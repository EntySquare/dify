import React from 'react'
import { InteractionStrategyCard } from '@/app/components/strategy/lnteraction-strategy/interaction-strategy-card'

const InteractionStrategy = () => {
  return (
    <div className="px-5 py-4 h-full overflow-y-auto tgai-custom-scrollbar">
      <InteractionStrategyCard />
    </div>
  )
}

export default React.memo(InteractionStrategy)
