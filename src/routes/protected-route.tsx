import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { Loader } from '@/components/loader'

export const ProtectedRoute = () => {
  const { user, isLoading, isUserLoading } = useAuth()

  if (isLoading || isUserLoading) {
    return <Loader />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
