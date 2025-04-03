'use client'

import React, { useCallback, useMemo, useState } from 'react'
import http from 'axios'
import { useShallow } from 'zustand/react/shallow'
import { RiEdit2Fill } from '@remixicon/react'
import ScheduledTaskOperation, { ExecuteType } from './scheduled-task-operation'
import Button from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'
import CommentGenTemplate from '@/app/components/enty-chat/chat/answer/template/comment-gen-template'
import PrivateMessagetGenTemplate from '@/app/components/enty-chat/chat/answer/template/private-message-gen-template'
import TweetsGenTemplate from '@/app/components/enty-chat/chat/answer/template/tweets-gen-template'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import type { ChatItem } from '@/app/components/enty-chat/types'
import { ChatResponseTypes } from '@/app/components/enty-chat/types'
import CustomPopover from '@/app/components/base/popover'
import { submitScheduledMatrixTask } from '@/service/xai'
import ReplyDmsGenTemplate from '@/app/components/enty-chat/chat/answer/template/reply-dms-gen-template'

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
  img_url?: string
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

type TaskLinks = {
  refresh_url: URL | undefined
  execute_url: URL | undefined
  execute_url_2: URL | undefined
  execute_url_3: URL | undefined
}

const executeLinkGetter = (execute_type: ExecuteType, links: TaskLinks) => {
  switch (execute_type) {
    case ExecuteType.EXECUTE_1:
      return links.execute_url
    case ExecuteType.EXECUTE_2:
      return links.execute_url_2
    case ExecuteType.EXECUTE_3:
      return links.execute_url_3
    default:
      return links.execute_url
  }
}

const actionPanelButtonMap = {
  execute_1: {
    [ChatResponseTypes.COMMENTS_GENERATION]: '评论',
    [ChatResponseTypes.TWEETS_GENERATION]: '发送',
    [ChatResponseTypes.REPLY_DMS]: '回复',
    [ChatResponseTypes.MESSAGE_GENERATION]: '',
    [ChatResponseTypes.PLAIN_TEXT]: '',
  },
  execute_2: {
    [ChatResponseTypes.COMMENTS_GENERATION]: '引用',
    [ChatResponseTypes.TWEETS_GENERATION]: '发送',
    [ChatResponseTypes.REPLY_DMS]: '回复',
    [ChatResponseTypes.MESSAGE_GENERATION]: '',
    [ChatResponseTypes.PLAIN_TEXT]: '',
  },
  first_execute_1: {
    [ChatResponseTypes.COMMENTS_GENERATION]: '评论',
    [ChatResponseTypes.TWEETS_GENERATION]: '发送',
    [ChatResponseTypes.REPLY_DMS]: '生成回复',
    [ChatResponseTypes.MESSAGE_GENERATION]: '',
    [ChatResponseTypes.PLAIN_TEXT]: '',
  },
  refresh: {
    [ChatResponseTypes.COMMENTS_GENERATION]: '重新生成',
    [ChatResponseTypes.TWEETS_GENERATION]: '重新生成',
    [ChatResponseTypes.REPLY_DMS]: '重新生成',
    [ChatResponseTypes.MESSAGE_GENERATION]: '',
    [ChatResponseTypes.PLAIN_TEXT]: '',
  },
  executed: {
    [ChatResponseTypes.COMMENTS_GENERATION]: '已评论',
    [ChatResponseTypes.TWEETS_GENERATION]: '已发推',
    [ChatResponseTypes.REPLY_DMS]: '已回复',
    [ChatResponseTypes.MESSAGE_GENERATION]: '已完成',
    [ChatResponseTypes.PLAIN_TEXT]: '已完成',
  }
} as const

