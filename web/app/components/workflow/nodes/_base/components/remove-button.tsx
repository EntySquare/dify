'use client'
import type { FC } from 'react'
import React from 'react'
import { RiDeleteBinLine } from '@remixicon/react'
import cn from '../../../../../../utils/classnames'

type Props = {
  className?: string
  onClick: (e: React.MouseEvent) => void
}

const Remove: FC<Props> = ({
  className,
  onClick,
}) => {
  return (
    <div
      className={cn(className, 'p-1 cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-zinc-600/5 text-tgai-text-3 hover:text-tgai-text-2')}
      onClick={onClick}
    >
      <RiDeleteBinLine className='w-4 h-4' />
    </div>
  )
}
export default React.memo(Remove)
