'use client'

import React from 'react'

import cn from '@/utils/classnames'
import type { TGAIWorkflow } from '@/models/tgai-workflow'

type Props = {
  open: boolean
  selectedWorkflowData: TGAIWorkflow | undefined
}

const WorkflowSelectorTrigger = React.memo(({ open, selectedWorkflowData }: Props) => {
  return (
    <div
      className={cn(
        'group flex items-center px-2 h-8 rounded-lg bg-gray-100 dark:bg-tgai-input-background hover:bg-gray-200 dark:hover:bg-zinc-700 cursor-pointer',
        open && '!bg-gray-200 dark:!bg-zinc-700',
        selectedWorkflowData ? 'text-tgai-text-1' : 'text-tgai-text-3',
      )}
    >
      {selectedWorkflowData?.workflow_name || '请选择工作流...'}
    </div>
  )
})

WorkflowSelectorTrigger.displayName = 'WorkflowSelectorTrigger'

export default WorkflowSelectorTrigger
