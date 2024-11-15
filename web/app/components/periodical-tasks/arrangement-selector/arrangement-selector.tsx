'use client'

import React, { useMemo, useState } from "react"
import { PortalToFollowElem, PortalToFollowElemContent, PortalToFollowElemTrigger } from "@/app/components/base/portal-to-follow-elem"
import { TGAIWorkflow } from "@/models/tgai-workflow"
import Popup from "./popup"
import ArrangementTrigger from "./trigger"

type ArrangementSelectorProps = {
  arrangementList: TGAIWorkflow[]
  selectedArrangement: string | null
  onSelect?: (arrangement_id: string) => void
}

const ArrangementSelector = React.memo<ArrangementSelectorProps>(({ arrangementList, selectedArrangement, onSelect }) => {

  const [open, setOpen] = useState(false)

  const selectedArrangementData = useMemo(() => {

    return arrangementList.find(arrangement => arrangement.workflow_id === selectedArrangement)

  }, [arrangementList, selectedArrangement])

  const handleSelect = (arrangement_id: string) => {
    setOpen(false)

    if (onSelect)
      onSelect(arrangement_id)
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
          <ArrangementTrigger open={open} selectedArrangementData={selectedArrangementData} />
          {/* {
                currentModel && currentProvider && (
                  <ModelTrigger
                    open={open}
                    provider={currentProvider}
                    model={currentModel}
                    className={triggerClassName}
                    readonly={readonly}
                  />
                )
              } */}
          {/* {
                !currentModel && defaultModel && (
                  <DeprecatedModelTrigger
                    modelName={defaultModel?.model || ''}
                    providerName={defaultModel?.provider || ''}
                    className={triggerClassName}
                  />
                )
              } */}
          {/* {
                !defaultModel && (
                  <EmptyTrigger
                    open={open}
                    className={triggerClassName}
                  />
                )
              } */}
        </PortalToFollowElemTrigger>
        <PortalToFollowElemContent className={`z-[1002]`}>
          <Popup
            arrangementList={arrangementList}
            selectedArrangement={selectedArrangement}
            onSelect={handleSelect}
          />
        </PortalToFollowElemContent>
      </div>
    </PortalToFollowElem>
  )
})

ArrangementSelector.displayName = 'ArrangementSelector'

export default ArrangementSelector