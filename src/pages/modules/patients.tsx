import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/routes/paths'
import { apiRequest } from '@/utils/api'

interface IPatientProfile {
  id: string
  firstName: string
  lastName: string
  createdAt: string
}

interface IPatientsListResponse {
  data: IPatientProfile[]
}

export const PatientsPage: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [patients, setPatients] = React.useState<IPatientProfile[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    setIsLoading(true)
    apiRequest<IPatientsListResponse>('/patients')
      .then(data => {
        setPatients(data.data ?? [])
      })
      .catch(e => {
        setError(e.message || 'Failed to load patients.')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filteredPatients = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(p =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q)
    )
  }, [patients, search])

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <Card className="max-w-4xl mx-auto w-full">
        <CardHeader>
          <CardTitle>{t('patients.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder={t('patients.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-sm"
          />
          {isLoading ? (
            <div className="text-center">{t('patients.loading')}</div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredPatients.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => navigate(ROUTES.PATIENTS.DETAIL(p.id))}
                  className="w-full text-left transition-shadow focus:ring-2 focus:ring-primary/40 rounded-lg"
                  tabIndex={0}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex gap-2 items-center">
                        {p.firstName} {p.lastName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">{t('patients.createdAt')}:</span>{' '}
                        {new Date(p.createdAt).toLocaleDateString(i18n.language)}
                      </div>
                    </CardContent>
                  </Card>
                </button>
              ))}
              {filteredPatients.length === 0 && (
                <p className="col-span-full text-center text-muted-foreground text-sm">
                  {t('patients.noResults')}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}