import type { FC } from 'react'
import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiArrowGoBackLine,
  RiArrowGoForwardFill,
} from '@remixicon/react'
import TipPopup from '../operator/tip-popup'
import { useWorkflowHistoryStore } from '../workflow-history-store'
import { useNodesReadOnly } from '../hooks'
import ViewWorkflowHistory from './view-workflow-history'

export type UndoRedoProps = { handleUndo: () => void; handleRedo: () => void }
const UndoRedo: FC<UndoRedoProps> = ({ handleUndo, handleRedo }) => {
  const { t } = useTranslation()
  const { store } = useWorkflowHistoryStore()
  const [buttonsDisabled, setButtonsDisabled] = useState({ undo: true, redo: true })

  useEffect(() => {
    const unsubscribe = store.temporal.subscribe((state) => {
      setButtonsDisabled({
        undo: state.pastStates.length === 0,
        redo: state.futureStates.length === 0,
      })
    })
    return () => unsubscribe()
  }, [store])

  const { nodesReadOnly } = useNodesReadOnly()

  return (
    <div className='flex items-center p-0.5 rounded-lg border-[0.5px] border-gray-100 dark:border-stone-600 bg-tgai-panel-background-3 shadow-lg dark:shadow-stone-800 text-tgai-text-2'>
      <TipPopup title={t('workflow.common.undo')!} shortcuts={['ctrl', 'z']}>
        <div
          data-tooltip-id='workflow.undo'
          className={`
        flex items-center px-1.5 w-8 h-8 rounded-md text-[13px] font-medium 
        hover:bg-black/5 dark:hover:bg-zinc-600 hover:text-tgai-text-1 cursor-pointer select-none
        ${(nodesReadOnly || buttonsDisabled.undo) && 'hover:bg-transparent opacity-50 !cursor-not-allowed'}
      `}
          onClick={() => !nodesReadOnly && !buttonsDisabled.undo && handleUndo()}
        >
          <RiArrowGoBackLine className='h-4 w-4' />
        </div>
      </TipPopup>
      <TipPopup title={t('workflow.common.redo')!} shortcuts={['ctrl', 'y']}>
        <div
          data-tooltip-id='workflow.redo'
          className={`
        flex items-center px-1.5 w-8 h-8 rounded-md text-[13px] font-medium 
        hover:bg-black/5 dark:hover:bg-zinc-600 hover:text-tgai-text-1 cursor-pointer select-none
        ${(nodesReadOnly || buttonsDisabled.redo) && 'hover:bg-transparent opacity-50 !cursor-not-allowed'}
      `}
          onClick={() => !nodesReadOnly && !buttonsDisabled.redo && handleRedo()}
        >
          <RiArrowGoForwardFill className='h-4 w-4' />
        </div>
      </TipPopup>
      <div className="mx-[3px] w-[1px] h-3.5 bg-gray-200 dark:bg-zinc-600"></div>
      <ViewWorkflowHistory />
    </div>
  )
}

export default memo(UndoRedo)
