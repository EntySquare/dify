import {
  memo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  useEdges,
  useNodes,
} from 'reactflow'
import {
  RiCloseLine,
  RiListCheck3,
} from '@remixicon/react'
import BlockIcon from '../block-icon'
import {
  useChecklist,
  useNodesInteractions,
} from '../hooks'
import type {
  CommonEdgeType,
  CommonNodeType,
} from '../types'
import cn from '../../../../utils/classnames'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '../../base/portal-to-follow-elem'
import {
  ChecklistSquare,
} from '../../base/icons/src/vender/line/general'
import { AlertTriangle } from '../../base/icons/src/vender/line/alertsAndFeedback'

type WorkflowChecklistProps = {
  disabled: boolean
}
const WorkflowChecklist = ({
  disabled,
}: WorkflowChecklistProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const nodes = useNodes<CommonNodeType>()
  const edges = useEdges<CommonEdgeType>()
  const needWarningNodes = useChecklist(nodes, edges)
  const { handleNodeSelect } = useNodesInteractions()

  return (
    <PortalToFollowElem
      placement='bottom-end'
      offset={{
        mainAxis: 12,
        crossAxis: 4,
      }}
      open={open}
      onOpenChange={setOpen}
    >
      <PortalToFollowElemTrigger onClick={() => !disabled && setOpen(v => !v)}>
        <div
          className={cn(
            'relative ml-0.5 flex items-center justify-center w-7 h-7 rounded-md',
            disabled && 'opacity-50 cursor-not-allowed',
          )}
        >
          <div
            className={cn('group flex items-center justify-center w-full h-full rounded-md cursor-pointer hover:bg-state-accent-hover', open && 'bg-state-accent-hover')}
          >
            <RiListCheck3
              className={cn('w-4 h-4 group-hover:text-components-button-secondary-accent-text', open ? 'text-components-button-secondary-accent-text' : 'text-components-button-ghost-text')}
            />
          </div>
          {
            !!needWarningNodes.length && (
              <div className='absolute -right-1.5 -top-1.5 flex items-center justify-center min-w-[18px] h-[18px] rounded-full border border-gray-100 dark:border-zinc-600 text-white text-[11px] font-semibold bg-[#F79009]'>
                {needWarningNodes.length}
              </div>
            )
          }
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className='z-[12]'>
        <div
          className='w-[420px] rounded-2xl bg-tgai-workflow-panel-background border-[0.5px] border-black/5 dark:border-stone-600 shadow-lg dark:shadow-stone-800 overflow-y-auto tgai-custom-scrollbar'
          style={{
            maxHeight: 'calc(2 / 3 * 100vh)',
          }}
        >
          <div className='sticky top-0 bg-tgai-workflow-panel-background flex items-center pl-4 pr-3 pt-3 h-[44px] text-md font-semibold text-tgai-text-1 z-[1]'>
            <div className='grow'>{t('workflow.panel.checklist')}{needWarningNodes.length ? `(${needWarningNodes.length})` : ''}</div>
            <div
              className='shrink-0 flex items-center justify-center w-6 h-6 cursor-pointer'
              onClick={() => setOpen(false)}
            >
              <RiCloseLine className='w-4 h-4 text-tgai-text-2' />
            </div>
          </div>
          <div className='py-2'>
            {
              !!needWarningNodes.length && (
                <>
                  <div className='px-4 text-xs text-tgai-text-3'>{t('workflow.panel.checklistTip')}</div>
                  <div className='px-4 py-2'>
                    {
                      needWarningNodes.map(node => (
                        <div
                          key={node.id}
                          className='mb-2 last-of-type:mb-0 border-[0.5px] border-gray-200 dark:border-stone-600 bg-tgai-workflow-panel-background shadow-xs rounded-lg cursor-pointer'
                          onClick={() => {
                            handleNodeSelect(node.id)
                            setOpen(false)
                          }}
                        >
                          <div className='flex items-center p-2 h-9 text-xs font-medium text-tgai-text-2'>
                            <BlockIcon
                              type={node.type}
                              className='mr-1.5'
                              toolIcon={node.toolIcon}
                            />
                            <span className='grow truncate'>
                              {node.title}
                            </span>
                          </div>
                          <div className='border-t-[0.5px] border-t-black/2'>
                            {
                              node.unConnected && (
                                <div className='px-3 py-2 bg-gray-25 rounded-b-lg dark:bg-tgai-input-background'>
                                  <div className='flex text-xs leading-[18px] text-tgai-text-2'>
                                    <AlertTriangle className='mt-[3px] mr-2 w-3 h-3 text-[#F79009]' />
                                    {t('workflow.common.needConnectTip')}
                                  </div>
                                </div>
                              )
                            }
                            {
                              node.errorMessage && (
                                <div className='px-3 py-2 bg-gray-25 dark:bg-tgai-input-background rounded-b-lg'>
                                  <div className='flex text-xs leading-[18px] text-tgai-text-2'>
                                    <AlertTriangle className='mt-[3px] mr-2 w-3 h-3 text-[#F79009]' />
                                    {node.errorMessage}
                                  </div>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </>
              )
            }
            {
              !needWarningNodes.length && (
                <div className='mx-4 mb-3 py-4 rounded-lg bg-gray-50 dark:bg-tgai-input-background text-tgai-text-2 text-xs text-center'>
                  <ChecklistSquare className='mx-auto mb-[5px] w-8 h-8 text-tgai-text-3' />
                  {t('workflow.panel.checklistResolved')}
                </div>
              )
            }
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default memo(WorkflowChecklist)
