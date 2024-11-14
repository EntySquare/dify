'use client'

import { TGAIWorkflow } from "@/models/tgai-workflow"
import { RiSearchLine } from "@remixicon/react"
import React, { useState } from "react"
import { XCircle } from "@/app/components/base/icons/src/vender/solid/general"
import PopupItem from "./popup-item"

type Props = {
    arrangementList: TGAIWorkflow[]
    selectedArrangement: string | null
    onSelect: (arrangement_id: string) => void
}

const Popup = React.memo<Props>(({ arrangementList, selectedArrangement, onSelect }) => {

    const [searchText, setSearchText] = useState('')

    const filteredArrangementList = arrangementList.filter(arrangement => {

        return arrangement.workflow_name.toLowerCase().includes(searchText.toLowerCase())

    })

    return (
        <div className='w-[320px] max-h-[480px] rounded-lg border-[0.5px] border-gray-200 dark:border-stone-600 bg-tgai-panel-background shadow-lg dark:shadow-stone-800 overflow-y-auto tgai-custom-scrollbar'>
            <div className='sticky top-0 pl-3 pt-3 pr-2 pb-1 bg-tgai-panel-background z-10'>
                <div className={`
              flex items-center pl-[9px] pr-[10px] h-8 rounded-lg border
              ${searchText ? 'bg-tgai-panel-background border-gray-300 dark:border-stone-500 shadow-xs' : 'bg-tgai-input-background border-transparent'}
            `}>
                    <RiSearchLine
                        className={`
                  shrink-0 mr-[7px] w-[14px] h-[14px]
                  ${searchText ? 'text-tgai-text-2' : 'text-tgai-text-3'}
                `}
                    />
                    <input
                        className='block grow h-[18px] text-[13px] text-tgai-text-1 appearance-none outline-none bg-transparent'
                        placeholder='搜索任务'
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                    />
                    {
                        searchText && (
                            <XCircle
                                className='shrink-0 ml-1.5 w-[14px] h-[14px] text-tgai-text-3 cursor-pointer'
                                onClick={() => setSearchText('')}
                            />
                        )
                    }
                </div>
            </div>
            <div className='p-1'>
                {
                    filteredArrangementList.map(arrangement => (
                        <PopupItem
                            key={arrangement.workflow_id}
                            arrangement={arrangement}
                            selected={selectedArrangement === arrangement.workflow_id}
                            onSelect={onSelect}
                        />
                    ))
                }
                {
                    !filteredArrangementList.length && (
                        <div className='px-3 py-1.5 leading-[18px] text-center text-xs text-tgai-text-3 break-all'>
                            {`未找到 “${searchText}”`}
                        </div>
                    )
                }
            </div>
        </div>
    )

})

export default Popup