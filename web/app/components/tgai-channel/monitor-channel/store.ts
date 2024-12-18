import { create } from 'zustand'

type State = {
  channelDetailId: number | undefined
}

type Action = {
  setChannelDetailId: (channelDetailId?: number) => void
}

export const useAllChannelStore = create<State & Action>(set => ({
  channelDetailId: undefined,
  setChannelDetailId: channelDetailId => set(() => ({ channelDetailId })),
}))
