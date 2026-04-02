import { useDocumentTitle } from '@/hooks/use-document-title'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, Hospital, Stethoscope } from 'lucide-react'
function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
  )
  return match ? match[1] : null
}

interface IYouTubeVideo {
  url: string
}

const TAB_VIDEOS: Record<'about' | 'diagnosis' | 'treatment', IYouTubeVideo> = {
  about: {
    url: 'https://www.youtube.com/watch?v=NT8mCn7V6po',
  },
  diagnosis: {
    url: 'https://www.youtube.com/watch?v=NT8mCn7V6po',
  },
  treatment: {
    url: 'https://www.youtube.com/watch?v=NT8mCn7V6po',
  },
}

interface IYouTubeEmbedProps {
  videoId: string
}

const YouTubeEmbed = ({ videoId }: IYouTubeEmbedProps) => (
  <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
    <iframe
      className="absolute inset-0 h-full w-full rounded-md"
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
)

interface IVideoPanelProps {
  tab: 'about' | 'diagnosis' | 'treatment'
}

const VideoPanel = ({ tab }: IVideoPanelProps) => {
  const video = TAB_VIDEOS[tab]
  const videoId = extractYouTubeId(video.url)
  return (
    <Card>
      <CardContent>
        {videoId ? (
          <YouTubeEmbed videoId={videoId} />
        ) : (
          <p className="text-sm text-muted-foreground">Nie można załadować wideo.</p>
        )}
      </CardContent>
    </Card>
  )
}

export const EndometriosisAdvice = () => {
  const { t } = useTranslation()
  useDocumentTitle(t('endometriosis.advice.title'))

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('endometriosis.advice.title')}</h1>
        <p className="text-muted-foreground">{t('endometriosis.advice.subtitle')}</p>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">
            <Heart className="mr-2 h-4 w-4" />
            {t('endometriosis.advice.abouttab')}
          </TabsTrigger>
          <TabsTrigger value="diagnosis">
            <Stethoscope className="mr-2 h-4 w-4" />
            {t('endometriosis.advice.diagnosistab')}
          </TabsTrigger>
          <TabsTrigger value="treatment">
            <Hospital className="mr-2 h-4 w-4" />
            {t('endometriosis.advice.treatmenttab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('endometriosis.advice.c1s1title')}</CardTitle>
                  <CardDescription>{t('endometriosis.advice.c1s1subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {(
                    t('endometriosis.advice.c1s1content', {
                      returnObjects: true,
                    }) as string[]
                  ).map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('endometriosis.advice.c1s2title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {(
                      t('endometriosis.advice.c1s2content', {
                        returnObjects: true,
                      }) as string[]
                    ).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="md:sticky md:top-24 md:self-start">
              <VideoPanel tab="about" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="diagnosis" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('endometriosis.advice.c2s1title')}</CardTitle>
                  <CardDescription>{t('endometriosis.advice.c2s1subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <p>{t('endometriosis.advice.c2s1content')}</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {(
                      t('endometriosis.advice.c2s1list', {
                        returnObjects: true,
                      }) as string[]
                    ).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="md:sticky md:top-24 md:self-start">
              <VideoPanel tab="diagnosis" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="treatment" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('endometriosis.advice.c3s1title')}</CardTitle>
                  <CardDescription>{t('endometriosis.advice.c3s1subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {(
                      t('endometriosis.advice.c3s1content', {
                        returnObjects: true,
                      }) as string[]
                    ).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="md:sticky md:top-24 md:self-start">
              <VideoPanel tab="treatment" />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
