import { useState } from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import type { SpecialistType } from '@/types/fertility'
import { UserPlus, Stethoscope, Heart, Activity, Star, type LucideIcon } from 'lucide-react'
import { mockDoctors } from '@/data/mock-specialists'
import { cn } from '@/lib/utils'

export const ConsultationRequest = () => {
  const { t } = useTranslation()
  const { toast } = useToast()
  useDocumentTitle('fertility.consultation.title')

  const [specialistType, setSpecialistType] = useState<SpecialistType>('gynecologist')
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)

  const specialists: { type: SpecialistType; label: string; description: string; icon: LucideIcon }[] = [
    {
      type: 'gynecologist',
      label: 'Ginekolog',
      description: 'Specjalista chorób narządów płciowych kobiety',
      icon: Stethoscope
    },
    {
      type: 'fertility_specialist',
      label: 'Specjalista ds. płodności',
      description: 'Lekarz zajmujący się problemami z płodnością i prokreacją',
      icon: Heart
    },
    {
      type: 'endocrinologist',
      label: 'Endokrynolog',
      description: 'Specjalista od hormonów i zaburzeń gospodarki hormonalnej',
      icon: Activity
    }
  ]

  const handleSpecialistTypeChange = (value: string) => {
    setSpecialistType(value as SpecialistType)
    setSelectedDoctorId(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!consentGiven) {
      toast({
        title: 'Błąd',
        description: 'Musisz wyrazić zgodę na przetwarzanie danych',
        variant: 'destructive'
      })
      return
    }

    console.log('Consultation request:', {
      specialistType,
      description,
      consentGiven
    })

    // TODO: Send to backend

    toast({
      title: 'Zgłoszenie wysłane',
      description: 'Twoje zgłoszenie zostało przekazane. Skontaktujemy się z Tobą wkrótce.',
    })

    // Reset form
    setDescription('')
    setConsentGiven(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('fertility.consultation.title')}</h1>
        <p className="text-muted-foreground">{t('fertility.consultation.description')}</p>
      </div>

      <Alert>
        <AlertDescription className="text-sm">
          ⚠️ {t('fertility.disclaimer')}
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wybierz specjalistę</CardTitle>
                <CardDescription>
                  Wybierz typ specjalisty, z którym chcesz się skonsultować
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={specialistType} onValueChange={handleSpecialistTypeChange}>
                  {specialists.map((specialist) => {
                    const Icon = specialist.icon
                    return (
                      <div key={specialist.type} className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer">
                        <RadioGroupItem value={specialist.type} id={specialist.type} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={specialist.type} className="flex items-center gap-2 font-medium cursor-pointer">
                            <Icon className="h-4 w-4" />
                            {specialist.label}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {specialist.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dostępni specjaliści</CardTitle>
                <CardDescription>
                  Wybierz lekarza, z którym chcesz się skonsultować
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(mockDoctors[specialistType] ?? []).map((doctor) => (
                  <button
                    key={doctor.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doctor.id)}
                    className={cn(
                      'w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-colors hover:bg-accent',
                      selectedDoctorId === doctor.id && 'border-primary ring-2 ring-primary bg-accent'
                    )}
                  >
                    <img
                      src={doctor.avatarUrl}
                      alt={doctor.name}
                      className="h-12 w-12 rounded-full bg-muted shrink-0"
                      aria-hidden="true"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{doctor.name}</span>
                        {doctor.isRecommended && (
                          <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                            Polecany
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{doctor.specialization}</p>
                      <p className="text-sm text-muted-foreground mt-1">{doctor.description}</p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Opisz problem (opcjonalnie)</CardTitle>
                <CardDescription>
                  Krótki opis powodu konsultacji pomoże specjaliście przygotować się do spotkania
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Np. nieregularny cykl, ból podczas menstruacji, trudności z zajściem w ciążę..."
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  To pole jest opcjonalne. Możesz pominąć szczegóły i omówić je podczas konsultacji.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Zgoda na przetwarzanie danych</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consent"
                    checked={consentGiven}
                    onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="consent" className="text-sm font-normal cursor-pointer">
                      Wyrażam zgodę na przetwarzanie moich danych osobowych oraz danych o stanie zdrowia 
                      w celu umówienia konsultacji ze specjalistą. *
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Zgodnie z RODO masz prawo do wglądu, poprawiania i usunięcia swoich danych. 
                      Twoje dane będą wykorzystane wyłącznie w celu organizacji konsultacji.
                    </p>
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-xs">
                    Ta aplikacja nie oferuje bezpośrednich konsultacji medycznych. Twoje zgłoszenie zostanie 
                    przekazane do partnera medycznego, który skontaktuje się z Tobą w celu umówienia wizyty.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg" disabled={!consentGiven}>
              <UserPlus className="mr-2 h-5 w-5" />
              Wyślij zgłoszenie konsultacji
            </Button>
          </form>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Co dalej?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </div>
                <p>Wypełnij formularz zgłoszenia</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  2
                </div>
                <p>Twoje zgłoszenie zostanie przekazane do partnera medycznego</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  3
                </div>
                <p>Skontaktujemy się z Tobą w ciągu 2-3 dni roboczych</p>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  4
                </div>
                <p>Umówimy termin konsultacji z wybranym specjalistą</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pilna pomoc</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                W przypadku nagłych dolegliwości (silny ból, krwawienie, gorączka) 
                nie czekaj na konsultację - udaj się do lekarza lub na izbę przyjęć.
              </p>
              <p className="mt-3 font-medium text-foreground">
                Numer alarmowy: 112
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}