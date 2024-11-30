'use client'

import React from 'react'
import { RiRobot2Fill } from '@remixicon/react'
import { Markdown } from '@/app/components/base/markdown'

type TaskCommentContentProps = {
  content: string
  name?: string
  username?: string
}

const TaskCommentContent = React.memo<TaskCommentContentProps>(({ content, name, username }) => {
  return <div className={'group rounded-2xl border shadow-xs dark:shadow-gray-600 border-gray-200 dark:border-gray-600 min-h-16 flex flex-col bg-white dark:bg-black w-[600px] max-w-full'}>
    <div className={'flex flex-row mt-3 mx-3'}>
      <div className={''}></div>

    </div>
    <div className={'mt-3 mx-3 flex flex-row flex-nowrap gap-1 items-center overflow-hidden truncate'}>
      <div className={'max-w-6 max-h-6 size-full aspect-square rounded-full bg-tgai-primary flex items-center justify-center'}>
        <RiRobot2Fill className={'text-white size-3/4'}/>
      </div>
      <div className={'truncate flex flex-row flex-nowrap gap-1'}>
        <span className={'text-[15px] font-bold text-tgai-text-1'}>{name || 'XAI Bot'}</span>
        <span className={'text-[15px] text-tgai-text-3'}>{username || '@xaibot'}</span>
      </div>
    </div>
    <div className={'mx-3'}>
      <Markdown
        className={'text-tgai-text-1 text-[15px]'}
        content={'Note that using clamp() for font sizes, as in these examples, allows you to set a font-size that grows with the size of the viewport, but doesn\'t go below a minimum font-size or above a maximum font-size. It has the same effect as the code in Fluid Typography but in one line, and without the use of media queries.'}
      />
    </div>

  </div>
})

TaskCommentContent.displayName = 'TaskCommentContent'

export default TaskCommentContent
