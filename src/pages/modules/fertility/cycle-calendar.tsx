import * as React from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  differenceInDays,
} from 'date-fns'
import { pl } from 'date-fns/locale'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  selectFertilityEntries,
  setOvulationDate,
  type ICycleEntryRedux,
} from '@//redux/fertility-slice'

// ─── Helpers ───────────────────────────────────────────────────────────────

const CYCLE_COLORS_A = {
  bg: 'bg-rose-200 dark:bg-rose-800',
  text: 'text-rose-900 dark:text-rose-100',
  dot: 'bg-rose-500',
}
const CYCLE_COLORS_B = {
  bg: 'bg-violet-200 dark:bg-violet-800',
  text: 'text-violet-900 dark:text-violet-100',
  dot: 'bg-violet-500',
}

function toDateStr(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

interface ICycleDayInfo {
  cycleEntry: ICycleEntryRedux
  cycleIndex: number
  isFirst: boolean
  isLast: boolean
}

function buildDayMap(entries: ICycleEntryRedux[]): Map<string, ICycleDayInfo> {
  const map = new Map<string, ICycleDayInfo>()
  const today = new Date()

  entries.forEach((entry, idx) => {
    const start = parseISO(entry.startDate)
    // End date: use endDate if set, else next cycle's start - 1, else today
    let end: Date
    if (entry.endDate) {
      end = parseISO(entry.endDate)
    } else {
      const nextEntry = entries[idx + 1]
      end = nextEntry ? addDays(parseISO(nextEntry.startDate), -1) : today
    }

    if (end < start) return

    const days = eachDayOfInterval({ start, end })
    days.forEach((day, dayIdx) => {
      const key = toDateStr(day)
      map.set(key, {
        cycleEntry: entry,
        cycleIndex: idx,
        isFirst: dayIdx === 0,
        isLast: dayIdx === days.length - 1,
      })
    })
  })

  return map
}

function calculateStats(entries: ICycleEntryRedux[]) {
  if (entries.length < 2) {
    return {
      averageLength: null,
      stdDev: null,
      regularity: null as null | 'regular' | 'somewhat' | 'irregular',
      lastCycles: [] as { startDate: string; length: number }[],
      ovulationAvgDay: null as number | null,
      ovulationStdDev: null as number | null,
    }
  }

  const lengths: number[] = []
  for (let i = 1; i < entries.length; i++) {
    const len = differenceInDays(parseISO(entries[i].startDate), parseISO(entries[i - 1].startDate))
    if (len > 0) lengths.push(len)
  }

  if (lengths.length === 0) {
    return {
      averageLength: null,
      stdDev: null,
      regularity: null as null | 'regular' | 'somewhat' | 'irregular',
      lastCycles: [],
      ovulationAvgDay: null,
      ovulationStdDev: null,
    }
  }

  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const variance = lengths.reduce((acc, l) => acc + (l - avg) ** 2, 0) / lengths.length
  const std = Math.sqrt(variance)

  let regularity: 'regular' | 'somewhat' | 'irregular'
  if (std < 3) regularity = 'regular'
  else if (std <= 7) regularity = 'somewhat'
  else regularity = 'irregular'

  const lastCycles = entries
    .slice(-6)
    .map((e, i, arr) => {
      if (i === 0) return null
      const len = differenceInDays(parseISO(e.startDate), parseISO(arr[i - 1].startDate))
      return { startDate: arr[i - 1].startDate, length: len }
    })
    .filter(Boolean) as { startDate: string; length: number }[]

  // Ovulation stats: day of ovulation relative to cycle start
  const ovulationDays: number[] = entries
    .filter(e => e.ovulationDate)
    .map(e => differenceInDays(parseISO(e.ovulationDate!), parseISO(e.startDate)))

  let ovulationAvgDay: number | null = null
  let ovulationStdDev: number | null = null
  if (ovulationDays.length >= 2) {
    ovulationAvgDay = Math.round(ovulationDays.reduce((a, b) => a + b, 0) / ovulationDays.length)
    const ovVar =
      ovulationDays.reduce((acc, d) => acc + (d - ovulationAvgDay!) ** 2, 0) / ovulationDays.length
    ovulationStdDev = Math.round(Math.sqrt(ovVar) * 10) / 10
  }

  return {
    averageLength: Math.round(avg * 10) / 10,
    stdDev: Math.round(std * 10) / 10,
    regularity,
    lastCycles,
    ovulationAvgDay,
    ovulationStdDev,
  }
}

function predictNextCycleStart(entries: ICycleEntryRedux[]): Date | null {
  if (entries.length < 2) return null
  const last = entries[entries.length - 1]
  const lengths: number[] = []
  for (let i = 1; i < entries.length; i++) {
    const len = differenceInDays(parseISO(entries[i].startDate), parseISO(entries[i - 1].startDate))
    if (len > 0) lengths.push(len)
  }
  if (lengths.length === 0) return null
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length
  return addDays(parseISO(last.startDate), Math.round(avg))
}

// ─── Tooltip content for a cycle day ──────────────────────────────────────

interface ICycleTooltipProps {
  info: ICycleDayInfo
  entries: ICycleEntryRedux[]
  predicted: Date | null
}

const CycleDayTooltip = ({ info, entries, predicted }: ICycleTooltipProps) => {
  const entry = info.cycleEntry
  const start = parseISO(entry.startDate)
  const end = entry.endDate ? parseISO(entry.endDate) : null

  const nextPredicted = predicted && entries[entries.length - 1]?.id === entry.id ? predicted : null

  return (
    <div className="space-y-1 text-xs">
      <p>
        <span className="font-semibold">Początek cyklu:</span>{' '}
        {format(start, 'd MMM yyyy', { locale: pl })}
      </p>
      {end && (
        <p>
          <span className="font-semibold">Koniec cyklu:</span>{' '}
          {format(end, 'd MMM yyyy', { locale: pl })}
        </p>
      )}
      {!end && <p className="text-yellow-300">Cykl w toku</p>}
      {nextPredicted && (
        <p>
          <span className="font-semibold">Prognoza następnego:</span>{' '}
          {format(nextPredicted, 'd MMM yyyy', { locale: pl })}
        </p>
      )}
      {entry.ovulationDate && (
        <p>
          <span className="font-semibold">Owulacja:</span>{' '}
          {format(parseISO(entry.ovulationDate), 'd MMM yyyy', { locale: pl })}
        </p>
      )}
    </div>
  )
}

// ─── Calendar Grid ─────────────────────────────────────────────────────────

const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz']

interface ICalendarGridProps {
  month: Date
  dayMap: Map<string, ICycleDayInfo>
  entries: ICycleEntryRedux[]
  predicted: Date | null
  onDayClick: (date: Date, info: ICycleDayInfo | undefined) => void
}

const CalendarGrid = ({ month, dayMap, entries, predicted, onDayClick }: ICalendarGridProps) => {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(wd => (
          <div key={wd} className="text-center text-xs font-medium text-muted-foreground py-2">
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map(day => {
          const key = toDateStr(day)
          const info = dayMap.get(key)
          const inCurrentMonth = isSameMonth(day, month)
          const isOvulation = info?.cycleEntry.ovulationDate
            ? isSameDay(parseISO(info.cycleEntry.ovulationDate), day)
            : false

          const colors =
            info !== undefined
              ? info.cycleIndex % 2 === 0
                ? CYCLE_COLORS_A
                : CYCLE_COLORS_B
              : null

          const isPredicted = predicted && isSameDay(day, predicted)

          const cell = (
            <button
              key={key}
              onClick={() => onDayClick(day, info)}
              className={[
                'relative flex flex-col items-center justify-center h-12 w-full rounded-lg text-sm transition-colors',
                'hover:ring-2 hover:ring-primary/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                inCurrentMonth ? '' : 'opacity-30',
                colors ? `${colors.bg} ${colors.text}` : 'hover:bg-muted',
                isToday(day) ? 'ring-2 ring-primary' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <span className="font-medium leading-none">{format(day, 'd')}</span>
              {isOvulation && (
                <span className="absolute bottom-1 text-[10px] leading-none">🥚</span>
              )}
              {isPredicted && !info && (
                <span className="absolute bottom-1 text-[10px] leading-none">📅</span>
              )}
            </button>
          )

          if (info) {
            return (
              <TooltipProvider key={key} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>{cell}</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[200px]">
                    <CycleDayTooltip info={info} entries={entries} predicted={predicted} />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          }

          return cell
        })}
      </div>
    </div>
  )
}

// ─── Regularity Badge ──────────────────────────────────────────────────────

const regularityVariant = {
  regular: 'default' as const,
  somewhat: 'secondary' as const,
  irregular: 'destructive' as const,
}
const regularityLabel = {
  regular: 'Regularny',
  somewhat: 'Umiarkowanie regularny',
  irregular: 'Nieregularny',
}

// ─── Main page ─────────────────────────────────────────────────────────────

export const CycleCalendar = () => {
  const { t } = useTranslation()
  useDocumentTitle('fertility.calendar.title')

  const dispatch = useAppDispatch()
  const entries = useAppSelector(selectFertilityEntries)

  const [currentMonth, setCurrentMonth] = React.useState(() => startOfMonth(new Date()))

  const dayMap = React.useMemo(() => buildDayMap(entries), [entries])
  const stats = React.useMemo(() => calculateStats(entries), [entries])
  const predicted = React.useMemo(() => predictNextCycleStart(entries), [entries])

  const handleDayClick = (date: Date, info: ICycleDayInfo | undefined) => {
    if (!info) return
    const entry = info.cycleEntry
    const ovulationDateISO = date.toISOString()
    const isAlreadyOvulation = entry.ovulationDate && isSameDay(parseISO(entry.ovulationDate), date)

    dispatch(
      setOvulationDate({
        entryId: entry.id,
        date: isAlreadyOvulation ? undefined : ovulationDateISO,
      })
    )
  }

  const prevMonth = () => setCurrentMonth(m => addMonths(m, -1))
  const nextMonth = () => setCurrentMonth(m => addMonths(m, 1))

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('fertility.calendar.title')}</h1>
        <p className="text-muted-foreground">{t('fertility.calendar.description')}</p>
      </div>

      <Alert>
        <AlertDescription className="text-sm">⚠️ {t('fertility.disclaimer')}</AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="capitalize text-lg">
                  {format(currentMonth, 'LLLL yyyy', { locale: pl })}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription className="text-center text-xs">
                Kliknij w dzień cyklu, aby zaznaczyć / odznaczyć owulację
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-6">
              {entries.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Brak danych. Dodaj wpisy w zakładce{' '}
                  <span className="font-semibold">Śledzenie cyklu</span>.
                </p>
              ) : (
                <CalendarGrid
                  month={currentMonth}
                  dayMap={dayMap}
                  entries={entries}
                  predicted={predicted}
                  onDayClick={handleDayClick}
                />
              )}
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Legenda</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-rose-300 dark:bg-rose-700" />
                <span>Cykl (parzysty)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded bg-violet-300 dark:bg-violet-700" />
                <span>Cykl (nieparzysty)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🥚</span>
                <span>Owulacja</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>Prognozowany następny cykl</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded ring-2 ring-primary" />
                <span>Dzisiaj</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statystyki</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {stats.averageLength === null ? (
                <p className="text-sm text-muted-foreground">
                  Dodaj co najmniej 2 cykle, aby zobaczyć statystyki.
                </p>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Średnia długość cyklu</p>
                    <p className="text-3xl font-bold">{stats.averageLength} dni</p>
                    {stats.stdDev !== null && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Odchylenie: ±{stats.stdDev} dni
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Regularność cyklu</p>
                    {stats.regularity && (
                      <div className="space-y-1">
                        <Badge variant={regularityVariant[stats.regularity]}>
                          {regularityLabel[stats.regularity]}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {stats.regularity === 'regular' &&
                            'Różnice między cyklami < 3 dni – bardzo regularny cykl.'}
                          {stats.regularity === 'somewhat' &&
                            'Różnice między cyklami 3–7 dni – umiarkowanie regularny.'}
                          {stats.regularity === 'irregular' &&
                            'Różnice między cyklami > 7 dni – nieregularny cykl.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {stats.ovulationAvgDay !== null && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Owulacja (średnio)</p>
                      <p className="text-xl font-semibold">{stats.ovulationAvgDay}. dzień cyklu</p>
                      {stats.ovulationStdDev !== null && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Odchylenie: ±{stats.ovulationStdDev} dni
                          {stats.ovulationStdDev < 2
                            ? ' – regularna owulacja'
                            : stats.ovulationStdDev <= 4
                              ? ' – umiarkowanie regularna'
                              : ' – nieregularna owulacja'}
                        </p>
                      )}
                    </div>
                  )}

                  {predicted && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Prognozowany następny cykl
                      </p>
                      <p className="font-medium">
                        {format(predicted, 'd MMMM yyyy', { locale: pl })}
                      </p>
                    </div>
                  )}

                  {stats.lastCycles.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Ostatnie cykle:</p>
                      <div className="space-y-2">
                        {stats.lastCycles.map((cycle, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-2 bg-muted rounded-md text-sm"
                          >
                            <span>
                              {format(parseISO(cycle.startDate), 'd MMM yyyy', { locale: pl })}
                            </span>
                            <Badge variant="secondary">{cycle.length} dni</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Statystyki są wyłącznie informacyjne i nie stanowią prognozy medycznej.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
