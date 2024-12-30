import { useCallback } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'

function useFilterSigninAccount() {
  const selectedAccounts = useEntyAIChatStore(state => state.selectedAccounts)

  return selectedAccounts
}

export { useFilterSigninAccount }

export const useEntyChat = () => {
  const {
    isChatStarted,
    setIsChatStarted,
    setChatLists,
    setConversationId,
    setSelectedAccounts,
    setSelectedPersonality,
  } = useEntyAIChatStore(useShallow(state => ({
    isChatStarted: state.isChatStarted,
    setIsChatStarted: state.setIsChatStarted,
    setChatLists: state.setChatLists,
    setConversationId: state.setConversationId,
    setSelectedAccounts: state.setSelectedAccounts,
    setSelectedPersonality: state.setSelectedPersonality,
  })))

  const onRestartAIChat = useCallback(() => {
    if (!isChatStarted)
      return

    setChatLists([])
    setSelectedAccounts([])
    setSelectedPersonality(null)
    setConversationId(null)
    setIsChatStarted(false)
  }, [isChatStarted])

  return { onRestartAIChat }
}
