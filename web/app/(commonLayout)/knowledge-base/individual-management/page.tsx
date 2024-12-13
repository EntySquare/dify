'use client'
import React from 'react'
import { KnowledgeBaseIndividualManagementHomeView } from '@/app/components/knowledge-base/individual-management/index'

const KnowledgeBaseIndividualManagementHome = () => {
  return (
    <div
      className="px-5 py-4 h-full overflow-y-auto"
      style={{ background: 'var(--color-background-grey)' }}
    >
      <KnowledgeBaseIndividualManagementHomeView />
    </div>
  )
}

export default React.memo(KnowledgeBaseIndividualManagementHome)
