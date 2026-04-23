import useApiMutation from '@/hooks/useApiMutation'

export default function usePost(defaultUrl = '', defaultConfig = {}) {
  return useApiMutation('post', defaultUrl, defaultConfig)
}
