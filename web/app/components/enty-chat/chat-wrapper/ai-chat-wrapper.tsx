'use client'

import React, { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { PanelTopHeader } from '@/app/components/enty-chat/chat-side-panel/ai-chat-account-role-panel'
import Toast from '@/app/components/base/toast'
import type { FileEntity } from '@/app/components/base/file-uploader/types'
import Empty from '@/app/components/enty-chat/chat-wrapper/empty'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import type { ChatConfig } from '@/app/components/base/chat/types'
import Chat from '@/app/components/enty-chat/chat'
import type { ChatItem } from '@/app/components/enty-chat/types'
import cn from '@/utils/classnames'

const AIChatWrapperHeader = React.memo(() => {
  const { isLeftPanelOpen, setIsLeftPanelOpen } = useEntyAIChatStore(useShallow(state => ({
    isLeftPanelOpen: state.isLeftPanelOpen,
    setIsLeftPanelOpen: state.setIsLeftPanelOpen,
  })))

  return <div className={cn('absolute top-0 left-0 h-14 flex justify-between items-center z-50 gap-4', isLeftPanelOpen ? 'pl-4' : '')}>
    {!isLeftPanelOpen && <PanelTopHeader/>}
    <div className={'text-base font-bold text-tgai-text-1'} onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}>AI智能聊天</div>
  </div>
})

AIChatWrapperHeader.displayName = 'AIChatWrapperHeader'

const AIChatWrapper = React.memo(() => {
  const { isChatStarted, chatLists, setChatLists, isResponding, setIsResponding, selectedAccounts, selectedPersonality } = useEntyAIChatStore(useShallow(state => ({
    isChatStarted: state.isChatStarted,
    chatLists: state.chatLists,
    setChatLists: state.setChatLists,
    isResponding: state.isResponding,
    setIsResponding: state.setIsResponding,
    selectedAccounts: state.selectedAccounts,
    selectedPersonality: state.selectedPersonality,
  })))

  const appConfig = useMemo(() => {
    return {
      file_upload: {

      },
      speech_to_text: {
        enabled: false,
      },
    } as ChatConfig
  }, [])

  const onSendMsg = useCallback((message: string, files?: FileEntity[], last_answer?: ChatItem | null) => {
    if (isResponding) {
      Toast.notify({
        message: 'AI助手 正在回复，请等待回复结束！',
      })
      return
    }

    console.log(selectedPersonality)
    console.log(selectedAccounts)

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
  }, [chatLists, selectedAccounts, selectedPersonality])

  return <div className={'relative h-full border-l border-tgai-panel-border w-full bg-gray-50 dark:bg-tgai-panel-background'}>
    <AIChatWrapperHeader />

    { selectedPersonality === undefined
      ? <Empty />
      : <Chat
        chatFooterClassName={'pb-12 w-full'}
        chatFooterInnerClassName={'w-full max-w-[800px] left-[50%] -translate-x-[50%]'}
        chatContainerInnerClassName={'pt-16'}
        chatList={chatLists}
        config={appConfig}
        noChatInput={selectedPersonality === undefined}
        onSend={onSendMsg}
        noStopResponding={true}
        isResponding={isResponding}
      />
    }
  </div>
})

AIChatWrapper.displayName = 'AIChatWrapper'

export default AIChatWrapper
