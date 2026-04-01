import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Loader } from '@/components/loader'
import { ROUTES } from './paths'

export const GuestRoute = () => {
  const { user, isLoading, isUserLoading } = useAuth()
  const location = useLocation()
  const isUpdatePassword = location.pathname === ROUTES.UPDATE_PASSWORD
  const params = new URLSearchParams(location.search)
  const hasRecoveryParams =
    !!params.get('email') && (params.has('code') || params.has('token_hash'))

  if (isLoading || isUserLoading) {
    return <Loader />
  }

  if (user && !(isUpdatePassword && hasRecoveryParams)) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return <Outlet />
}
