import type { FC } from 'react'
import { RiArrowDownSLine } from '@remixicon/react'
import { CubeOutline } from '../../../../base/icons/src/vender/line/shapes'

type ModelTriggerProps = {
  open: boolean
  className?: string
}
const ModelTrigger: FC<ModelTriggerProps> = ({
  open,
  className,
}) => {
  return (
    <div
      className={`
        flex items-center px-2 h-8 rounded-lg bg-gray-100 dark:bg-tgai-input-background hover:bg-gray-200 dark:hover:bg-zinc-600 cursor-pointer
        ${className}
        ${open && '!bg-gray-200 dark:!bg-zinc-600'}
      `}
    >
      <div className='grow flex items-center'>
        <div className='mr-1.5 flex items-center justify-center w-4 h-4 rounded-[5px] border border-dashed border-black/5 dark:border-stone-600/95'>
          <CubeOutline className='w-3 h-3 text-tgai-text-3' />
        </div>
        <div
          className='text-[13px] text-tgai-text-2 truncate'
          title='Select model'
        >
          Select model
        </div>
      </div>
      <div className='shrink-0 flex items-center justify-center w-4 h-4'>
        <RiArrowDownSLine className='w-3.5 h-3.5 text-tgai-text-2' />
      </div>
    </div>
  )
}

export default ModelTrigger
