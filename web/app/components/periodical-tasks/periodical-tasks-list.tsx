'use client'

import React from "react"
import PeriodicalTaskCard from "./card"
import cn from '@/utils/classnames'
import { usePeriodicalTasksStore } from "./store"
import { PeriodicalTaskRes } from "@/models/tgai-periodical-task"
import { TGAIWorkflow } from "@/models/tgai-workflow"

type Props = {
    taskList: PeriodicalTaskRes[]
    arrangementList: TGAIWorkflow[] | undefined
}

const PeriodicalTasksList = React.memo<Props>(({ taskList, arrangementList }) => {

    const currentTask = usePeriodicalTasksStore(state => state.currentTask)

    return (
        <>
            {taskList.map((task) => <PeriodicalTaskCard key={task.id} task={task} active={currentTask === task.id} arrangementList={arrangementList}/>)}
        </>
    )
})

PeriodicalTasksList.displayName = "PeriodicalTasksList"

export default PeriodicalTasksList