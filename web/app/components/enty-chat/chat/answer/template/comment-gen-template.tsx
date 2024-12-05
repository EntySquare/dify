'use client'

import { RiRobot2Fill, RiUserFill } from '@remixicon/react'
import React from 'react'
import { Markdown } from '@/app/components/base/markdown'

type CommentGenTemplateProps = {
  name?: string
  username?: string
  content: string
  children?: JSX.Element
  originTweets?: string
}

const CommentGenTemplate = React.memo<CommentGenTemplateProps>(({ name, username, content, children, originTweets }) => {
  return <div
    className={'group rounded-2xl border shadow-xs dark:shadow-gray-600 border-gray-200 dark:border-gray-600 min-h-16 flex flex-col bg-white dark:bg-black w-[600px] max-w-full'}
  >
    {
      originTweets && name && username && <>
        <div className={'flex flex-row mt-3 mx-3 gap-2'}>
          <div className={'flex flex-col items-center w-10'}>
            <div className={'size-10 rounded-full bg-tgai-primary flex justify-center items-center'}>
              <RiUserFill className={'text-white size-3/4'}/>
            </div>
            <div className={'flex-1 w-[2px] bg-gray-300 mt-1'}></div>
          </div>
          <div className={''}>
            <div className={'truncate flex flex-row flex-nowrap gap-1'}>
              <span className={'text-[15px] font-bold text-tgai-text-1'}>{name || 'Some User'}</span>
              <span className={'text-[15px] text-tgai-text-2'}>{username || '@someuser'}</span>
            </div>
            <Markdown
              className={'text-tgai-text-1 !text-[15px]'}
              content={originTweets || 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...'}
            />
          </div>
        </div>
        <div className={'flex flex-row gap-2 mx-3'}>
          <div className={'flex w-10 flex-col items-center'}>
            <div className={'flex-1 w-[2px] bg-gray-300 mb-1'}></div>
          </div>
          <div className={'text-[15px] text-tgai-text-2 pb-4 pt-1'}>
        Replying to <span className={'text-tgai-primary'}>{username || '@someuser'}</span>
          </div>
        </div>
      </>
    }
    <div className={'flex flex-row gap-2 mx-3 pt-3'}>
      { name && username && <div className={'flex w-10 flex-col items-center'}>
        <div className={'size-10 rounded-full bg-tgai-primary flex justify-center items-center'}>
          <RiRobot2Fill className={'text-white size-3/4'}/>
        </div>
      </div>}
      <div className={'text-[15px] text-tgai-text-2 pb-4 pt-1'}>
        <Markdown
          // className={'text-tgai-text-1 !text-xl'}
          className={'text-tgai-text-1 !text-[15px]'}
          content={content}
        />
      </div>
    </div>
    {children}
  </div>
})

CommentGenTemplate.displayName = 'CommentGenTemplate'

export default CommentGenTemplate
