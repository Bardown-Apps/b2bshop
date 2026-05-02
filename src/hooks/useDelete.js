import useApiMutation from '@/hooks/useApiMutation'

export default function useDelete(defaultUrl = '', defaultConfig) {
  return useApiMutation('delete', defaultUrl, defaultConfig)
}
