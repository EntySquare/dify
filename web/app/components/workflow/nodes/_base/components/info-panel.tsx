'use client'
import type { FC } from 'react'
import React from 'react'

type Props = {
  title: string
  content: string | JSX.Element
}

const InfoPanel: FC<Props> = ({
  title,
  content,
}) => {
  return (
    <div>
      <div className='px-[5px] py-[3px] bg-gray-100 dark:bg-tgai-input-background rounded-md'>
        <div className='leading-4 text-[10px] font-medium text-tgai-text-3 uppercase'>
          {title}
        </div>
        <div className='leading-4 text-xs font-normal text-tgai-text-2 break-words'>
          {content}
        </div>
      </div>
    </div>
  )
}
export default React.memo(InfoPanel)
