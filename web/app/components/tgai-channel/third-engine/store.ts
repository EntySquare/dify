import { create } from 'zustand'

type SearchParams = {
    keyword: string
    phone: string
}

type State = {
    searchParams: SearchParams | undefined
    actionLoading: Set<string>
}

type Action = {
    setSearchParams: (searchParams?: SearchParams) => void
    setActionLoading: (actionLoading: Set<string>) => void
}

export const useThirdEngineStore = create<State & Action>(set => ({
    searchParams: undefined,
    setSearchParams: searchParams => set(() => ({ searchParams })),
    actionLoading: new Set(),
    setActionLoading: actionLoading => set(() => ({ actionLoading })),
}))
