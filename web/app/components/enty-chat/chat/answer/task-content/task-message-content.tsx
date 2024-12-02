'use client'

import React from 'react'
import Button from '@/app/components/base/button'

type TaskMessageContentProps = {
  content: string
}

const TaskMessageContent = React.memo<TaskMessageContentProps>(({ content }) => {
  return <div className={'bg-white dark:bg-black px-4 pt-5 flex flex-col items-end rounded-2xl border shadow-xs dark:shadow-gray-600 border-gray-200 dark:border-gray-600'}>
    <div
      className={'bg-[rgb(29,_155,_240)] py-3 px-4 rounded-3xl rounded-br-[4px] text-white hover:bg-[rgb(26,_140,_216)] text-[15px] break-words w-[408px] max-w-full font-medium'}
    >
      {content}
    </div>
    <div className={'mt-[6px] text-tgai-text-2 text-[13px] font-medium'}>6:34 PM</div>
    <div className={'mt-3 flex justify-end flex-row mb-3 gap-2'}>
      <Button variant={'secondary'} type={'button'}>重新生成</Button>
      <Button variant={'primary'} type={'button'}>发送</Button>
    </div>
  </div>
})

TaskMessageContent.displayName = 'TaskMessageContent'

export default TaskMessageContent
