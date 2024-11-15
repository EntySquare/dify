import { ThirdEngineCard } from '@/app/components/tgai-channel/third-engine/third-engine-card'
import React from 'react'

const ThirdEnginePage = () => {
  return <div className='px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar'>
  <ThirdEngineCard />

</div>
}

export default React.memo(ThirdEnginePage)
