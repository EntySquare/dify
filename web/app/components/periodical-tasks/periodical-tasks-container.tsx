'use client'

import { useTGAIGlobalStore } from "@/context/tgai-global-context"
import SearchInput from "@/app/components/base/search-input"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { FC } from "react"
import { Theme } from "@/types/app"
import PeriodicalTasksList from "./periodical-tasks-list"
import Button from "@/app/components/base/button"
import { PlusIcon } from "@heroicons/react/24/solid"
import { usePeriodicalTasksStore } from "./store"
import CreatePeriodicalTaskModal from "./create-periodical-task-modal"
import useSWR from "swr"
import { getAllPeriodicalTasks, getTGAIAllWorkflows } from "@/service/tgai"
import PeriodicalTaskDetail from "./periodical-task-detail"
import Loading from "../base/loading"
import { useShallow } from "zustand/react/shallow"
import cn from '@/utils/classnames'
import { RiCloseLine } from "@remixicon/react"

const PeriodicalTasksContainer: FC = () => {

    const theme = useTGAIGlobalStore(state => state.theme)

    const { currentTask, setCurrentTask } = usePeriodicalTasksStore(useShallow(state => ({
        currentTask: state.currentTask,
        setCurrentTask: state.setCurrentTask
    })))


    const [keywords, setKeywords] = useState("")
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)

    const { data, isLoading } = useSWR(['/cron/list'], getAllPeriodicalTasks)
    const { data: arrangementList } = useSWR(['/workflow/all'], getTGAIAllWorkflows)


    const openCreateTaskModal = useCallback(() => {
        setShowCreateTaskModal(true)
    }, [])

    const closeCreateTaskModal = useCallback(() => {
        setShowCreateTaskModal(false)
    }, [])

    const handleKeywordsChange = (value: string) => {
        setKeywords(value)
    }

    useEffect(() => {
        return () => {
            setCurrentTask(undefined)
        }
    }, [])

    const currentTaskData = useMemo(() => {
        if (!currentTask || !data || !data.data.cron_list) return undefined

        return data.data.cron_list.find(task => task.id === currentTask)

    }, [currentTask, data])

    const filteredTasks = useMemo(() => {
        if (!data) return undefined

        return data.data.cron_list.filter(task => task.name.toLowerCase().includes(keywords.trim().toLowerCase())).sort((a, b) => b.id - a.id)

    }, [keywords, data])

    return (
        <div className='relative flex overflow-hidden bg-tgai-section-background shrink-0 h-0 grow'>
            <div className='relative flex flex-col overflow-y-auto bg-tgai-section-background grow tgai-custom-scrollbar'>
                <div className={cn(
                    'sticky top-0 flex justify-between items-center pt-4 px-12 pb-2 leading-[56px] bg-tgai-section-background z-20 flex-wrap gap-y-2',
                    currentTask && currentTaskData && 'pr-6',
                )}>
                    <div>
                        <Button variant={'primary'} onClick={openCreateTaskModal}>
                            <PlusIcon className="size-4 mr-1" /> 创建主动任务
                        </Button>

                    </div>

                    <div>
                        <SearchInput
                            white={theme === Theme.light} dark={theme === Theme.dark} className='w-[200px]'
                            value={keywords}
                            onChange={handleKeywordsChange}
                        />
                    </div>
                </div>
                <div className={cn(
                    'relative grid content-start grid-cols-1 gap-4 px-12 pt-2 pb-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0',
                    currentTask && currentTaskData && 'pr-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
                    isLoading && 'size-full'
                )}>
                    {isLoading && <Loading />}
                    {filteredTasks && <PeriodicalTasksList taskList={filteredTasks} arrangementList={arrangementList ? arrangementList.data.workflow_array : undefined} />}
                </div>
            </div>
            <div className={cn(
                'shrink-0 w-0 border-l-[0.5px] border-black/8 dark:border-stone-600/[92] overflow-y-auto transition-all duration-200 ease-in-out tgai-custom-scrollbar',
                currentTask && currentTaskData && 'w-[420px]',
            )}>
                {currentTask && currentTaskData && <PeriodicalTaskDetail task={currentTaskData} arrangementList={arrangementList ? arrangementList.data.workflow_array : undefined} />}
            </div>
            <div className='absolute top-5 right-5 p-1 cursor-pointer' onClick={() => setCurrentTask(undefined)}><RiCloseLine className='w-4 h-4 text-tgai-text-2' /></div>
            <CreatePeriodicalTaskModal show={showCreateTaskModal} onClose={closeCreateTaskModal} arrangementList={arrangementList ? arrangementList.data.workflow_array : undefined} />
        </div>
    )
}

PeriodicalTasksContainer.displayName = "PeriodicalTasksContainer"

export default PeriodicalTasksContainer

