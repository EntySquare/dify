import {
  memo,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  COMMAND_PRIORITY_EDITOR,
} from 'lexical'
import { mergeRegister } from '@lexical/utils'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  RiErrorWarningFill,
} from '@remixicon/react'
import { useSelectOrDelete } from '../../hooks'
import type { WorkflowNodesMap } from './node'
import { WorkflowVariableBlockNode } from './node'
import {
  DELETE_WORKFLOW_VARIABLE_BLOCK_COMMAND,
  UPDATE_WORKFLOW_NODES_MAP,
} from './index'
import cn from '../../../../../../utils/classnames'
import { Variable02 } from '../../../icons/src/vender/solid/development'
import { BubbleX, Env } from '../../../icons/src/vender/line/others'
import { VarBlockIcon } from '../../../../workflow/block-icon'
import { Line3 } from '../../../icons/src/public/common'
import { isConversationVar, isENV, isSystemVar } from '../../../../workflow/nodes/_base/components/variable/utils'
import TooltipPlus from '../../../tooltip-plus'

type WorkflowVariableBlockComponentProps = {
  nodeKey: string
  variables: string[]
  workflowNodesMap: WorkflowNodesMap
}

const WorkflowVariableBlockComponent = ({
  nodeKey,
  variables,
  workflowNodesMap = {},
}: WorkflowVariableBlockComponentProps) => {
  const { t } = useTranslation()
  const [editor] = useLexicalComposerContext()
  const [ref, isSelected] = useSelectOrDelete(nodeKey, DELETE_WORKFLOW_VARIABLE_BLOCK_COMMAND)
  const variablesLength = variables.length
  const varName = (
    () => {
      const isSystem = isSystemVar(variables)
      const varName = variablesLength >= 3 ? (variables).slice(-2).join('.') : variables[variablesLength - 1]
      return `${isSystem ? 'sys.' : ''}${varName}`
    }
  )()
  const [localWorkflowNodesMap, setLocalWorkflowNodesMap] = useState<WorkflowNodesMap>(workflowNodesMap)
  const node = localWorkflowNodesMap![variables[0]]
  const isEnv = isENV(variables)
  const isChatVar = isConversationVar(variables)

  useEffect(() => {
    if (!editor.hasNodes([WorkflowVariableBlockNode]))
      throw new Error('WorkflowVariableBlockPlugin: WorkflowVariableBlock not registered on editor')

    return mergeRegister(
      editor.registerCommand(
        UPDATE_WORKFLOW_NODES_MAP,
        (workflowNodesMap: WorkflowNodesMap) => {
          setLocalWorkflowNodesMap(workflowNodesMap)

          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    )
  }, [editor])

  const Item = (
    <div
      className={cn(
        'mx-0.5 relative group/wrap flex items-center h-[18px] pl-0.5 pr-[3px] rounded-[5px] border select-none',
        isSelected ? ' border-[#84ADFF] bg-[#F5F8FF] dark:bg-neutral-600/90 dark:border-tgai-primary-5' : ' border-black/5 bg-white dark:bg-neutral-600',
        !node && !isEnv && !isChatVar && '!border-[#F04438] !bg-[#FEF3F2]',
      )}
      ref={ref}
    >
      {!isEnv && !isChatVar && (
        <div className='flex items-center'>
          {
            node?.type && (
              <div className='p-[1px]'>
                <VarBlockIcon
                  className='!text-tgai-text-3'
                  type={node?.type}
                />
              </div>
            )
          }
          <div className='shrink-0 mx-0.5 max-w-[60px] text-xs font-medium text-tgai-text-3 truncate' title={node?.title} style={{
          }}>{node?.title}</div>
          <Line3 className='mr-0.5 text-tgai-text-3'></Line3>
        </div>
      )}
      <div className='flex items-center text-tgai-primary'>
        {!isEnv && !isChatVar && <Variable02 className='shrink-0 w-3.5 h-3.5' />}
        {isEnv && <Env className='shrink-0 w-3.5 h-3.5 text-util-colors-violet-violet-600' />}
        {isChatVar && <BubbleX className='w-3.5 h-3.5 text-util-colors-teal-teal-700' />}
        <div className={cn('shrink-0 ml-0.5 text-xs font-medium truncate', (isEnv || isChatVar) && 'text-tgai-text-1')} title={varName}>{varName}</div>
        {
          !node && !isEnv && !isChatVar && (
            <RiErrorWarningFill className='ml-0.5 w-3 h-3 text-[#D92D20]' />
          )
        }
      </div>
    </div>
  )

  if (!node && !isEnv && !isChatVar) {
    return (
      <TooltipPlus popupContent={t('workflow.errorMsg.invalidVariable')}>
        {Item}
      </TooltipPlus>
    )
  }

  return Item
}

export default memo(WorkflowVariableBlockComponent)
