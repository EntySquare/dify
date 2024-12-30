import { create } from 'zustand'
import type { ChatItem } from '@/app/components/enty-chat/types'

type State = {
  selectedAccounts: string[]
  isChatStarted: boolean
  isLeftPanelOpen: boolean
  isResponding: boolean
  selectedPersonality: string | null
  chatLists: ChatItem[]
  conversation_id: string | null
}

type Action = {
  setSelectedAccounts: (accounts: string[]) => void
  setIsChatStarted: (isChatStarted: boolean) => void
  setIsLeftPanelOpen: (isLeftPanelOpen: boolean) => void
  setChatLists: (chatLists: ChatItem[]) => void
  setIsResponding: (isResponding: boolean) => void
  setSelectedPersonality: (selectedPersonality: string | null) => void
  setConversationId: (conversation_id: string | null) => void
}

export const useEntyAIChatStore = create<State & Action>(set => ({
  selectedAccounts: [],
  isChatStarted: false,
  isLeftPanelOpen: true,
  chatLists: [],
  isResponding: false,
  selectedPersonality: null,
  conversation_id: null,
  setSelectedAccounts: selectedAccounts => set(() => ({ selectedAccounts })),
  setIsChatStarted: isChatStarted => set(() => ({ isChatStarted })),
  setIsLeftPanelOpen: isLeftPanelOpen => set(() => ({ isLeftPanelOpen })),
  setChatLists: chatLists => set(() => ({ chatLists })),
  setIsResponding: isResponding => set(() => ({ isResponding })),
  setSelectedPersonality: selectedPersonality => set(() => ({ selectedPersonality })),
  setConversationId: conversation_id => set(() => ({ conversation_id })),
}))
