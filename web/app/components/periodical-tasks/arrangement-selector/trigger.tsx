'use client'

import React from "react"

import cn from '@/utils/classnames'
import { TGAIWorkflow } from "@/models/tgai-workflow"

type Props = {
    open: boolean
    selectedArrangementData: TGAIWorkflow | undefined
}

const ArrangementTrigger = React.memo(({ open, selectedArrangementData }: Props) => {

    return (
        <div
            className={cn(
                'group flex items-center px-2 h-8 rounded-lg bg-gray-100 dark:bg-tgai-input-background hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer',
                open && '!bg-gray-200 dark:!bg-zinc-700',
                selectedArrangementData ? "text-tgai-text-1" : "text-tgai-text-3"
            )}
        >
            {selectedArrangementData?.workflow_name || "请选择任务..."}
        </div>
    )
})

export default ArrangementTrigger