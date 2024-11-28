import { useEntyAIChatStore } from '@/app/components/enty-chat/store'

function useFilterSigninAccount() {
  const selectedAccounts = useEntyAIChatStore(state => state.selectedAccounts)

  return selectedAccounts
}

export { useFilterSigninAccount }
