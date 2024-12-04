'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Button from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'
import CommentGenTemplate from '@/app/components/enty-chat/chat/answer/template/comment-gen-template'
import TweetsGenTemplate from '@/app/components/enty-chat/chat/answer/template/tweets-gen-template'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import type { ChatItem } from '@/app/components/enty-chat/types'
import { ChatResponseTypes } from '@/app/components/enty-chat/types'

type CommonTaskItemProps = {
  content: string
  execute_url?: string
  refresh_url?: string
  message_id: string
  name?: string
  username?: string
  replyType: ChatResponseTypes
}

type regeneratedItem = {
  uuid: string
  chat_diy_uuid: string
  view: string
  execute_url: string
  refresh_url: string
}

const CommonTaskItem = React.memo<CommonTaskItemProps>(({ content, execute_url, refresh_url, name, username, replyType }) => {
  const { isResponding, setIsResponding} = useEntyAIChatStore(useShallow(state => ({
    isResponding: state.isResponding,
    setIsResponding: state.setIsResponding,
  })))

  const [isExecuting, setIsExecuting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [regeneratedItem, setRegeneratedItem] = useState<regeneratedItem>()

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

      if (regeneratedItem)
        await fetch(regeneratedItem.execute_url)

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

      if (regeneratedItem) {
        const res = await fetch(regeneratedItem.refresh_url)
        const json = await res.json() as { code: number; data: regeneratedItem }

        setRegeneratedItem(json.data)
      }
      else {
        const res = await fetch(refresh_url)
        const json = await res.json() as { code: number; data: regeneratedItem }

        setRegeneratedItem(json.data)
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

  const actionPanel = useMemo(() => {
    return <div className={'mx-3 flex justify-end flex-row mb-3 gap-2'}>
      <Button variant={'secondary'} type={'button'} loading={isRefreshing && isResponding} disabled={isResponding}
        onClick={() => onRefreshClick()}
      >重新生成</Button>
      <Button variant={'primary'} type={'button'} loading={isExecuting && isResponding} disabled={isResponding}
        onClick={() => onExecuteClick()}
      >发送</Button>
    </div>
  }, [isRefreshing, isExecuting, isResponding, onRefreshClick, onExecuteClick])

  return (
    <>
      {(replyType === ChatResponseTypes.TWEETS_GENERATION) && (<TweetsGenTemplate username={username} name={name} content={regeneratedItem ? regeneratedItem.view : content}>
        {actionPanel}
      </TweetsGenTemplate>)}
      {(replyType === ChatResponseTypes.COMMENTS_GENERATION) && (<CommentGenTemplate username={username} name={name} content={regeneratedItem ? regeneratedItem.view : content}>
        {actionPanel}
      </CommentGenTemplate>)}
    </>
  )
})

CommonTaskItem.displayName = 'CommonTaskItem'

type CommonTaskContentProps = {
  content: any[]
  name?: string
  username?: string
  item: ChatItem
  replyType: ChatResponseTypes
}

const CommonTaskContent = React.memo<CommonTaskContentProps>(({
  content,
  name,
  username,
  replyType,
  item,
}) => {
  console.log(content)

  return <div className={'flex flex-col gap-y-4'}>
    {content.map((taskItem, index) => <CommonTaskItem key={taskItem.uuid || 'index'} content={taskItem.view || ''} execute_url={taskItem.execute_url} refresh_url={taskItem.refresh_url} message_id={item.id} name={name} username={username} replyType={replyType} />)}
  </div>
})

CommonTaskContent.displayName = 'CommonTaskContent'

export default CommonTaskContent
