import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { pl, enUS, uk } from 'date-fns/locale'
import type { Locale } from 'date-fns'
import { ChevronLeft, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import {
  BarChart, 
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { apiRequest } from '@/utils/api'
import { ROUTES } from '@/routes/paths'
import type {
  IPatientDiaryEntry,
  TGetPatientResponse,
  TListPatientDiaryResponse,
} from '@/types/patients'
import { useTheme } from '@/hooks/use-theme'

const DATE_FNS_LOCALES: Record<string, Locale> = { pl, en: enUS, uk }

function getDateFnsLocale(lang: string): Locale {
  return DATE_FNS_LOCALES[lang] ?? pl
}

const RISK_WEIGHTS = {
  avgPainMultiplier: 6,
  highPainRatioMax: 20,
  surgeryPenalty: 15,
  noHormonePenalty: 10,
  noImagingPenalty: 5,
} as const


function computePrognosis(entries: IPatientDiaryEntry[]) {
  if (entries.length === 0) return null

  const avgPain = entries.reduce((s, e) => s + e.painLevel, 0) / entries.length
  const highPainCount = entries.filter(e => e.painLevel >= 7).length
  const highPainRatio = highPainCount / entries.length
  const hadSurgery = entries.some(e => e.hadSurgeryLast6Months)
  const onHormones = entries.some(e => e.hormonalTreatment)
  const hasImaging = entries.some(e => e.recentImaging)

  let score = 0
  score += avgPain * RISK_WEIGHTS.avgPainMultiplier
  score += highPainRatio * RISK_WEIGHTS.highPainRatioMax
  if (hadSurgery) score += RISK_WEIGHTS.surgeryPenalty
  if (!onHormones) score += RISK_WEIGHTS.noHormonePenalty
  if (!hasImaging) score += RISK_WEIGHTS.noImagingPenalty

  const risk = Math.min(Math.round(score), 100)

  return {
    risk,
    avgPain: Math.round(avgPain * 10) / 10,
    highPainCount,
    totalEntries: entries.length,
    hadSurgery,
    onHormones,
    hasImaging,
  }
}

export const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const dateFnsLocale = getDateFnsLocale(i18n.language)

  const [patient, setPatient] = React.useState<{
    firstName: string
    lastName: string
    createdAt: string
  } | null>(null)
  const [entries, setEntries] = React.useState<IPatientDiaryEntry[]>([])
  const [isLoadingPatient, setIsLoadingPatient] = React.useState(true)
  const [isLoadingEntries, setIsLoadingEntries] = React.useState(true)
  const [patientError, setPatientError] = React.useState<string | null>(null)
  const [entriesError, setEntriesError] = React.useState<string | null>(null)

  const [minDate, setMinDate] = React.useState<string>("")
  const [maxDate, setMaxDate] = React.useState<string>("")
  const [filterStart, setFilterStart] = React.useState<string>("")
  const [filterEnd, setFilterEnd] = React.useState<string>("")
  const { theme } = useTheme()
  const isDarkMode =
    theme === 'dark' ||
    (theme === 'auto' && typeof window !== 'undefined' && document.documentElement.classList.contains('dark'))

  React.useEffect(() => {
    if (!id) return
    setIsLoadingPatient(true)
    apiRequest<TGetPatientResponse>(`/patients/${id}`)
      .then(res => setPatient(res.data))
      .catch(e => setPatientError(e?.message || t('patients.detail.errorPatient')))
      .finally(() => setIsLoadingPatient(false))
  }, [id, t])

  React.useEffect(() => {
    if (!id) return
    setIsLoadingEntries(true)
    apiRequest<TListPatientDiaryResponse>(`/patients/${id}/diary-entries`)
      .then(res => setEntries(res.data ?? []))
      .catch(e => setEntriesError(e?.message || t('patients.detail.errorEntries')))
      .finally(() => setIsLoadingEntries(false))
  }, [id, t])

  React.useEffect(() => {
    if (entries.length) {
      const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
      const first = sorted[0].date
      const last = sorted[sorted.length - 1].date
      setMinDate(first)
      setMaxDate(last)
      setFilterStart(first)
      setFilterEnd(last)
    } else {
      setMinDate("")
      setMaxDate("")
      setFilterStart("")
      setFilterEnd("")
    }
  }, [entries])

  const filteredEntries = React.useMemo(() => {
    if (!filterStart || !filterEnd) return []
    return entries.filter(
      e => e.date >= filterStart && e.date <= filterEnd
    )
  }, [entries, filterStart, filterEnd])

  const chartData = React.useMemo(
    () =>
      [...filteredEntries]
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(e => ({
          date: format(new Date(e.date), 'd MMM', { locale: dateFnsLocale }),
          painLevel: e.painLevel,
          rawDate: e.date,
        })),
    [filteredEntries, dateFnsLocale]
  )

  const prognosis = React.useMemo(() => computePrognosis(filteredEntries), [filteredEntries])

  const riskColor = (risk: number) => {
    if (risk < 30) return 'text-green-600 dark:text-green-400'
    if (risk < 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const riskBadge = (risk: number): 'default' | 'secondary' | 'destructive' => {
    if (risk < 30) return 'secondary'
    if (risk < 60) return 'default'
    return 'destructive'
  }

  const riskLabel = (risk: number) => {
    if (risk < 30) return t('patients.detail.prognosis.riskLow')
    if (risk < 60) return t('patients.detail.prognosis.riskMedium')
    return t('patients.detail.prognosis.riskHigh')
  }

  const TrendIcon = prognosis
    ? prognosis.avgPain < 4
      ? TrendingDown
      : prognosis.avgPain > 6
        ? TrendingUp
        : Minus
    : Minus

  const patientName = patient
    ? `${patient.firstName} ${patient.lastName}`
    : isLoadingPatient
      ? t('patients.loading')
      : t('patients.detail.unknownPatient')

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.PATIENTS.ROOT)}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('patients.detail.back')}
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">{patientName}</h1>
        {patient && (
          <p className="text-muted-foreground text-sm">
            {t('patients.createdAt')}:{' '}
            {new Date(patient.createdAt).toLocaleDateString(i18n.language)}
          </p>
        )}
        {patientError && (
          <Alert variant="destructive" className="mt-2">
            <AlertDescription>{patientError}</AlertDescription>
          </Alert>
        )}
      </div>

      {minDate && maxDate && (
        <Card className="max-w-fit">
          <CardContent className="flex flex-col gap-3 pt-4">
            <div className="flex flex-wrap gap-4 items-center">
              <span className="font-medium">{t('patients.detail.filter.dateRange')}:</span>
              <input
                type="date"
                value={filterStart}
                min={minDate}
                max={filterEnd}
                onChange={e => setFilterStart(e.target.value)}
                className="border rounded p-1"
              />
              <span>-</span>
              <input
                type="date"
                value={filterEnd}
                min={filterStart}
                max={maxDate}
                onChange={e => setFilterEnd(e.target.value)}
                className="border rounded p-1"
              />
              <Button
                variant="secondary"
                size="sm"
                className="ml-2"
                onClick={() => {
                  setFilterStart(minDate)
                  setFilterEnd(maxDate)
                }}
              >
                {t('patients.detail.filter.clear')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="visualization">
        <TabsList>
          <TabsTrigger value="visualization">{t('patients.detail.tabs.visualization')}</TabsTrigger>
          <TabsTrigger value="prognosis">{t('patients.detail.tabs.prognosis')}</TabsTrigger>
        </TabsList>

        {/* ── VISUALIZATION TAB ── */}
        <TabsContent value="visualization" className="flex flex-col gap-6 mt-4">
          {entriesError && (
            <Alert variant="destructive">
              <AlertDescription>{entriesError}</AlertDescription>
            </Alert>
          )}

          {isLoadingEntries ? (
            <div className="text-center text-muted-foreground py-10">{t('patients.loading')}</div>
          ) : (
            <>

            <Card>
              <CardHeader>
                <CardTitle>{t('patients.detail.visualization.chartTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {t('patients.detail.visualization.noData')}
                </p>
              ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  className="text-muted-foreground"
                />
                <YAxis
                  domain={[0, 10]}
                  ticks={[0, 2, 4, 6, 8, 10]}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  labelFormatter={label =>
                    `${t('patients.detail.visualization.date')}: ${label}`
                  }
                  formatter={(value: number | undefined) => [value ?? 0, t('endometriosis.diary.painlevel')]}
                  
                />
                <ReferenceLine
                  y={7}
                  stroke="hsl(var(--destructive))"
                  strokeDasharray="4 4"
                />
                <Bar
                  dataKey="painLevel"
                  fill={isDarkMode ? "#b2b2b2" : "hsl(var(--primary))"}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('patients.detail.visualization.tableTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredEntries.length === 0 ? (
                    <p className="text-muted-foreground text-sm">
                      {t('patients.detail.visualization.noData')}
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full table-auto text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 font-medium">
                              {t('patients.detail.visualization.date')}
                            </th>
                            <th className="text-left p-2 font-medium">
                              {t('endometriosis.diary.painlevel')}
                            </th>
                            <th className="text-left p-2 font-medium">
                              {t('endometriosis.diary.painlocation')}
                            </th>
                            <th className="text-left p-2 font-medium">
                              {t('endometriosis.diary.symptoms')}
                            </th>
                            <th className="text-left p-2 font-medium">
                              {t('endometriosis.diary.last6months.hormonaltreatment')}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...filteredEntries]
                            .sort((a, b) => b.date.localeCompare(a.date))
                            .map(e => (
                              <tr key={e.id} className="border-b last:border-0 hover:bg-muted/50">
                                <td className="p-2">
                                  {format(new Date(e.date), 'd MMM yyyy', {
                                    locale: dateFnsLocale,
                                  })}
                                </td>
                                <td className="p-2">
                                  <span
                                    className={
                                      e.painLevel >= 7
                                        ? 'font-bold text-red-600 dark:text-red-400'
                                        : e.painLevel >= 4
                                          ? 'font-medium text-yellow-600 dark:text-yellow-400'
                                          : 'text-green-600 dark:text-green-400'
                                    }
                                  >
                                    {e.painLevel}/10
                                  </span>
                                </td>
                                <td className="p-2 max-w-[140px] truncate">
                                  {e.painLocation || '—'}
                                </td>
                                <td className="p-2 max-w-[180px] truncate">{e.symptoms || '—'}</td>
                                <td className="p-2">
                                  {e.hormonalTreatment ? t('common.yes') : t('common.no')}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* ── PROGNOSIS TAB ── */}
        <TabsContent value="prognosis" className="flex flex-col gap-6 mt-4">
          {isLoadingEntries ? (
            <div className="text-center text-muted-foreground py-10">{t('patients.loading')}</div>
          ) : !prognosis ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-sm">
                  {t('patients.detail.prognosis.noData')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendIcon className="h-5 w-5" />
                    {t('patients.detail.prognosis.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl font-bold ${riskColor(prognosis.risk)}`}>
                      {prognosis.risk}%
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={riskBadge(prognosis.risk)} className="w-fit">
                        {riskLabel(prognosis.risk)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {t('patients.detail.prognosis.riskDescription')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('patients.detail.prognosis.avgPain')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{prognosis.avgPain}/10</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('patients.detail.prognosis.highPainEntries')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {prognosis.highPainCount}
                      <span className="text-base font-normal text-muted-foreground">
                        /{prognosis.totalEntries}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('patients.detail.prognosis.totalEntries')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{prognosis.totalEntries}</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {t('patients.detail.prognosis.medicalFactors')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">
                        {t('endometriosis.diary.last6months.surgicalprocedure')}
                      </span>
                      <Badge variant={prognosis.hadSurgery ? 'destructive' : 'secondary'}>
                        {prognosis.hadSurgery ? t('common.yes') : t('common.no')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">
                        {t('endometriosis.diary.last6months.hormonaltreatment')}
                      </span>
                      <Badge variant={prognosis.onHormones ? 'secondary' : 'default'}>
                        {prognosis.onHormones ? t('common.yes') : t('common.no')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <span className="text-sm">
                        {t('endometriosis.diary.last6months.imagingtests')}
                      </span>
                      <Badge variant={prognosis.hasImaging ? 'secondary' : 'default'}>
                        {prognosis.hasImaging ? t('common.yes') : t('common.no')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}