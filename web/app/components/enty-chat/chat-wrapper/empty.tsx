import { ChatBotSlim } from '@/app/components/base/icons/src/vender/line/communication'

const Empty = () => {
  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
      <div className='flex justify-center mb-2'>
        <ChatBotSlim className='w-12 h-12 text-tgai-text-3' />
      </div>
      <div className='w-[256px] text-center text-[13px] text-tgai-text-3'>
        AI 聊天未准备好，请先去配置相应参数
      </div>
    </div>
  )
}

export default Empty
