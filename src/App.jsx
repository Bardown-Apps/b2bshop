import AppRoutes from '@/routes/AppRoutes'
import { AxiosInterceptor } from '@/services/http'
import { useSelector } from 'react-redux'
import GlobalLoader from '@/components/GlobalLoader'
import useAuthBootstrapCalls from '@/hooks/useAuthBootstrapCalls'

function App() {
  const pendingRequests = useSelector((state) => state.network.pendingRequests)
  useAuthBootstrapCalls()

  return (
    <AxiosInterceptor>
      <GlobalLoader show={pendingRequests > 0} />
      <AppRoutes />
    </AxiosInterceptor>
  )
}

export default App
