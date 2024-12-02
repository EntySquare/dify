'use client'

import type { FC } from 'react'
import AIChatContainer from '@/app/components/enty-chat/ai-chat-container'

const AIChatPage: FC = () => {
  return <div className='h-full bg-white dark:bg-tgai-panel-background'>
    <AIChatContainer />
  </div>
}

export default AIChatPage
