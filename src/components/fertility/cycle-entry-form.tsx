import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SymptomType } from '@//types/fertility'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface CycleEntryFormProps {
  onSubmit: (data: CycleFormData) => void
  initialData?: Partial<CycleFormData>
}

export interface CycleFormData {
  startDate: Date
  endDate?: Date
  symptoms: {
    type: SymptomType
    intensity: 1 | 2 | 3 | 4 | 5
    description?: string
  }[]
  notes?: string
}

const symptomTypes: { type: SymptomType; label: string }[] = [
  { type: 'cramps', label: 'Bóle brzucha' },
  { type: 'headache', label: 'Ból głowy' },
  { type: 'mood_changes', label: 'Zmiany nastroju' },
  { type: 'fatigue', label: 'Zmęczenie' },
  { type: 'bloating', label: 'Wzdęcia' },
  { type: 'breast_tenderness', label: 'Wrażliwość piersi' },
  { type: 'other', label: 'Inne' },
]

export const CycleEntryForm = ({ onSubmit, initialData }: CycleEntryFormProps) => {
  const [startDate, setStartDate] = React.useState<Date | undefined>(initialData?.startDate)
  const [endDate, setEndDate] = React.useState<Date | undefined>(initialData?.endDate)
  const [selectedSymptoms, setSelectedSymptoms] = React.useState<Set<SymptomType>>(
    new Set(initialData?.symptoms?.map(s => s.type) ?? [])
  )
  const [symptomIntensities, setSymptomIntensities] = React.useState<
    Record<SymptomType, 1 | 2 | 3 | 4 | 5>
  >(
    Object.fromEntries(initialData?.symptoms?.map(s => [s.type, s.intensity]) ?? []) as Record<
      SymptomType,
      1 | 2 | 3 | 4 | 5
    >
  )
  const [notes, setNotes] = React.useState(initialData?.notes || '')

  const handleSymptomToggle = (symptomType: SymptomType, checked: boolean) => {
    const newSelected = new Set(selectedSymptoms)
    if (checked) {
      newSelected.add(symptomType)
      if (!symptomIntensities[symptomType]) {
        setSymptomIntensities({ ...symptomIntensities, [symptomType]: 3 })
      }
    } else {
      newSelected.delete(symptomType)
    }
    setSelectedSymptoms(newSelected)
  }

  const handleIntensityChange = (symptomType: SymptomType, intensity: string) => {
    setSymptomIntensities({
      ...symptomIntensities,
      [symptomType]: parseInt(intensity) as 1 | 2 | 3 | 4 | 5,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!startDate) {
      alert('Proszę wybrać datę rozpoczęcia cyklu')
      return
    }

    if (endDate && endDate < startDate) {
      alert('Data zakończenia nie może być wcześniejsza niż data rozpoczęcia')
      return
    }

    const symptoms = Array.from(selectedSymptoms).map(type => ({
      type,
      intensity: symptomIntensities[type] || 3,
      description: type === 'other' ? notes : undefined,
    }))

    onSubmit({
      startDate,
      endDate,
      symptoms,
      notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daty cyklu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Data rozpoczęcia *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : <span>Wybierz datę</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Data zakończenia (opcjonalnie)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !endDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : <span>Wybierz datę</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={date => (startDate ? date < startDate : false)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Objawy okołocyklowe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {symptomTypes.map(symptom => (
            <div key={symptom.type} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={symptom.type}
                  checked={selectedSymptoms.has(symptom.type)}
                  onCheckedChange={checked => handleSymptomToggle(symptom.type, checked as boolean)}
                />
                <Label htmlFor={symptom.type} className="font-normal">
                  {symptom.label}
                </Label>
              </div>

              {selectedSymptoms.has(symptom.type) && (
                <div className="ml-6 space-y-2">
                  <Label className="text-sm text-muted-foreground">Intensywność:</Label>
                  <RadioGroup
                    value={symptomIntensities[symptom.type]?.toString() || '3'}
                    onValueChange={value => handleIntensityChange(symptom.type, value)}
                    className="flex gap-4"
                  >
                    {[1, 2, 3, 4, 5].map(level => (
                      <div key={level} className="flex items-center space-x-1">
                        <RadioGroupItem value={level.toString()} id={`${symptom.type}-${level}`} />
                        <Label htmlFor={`${symptom.type}-${level}`} className="font-normal text-sm">
                          {level}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">1 = niska, 5 = bardzo wysoka</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dodatkowe notatki</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Opcjonalne dodatkowe informacje..."
            rows={4}
          />
        </CardContent>
      </Card>

      <Button type="submit" className="w-full">
        Zapisz wpis
      </Button>
    </form>
  )
}
