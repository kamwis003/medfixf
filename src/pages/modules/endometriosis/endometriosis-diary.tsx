import { FC, useEffect, useMemo, useState } from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAuth } from '@/hooks/use-auth'
import { apiRequest } from '@/utils/api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'
import type {
  DiaryEntry,
  DiaryEntryForm,
  ListDiaryResponse,
  CreateDiaryResponse,
} from '@/types/endometriosis'

const initialForm: DiaryEntryForm = {
  date: new Date().toISOString().split('T')[0],
  painLevel: 0,
  painLocation: '',
  symptoms: '',
  hadSurgeryLast6Months: false,
  surgeryDescription: '',
  hormonalTreatment: false,
  recentImaging: false,
  cycleDay: '',
}

export const EndometriosisDiary: FC = () => {
  const { t } = useTranslation()
  useDocumentTitle(t('pages.products.tabs.endometriosis_diary'))

  const { user } = useAuth()

  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [isLoadingEntries, setIsLoadingEntries] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<DiaryEntryForm>(initialForm)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target

    if (name === 'hadSurgeryLast6Months' && !checked) {
      setForm(prev => ({
        ...prev,
        [name]: false,
        surgeryDescription: '',
      }))
      return
    }

    setForm(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'painLevel' || name === 'cycleDay'
            ? value === ''
              ? ''
              : Number(value)
            : value,
    }))
  }

  useEffect(() => {
    setError(null)

    if (!user) {
      setEntries([])
      return
    }

    setIsLoadingEntries(true)
    ;(async () => {
      try {
        const res = await apiRequest<ListDiaryResponse>('/diary-entries', {
          method: 'GET',
        })
        setEntries(res.data)
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError('Nie udało się pobrać wpisów.')
        }
      } finally {
        setIsLoadingEntries(false)
      }
    })()
  }, [user?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      const payload = {
        ...form,
        surgeryDescription: form.hadSurgeryLast6Months ? form.surgeryDescription : '',
        cycleDay: form.cycleDay === '' ? undefined : form.cycleDay,
      }
      const res = await apiRequest<CreateDiaryResponse>('/diary-entries', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setEntries(prev => [res.data, ...prev])
      setForm(initialForm)
      setIsSaving(false)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Nie udało się załadować wpisów')
      }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('pages.products.tabs.endometriosis_diary')}</h1>
      </div>

      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            {t('endometriosis.diary.newentry')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            <div>
              <label className="block font-medium mb-1">{t('endometriosis.diary.date')}</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-background text-foreground"
                disabled={!user || isSaving}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">{t('endometriosis.diary.cycleday')}</label>
              <input
                type="number"
                name="cycleDay"
                min="1"
                max="40"
                value={form.cycleDay}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-background text-foreground"
                disabled={isSaving}
              />
            </div>
            {/* Natężenie bólu */}
            <div>
              <label className="block font-medium mb-1">
                {t('endometriosis.diary.painlevel')} (0-10)
              </label>
              <input
                type="range"
                min="0"
                max="10"
                name="painLevel"
                value={form.painLevel}
                onChange={handleChange}
                className="w-full"
              />
              <div className="text-center mt-2 font-semibold text-lg">{form.painLevel}</div>
            </div>

            <div>
              <label className="block font-medium mb-1">
                {t('endometriosis.diary.painlocation')}
              </label>
              <input
                type="text"
                name="painLocation"
                placeholder={t('endometriosis.diary.painlocation_examples')}
                value={form.painLocation}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">{t('endometriosis.diary.symptoms')}</label>
              <textarea
                name="symptoms"
                placeholder={t('endometriosis.diary.symptoms_examples')}
                value={form.symptoms}
                onChange={handleChange}
                rows={4}
                className="w-full border rounded-lg p-2 bg-background text-foreground"
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">
                {t('endometriosis.diary.last6months.title')}
              </h2>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="hadSurgeryLast6Months"
                  checked={form.hadSurgeryLast6Months}
                  onChange={handleChange}
                />
                {t('endometriosis.diary.last6months.surgicalprocedure')}
              </label>

              {form.hadSurgeryLast6Months && (
                <div className="ml-6 my-2">
                  <label className="block text-sm mb-1">
                    {t('endometriosis.diary.last6months.whatsurgery')}
                  </label>
                  <input
                    type="text"
                    name="surgeryDescription"
                    value={form.surgeryDescription}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 bg-background text-foreground"
                    placeholder={t('endometriosis.diary.last6months.surgicalprocedure_examples')}
                    maxLength={256}
                    disabled={isSaving}
                  />
                </div>
              )}

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="hormonalTreatment"
                  checked={form.hormonalTreatment}
                  onChange={handleChange}
                />
                {t('endometriosis.diary.last6months.hormonaltreatment')}
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="recentImaging"
                  checked={form.recentImaging}
                  onChange={handleChange}
                />
                {t('endometriosis.diary.last6months.imagingtests')}
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={!user || isSaving}>
              {isSaving ? t('endometriosis.saving') : t('endometriosis.diary.saveentry')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Historia wpisów */}
      <Card className="max-w-2xl mx-auto w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center">
            {t('endometriosis.diary.entryjournal')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingEntries ? (
            <div className="text-muted-foreground text-center py-4">
              {t('endometriosis.loading')}
            </div>
          ) : entries.length === 0 ? (
            <div className="text-muted-foreground text-center py-4">
              {t('endometriosis.diary.noentries')}
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map(entry => (
                <Card key={entry.id} className="shadow-none border bg-card text-card-foreground">
                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-3 items-baseline mb-1">
                      <span className="font-semibold">
                        {t('endometriosis.diary.date')}:{' '}
                        {new Date(entry.date).toISOString().split('T')[0]}
                      </span>
                      {'cycleDay' in entry && typeof entry.cycleDay === 'number' && (
                        <span>
                          {t('endometriosis.diary.cycleday')}: {entry.cycleDay}
                        </span>
                      )}
                      <span>
                        {t('endometriosis.diary.painlevel')}: {entry.painLevel}/10
                      </span>
                    </div>
                    <div>
                      {t('endometriosis.diary.painlocation')}: {entry.painLocation}
                    </div>
                    <div>
                      {t('endometriosis.diary.symptoms')}: {entry.symptoms}
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground space-y-1">
                      {entry.hadSurgeryLast6Months && (
                        <div>
                          ✔ {t('endometriosis.diary.last6months.surgicalprocedure')}
                          {entry.surgeryDescription ? <> – {entry.surgeryDescription}</> : null}
                        </div>
                      )}
                      {entry.hormonalTreatment && (
                        <div>✔ {t('endometriosis.diary.last6months.hormonaltreatment')}</div>
                      )}
                      {entry.recentImaging && (
                        <div>✔ {t('endometriosis.diary.last6months.imagingtests')}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
