import useApiMutation from '@/hooks/useApiMutation'

export default function usePatch(defaultUrl = '', defaultConfig) {
  return useApiMutation('patch', defaultUrl, defaultConfig)
}
