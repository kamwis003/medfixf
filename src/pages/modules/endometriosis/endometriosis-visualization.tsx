import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { pl } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DiaryEntryPoint, ListDiaryResponse } from '@/types/endometriosis'
import { apiRequest } from '@/utils/api'
import { useAuth } from '@/hooks/use-auth'

export const EndometriosisVisualization: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  useDocumentTitle('endometriosis.visualization.title')

  const PAIN_COLORS = [
    {
      min: 0,
      max: 1,
      color: 'bg-green-300 dark:bg-green-700',
      label: t('endometriosis.visualization.pain.01'),
    },
    {
      min: 2,
      max: 3,
      color: 'bg-yellow-200 dark:bg-yellow-700',
      label: t('endometriosis.visualization.pain.23'),
    },
    {
      min: 4,
      max: 6,
      color: 'bg-orange-300 dark:bg-orange-700',
      label: t('endometriosis.visualization.pain.46'),
    },
    {
      min: 7,
      max: 8,
      color: 'bg-rose-300 dark:bg-rose-700',
      label: t('endometriosis.visualization.pain.78'),
    },
    {
      min: 9,
      max: 10,
      color: 'bg-red-400 dark:bg-red-800',
      label: t('endometriosis.visualization.pain.910'),
    },
  ]

  function getPainColor(painLevel: number) {
    const found = PAIN_COLORS.find(v => painLevel >= v.min && painLevel <= v.max)
    return found ? found.color : 'bg-muted'
  }

  function getPainLabel(painLevel: number) {
    const found = PAIN_COLORS.find(v => painLevel >= v.min && painLevel <= v.max)
    return found ? found.label : 'Brak danych'
  }

  const WEEKDAYS: string[] = t('endometriosis.visualization.weekdays', {
    returnObjects: true,
  }) as string[]
  const [entries, setEntries] = useState<DiaryEntryPoint[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))

  useEffect(() => {
    let cancelled = false
    const fetchEntries = async () => {
      setError(null)
      if (!user) {
        setEntries([])
        return
      }
      setIsLoading(true)
      try {
        const res = await apiRequest<ListDiaryResponse>('/diary-entries', { method: 'GET' })
        const points: DiaryEntryPoint[] = (res.data ?? []).map(e => ({
          date: e.date,
          painLevel: Number(e.painLevel ?? 0),
        }))
        if (!cancelled) setEntries(points)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Nie udało się pobrać danych.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchEntries()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const painMap = useMemo(() => {
    const map = new Map<string, DiaryEntryPoint>()
    entries.forEach(entry => {
      map.set(entry.date, entry)
    })
    return map
  }, [entries])

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start, end })

  const prevMonth = () => setCurrentMonth(m => addMonths(m, -1))
  const nextMonth = () => setCurrentMonth(m => addMonths(m, 1))

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('endometriosis.visualization.title')}</h1>
        <p className="text-muted-foreground">{t('endometriosis.visualization.subtitle')}</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <button className="p-2" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <CardTitle className="capitalize text-lg">
              {format(currentMonth, 'LLLL yyyy', { locale: pl })}
            </CardTitle>
            <button className="p-2" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">
              {t('endometriosis.loading')}
            </div>
          ) : (
            <>
              {/* Nagłówki dni tygodnia */}
              <div className="grid grid-cols-7 mb-1">
                {WEEKDAYS.map(wd => (
                  <div
                    key={wd}
                    className="text-center text-xs font-medium text-muted-foreground py-2"
                  >
                    {wd}
                  </div>
                ))}
              </div>
              {/* Komórki kalendarza */}
              <div className="grid grid-cols-7 gap-y-1">
                {days.map(day => {
                  const key = format(day, 'yyyy-MM-dd')
                  const entry = painMap.get(key)
                  const inCurrentMonth = isSameMonth(day, currentMonth)
                  const painLevel = entry?.painLevel

                  const cell = (
                    <div
                      key={key}
                      className={[
                        'h-12 w-full rounded-lg flex flex-col items-center justify-center text-sm transition-colors',
                        painLevel !== undefined
                          ? getPainColor(Number(painLevel))
                          : 'hover:bg-muted',
                        'hover:ring-2 hover:ring-primary/50 focus:outline-none',
                        inCurrentMonth ? '' : 'opacity-30',
                        isToday(day) ? 'ring-2 ring-primary' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      style={{ cursor: entry ? 'pointer' : undefined }}
                    >
                      <span className="font-medium leading-none">{format(day, 'd')}</span>
                      {painLevel !== undefined && (
                        <span className="text-[10px] leading-none font-bold mt-1">{painLevel}</span>
                      )}
                    </div>
                  )

                  if (entry) {
                    return (
                      <TooltipProvider key={key} delayDuration={200}>
                        <Tooltip>
                          <TooltipTrigger asChild>{cell}</TooltipTrigger>
                          <TooltipContent side="top" className="max-w-[200px]">
                            <span className="font-semibold">
                              {t('endometriosis.diary.painlevel')}:
                            </span>{' '}
                            {painLevel ?? '-'}
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {getPainLabel(Number(painLevel))}
                            </span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  }
                  return cell
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('endometriosis.visualization.legend')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm">
          {PAIN_COLORS.map(v => (
            <div className="flex items-center gap-2" key={v.color}>
              <div className={`h-4 w-4 rounded ${v.color}`} />
              <span>{v.label}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded ring-2 ring-primary" />
            <span>{t('endometriosis.visualization.today')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
