import { useEffect, useRef } from 'react'
import AppRoutes from '@/routes/AppRoutes'
import { AxiosInterceptor } from '@/services/http'
import HttpService from '@/services/http'
import { useDispatch, useSelector } from 'react-redux'
import GlobalLoader from '@/components/GlobalLoader'
import useAuthBootstrapCalls from '@/hooks/useAuthBootstrapCalls'
import { CART } from '@/constants/services'
import { setCartItemsCount, setItems } from '@/features/cart/cartSlice'

function App() {
  const dispatch = useDispatch()
  const pendingRequests = useSelector((state) => state.network.pendingRequests)
  const authToken = useSelector((state) => state?.auth?.token)
  const hasBootstrappedCartRef = useRef(false)
  useAuthBootstrapCalls()

  useEffect(() => {
    if (!authToken || hasBootstrappedCartRef.current) return
    hasBootstrappedCartRef.current = true

    const bootstrapCart = async () => {
      try {
        const response = await HttpService.post(CART, {})
        const items = Array.isArray(response?.data) ? response.data : []
        dispatch(setItems({ items }))
        dispatch(setCartItemsCount({ count: items.length }))
      } catch (_error) {
        // Keep app startup resilient if cart bootstrap fails.
      }
    }

    bootstrapCart()
  }, [authToken, dispatch])

  return (
    <AxiosInterceptor>
      <GlobalLoader show={pendingRequests > 0} />
      <AppRoutes />
    </AxiosInterceptor>
  )
}

export default App
