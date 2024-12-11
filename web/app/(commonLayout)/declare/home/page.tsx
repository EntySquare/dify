'use client'
import React from 'react'
import HuoXuanContainer from '@/app/components/xai-huoxuan/huoxuan-container'
import { HuoXuanListItemType } from '@/models/xai-huoxuan'

const DeclareHome = () => {
  return (
    <div
      className="px-5 py-4 h-full overflow-y-auto"
      style={{ background: 'var(--color-background-grey)' }}
    >
      <HuoXuanContainer huoxuanType={HuoXuanListItemType.XUAN} />
    </div>
  )
}

export default React.memo(DeclareHome)
