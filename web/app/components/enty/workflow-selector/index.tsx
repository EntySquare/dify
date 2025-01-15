'use client'

import React, { useMemo, useState } from 'react'
import Popup from './popup'
import WorkflowSelectorTrigger from './trigger'
import { PortalToFollowElem, PortalToFollowElemContent, PortalToFollowElemTrigger } from '@/app/components/base/portal-to-follow-elem'
import type { TGAIWorkflow } from '@/models/tgai-workflow'

type WorkflowSelectorProps = {
  workflowList: TGAIWorkflow[]
  selectedWorkflow: string | null
  onSelect?: (workflow_id: string) => void
}

const WorkflowSelector = React.memo<WorkflowSelectorProps>(({ workflowList, selectedWorkflow, onSelect }) => {
  const [open, setOpen] = useState(false)

  const selectedWorkflowData = useMemo(() => {
    return workflowList.find(workflow => workflow.workflow_id === selectedWorkflow)
  }, [workflowList, selectedWorkflow])

  const handleSelect = (workflow_id: string) => {
    setOpen(false)

    if (onSelect)
      onSelect(workflow_id)
  }
  const handleToggle = () => {
    setOpen(v => !v)
  }

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-start'
      offset={4}
    >
      <div className='relative'>
        <PortalToFollowElemTrigger
          onClick={handleToggle}
          className='block'
        >
          <WorkflowSelectorTrigger open={open} selectedWorkflowData={selectedWorkflowData} />
        </PortalToFollowElemTrigger>
        <PortalToFollowElemContent className={'z-[1002]'}>
          <Popup
            workflowList={workflowList}
            selectedWorkflow={selectedWorkflow}
            onSelect={handleSelect}
          />
        </PortalToFollowElemContent>
      </div>
    </PortalToFollowElem>
  )
})

WorkflowSelector.displayName = 'WorkflowSelector'

export default WorkflowSelector
