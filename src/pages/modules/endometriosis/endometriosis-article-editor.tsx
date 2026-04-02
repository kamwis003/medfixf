import { FC, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { useAuth } from '@/hooks/use-auth'
import { apiRequest } from '@/utils/api'
import { ROUTES } from '@/routes/paths'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useTranslation } from 'react-i18next'

type CreateResponse = {
  success: true
  data: { id: string }
}

type FormState = { title: string; content: string }

const initialForm: FormState = { title: '', content: '' }

export const EndometriosisArticleEditor: FC = () => {
  const { t } = useTranslation()
  useDocumentTitle(t('endometriosis.info.addarticle'))

  const navigate = useNavigate()
  const { user } = useAuth()

  const [form, setForm] = useState<FormState>(initialForm)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSaving(true)
    try {
      await apiRequest<CreateResponse>('/endometriosis-articles', {
        method: 'POST',
        body: JSON.stringify(form),
      })

      navigate(ROUTES.ENDOMETRIOSIS.INFO)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError('Nie udało się dodać artykułu.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-4 md:p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t('endometriosis.info.addarticle')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-5">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-1">{t('endometriosis.editor.title')}</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                className="w-full border rounded-lg p-2"
                disabled={isSaving}
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">{t('endometriosis.editor.content')}</label>
              <textarea
                name="content"
                value={form.content}
                onChange={onChange}
                rows={12}
                className="w-full border rounded-lg p-2"
                disabled={isSaving}
                required
                maxLength={4000}
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="w-1/3"
                onClick={() => navigate(ROUTES.ENDOMETRIOSIS.INFO)}
                disabled={isSaving}
              >
                {t('endometriosis.editor.cancel')}
              </Button>
              <Button type="submit" className="w-2/3" disabled={isSaving}>
                {isSaving ? t('endometriosis.saving') : t('endometriosis.editor.publish')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
