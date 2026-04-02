import * as React from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2, Pencil } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { pl } from 'date-fns/locale'
import type { CycleFormData } from '@//components/fertility/cycle-entry-form'
import { CycleEntryForm } from '@//components/fertility/cycle-entry-form'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import {
  addEntry,
  updateEntry,
  deleteEntry,
  selectFertilityEntries,
  type ICycleEntryRedux,
} from '@/redux/fertility-slice'

export const CycleTracking = () => {
  const { t } = useTranslation()
  useDocumentTitle('fertility.tracking.title')
  const dispatch = useAppDispatch()
  const entries = useAppSelector(selectFertilityEntries)
  const [editingEntry, setEditingEntry] = React.useState<ICycleEntryRedux | null>(null)
  const [showForm, setShowForm] = React.useState(false)

  const handleSubmit = (data: CycleFormData) => {
    if (editingEntry) {
      dispatch(
        updateEntry({
          ...editingEntry,
          startDate: data.startDate.toISOString(),
          endDate: data.endDate?.toISOString(),
          symptoms: data.symptoms,
          notes: data.notes,
        })
      )
      setEditingEntry(null)
    } else {
      dispatch(
        addEntry({
          id: crypto.randomUUID(),
          startDate: data.startDate.toISOString(),
          endDate: data.endDate?.toISOString(),
          symptoms: data.symptoms,
          notes: data.notes,
        })
      )
    }
    setShowForm(false)
  }

  const handleEdit = (entry: ICycleEntryRedux) => {
    setEditingEntry(entry)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    dispatch(deleteEntry(id))
  }

  const handleCancel = () => {
    setEditingEntry(null)
    setShowForm(false)
  }

  const initialData = editingEntry
    ? {
        startDate: parseISO(editingEntry.startDate),
        endDate: editingEntry.endDate ? parseISO(editingEntry.endDate) : undefined,
        symptoms: editingEntry.symptoms as CycleFormData['symptoms'],
        notes: editingEntry.notes,
      }
    : undefined

  const sortedEntries = [...entries].reverse()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('fertility.tracking.title')}</h1>
        <p className="text-muted-foreground">{t('fertility.tracking.description')}</p>
      </div>

      <Alert>
        <AlertDescription className="text-sm">⚠️ {t('fertility.disclaimer')}</AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {showForm ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {editingEntry ? 'Edytuj wpis' : 'Nowy wpis cyklu'}
                </h2>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Anuluj
                </Button>
              </div>
              <CycleEntryForm onSubmit={handleSubmit} initialData={initialData} />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Historia cykli</h2>
                <Button onClick={() => setShowForm(true)}>+ Dodaj wpis</Button>
              </div>

              {sortedEntries.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>Brak wpisów. Kliknij „Dodaj wpis" aby zacząć śledzić cykl.</p>
                  </CardContent>
                </Card>
              ) : (
                sortedEntries.map(entry => (
                  <Card key={entry.id}>
                    <CardContent className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">
                              {format(parseISO(entry.startDate), 'd MMMM yyyy', { locale: pl })}
                            </span>
                            {entry.endDate && (
                              <>
                                <span className="text-muted-foreground">→</span>
                                <span className="font-medium">
                                  {format(parseISO(entry.endDate), 'd MMMM yyyy', { locale: pl })}
                                </span>
                              </>
                            )}
                            {entry.ovulationDate && (
                              <Badge variant="secondary" className="text-xs">
                                🥚 Owulacja:{' '}
                                {format(parseISO(entry.ovulationDate), 'd MMM', { locale: pl })}
                              </Badge>
                            )}
                          </div>
                          {entry.symptoms.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {entry.symptoms.map((s, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {s.type}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {entry.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(entry)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informacje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium mb-1">Jak rejestrować cykl?</p>
                <p className="text-muted-foreground">
                  Zaznacz datę pierwszego dnia menstruacji jako początek cyklu. Możesz dodać wpis
                  historyczny wybierając dowolną datę w przeszłości.
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Objawy</p>
                <p className="text-muted-foreground">
                  Zaznacz wszystkie objawy, które występują i oceń ich intensywność w skali 1–5.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kiedy skonsultować się z lekarzem?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Cykl trwa krócej niż 21 dni lub dłużej niż 35 dni</p>
              <p>• Bardzo silny ból utrudniający codzienne funkcjonowanie</p>
              <p>• Nieregularny cykl (różnice &gt;7 dni między cyklami)</p>
              <p>• Bardzo obfite krwawienie</p>
              <p>• Brak menstruacji przez 3+ miesiące</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
