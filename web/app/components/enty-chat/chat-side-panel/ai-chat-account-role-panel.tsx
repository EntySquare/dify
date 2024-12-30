'use client'

import { Disclosure, Transition } from '@headlessui/react'
import { RiArrowDropRightLine, RiLayoutLeftLine, RiRestartLine } from '@remixicon/react'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'
import useSWR from 'swr'
import { useShallow } from 'zustand/react/shallow'
import { useEntyChat } from '@/app/components/enty-chat/hooks'
import Button from '@/app/components/base/button'
import Tooltip from '@/app/components/base/tooltip'
import PersonalitySelection from '@/app/components/enty-chat/chat-side-panel/personality-selection'
import XAccountSelection from '@/app/components/enty-chat/chat-side-panel/x-account-selection'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import { EntyServiceType, useTGAIGlobalStore } from '@/context/tgai-global-context'
import { getKnowledgeList, tweetsUserNameList } from '@/service/xai'
import cn from '@/utils/classnames'

type CommonSectionLabelProps = {
  text: string
  className?: string
}

export const CommonSectionLabel = React.memo<CommonSectionLabelProps>(({ text, className }) => {
  return <div className={cn('flex h-9 items-center', className)}>
    <h3 className={'text-xs truncate font-semibold text-tgai-text-1'}>{text}</h3>
  </div>
})

CommonSectionLabel.displayName = 'CommonSectionLabel'

export const PanelTopHeader = React.memo(() => {
  const {
    isLeftPanelOpen,
    setIsLeftPanelOpen,

  } = useEntyAIChatStore(useShallow(state => ({
    isLeftPanelOpen: state.isLeftPanelOpen,
    setIsLeftPanelOpen: state.setIsLeftPanelOpen,
    isChatStarted: state.isChatStarted,
    setIsChatStarted: state.setIsChatStarted,
    setChatLists: state.setChatLists,
    setConversationId: state.setConversationId,
    setSelectedAccounts: state.setSelectedAccounts,
    setSelectedPersonality: state.setSelectedPersonality,
  })))

  const { onRestartAIChat } = useEntyChat()

  return <div className={'flex gap-2 h-14 items-center px-3 z-50'}>
    <Tooltip
      popupContent={
        <div className='w-[180px]'>
          {isLeftPanelOpen ? '关闭侧边栏' : '打开侧边栏'}
        </div>
      }
    >
      <Button className={'text-tgai-text-3 font-bold px-0 w-10 h-10'} onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}>
        <RiLayoutLeftLine />
      </Button>
    </Tooltip>
    <Tooltip
      popupContent={
        <div className='w-[180px]'>
          重新开始 AI 聊天
        </div>
      }
    >
      <Button className={'text-tgai-text-3 font-bold px-0 w-10 h-10'} onClick={() => onRestartAIChat()}>
        <RiRestartLine />
      </Button>
    </Tooltip>
  </div>
})

PanelTopHeader.displayName = 'AIChatPanelTopHeader'

const PanelFooter = React.memo(() => {
  return <div className={'h-20 flex items-center px-3'}>
    <Button variant={'primary'}>生成对话</Button>
  </div>
})

PanelFooter.displayName = 'PanelFooter'

const AccountRolePanel = React.memo(() => {
  const { data: userListData } = useSWR(['/tweetsUserNameList'], tweetsUserNameList)
  const { data: knowledgeListData } = useSWR(['/knowledge/list'], () => getKnowledgeList({ page: 1, limit: 50 }))

  const {
    isChatStarted,
    selectedAccounts,
    setSelectedAccounts,
    isLeftPanelOpen,
  } = useEntyAIChatStore(useShallow(state => ({
    isChatStarted: state.isChatStarted,
    selectedAccounts: state.selectedAccounts,
    setSelectedAccounts: state.setSelectedAccounts,
    isLeftPanelOpen: state.isLeftPanelOpen,
  })))

  const { onRestartAIChat } = useEntyChat()

  const serviceType = useTGAIGlobalStore(state => state.serviceType)

  const pathname = usePathname()

  const chatType = useMemo(() => {
    if (!pathname)
      return 'x'

    return pathname.includes('ai-chat') ? 'x' : 'instagram'
  }, [pathname])

  const serviceText = useMemo(() => {
    switch (serviceType) {
      case EntyServiceType.X: {
        return 'X'
      }
      case EntyServiceType.INSTAGRAM: {
        return 'Instagram'
      }
      case EntyServiceType.TRUTH_SOCIAL: {
        return 'Truth Social'
      }
      default:
        return 'X'
    }
  }, [serviceType])

  return <Transition show={isLeftPanelOpen}
    className={'w-full max-w-[300px]'}
    enter="transition-all duration-150"
    enterFrom="opacity-0 w-0"
    enterTo="opacity-100 w-full"
    leave="transition-all duration-150"
    leaveFrom="opacity-100 w-full"
    leaveTo="opacity-0 w-0"
  >
    <div className={cn('text-tgai-text-1 overflow-hidden flex flex-col h-full relative')}>
      <PanelTopHeader />
      {isChatStarted && <div className='group absolute top-0 left-0 size-full h-full backdrop-blur-0 hover:backdrop-blur-[3px] z-40 transition-all flex justify-center items-center'>
        <Button variant={'primary'} className='opacity-0 group-hover:opacity-100 transition-all' onClick={onRestartAIChat}>重置参数</Button>
      </div>
      }
      <div className={cn('overflow-y-auto h-full tgai-custom-scrollbar py-4 px-3 relative')}>
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className={'flex items-center justify-between w-full'}>
                <CommonSectionLabel text={`已登录${serviceText}账号列表`} />
                <RiArrowDropRightLine className={cn('transition text-tgai-text-3', open ? 'rotate-90' : '')} />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel>
                  <XAccountSelection data={userListData ? userListData.data.tweets_user_name_list : []} />
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
        {/* <div className={'h-[1px] bg-gray-200 dark:bg-stone-600 w-[90%] my-8 mx-auto'}/> */}
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className={'flex items-center justify-between w-full mt-10'}>
                <CommonSectionLabel text={'AI 人设列表'} />
                <RiArrowDropRightLine className={cn('transition text-tgai-text-3', open ? 'rotate-90' : '')} />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel>
                  <PersonalitySelection data={knowledgeListData ? knowledgeListData.data.data : []} />
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      </div>
      {/* <PanelFooter /> */}
    </div>
  </Transition>
})

AccountRolePanel.displayName = 'AccountRolePanel'

export default AccountRolePanel
