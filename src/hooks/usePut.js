import useApiMutation from '@/hooks/useApiMutation'

export default function usePut(defaultUrl = '', defaultConfig) {
  return useApiMutation('put', defaultUrl, defaultConfig)
}
