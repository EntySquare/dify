'use client'

import React, { useCallback } from 'react'
import useSWR from 'swr'
import { useShallow } from 'zustand/react/shallow'
import { Disclosure, Transition } from '@headlessui/react'
import { RiArrowDropRightLine, RiLayoutLeftLine, RiRestartLine } from '@remixicon/react'
import PersonalitySelection from '@/app/components/enty-chat/chat-side-panel/personality-selection'
import XAccountSelection from '@/app/components/enty-chat/chat-side-panel/x-account-selection'
import Tooltip from '@/app/components/base/tooltip'
import Button from '@/app/components/base/button'
import cn from '@/utils/classnames'
import { getKnowledgeList, tweetsUserNameList } from '@/service/xai'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'

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
    setChatLists,
    setConversationId,
  } = useEntyAIChatStore(useShallow(state => ({
    isLeftPanelOpen: state.isLeftPanelOpen,
    setIsLeftPanelOpen: state.setIsLeftPanelOpen,
    setChatLists: state.setChatLists,
    setConversationId: state.setConversationId,
  })))

  const onRestartAIChat = useCallback(() => {
    setChatLists([])
    setConversationId()
  }, [])

  return <div className={'flex gap-2 h-14 items-center px-3'}>
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
    selectedAccounts,
    setSelectedAccounts,
    isLeftPanelOpen,
  } = useEntyAIChatStore(useShallow(state => ({
    selectedAccounts: state.selectedAccounts,
    setSelectedAccounts: state.setSelectedAccounts,
    isLeftPanelOpen: state.isLeftPanelOpen,
  })))

  return <Transition show={isLeftPanelOpen}
    className={'w-full max-w-[300px]'}
    enter="transition-all duration-150"
    enterFrom="opacity-0 w-0"
    enterTo="opacity-100 w-full"
    leave="transition-all duration-150"
    leaveFrom="opacity-100 w-full"
    leaveTo="opacity-0 w-0"
  >
    <div className={cn('text-tgai-text-1 overflow-hidden flex flex-col h-full')}>
      <PanelTopHeader/>
      <div className={'overflow-y-auto h-full tgai-custom-scrollbar py-4 px-3'}>
        <Disclosure defaultOpen>
          {({ open }) => (
            <>
              <Disclosure.Button className={'flex items-center justify-between w-full'}>
                <CommonSectionLabel text={'已登录X账号列表'}/>
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
                  <XAccountSelection data={userListData ? userListData.data.tweets_user_name_list : []}/>
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
                <CommonSectionLabel text={'AI 人设列表'}/>
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
      <PanelFooter />
    </div>
  </Transition>
})

AccountRolePanel.displayName = 'AccountRolePanel'

export default AccountRolePanel
