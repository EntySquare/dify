'use client'
import type { FC } from 'react'
import React from 'react'

type Props = {
  children: React.ReactNode
}

const ListNoDataPlaceholder: FC<Props> = ({
  children,
}) => {
  return (
    <div className='flex rounded-md bg-gray-50 dark:bg-tgai-panel-background-4 items-center min-h-[42px] justify-center leading-[18px] text-xs font-normal text-tgai-text-3'>
      {children}
    </div>
  )
}
export default React.memo(ListNoDataPlaceholder)
