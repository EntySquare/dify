import React from 'react'
import type { TGAIWorkflow } from '@/models/tgai-workflow'
import Tooltip from '@/app/components/base/tooltip'
import { Check } from '@/app/components/base/icons/src/vender/line/general'

type Props = {
  workflow: TGAIWorkflow
  selected: boolean
  onSelect: (workflow_id: string) => void
}

const PopupItem = React.memo<Props>(({ workflow, selected, onSelect }) => {
  return (
    <div className='mb-1'>
      <Tooltip
        position='right'
      >
        <div className={'roup relative flex items-center px-3 py-1.5 h-8 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-600'}
          onClick={() => onSelect(workflow.workflow_id)}
        >
          <div className={'grow text-sm font-normal text-tgai-text-1'}>
            {workflow.workflow_name}
          </div>
          {
            selected && (
              <Check className='shrink-0 w-4 h-4 text-tgai-primary' />
            )
          }
        </div>
      </Tooltip>
    </div>
  )
})

PopupItem.displayName = 'WorkflowSelectorPopupItem'

export default PopupItem
