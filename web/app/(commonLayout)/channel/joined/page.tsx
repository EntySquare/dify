import { JoinedChannelListCard } from '@/app/components/tgai-channel/joined/join-channel-list-card'
import React from 'react'

const TGAIJoinedChannelList = () => {
  return  <div className='px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar'>
  <JoinedChannelListCard />
</div>
}

export default React.memo(TGAIJoinedChannelList)
