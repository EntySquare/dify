import { memo } from 'react'
import { MiniMap } from 'reactflow'
import UndoRedo from '../header/undo-redo'
import ZoomInOut from './zoom-in-out'
import Control from './control'
import { useTGAIGlobalStore } from '@/context/tgai-global-context'
import { Theme } from '@/types/app'

export type OperatorProps = {
  handleUndo: () => void
  handleRedo: () => void
}

const Operator = ({ handleUndo, handleRedo }: OperatorProps) => {

  const theme = useTGAIGlobalStore(state => state.theme)
  
  return (
    <>
      <MiniMap
        style={{
          width: 102,
          height: 72,
        }}
        maskColor={theme === Theme.dark ? "rgba(0,0,0,.7)" : undefined}
        nodeColor={theme === Theme.dark ? "var(--tgai-primary)" : undefined}
        className='!absolute !left-4 !bottom-14 z-[9] !m-0 !w-[102px] !h-[72px] !border-[0.5px] !border-black/8 dark:!border-stone-600 !rounded-lg !shadow-lg dark:!shadow-stone-800 !overflow-hidden dark:!bg-zinc-600'
      />
      <div className='flex items-center mt-1 gap-2 absolute left-4 bottom-4 z-[9]'>
        <ZoomInOut />
        <UndoRedo handleUndo={handleUndo} handleRedo={handleRedo} />
        <Control />
      </div>
    </>
  )
}

export default memo(Operator)
