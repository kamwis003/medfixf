import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'

export const HomeRedirect: React.FC = () => {
  return <Navigate to={ROUTES.PRODUCTS.MY} replace />
}
