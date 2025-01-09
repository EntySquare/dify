'use client'

import React, { useCallback, useEffect, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import useSWR from 'swr'
import { useEntyChat } from '../hooks'
import { getLastAnswer } from '@/app/components/enty-chat/utils'
import type { SendAIChatMsgReq } from '@/service/xai'
import { getKnowledgeList, sendAIChatMsg } from '@/service/xai'
import { PanelTopHeader } from '@/app/components/enty-chat/chat-side-panel/ai-chat-account-role-panel'
import Toast from '@/app/components/base/toast'
import type { FileEntity } from '@/app/components/base/file-uploader/types'
import Empty from '@/app/components/enty-chat/chat-wrapper/empty'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import type { ChatConfig } from '@/app/components/base/chat/types'
import Chat from '@/app/components/enty-chat/chat'
import type { ChatItem } from '@/app/components/enty-chat/types'
import cn from '@/utils/classnames'

// const SUGGESTED_QUESTION = ['生成推文', '生成推文评论', '生成私信回复']
const SUGGESTED_QUESTION = ['生成推文', '生成评论']

const AIChatWrapperHeader = React.memo(() => {
  const { isLeftPanelOpen } = useEntyAIChatStore(useShallow(state => ({
    isLeftPanelOpen: state.isLeftPanelOpen,
  })))

  return <div className={cn('absolute top-0 left-0 h-14 flex justify-between items-center z-50 gap-4', isLeftPanelOpen ? 'pl-4' : '')}>
    {!isLeftPanelOpen && <PanelTopHeader />}
    <div className={'text-base font-bold text-tgai-text-1'}>AI智能聊天</div>
  </div>
})

AIChatWrapperHeader.displayName = 'AIChatWrapperHeader'

const AIChatWrapper = React.memo(() => {
  const { isChatStarted, chatLists, setChatLists, isResponding, setIsResponding, selectedPersonality, conversation_id, setConversationId } = useEntyAIChatStore(useShallow(state => ({
    isChatStarted: state.isChatStarted,
    chatLists: state.chatLists,
    setChatLists: state.setChatLists,
    isResponding: state.isResponding,
    setIsResponding: state.setIsResponding,
    selectedPersonality: state.selectedPersonality,
    conversation_id: state.conversation_id,
    setConversationId: state.setConversationId,
  })))

  const { data: knowledgeListData } = useSWR(['/knowledge/list'], () => getKnowledgeList({ page: 1, limit: 10000 }))

  const { onRestartAIChat } = useEntyChat()

  const selectedKnowledge = useMemo(() => {
    if (!selectedPersonality || !knowledgeListData)
      return null
    const foundPersonality = knowledgeListData.data.data.find(knowledge => knowledge.id === selectedPersonality)

    return foundPersonality || null
  }, [knowledgeListData, selectedPersonality])

  const appConfig = useMemo(() => {
    return {
      file_upload: {

      },
      speech_to_text: {
        enabled: false,
      },
      suggested_questions_after_answer: {
        enabled: true,
      },
    } as ChatConfig
  }, [])

  const onSendMsg = useCallback(async (message: string, files?: FileEntity[], last_answer?: ChatItem | null) => {
    if (!selectedKnowledge)
      return

    if (isResponding) {
      Toast.notify({
        message: 'AI助手 正在回复，请等待回复结束！',
      })
      return
    }

    const questionItem: ChatItem = {
      id: `question-${Date.now()}`,
      content: message,
      message_files: files,
      isAnswer: false,
    }

    const answerItem: ChatItem = {
      id: `answer-${Date.now()}`,
      content: '',
      isAnswer: true,
    }

    setChatLists([...chatLists, questionItem, answerItem])

    const reqParams: SendAIChatMsgReq = {
      conversation_id: conversation_id || '',
      parent_message_id: last_answer?.id || getLastAnswer(chatLists)?.id || '',
      knowledge: selectedKnowledge.id || '',
      tweets_user_name_list: [selectedKnowledge.tweet_account],
      message,
      tweet_account: selectedKnowledge.tweet_account,
      role: selectedKnowledge.role,
      character: selectedKnowledge.character,
    }

    try {
      setIsResponding(true)
      const res = await sendAIChatMsg(reqParams)

      if (res.code === -1)
        throw new Error('error')

      if (res.data.conversation_id)
        setConversationId(res.data.conversation_id)

      answerItem.id = res.data.message_id
      answerItem.content = res.data.outputs
    }
    catch (error) {
      Toast.notify({
        type: 'error',
        message: 'AI 聊天响应出错！',
      })
      answerItem.content = '响应出错，请重试！'
    }
    finally {
      setIsResponding(false)
    }
  }, [chatLists, selectedKnowledge, conversation_id, isResponding])

  useEffect(() => {
    return () => {
      onRestartAIChat()
    }
  }, [])

  return <div className={'relative h-full border-l border-tgai-panel-border w-full bg-gray-50 dark:bg-tgai-panel-background'}>
    <AIChatWrapperHeader />

    {(selectedPersonality === undefined || !isChatStarted || selectedKnowledge === null)
      ? <Empty />
      : <Chat
        chatFooterClassName={'pb-12 w-full'}
        chatFooterInnerClassName={'w-full max-w-[800px] left-[50%] -translate-x-[50%]'}
        chatContainerInnerClassName={'pt-16'}
        chatList={chatLists}
        config={appConfig}
        noChatInput={selectedPersonality === undefined || selectedKnowledge === null}
        onSend={onSendMsg}
        noStopResponding={true}
        isResponding={isResponding}
        suggestedQuestions={SUGGESTED_QUESTION}
      />
    }
  </div>
})

AIChatWrapper.displayName = 'AIChatWrapper'

export default AIChatWrapper
