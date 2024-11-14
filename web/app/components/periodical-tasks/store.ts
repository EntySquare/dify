import { create } from 'zustand'

type State = {
    currentTask: number | undefined
}

type Action = {
    setCurrentTask: (currentTask?: number) => void
}

export const usePeriodicalTasksStore = create<State & Action>(set => ({
    currentTask: undefined,
    setCurrentTask: currentTask => set(() => ({ currentTask })),
}))
