import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import routes from '@/constants/routes'

const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to={routes.home} replace />
  }

  return <Outlet />
}

export default PrivateRoute
