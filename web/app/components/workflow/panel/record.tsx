import { memo, useCallback } from 'react'
import type { WorkflowDataUpdator } from '../types'
import Run from '../run'
import { useStore } from '../store'
import { useWorkflowUpdate } from '../hooks'

const Record = () => {
  const historyWorkflowData = useStore(s => s.historyWorkflowData)
  const { handleUpdateWorkflowCanvas } = useWorkflowUpdate()

  const handleResultCallback = useCallback((res: any) => {
    const graph: WorkflowDataUpdator = res.graph
    handleUpdateWorkflowCanvas({
      nodes: graph.nodes,
      edges: graph.edges,
      viewport: graph.viewport,
    })
  }, [handleUpdateWorkflowCanvas])

  return (
    <div className='flex flex-col w-[400px] h-full rounded-l-2xl border-[0.5px] border-gray-200 dark:border-stone-600 shadow-xl dark:shadow-stone-800 bg-tgai-panel-background'>
      <div className='flex items-center justify-between p-4 pb-1 text-base font-semibold text-tgai-text-1'>
        {`Test Run#${historyWorkflowData?.sequence_number}`}
      </div>
      <Run
        runID={historyWorkflowData?.id || ''}
        getResultCallback={handleResultCallback}
      />
    </div>
  )
}

export default memo(Record)
