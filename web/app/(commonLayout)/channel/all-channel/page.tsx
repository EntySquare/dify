
import { AllChannelListCard } from '@/app/components/tgai-channel/all-channel/all-channel-list-card'
import React from 'react'

const TGAIAllChannel = () => {
  return <div className='px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar'>
    <AllChannelListCard />

</div>
}

export default React.memo(TGAIAllChannel)
