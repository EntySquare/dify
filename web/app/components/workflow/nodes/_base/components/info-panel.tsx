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
      <div className='px-[5px] py-[3px] bg-workflow-block-parma-bg dark:bg-tgai-input-background rounded-md'>
        <div className='text-text-secondary dark:text-tgai-text-2 system-2xs-semibold-uppercase uppercase'>
          {title}
        </div>
        <div className='text-text-tertiary dark:text-tgai-text-3 system-xs-regular break-words'>
          {content}
        </div>
      </div>
    </div>
  )
}
export default React.memo(InfoPanel)
