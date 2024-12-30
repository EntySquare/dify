import { useShallow } from 'zustand/react/shallow'
import { useCallback } from 'react'
import Button from '../../base/button'
import { useEntyAIChatStore } from '../store'
import Toast from '../../base/toast'
import { ChatBotSlim } from '@/app/components/base/icons/src/vender/line/communication'

const Empty = () => {
  const {
    isChatStarted,
    setIsChatStarted,
    selectedAccounts,
    selectedPersonality,
  } = useEntyAIChatStore(useShallow(state => ({
    isChatStarted: state.isChatStarted,
    setIsChatStarted: state.setIsChatStarted,
    selectedAccounts: state.selectedAccounts,
    selectedPersonality: state.selectedPersonality,
  })))

  const onStartChat = useCallback(() => {
    if (isChatStarted)
      return

    if (selectedPersonality === null || selectedAccounts.length === 0) {
      Toast.notify({
        type: 'warning',
        message: '请先在左侧面板选择要操作的账号以及要使用的 AI 人设！',
      })
      return
    }

    setIsChatStarted(true)
  }, [isChatStarted, selectedAccounts, selectedPersonality])

  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='flex justify-center items-center mb-2'>
        <ChatBotSlim className='w-12 h-12 text-tgai-text-3' />
      </div>
      <div className='w-[256px] text-center text-[13px] text-tgai-text-3'>
        AI 聊天未准备好，请先去配置相应参数
      </div>
      <div className='w-full flex justify-center mt-4'>
        <Button variant={'primary'} onClick={onStartChat}>开始聊天</Button>
      </div>
    </div>
  )
}

export default Empty
