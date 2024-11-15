import { memo } from 'react'
import cn from '../../../../../../utils/classnames'
import { VarBlockIcon } from '../../../block-icon'
import { Line3 } from '../../../../base/icons/src/public/common'
import { Variable02 } from '../../../../base/icons/src/vender/solid/development'
import { BubbleX, Env } from '../../../../base/icons/src/vender/line/others'
import type { Node } from '../../../types'
import { BlockEnum } from '../../../types'

type NodeVariableItemProps = {
  isEnv: boolean
  isChatVar: boolean
  node: Node
  varName: string
  showBorder?: boolean
  className?: string
}
const NodeVariableItem = ({
  isEnv,
  isChatVar,
  node,
  varName,
  showBorder,
  className,
}: NodeVariableItemProps) => {
  return (
    <div className={cn(
      'relative flex items-center mt-0.5 h-6 bg-gray-100 dark:bg-tgai-input-background rounded-md  px-1 text-xs font-normal text-tgai-text-2',
      showBorder && '!bg-black/[0.02] dark:!bg-stone-600/[0.98]',
      className,
    )}>
      {!isEnv && !isChatVar && (
        <div className='flex items-center'>
          <div className='p-[1px]'>
            <VarBlockIcon
              className='!text-tgai-text-1'
              type={node?.data.type || BlockEnum.Start}
            />
          </div>
          <div className='max-w-[85px] truncate mx-0.5 text-xs font-medium text-tgai-text-2' title={node?.data.title}>{node?.data.title}</div>
          <Line3 className='mr-0.5'></Line3>
        </div>
      )}
      <div className='flex items-center text-primary-600 dark:text-tgai-primary'>
        {!isEnv && !isChatVar && <Variable02 className='shrink-0 w-3.5 h-3.5 text-primary-500 dark:text-tgai-primary-5' />}
        {isEnv && <Env className='shrink-0 w-3.5 h-3.5 text-util-colors-violet-violet-600' />}
        {isChatVar && <BubbleX className='w-3.5 h-3.5 text-util-colors-teal-teal-700' />}
        <div className={cn('max-w-[75px] truncate ml-0.5 text-xs font-medium', (isEnv || isChatVar) && 'text-tgai-text-1')} title={varName}>{varName}</div>
      </div>
    </div>
  )
}

export default memo(NodeVariableItem)
