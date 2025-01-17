'use client'

import { RiRobot2Fill } from '@remixicon/react'
import React from 'react'
import cn from '@/utils/classnames'
import AutoHeightTextarea from '@/app/components/base/auto-height-textarea/common'

type TweetsGenTemplateProps = {
  name?: string
  username?: string
  content: string
  editingContent?: string
  onEditContentChange?: (value: string) => void
  img_url?: string
  children?: JSX.Element
}

const TweetsGenTemplate = React.memo<TweetsGenTemplateProps>(({ name, username, content, editingContent, onEditContentChange, children, img_url }) => {
  return <div
    className={cn('group rounded-2xl border shadow-xs dark:shadow-gray-600 border-gray-200 dark:border-gray-600 min-h-16 flex flex-col bg-white dark:bg-black transition-colors w-[516px] max-w-full',
      editingContent === undefined && 'hover:border-gray-300 dark:hover:border-gray-600 hover:bg-[rgba(0,_0,_0,_0.03)] dark:hover:bg-[rgba(255,_255,_255,_0.03)]',
    )}
  >
    {username && name && <div className={'mt-3 mx-3 flex flex-row flex-nowrap gap-1 items-center overflow-hidden truncate'}>
      <div
        className={'max-w-6 max-h-6 size-full aspect-square rounded-full bg-tgai-primary flex items-center justify-center'}
      >
        <RiRobot2Fill className={'text-white size-3/4'} />
      </div>
      <div className={'truncate flex flex-row flex-nowrap gap-1'}>
        <span className={'text-[15px] font-bold text-tgai-text-1'}>{name || 'AI Bot'}</span>
        <span className={'text-[15px] text-tgai-text-3'}>{username || '@aibot'}</span>
      </div>
    </div>}
    <div className={cn('mx-3 mb-3 border border-transparent overflow-hidden rounded-xl', (!username || !name) && 'mt-3', editingContent !== undefined && 'border-gray-300 dark:border-gray-600 py-1 p-2')}>
      {/* <Markdown
        className={'text-tgai-text-1 !text-[15px]'}
        content={content}
      /> */}
      <AutoHeightTextarea
        value={editingContent ?? content}
        onChange={(e) => {
          onEditContentChange && onEditContentChange(e.target.value)
        }}
        placeholder={'请输入推文内容...'}
        disabled={editingContent === undefined}
        className={cn('!text-[15px] bg-transparent tgai-custom-scrollbar')}
      />
    </div>
    {img_url && <div className='mb-4'>
      <img src={img_url} className={'max-w-[516px] aspect-video object-contain'} alt={img_url} />
    </div>}
    {children}
  </div>
})

TweetsGenTemplate.displayName = 'TweetsGenTemplate'

export default TweetsGenTemplate
