import { useDocumentTitle } from '@/hooks/use-document-title'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Heart, Baby } from 'lucide-react'

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
  )
  return match ? match[1] : null
}

interface IYouTubeVideo {
  url: string
  title: string
  description: string
}

const TAB_VIDEOS: Record<'cycle' | 'fertility' | 'planning', IYouTubeVideo> = {
  cycle: {
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'Cykl menstruacyjny – co warto wiedzieć?',
    description: 'Przewodnik po fazach cyklu i ich wpływie na organizm.',
  },
  fertility: {
    url: 'https://youtu.be/3JZ_D3ELwOQ',
    title: 'Podstawy płodności',
    description: 'Jak rozumieć okno płodności i czynniki wpływające na płodność.',
  },
  planning: {
    url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    title: 'Planowanie ciąży krok po kroku',
    description: 'Jak przygotować się do ciąży i kiedy szukać pomocy specjalisty.',
  },
}

interface IYouTubeEmbedProps {
  videoId: string
  title: string
}

const YouTubeEmbed = ({ videoId, title }: IYouTubeEmbedProps) => (
  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
    <iframe
      className="absolute inset-0 h-full w-full rounded-md"
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
)

interface IVideoPanelProps {
  tab: 'cycle' | 'fertility' | 'planning'
}

const VideoPanel = ({ tab }: IVideoPanelProps) => {
  const video = TAB_VIDEOS[tab]
  const videoId = extractYouTubeId(video.url)
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{video.title}</CardTitle>
        <CardDescription>{video.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {videoId ? (
          <YouTubeEmbed videoId={videoId} title={video.title} />
        ) : (
          <p className="text-sm text-muted-foreground">Nie można załadować wideo.</p>
        )}
      </CardContent>
    </Card>
  )
}

