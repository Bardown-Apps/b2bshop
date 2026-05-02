import { useCallback, useState } from 'react'
import HttpService from '@/services/http'

/** Stable fallback so `mutate` stays memoized when callers omit config. */
const EMPTY_CONFIG = {}

const runRequest = (method, url, payload, config) => {
  if (method === 'delete') {
    return HttpService.delete(url, { ...config, data: payload })
  }

  return HttpService[method](url, payload, config)
}

export default function useApiMutation(method, defaultUrl = '', defaultConfig = EMPTY_CONFIG) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(
    async (payload, options = {}) => {
      const url = options.url ?? defaultUrl
      const config = { ...defaultConfig, ...(options.config ?? {}) }

      if (!url) {
        const urlError = new Error('Request URL is required')
        setError(urlError)
        throw urlError
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await runRequest(method, url, payload, config)
        setData(response.data)
        return response.data
      } catch (requestError) {
        setError(requestError)
        throw requestError
      } finally {
        setIsLoading(false)
      }
    },
    [defaultConfig, defaultUrl, method],
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { mutate, data, error, isLoading, reset }
}
