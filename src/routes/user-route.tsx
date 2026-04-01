import { Outlet } from 'react-router-dom'

import { useAuth } from '@/hooks/use-auth'
import { Loader } from '@/components/loader'

export const UserRoute = () => {
  const { isLoading, isUserLoading } = useAuth()

  if (isLoading || isUserLoading) {
    return <Loader />
  }

  return <Outlet />
}
