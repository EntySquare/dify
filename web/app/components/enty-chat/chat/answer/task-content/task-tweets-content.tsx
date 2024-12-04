'use client'

import React, { useCallback, useState } from 'react'
import { RiRobot2Fill } from '@remixicon/react'
import { useShallow } from 'zustand/react/shallow'
import Toast from '@/app/components/base/toast'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import type { ChatItem } from '@/app/components/enty-chat/types'
import Button from '@/app/components/base/button'
import { Markdown } from '@/app/components/base/markdown'

type TaskTweetsContentItemProps = {
  content: string
  execute_url?: string
  refresh_url?: string
  message_id: string
  name?: string
  username?: string
}

type regeneratedTweetItem = {
  uuid: string
  chat_diy_uuid: string
  view: string
  execute_url: string
  refresh_url: string
}

const TaskTweetsContentItem = React.memo<TaskTweetsContentItemProps>(({ content, execute_url, refresh_url, name, username }) => {
  const { isResponding, setIsResponding, chatLists, setChatLists } = useEntyAIChatStore(useShallow(state => ({
    isResponding: state.isResponding,
    setIsResponding: state.setIsResponding,
    chatLists: state.chatLists,
    setChatLists: state.setChatLists,
  })))

  const [isExecuting, setIsExecuting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [regeneratedTweet, setRegeneratedTweet] = useState<regeneratedTweetItem>()

  const onExecuteClick = useCallback(async () => {
    if (!execute_url)
      return

    if (isResponding) {
      Toast.notify({
        message: 'AI助手 正在回复，请等待回复结束！',
      })
      return
    }

    try {
      setIsResponding(true)
      setIsExecuting(true)

      if (regeneratedTweet)
        await fetch(regeneratedTweet.execute_url)

      else
        await fetch(execute_url)

      Toast.notify({ type: 'success', message: '发送成功！' })
    }
    catch (err) {
      Toast.notify({ type: 'error', message: '发送失败！请重试！' })
    }
    finally {
      setIsResponding(false)
      setIsExecuting(false)
    }
  }, [execute_url, isResponding])

  const onRefreshClick = useCallback(async () => {
    if (!refresh_url)
      return

    if (isResponding) {
      Toast.notify({
        message: 'AI助手 正在回复，请等待回复结束！',
      })
      return
    }

    try {
      setIsResponding(true)
      setIsRefreshing(true)

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
      Toast.notify({ type: 'error', message: '重新生成失败！请重试！' })
    }
    finally {
      setIsResponding(false)
      setIsRefreshing(false)
    }
  }, [refresh_url, isResponding])

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
        <span className={'text-[15px] font-bold text-tgai-text-1'}>{name || 'AI Bot'}</span>
        <span className={'text-[15px] text-tgai-text-3'}>{username || '@aibot'}</span>
      </div>
    </div>
    <div className={'mx-3'}>
      <Markdown
        className={'text-tgai-text-1 !text-[15px]'}
        content={regeneratedTweet ? regeneratedTweet.view : content}
      />
    </div>
    <div className={'mx-3 flex justify-end flex-row mb-3 gap-2'}>
      <Button variant={'secondary'} type={'button'} loading={isRefreshing && isResponding} disabled={isResponding} onClick={() => onRefreshClick()}>重新生成</Button>
      <Button variant={'primary'} type={'button'} loading={isExecuting && isResponding} disabled={isResponding} onClick={() => onExecuteClick()}>发送</Button>
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
    {content.map((tweet, index) => <TaskTweetsContentItem key={tweet.uuid || 'index'} content={tweet.view || ''} execute_url={tweet.execute_url} refresh_url={tweet.refresh_url} message_id={item.id} name={name} username={username} />)}
  </div>
})

TaskTweetsContent.displayName = 'TaskTweetsContent'

export default TaskTweetsContent
