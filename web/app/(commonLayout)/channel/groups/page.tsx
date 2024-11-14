import { ChannelGroupCard } from '@/app/components/tgai-channel/channel-group/channel-group-card'
import React from 'react'

const TGAIChannelGroups = () => {
  return <div className='px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar'><ChannelGroupCard /></div>
}

export default React.memo(TGAIChannelGroups)
