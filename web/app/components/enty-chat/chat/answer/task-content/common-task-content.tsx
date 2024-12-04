'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Button from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'
import CommentGenTemplate from '@/app/components/enty-chat/chat/answer/template/comment-gen-template'
import PrivateMessagetGenTemplate from '@/app/components/enty-chat/chat/answer/template/private-message-gen-template'
import TweetsGenTemplate from '@/app/components/enty-chat/chat/answer/template/tweets-gen-template'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import type { ChatItem } from '@/app/components/enty-chat/types'
import { ChatResponseTypes } from '@/app/components/enty-chat/types'

type CommonTaskItemProps = {
  content: string
  execute_url?: string
  refresh_url?: string
  execute_url_2?: string
  execute_url_3?: string
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
  execute2_url: string
  execute3_url: string
}

const CommonTaskItem = React.memo<CommonTaskItemProps>(({ content, execute_url, refresh_url, name, username, replyType, execute_url_2, execute_url_3 }) => {
  const { isResponding, setIsResponding } = useEntyAIChatStore(useShallow(state => ({
    isResponding: state.isResponding,
    setIsResponding: state.setIsResponding,
  })))

  const [isExecuting, setIsExecuting] = useState(false)
  const [isExecuting2, setIsExecuting2] = useState(false)
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

      Toast.notify({ type: 'success', message: '执行成功！' })
    }
    catch (err) {
      Toast.notify({ type: 'error', message: '执行失败！请重试！' })
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

  const onExecute2Click = useCallback(async () => {
    if (!execute_url_2)
      return

    if (isResponding) {
      Toast.notify({
        message: 'AI助手 正在回复，请等待回复结束！',
      })
      return
    }

    try {
      setIsResponding(true)
      setIsExecuting2(true)

      if (regeneratedItem)
        await fetch(regeneratedItem.execute2_url)

      else
        await fetch(execute_url_2)

      Toast.notify({ type: 'success', message: '执行成功！' })
    }
    catch (err) {
      Toast.notify({ type: 'error', message: '执行失败！请重试！' })
    }
    finally {
      setIsResponding(false)
      setIsExecuting2(false)
    }
  }, [execute_url_2, isResponding])

  const actionPanel = useMemo(() => {
    const refreshButtonText = '重新生成'
    const executeButtonText = replyType === ChatResponseTypes.COMMENTS_GENERATION ? '评论' : '发送'
    const executeButton2Text = replyType === ChatResponseTypes.COMMENTS_GENERATION ? '引用' : ''

    return <div className={'mx-3 flex justify-end flex-row mb-3 gap-2'}>
      <Button variant={'secondary'} type={'button'} loading={isRefreshing && isResponding} disabled={isResponding}
        onClick={() => onRefreshClick()}
      >{refreshButtonText}</Button>
      <Button variant={'primary'} type={'button'} loading={isExecuting && isResponding} disabled={isResponding}
        onClick={() => onExecuteClick()}
      >{executeButtonText}</Button>
      {execute_url_2 && <Button variant={'primary'} type={'button'} loading={isExecuting2 && isResponding} disabled={isResponding}
        onClick={() => onExecute2Click()}
      >{executeButton2Text}</Button>}

    </div>
  }, [isRefreshing, isExecuting, isResponding, onRefreshClick, onExecuteClick, execute_url_2, onExecute2Click])

  return (
    <>
      {(replyType === ChatResponseTypes.TWEETS_GENERATION) && (<TweetsGenTemplate username={username} name={name} content={regeneratedItem ? regeneratedItem.view : content}>
        {actionPanel}
      </TweetsGenTemplate>)}
      {(replyType === ChatResponseTypes.COMMENTS_GENERATION) && (<CommentGenTemplate username={username} name={name} content={regeneratedItem ? regeneratedItem.view : content}>
        {actionPanel}
      </CommentGenTemplate>)}
      {(replyType === ChatResponseTypes.MESSAGE_GENERATION) && (<PrivateMessagetGenTemplate content={regeneratedItem ? regeneratedItem.view : content}>
        {actionPanel}
      </PrivateMessagetGenTemplate>)}
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
    {content.map((taskItem, index) => <CommonTaskItem key={taskItem.uuid || 'index'} content={taskItem.view || ''} execute_url={taskItem.execute_url} refresh_url={taskItem.refresh_url} message_id={item.id} name={name} username={username} replyType={replyType} execute_url_2={taskItem.execute2_url ? taskItem.execute2_url : undefined} execute_url_3={taskItem.execute3_url ? taskItem.execute3_url : undefined} />)}
  </div>
})

CommonTaskContent.displayName = 'CommonTaskContent'

export default CommonTaskContent