export const FertilityEducation = () => {
  const { t } = useTranslation()
  useDocumentTitle('fertility.education.title')

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('fertility.education.title')}</h1>
        <p className="text-muted-foreground">{t('fertility.education.description')}</p>
      </div>

      <Alert>
        <AlertDescription className="text-sm">
          ⚠️ {t('fertility.disclaimer')}
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="cycle" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cycle">
            <Heart className="mr-2 h-4 w-4" />
            Cykl menstruacyjny
          </TabsTrigger>
          <TabsTrigger value="fertility">
            <Baby className="mr-2 h-4 w-4" />
            Płodność
          </TabsTrigger>
          <TabsTrigger value="planning">
            <BookOpen className="mr-2 h-4 w-4" />
            Planowanie ciąży
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cycle" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Czym jest cykl menstruacyjny?</CardTitle>
                  <CardDescription>
                    Podstawowe informacje o cyklu menstruacyjnym
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p>
                    Cykl menstruacyjny to naturalny, cykliczny proces zachodzący w organizmie kobiety w wieku rozrodczym. 
                    Trwa zazwyczaj od 21 do 35 dni, przy czym najczęstsza długość to około 28 dni.
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Fazy cyklu:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                      <li><strong>Faza menstruacyjna (1-5 dzień)</strong> - Krwawienie menstruacyjne, złuszczanie błony śluzowej macicy</li>
                      <li><strong>Faza folikularna (6-13 dzień)</strong> - Dojrzewanie pęcherzyka jajnikowego, wzrost poziomu estrogenu</li>
                      <li><strong>Owulacja (około 14 dzień)</strong> - Uwolnienie komórki jajowej z jajnika</li>
                      <li><strong>Faza lutealna (15-28 dzień)</strong> - Przygotowanie macicy do ewentualnej implantacji zarodka</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Typowe objawy w różnych fazach</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">Faza menstruacyjna:</p>
                    <p className="text-muted-foreground">Bóle brzucha, zmęczenie, bóle głowy, wahania nastroju</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Faza folikularna:</p>
                    <p className="text-muted-foreground">Większa energia, lepsze samopoczucie, wzmożona aktywność</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Owulacja:</p>
                    <p className="text-muted-foreground">Wzrost libido, delikatny ból po jednej stronie brzucha</p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Faza lutealna:</p>
                    <p className="text-muted-foreground">Wzdęcia, wrażliwość piersi, zmiany nastroju, zmęczenie</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:sticky md:top-24 md:self-start">
              <VideoPanel tab="cycle" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fertility" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Podstawy płodności</CardTitle>
                  <CardDescription>
                    Informacje edukacyjne o płodności kobiet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p>
                    Płodność to zdolność do zajścia w ciążę. U kobiet jest ona ściśle związana z cyklem menstruacyjnym 
                    i procesem owulacji.
                  </p>
                  <div>
                    <h4 className="font-semibold mb-2">Okno płodności:</h4>
                    <p className="text-muted-foreground">
                      Najwyższa płodność występuje w tzw. "oknie płodności", które obejmuje 5-6 dni w cyklu: 
                      5 dni przed owulacją i dzień owulacji. Plemniki mogą przetrwać w organizmie kobiety do 5 dni, 
                      podczas gdy komórka jajowa jest zdolna do zapłodnienia przez około 24 godziny.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Czynniki wpływające na płodność:</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Wiek (płodność maleje po 35. roku życia)</li>
                      <li>Stan zdrowia ogólnego</li>
                      <li>Waga ciała (niedowaga lub nadwaga)</li>
                      <li>Palenie tytoniu i alkohol</li>
                      <li>Stres</li>
                      <li>Niektóre schorzenia (PCOS, endometrioza)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertDescription>
                  <strong>Ważne:</strong> Informacje zawarte w tej sekcji mają charakter wyłącznie edukacyjny. 
                  Jeśli masz trudności z zajściem w ciążę, skonsultuj się ze specjalistą.
                </AlertDescription>
              </Alert>
            </div>

            <div className="md:sticky md:top-24 md:self-start">
              <VideoPanel tab="fertility" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="planning" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Planowanie ciąży</CardTitle>
                  <CardDescription>
                    Informacje dla kobiet planujących ciążę
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Przygotowanie do ciąży:</h4>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li><strong>Kwas foliowy</strong> - Zalecana suplementacja (min. 400 µg dziennie) na 3 miesiące przed planowaną ciążą</li>
                      <li><strong>Badania kontrolne</strong> - Konsultacja z ginekologiem, badania tarczycy, morfologia, poziom witaminy D</li>
                      <li><strong>Zdrowy styl życia</strong> - Zbilansowana dieta, regularna aktywność fizyczna, odpowiednia waga</li>
                      <li><strong>Unikanie używek</strong> - Alkohol, papierosy, narkotyki negatywnie wpływają na płodność i rozwój płodu</li>
                      <li><strong>Szczepienia</strong> - Sprawdzenie odporności na różyczkę i inne choroby</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Śledzenie cyklu:</h4>
                    <p className="text-muted-foreground">
                      Regularne obserwowanie swojego cyklu może pomóc w określeniu okna płodności. Pomocne mogą być:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                      <li>Kalendarz cyklu</li>
                      <li>Obserwacja śluzu szyjkowego</li>
                      <li>Pomiar temperatury ciała bazalnej</li>
                      <li>Testy owulacyjne</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kiedy zasięgnąć porady lekarza?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Warto skonsultować się ze specjalistą, jeśli:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Masz poniżej 35 lat i nie udaje się zajść w ciążę przez 12 miesięcy regularnych prób</li>
                    <li>Masz powyżej 35 lat i nie udaje się zajść w ciążę przez 6 miesięcy</li>
                    <li>Masz nieregularny cykl lub jego brak</li>
                    <li>Podejrzewasz niepłodność partnera</li>
                    <li>Masz schorzenia mogące wpływać na płodność (PCOS, endometrioza)</li>
                    <li>Przebyte infekcje układu rozrodczego</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="md:sticky md:top-24 md:self-start">
              <VideoPanel tab="planning" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}