'use client'

import React, { useCallback, useState } from 'react'
import { RiRobot2Fill } from '@remixicon/react'
import toast from '@/app/components/base/toast'
import type { ChatItem } from '@/app/components/enty-chat/types'
import Button from '@/app/components/base/button'
import { Markdown } from '@/app/components/base/markdown'

type TaskTweetsContentItemProps = {
  content: string
  execute_url?: string
  refresh_url?: string
  message_id: string
}

type regeneratedTweetItem = {
  uuid: string
  chat_diy_uuid: string
  view: string
  execute_url: string
  refresh_url: string
}

const TaskTweetsContentItem = React.memo<TaskTweetsContentItemProps>(({ content, execute_url, refresh_url }) => {
  // const { isResponding, setIsResponding, chatLists, setChatLists } = useEntyAIChatStore(useShallow(state => ({
  //   isResponding: state.isResponding,
  //   setIsResponding: state.setIsResponding,
  //   chatLists: state.chatLists,
  //   setChatLists: state.setChatLists,
  // })))

  const [regeneratedTweet, setRegeneratedTweet] = useState<regeneratedTweetItem>()

  const onExecuteClick = useCallback(async () => {
    if (!execute_url)
      return

    try {
      if (regeneratedTweet)
        await fetch(regeneratedTweet.execute_url)

      else
        await fetch(execute_url)

      toast.notify({ type: 'success', message: '发送成功！' })
    }
    catch (err) {
      toast.notify({ type: 'error', message: '发送失败！请重试！' })
    }
  }, [execute_url])

  const onRefreshClick = useCallback(async () => {
    if (!refresh_url)
      return

    try {
      if (regeneratedTweet) {
        const res = await fetch(regeneratedTweet.refresh_url)
        const json = await res.json() as { code: number; data: regeneratedTweetItem }

        setRegeneratedTweet(json.data)
      }
      else {
        const res = await fetch(refresh_url)
        const json = await res.json() as { code: number; data: regeneratedTweetItem }

        setRegeneratedTweet(json.data)
      }
    }
    catch (err) {
      toast.notify({ type: 'error', message: '重新生成失败！请重试！' })
    }
  }, [refresh_url])

  return <div
    className={'group rounded-2xl border shadow-xs dark:shadow-gray-600 border-gray-200 hover:border-gray-300 dark:border-gray-600 dark:hover:border-gray-600 min-h-16 flex flex-col bg-white dark:bg-black hover:bg-[rgba(0,_0,_0,_0.03)] dark:hover:bg-[rgba(255,_255,_255,_0.03)] transition-colors w-[516px] max-w-full'}
  >
    <div className={'mt-3 mx-3 flex flex-row flex-nowrap gap-1 items-center overflow-hidden truncate'}>
      <div
        className={'max-w-6 max-h-6 size-full aspect-square rounded-full bg-tgai-primary flex items-center justify-center'}
      >
        <RiRobot2Fill className={'text-white size-3/4'}/>
      </div>
      <div className={'truncate flex flex-row flex-nowrap gap-1'}>
        <span className={'text-[15px] font-bold text-tgai-text-1'}>{'XAI Bot'}</span>
        <span className={'text-[15px] text-tgai-text-3'}>{'@xaibot'}</span>
      </div>
    </div>
    <div className={'mx-3'}>
      <Markdown
        className={'text-tgai-text-1 !text-[15px]'}
        content={regeneratedTweet ? regeneratedTweet.view : content}
      />
    </div>
    <div className={'mx-3 flex justify-end flex-row mb-3 gap-2'}>
      <Button variant={'secondary'} type={'button'} onClick={() => onRefreshClick()}>重新生成</Button>
      <Button variant={'primary'} type={'button'} onClick={() => onExecuteClick()}>发送</Button>
    </div>

  </div>
})

TaskTweetsContentItem.displayName = 'TaskTweetsContentItem'

type TaskTweetsContentProps = {
  content: any[]
  name?: string
  username?: string
  item: ChatItem
}

const TaskTweetsContent = React.memo<TaskTweetsContentProps>(({
  content,
  name,
  username,
  item,
}) => {
  console.log(content)

  return <div className={'flex flex-col gap-y-4'}>
    {content.map((tweet, index) => <TaskTweetsContentItem key={tweet.uuid || 'index'} content={tweet.view || ''} execute_url={tweet.execute_url} refresh_url={tweet.refresh_url} message_id={item.id} />)}
  </div>
})

TaskTweetsContent.displayName = 'TaskTweetsContent'

export default TaskTweetsContent
