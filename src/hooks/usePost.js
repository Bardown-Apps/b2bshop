import useApiMutation from '@/hooks/useApiMutation'
import HttpService from '@/services/http'

export default function usePost(defaultUrl = '', defaultConfig = {}) {
  const { mutate, data, error, isLoading, reset } = useApiMutation(
    'post',
    defaultUrl,
    defaultConfig,
  )

  const mutateAsync = async (payload, options = {}) => {
    // Backward compatibility for copied flows that call:
    // mutateAsync({ url, data, isPut, isPatch, isDelete })
    if (payload && typeof payload === 'object' && payload.url) {
      const { url, data: body, isPut, isPatch, isDelete, config } = payload
      if (isPut) {
        return HttpService.put(url, body, config)
      }
      if (isPatch) {
        return HttpService.patch(url, body, config)
      }
      if (isDelete) {
        return HttpService.delete(url, { ...(config || {}), data: body })
      }
      return HttpService.post(url, body, config)
    }

    const result = await mutate(payload, options)
    return { data: result }
  }

  return {
    mutate,
    mutateAsync,
    data,
    error,
    isLoading,
    reset,
  }
}
