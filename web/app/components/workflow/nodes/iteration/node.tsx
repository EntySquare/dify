import type { FC } from 'react'
import {
  memo,
  useEffect,
} from 'react'
import {
  Background,
  useNodesInitialized,
  useViewport,
} from 'reactflow'
import { useTranslation } from 'react-i18next'
import { IterationStartNodeDumb } from '../iteration-start'
import { useNodeIterationInteractions } from './use-interactions'
import type { IterationNodeType } from './types'
import AddBlock from './add-block'
import cn from '@/utils/classnames'
import type { NodeProps } from '@/app/components/workflow/types'
import Toast from '@/app/components/base/toast'
import { useTGAIGlobalStore } from '@/context/tgai-global-context'
import { Theme } from '@/types/app'

const i18nPrefix = 'workflow.nodes.iteration'

const Node: FC<NodeProps<IterationNodeType>> = ({
  id,
  data,
}) => {
  const { zoom } = useViewport()
  const nodesInitialized = useNodesInitialized()
  const { handleNodeIterationRerender } = useNodeIterationInteractions()
  const { t } = useTranslation()

  const theme = useTGAIGlobalStore(state => state.theme)

  useEffect(() => {
    if (nodesInitialized)
      handleNodeIterationRerender(id)
    if (data.is_parallel && data._isShowTips) {
      Toast.notify({
        type: 'warning',
        message: t(`${i18nPrefix}.answerNodeWarningDesc`),
        duration: 5000,
      })
      data._isShowTips = false
    }
  }, [nodesInitialized, id, handleNodeIterationRerender, data, t])

  return (
    <div className={cn(
      'relative min-w-[240px] min-h-[90px] w-full h-full rounded-2xl bg-[#F0F2F7]/90 dark:bg-[#141414]/90',
    )}>
      <Background
        id={`iteration-background-${id}`}
        className='rounded-2xl !z-0'
        gap={[14 / zoom, 14 / zoom]}
        size={2 / zoom}
        color={theme === Theme.light ? "#E4E5E7" : "#9e0047"}
      />
      {
        data._isCandidate && (
          <IterationStartNodeDumb />
        )
      }
      {
        data._children!.length === 1 && (
          <AddBlock
            iterationNodeId={id}
            iterationNodeData={data}
          />
        )
      }
    </div>
  )
}

export default memo(Node)
