import { TGAIWorkflow } from "@/models/tgai-workflow"
import React from "react"
import Tooltip from "@/app/components/base/tooltip"
import { Check } from "@/app/components/base/icons/src/vender/line/general"

type Props = {
    arrangement: TGAIWorkflow
    selected: boolean
    onSelect: (arrangement_id: string) => void
}

const PopupItem = React.memo<Props>(({ arrangement, selected, onSelect }) => {


    return (
        <div className='mb-1'>
            <Tooltip
                selector={`${arrangement.workflow_id}-${arrangement.workflow_name}`}
                content={undefined}
                position='right'
            >
                <div className={`roup relative flex items-center px-3 py-1.5 h-8 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-600`}
                    onClick={() => onSelect(arrangement.workflow_id)}
                >
                    <div className={`grow text-sm font-normal text-tgai-text-1`}>
                        {arrangement.workflow_name}
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

export default PopupItem