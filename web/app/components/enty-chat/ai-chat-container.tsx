'use client'

import React from 'react'
import { useFilterSigninAccount } from '@/app/components/enty-chat/hooks'
import AIChatWrapper from '@/app/components/enty-chat/chat-wrapper/ai-chat-wrapper'
import AccountRolePanel from '@/app/components/enty-chat/chat-side-panel/ai-chat-account-role-panel'

const AIChatContainer = React.memo(() => {
  const list = useFilterSigninAccount()

  return <div className={'w-full h-full flex flex-nowrap'}>

    <AccountRolePanel />
    <AIChatWrapper />

  </div>
})

AIChatContainer.displayName = 'EntyAIChatContainer'

export default AIChatContainer
