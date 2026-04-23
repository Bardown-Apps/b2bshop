import AppRoutes from '@/routes/AppRoutes'
import { AxiosInterceptor } from '@/services/http'

function App() {
  return (
    <AxiosInterceptor>
      <AppRoutes />
    </AxiosInterceptor>
  )
}

export default App
