import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import routes from '@/constants/routes'

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to={routes.dashboard} replace />
  }

  return children
}

export default PublicRoute
