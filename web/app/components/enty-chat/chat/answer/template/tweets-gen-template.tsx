'use client'

import { RiRobot2Fill } from '@remixicon/react'
import React from 'react'
import { Markdown } from '@/app/components/base/markdown'
import cn from '@/utils/classnames'

type TweetsGenTemplateProps = {
  name?: string
  username?: string
  content: string
  children?: JSX.Element
}

const TweetsGenTemplate = React.memo<TweetsGenTemplateProps>(({ name, username, content, children }) => {
  return <div
    className={'group rounded-2xl border shadow-xs dark:shadow-gray-600 border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-600 min-h-16 flex flex-col bg-white dark:bg-black hover:bg-[rgba(0,_0,_0,_0.03)] dark:hover:bg-[rgba(255,_255,_255,_0.03)] transition-colors w-[516px] max-w-full'}
  >
    {username && name && <div className={'mt-3 mx-3 flex flex-row flex-nowrap gap-1 items-center overflow-hidden truncate'}>
      <div
        className={'max-w-6 max-h-6 size-full aspect-square rounded-full bg-tgai-primary flex items-center justify-center'}
      >
        <RiRobot2Fill className={'text-white size-3/4'}/>
      </div>
      <div className={'truncate flex flex-row flex-nowrap gap-1'}>
        <span className={'text-[15px] font-bold text-tgai-text-1'}>{name || 'AI Bot'}</span>
        <span className={'text-[15px] text-tgai-text-3'}>{username || '@aibot'}</span>
      </div>
    </div>}
    <div className={cn('mx-3', (!username || !name) && 'mt-3')}>
      <Markdown
        className={'text-tgai-text-1 !text-[15px]'}
        content={content}
      />
    </div>
    {children}
  </div>
})

TweetsGenTemplate.displayName = 'TweetsGenTemplate'

export default TweetsGenTemplate
