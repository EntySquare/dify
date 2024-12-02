import { create } from 'zustand'
import type { ChatItem } from '@/app/components/enty-chat/types'

type State = {
  selectedAccounts: string[]
  isChatStarted: boolean
  isLeftPanelOpen: boolean
  isResponding: boolean
  selectedPersonality?: string
  chatLists: ChatItem[]
  conversation_id?: string
}

type Action = {
  setSelectedAccounts: (accounts: string[]) => void
  setIsChatStarted: (isChatStarted: boolean) => void
  setIsLeftPanelOpen: (isLeftPanelOpen: boolean) => void
  setChatLists: (chatLists: ChatItem[]) => void
  setIsResponding: (isResponding: boolean) => void
  setSelectedPersonality: (selectedPersonality: string) => void
  setConversationId: (conversation_id?: string) => void
}

export const useEntyAIChatStore = create<State & Action>(set => ({
  selectedAccounts: [],
  isChatStarted: true,
  isLeftPanelOpen: true,
  chatLists: [],
  isResponding: false,
  selectedPersonality: undefined,
  conversation_id: undefined,
  setSelectedAccounts: selectedAccounts => set(() => ({ selectedAccounts })),
  setIsChatStarted: isChatStarted => set(() => ({ isChatStarted })),
  setIsLeftPanelOpen: isLeftPanelOpen => set(() => ({ isLeftPanelOpen })),
  setChatLists: chatLists => set(() => ({ chatLists })),
  setIsResponding: isResponding => set(() => ({ isResponding })),
  setSelectedPersonality: selectedPersonality => set(() => ({ selectedPersonality })),
  setConversationId: conversation_id => set(() => ({ conversation_id })),
}))
