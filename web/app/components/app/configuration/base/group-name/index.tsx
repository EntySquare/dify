'use client'
import type { FC } from 'react'
import React from 'react'

export type IGroupNameProps = {
  name: string
}

const GroupName: FC<IGroupNameProps> = ({
  name,
}) => {

  return (
    <div className='flex items-center mb-1'>
      <div className='mr-3 leading-[18px] text-xs font-semibold text-tgai-text-2 uppercase'>{name}</div>
      <div className='grow h-[1px] bg-gradient-to-l from-[rgba(243,_244,_246,_0) to-[#F3F4F6] dark:from-zinc-600/0 dark:to-zinc-600'

      ></div>
    </div>
  )
}
export default React.memo(GroupName)
