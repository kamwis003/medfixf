import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAuth } from '@/hooks/use-auth'
import { apiRequest } from '@/utils/api'
import { ROUTES } from '@/routes/paths'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'
import type { Article, ListArticleResponse } from '@/types/endometriosis'

export const EndometriosisInfo: FC = () => {
  const { t } = useTranslation()
  useDocumentTitle(t('endometriosis.info.documenttitle'))

  const navigate = useNavigate()
  const { user } = useAuth()

  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchArticles = async () => {
      setError(null)
      setIsLoading(true)
      try {
        const res = await apiRequest<ListArticleResponse>('/endometriosis-articles', {
          method: 'GET',
        })
        if (!cancelled) setArticles(res.data ?? [])
      } catch (e: unknown) {
        if (!cancelled) {
          if (e instanceof Error) {
            setError(e.message)
          } else {
            setError('Nie udało się pobrać artykułów.')
          }
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void fetchArticles()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{t('endometriosis.info.title')}</h1>
        <p className="text-muted-foreground">{t('endometriosis.info.subtitle')}</p>
      </div>

      <div className="flex justify-end mb-2">
        <Button
          onClick={() => navigate(ROUTES.ENDOMETRIOSIS.INFOEDITOR)}
          disabled={!user}
          title={!user ? 'Zaloguj się, aby dodać artykuł' : 'Dodaj artykuł'}
        >
          {t('endometriosis.info.addarticle')}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-5">
        {isLoading ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {t('endometriosis.loading')}
            </CardContent>
          </Card>
        ) : articles.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {t('endometriosis.info.noarticles')}
            </CardContent>
          </Card>
        ) : (
          articles.map(a => (
            <Card key={a.id}>
              <CardHeader>
                <CardTitle>{a.title}</CardTitle>
                <div className="text-xs text-muted-foreground mt-1">
                  {a.author?.name && <span className="pr-2">Autor: {a.author.name}</span>}
                  {new Date(a.createdAt).toLocaleDateString()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{a.content}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