const CommonTaskItem = React.memo<CommonTaskItemProps>(({ content, execute_url, refresh_url, name, username, replyType, execute_url_2, execute_url_3, img_url }) => {
  const { isResponding, setIsResponding } = useEntyAIChatStore(useShallow(state => ({
    isResponding: state.isResponding,
    setIsResponding: state.setIsResponding,
  })))

  const [isExecuting, setIsExecuting] = useState(false)
  const [isExecuting2, setIsExecuting2] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [editingContent, setEditingContent] = useState<string>()
  const [editedContent, setEditedContent] = useState<string>('')
  const [scheduledTaskSubmited, setScheduledTaskSubmited] = useState(false)
  const [isFirstAction, setIsFirstAction] = useState(true)
  const [initialContent, setInitialContent] = useState(content)
  const [isExecuted, setIsExecuted] = useState(false)

  const [regeneratedItem, setRegeneratedItem] = useState<regeneratedItem>()

  const links = useMemo<TaskLinks>(() => {
    const linksObj = {} as TaskLinks

    if (refresh_url) {
      const url = new URL(regeneratedItem ? regeneratedItem.refresh_url : refresh_url)
      editedContent && url.searchParams.set('content', editedContent)
      linksObj.refresh_url = url
    }

    if (execute_url) {
      const url = new URL(regeneratedItem ? regeneratedItem.execute_url : execute_url)
      editedContent && url.searchParams.set('content', editedContent)
      linksObj.execute_url = url
    }

    if (execute_url_2) {
      const url = new URL(regeneratedItem ? regeneratedItem.execute2_url : execute_url_2)
      editedContent && url.searchParams.set('content', editedContent)
      linksObj.execute_url_2 = url
    }

    if (execute_url_3) {
      const url = new URL(regeneratedItem ? regeneratedItem.execute3_url : execute_url_3)
      editedContent && url.searchParams.set('content', editedContent)
      linksObj.execute_url_3 = url
    }

    return linksObj
  }, [refresh_url, execute_url, execute_url_2, execute_url_3, editedContent, regeneratedItem])

  const onExecuteClick = useCallback(async () => {
    if (!links.execute_url || isExecuted)
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

      if (isFirstAction && replyType === ChatResponseTypes.REPLY_DMS) {
        setIsRefreshing(true)

        const res = await http.get(links.execute_url.toString(), { timeout: 180000 })
        const json = res.data

        setIsFirstAction(false)
        setRegeneratedItem(json.data)
        setIsRefreshing(false)
      }
      else {
        await http.get(links.execute_url.toString(), { timeout: 180000 })
        setIsExecuted(true)

        Toast.notify({ type: 'success', message: '执行成功！' })
      }
    }
    catch (err) {
      Toast.notify({ type: 'error', message: '执行失败！请重试！' })
    }
    finally {
      setIsResponding(false)
      setIsExecuting(false)
    }
  }, [links, isResponding, isFirstAction, isExecuted])

  const onRefreshClick = useCallback(async () => {
    if (!links.refresh_url || isExecuted)
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

      const res = await http.get<{ code: number; data: regeneratedItem }>(links.refresh_url.toString(), { timeout: 180000 })
      const json = res.data

      setRegeneratedItem(json.data)

      if (editedContent)
        setEditedContent('')
    }
    catch (err) {
      Toast.notify({ type: 'error', message: '重新生成失败！请重试！' })
    }
    finally {
      setIsResponding(false)
      setIsRefreshing(false)
    }
  }, [links, isResponding, editedContent, isExecuted])

  const onExecute2Click = useCallback(async () => {
    if (!links.execute_url_2 || isExecuted)
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

      await http.get(links.execute_url_2.toString(), { timeout: 180000 })

      Toast.notify({ type: 'success', message: '执行成功！' })

      if (replyType === ChatResponseTypes.COMMENTS_GENERATION)
        setIsExecuted(true)
    }
    catch (err) {
      Toast.notify({ type: 'error', message: '执行失败！请重试！' })
    }
    finally {
      setIsResponding(false)
      setIsExecuting2(false)
    }
  }, [links, isResponding, isExecuted])

  const onEditContentChangeHandler = useCallback((value: string) => {
    setEditingContent(value)
  }, [])

  const onEditCancelHandler = useCallback(() => {
    setEditingContent(undefined)
  }, [])

  const onEditConfirmHandler = useCallback(() => {
    if (editingContent === undefined)
      return
    if (editingContent === '') {
      Toast.notify({ type: 'warning', message: '推文内容不能为空！' })
      return
    }

    setEditedContent(editingContent)
    setEditingContent(undefined)
  }, [editingContent])

  const onScheduledTaskSubmit = useCallback(async (execute_datetime: string, workflow_id: string, execute_type?: ExecuteType) => {
    if (scheduledTaskSubmited || isExecuted)
      return

    const execute_url = execute_type ? executeLinkGetter(execute_type, links) : links.execute_url

    if (!execute_url)
      return

    const payload = {
      execute_datetime,
      workflow_id,
      execute_url: execute_url.toString(),
    }

    try {
      await submitScheduledMatrixTask(payload)
      Toast.notify({
        type: 'success',
        message: '提交延时任务成功！',
      })
      setScheduledTaskSubmited(true)
    }
    catch (err) {

    }
    finally {

    }
  }, [links, scheduledTaskSubmited, isExecuted])

  const actionPanel = useMemo(() => {
    const isReplyDmsFirstAction = replyType === ChatResponseTypes.REPLY_DMS && isFirstAction
    const refreshButtonText = '重新生成'
    const executeButtonText = isFirstAction ? actionPanelButtonMap.first_execute_1[replyType] : actionPanelButtonMap.execute_1[replyType]
    const executeButton2Text = actionPanelButtonMap.execute_2[replyType]

    return <div className='mx-3 flex justify-between items-center flew-row flex-wrap mb-3 gap-2' >
      <div>
        {!isExecuted && !isReplyDmsFirstAction && (editingContent === undefined
          ? <RiEdit2Fill
            className='cursor-pointer size-4 text-tgai-primary-5 hover:text-tgai-primary opacity-0 group-hover:opacity-100'
            onClick={() => setEditingContent(editedContent || (regeneratedItem ? regeneratedItem.view : content))}
          />
          : <div className={'flex flex-row flex-wrap gap-2'}>
            <Button variant={'secondary'} type={'button'} loading={isRefreshing && isResponding} disabled={isResponding} onClick={onEditCancelHandler}
            >取消</Button>
            <Button variant={'primary'} type={'button'} loading={isExecuting && isResponding} disabled={isResponding} onClick={onEditConfirmHandler}
            >保存</Button>
          </div>)
        }
      </div>
      {!isExecuted && editingContent === undefined
        && <div className={'flex flex-row flex-wrap gap-2'}>
          {!scheduledTaskSubmited && replyType !== ChatResponseTypes.REPLY_DMS && <CustomPopover
            htmlContent={<ScheduledTaskOperation onSubmit={onScheduledTaskSubmit} replyType={replyType} />}
            position='bottom'
            trigger={'click'}
            btnElement={'延时发送'}
            btnClassName={'dark:!bg-zinc-700 !text-tgai-text-1 !text-[13px] !py-0 !px-[14px] !leading-4 !font-medium !h-8 !shadow-xs'}
            disabled={isResponding && scheduledTaskSubmited}
            className={'!w-[280px]'}
            popupClassName={'!w-full'}
          />}
          {/* <Button variant={'secondary'} type={'button'} loading={isRefreshing && isResponding} disabled={isResponding}
            onClick={() => onRefreshClick()}
          >{refreshButtonText}</Button> */}
          <Button variant={'primary'} type={'button'} loading={isExecuting && isResponding} disabled={isResponding}
            onClick={() => onExecuteClick()}
          >{executeButtonText}</Button>
          {links.execute_url_2 && <Button variant={'primary'} type={'button'} loading={isExecuting2 && isResponding} disabled={isResponding}
            onClick={() => onExecute2Click()}
          >{executeButton2Text}</Button>}
        </div>
      }
      {isExecuted && <span className='font-semibold'>{actionPanelButtonMap.executed[replyType]}</span>}
    </div>
  }, [isFirstAction, isRefreshing, isExecuting, isResponding, onRefreshClick, onExecuteClick, links, onExecute2Click, editingContent, editedContent, scheduledTaskSubmited, isExecuted])

  return (
    <>
      {(replyType === ChatResponseTypes.TWEETS_GENERATION) && (<TweetsGenTemplate username={username} name={name} content={editedContent || (regeneratedItem ? regeneratedItem.view : content)} editingContent={editingContent} onEditContentChange={onEditContentChangeHandler} img_url={img_url}>
        {actionPanel}
      </TweetsGenTemplate>)}
      {(replyType === ChatResponseTypes.COMMENTS_GENERATION) && (<CommentGenTemplate username={username} name={name} content={editedContent || (regeneratedItem ? regeneratedItem.view : content)} editingContent={editingContent} onEditContentChange={onEditContentChangeHandler}>
        {actionPanel}
      </CommentGenTemplate>)}
      {(replyType === ChatResponseTypes.MESSAGE_GENERATION) && (<PrivateMessagetGenTemplate content={regeneratedItem ? regeneratedItem.view : content} isFirstAction={isFirstAction}>
        {actionPanel}
      </PrivateMessagetGenTemplate>)}
      {(replyType === ChatResponseTypes.REPLY_DMS) && (<ReplyDmsGenTemplate content={editedContent || (regeneratedItem ? regeneratedItem.view : content)} editingContent={editingContent} onEditContentChange={onEditContentChangeHandler} isFirstAction={isFirstAction} incomingMsg={initialContent}>
        {actionPanel}
      </ReplyDmsGenTemplate>)}
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
  return <div className={'flex flex-col gap-y-4'}>
    {content.length > 0 && content.map((taskItem, index) => <CommonTaskItem key={taskItem.uuid || index} content={taskItem.view || ''} execute_url={taskItem.execute_url} refresh_url={taskItem.refresh_url} message_id={item.id} name={name} username={username} replyType={replyType} execute_url_2={taskItem.execute2_url ? taskItem.execute2_url : undefined} execute_url_3={taskItem.execute3_url ? taskItem.execute3_url : undefined} img_url={taskItem.img_url} />)}
    {content.length === 0 && replyType === ChatResponseTypes.REPLY_DMS && '当前无需要回复的私信'}
    {content.length === 0 && replyType === ChatResponseTypes.TWEETS_GENERATION && '生成失败，请稍后重试'}
    {content.length === 0 && replyType === ChatResponseTypes.COMMENTS_GENERATION && '生成失败，请稍后重试'}
  </div>
})

CommonTaskContent.displayName = 'CommonTaskContent'

export default CommonTaskContent
