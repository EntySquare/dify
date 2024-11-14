import {
  memo,
  useCallback,
} from 'react'
import { useTranslation } from 'react-i18next'
import { intersection } from 'lodash-es'
import type {
  CommonNodeType,
  OnSelectBlock,
} from '../../../../types'
import BlockIcon from '../../../../block-icon'
import BlockSelector from '../../../../block-selector'
import {
  useAvailableBlocks,
  useNodesInteractions,
  useNodesReadOnly,
  useToolIcon,
} from '../../../../hooks'
import Button from '../../../../../base/button'

type ItemProps = {
  nodeId: string
  sourceHandle: string
  branchName?: string
  data: CommonNodeType
}
const Item = ({
  nodeId,
  sourceHandle,
  branchName,
  data,
}: ItemProps) => {
  const { t } = useTranslation()
  const { handleNodeChange } = useNodesInteractions()
  const { nodesReadOnly } = useNodesReadOnly()
  const toolIcon = useToolIcon(data)
  const {
    availablePrevBlocks,
    availableNextBlocks,
  } = useAvailableBlocks(data.type, data.isInIteration)

  const handleSelect = useCallback<OnSelectBlock>((type, toolDefaultValue) => {
    handleNodeChange(nodeId, type, sourceHandle, toolDefaultValue)
  }, [nodeId, sourceHandle, handleNodeChange])
  const renderTrigger = useCallback((open: boolean) => {
    return (
      <Button
        size='small'
        className={`
          hidden group-hover:flex
          ${open && '!bg-gray-100 dark:!bg-zinc-600 !flex'}
        `}
      >
        {t('workflow.panel.change')}
      </Button>
    )
  }, [t])

  return (
    <div
      className='relative group flex items-center mb-3 last-of-type:mb-0 px-2 h-9 rounded-lg border-[0.5px] border-divider-regular bg-background-default hover:bg-background-default-hover shadow-xs text-xs text-text-secondary cursor-pointer'
    >
      {
        branchName && (
          <div
            className='absolute left-1 right-1 -top-[7.5px] flex items-center h-3 text-[10px] text-tgai-text-2 font-semibold'
            title={branchName.toLocaleUpperCase()}
          >
            <div className='inline-block px-0.5 rounded-[5px] bg-white dark:bg-background-default truncate'>{branchName.toLocaleUpperCase()}</div>
          </div>
        )
      }
      <BlockIcon
        type={data.type}
        toolIcon={toolIcon}
        className='shrink-0 mr-1.5'
      />
      <div className='grow system-xs-medium text-tgai-text-1'>{data.title}</div>
      {
        !nodesReadOnly && (
          <BlockSelector
            onSelect={handleSelect}
            placement='top-end'
            offset={{
              mainAxis: 6,
              crossAxis: 8,
            }}
            trigger={renderTrigger}
            popupClassName='!w-[328px]'
            availableBlocksTypes={intersection(availablePrevBlocks, availableNextBlocks).filter(item => item !== data.type)}
          />
        )
      }
    </div>
  )
}

export default memo(Item)
