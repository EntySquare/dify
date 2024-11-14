import type { FC } from 'react'
import React, { useState } from 'react'
import { ArrowUpRightIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import {
  RiDeleteBinLine,
} from '@remixicon/react'
import { StatusItem } from '../../list'
import { DocumentTitle } from '../index'
import s from './style.module.css'
import { SegmentIndexTag } from './index'
import cn from '../../../../../../utils/classnames'
import Confirm from '../../../../base/confirm'
import Switch from '../../../../base/switch'
import Divider from '../../../../base/divider'
import Indicator from '../../../../header/indicator'
import { formatNumber } from '../../../../../../utils/format'
import type { SegmentDetailModel } from '../../../../../../models/datasets'
import { useTGAIGlobalStore } from '@/context/tgai-global-context'
import { Theme } from '@/types/app'

const ProgressBar: FC<{ percent: number; loading: boolean }> = ({ percent, loading }) => {
  return (
    <div className={s.progressWrapper}>
      <div className={cn(s.progress, loading ? s.progressLoading : '')}>
        <div
          className={s.progressInner}
          style={{ width: `${loading ? 0 : (Math.min(percent, 1) * 100).toFixed(2)}%` }}
        />
      </div>
      <div className={loading ? s.progressTextLoading : s.progressText}>{loading ? null : percent.toFixed(2)}</div>
    </div>
  )
}

export type UsageScene = 'doc' | 'hitTesting'

type ISegmentCardProps = {
  loading: boolean
  detail?: SegmentDetailModel & { document: { name: string } }
  score?: number
  onClick?: () => void
  onChangeSwitch?: (segId: string, enabled: boolean) => Promise<void>
  onDelete?: (segId: string) => Promise<void>
  scene?: UsageScene
  className?: string
  archived?: boolean
  embeddingAvailable?: boolean
}

const SegmentCard: FC<ISegmentCardProps> = ({
  detail = {},
  score,
  onClick,
  onChangeSwitch,
  onDelete,
  loading = true,
  scene = 'doc',
  className = '',
  archived,
  embeddingAvailable,
}) => {
  const { t } = useTranslation()
  const {
    id,
    position,
    enabled,
    content,
    word_count,
    hit_count,
    index_node_hash,
    answer,
  } = detail as Required<ISegmentCardProps>['detail']
  const isDocScene = scene === 'doc'
  const [showModal, setShowModal] = useState(false)

  const renderContent = () => {
    if (answer) {
      return (
        <>
          <div className='flex mb-2'>
            <div className='mr-2 text-[13px] font-semibold text-tgai-text-3'>Q</div>
            <div className='text-[13px]'>{content}</div>
          </div>
          <div className='flex'>
            <div className='mr-2 text-[13px] font-semibold text-tgai-text-3'>A</div>
            <div className='text-[13px]'>{answer}</div>
          </div>
        </>
      )
    }

    return content
  }

  const theme = useTGAIGlobalStore(state=>state.theme)

  return (
    <div
      className={cn(
        'box-border h-[180px] w-full xl:min-w-[290px] bg-gray-50 dark:bg-tgai-panel-background-4 px-4 pt-4 flex flex-col text-opacity-50 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-stone-500 hover:shadow-lg hover:cursor-pointer hover:bg-white dark:hover:bg-zinc-600',
        (isDocScene && !enabled) ? 'bg-gray-25 dark:bg-tgai-panel-background-3' : '',
        'group',
        !loading ? 'pb-4 hover:pb-[10px]' : '',
        className,
      )}
      onClick={() => onClick?.()}
    >
      <div className={s.segTitleWrapper}>
        {isDocScene
          ? <>
            <SegmentIndexTag positionId={position} className={cn('w-fit group-hover:opacity-100', (isDocScene && !enabled) ? 'opacity-50' : '')} />
            <div className={s.segStatusWrapper}>
              {loading
                ? (
                  <Indicator
                    color="gray"
                    className="bg-gray-200 border-gray-300 dark:bg-zinc-600 dark:border-stone-500 shadow-none"
                  />
                )
                : (
                  <>
                    <StatusItem status={enabled ? 'enabled' : 'disabled'} reverse textCls="text-tgai-text-2 text-xs" />
                    {embeddingAvailable && (
                      <div className="hidden group-hover:inline-flex items-center">
                        <Divider type="vertical" className="!h-2" />
                        <div
                          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                            e.stopPropagation()
                          }
                          className="inline-flex items-center"
                        >
                          <Switch
                            size='md'
                            disabled={archived || detail.status !== 'completed'}
                            defaultValue={enabled}
                            onChange={async (val) => {
                              await onChangeSwitch?.(id, val)
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
            </div>
          </>
          : (
            score !== null
              ? (
                <div className={s.hitTitleWrapper}>
                  <div className={cn(s.commonIcon, s.targetIcon, loading ? '!bg-gray-300' : '', '!w-3.5 !h-3.5')} />
                  <ProgressBar percent={score ?? 0} loading={loading} />
                </div>
              )
              : null
          )}
      </div>
      {loading
        ? (
          <div className={cn(s.cardLoadingWrapper, theme === Theme.light ? s.cardLoadingIcon : s.cardLoadingIconDark)}>
            <div className={cn(s.cardLoadingBg, "bg-gradient-to-t to-[rgba(252,_252,_253,_0)] from-[0%] from-[#fcfcfd] to-[74.15%] dark:to-zinc-600/0 dark:from-tgai-panel-background-3", 
            )} />
          </div>
        )
        : (
          isDocScene
            ? <>
              <div
                className={cn(
                  s.segContent,
                  'flex-1 h-0 min-h-0 mt-2 text-sm text-tgai-text-1 overflow-ellipsis overflow-hidden from-gray-800 to-white dark:from-white dark:to-zinc-600',
                  enabled ? '' : 'opacity-50',
                  'group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-b',
                )}
              >
                {renderContent()}
              </div>
              <div className={cn('group-hover:flex', 'hidden text-tgai-text-2 text-xs pt-2')}>
                <div className="flex items-center mr-6">
                  <div className={cn(s.commonIcon, s.typeSquareIcon)}></div>
                  <div className={s.segDataText}>{formatNumber(word_count)}</div>
                </div>
                <div className="flex items-center mr-6">
                  <div className={cn(s.commonIcon, s.targetIcon)} />
                  <div className={s.segDataText}>{formatNumber(hit_count)}</div>
                </div>
                <div className="grow flex items-center">
                  <div className={cn(s.commonIcon, s.bezierCurveIcon)} />
                  <div className={s.segDataText}>{index_node_hash}</div>
                </div>
                {!archived && embeddingAvailable && (
                  <div className='shrink-0 w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-100 hover:text-red-600 cursor-pointer group/delete' onClick={(e) => {
                    e.stopPropagation()
                    setShowModal(true)
                  }}>
                    <RiDeleteBinLine className='w-[14px] h-[14px] text-tgai-text-3 group-hover/delete:text-red-600' />
                  </div>
                )}
              </div>
            </>
            : <>
              <div className="h-[140px] overflow-hidden text-ellipsis text-sm font-normal text-tgai-text-1">
                {renderContent()}
              </div>
              <div className={cn('w-full bg-gray-50 dark:bg-tgai-panel-background-4 dark:group-hover:bg-zinc-600 group-hover:bg-white')}>
                <Divider />
                <div className="relative flex items-center w-full">
                  <DocumentTitle
                    name={detail?.document?.name || ''}
                    extension={(detail?.document?.name || '').split('.').pop() || 'txt'}
                    wrapperCls='w-full'
                    iconCls="!h-4 !w-4 !bg-contain"
                    textCls="text-xs text-tgai-text-2 !font-normal overflow-hidden whitespace-nowrap text-ellipsis"
                  />
  {/* /* background: linear-gradient(to left, white, 90%, transparent); */}
                  <div className={cn(s.chartLinkText,"dark:!text-tgai-primary", 'group-hover:inline-flex',
                    "bg-gradient-to-l from-white dark:from-zinc-600 from-[90%] to-transparent"
                  )}>
                    {t('datasetHitTesting.viewChart')}
                    <ArrowUpRightIcon className="w-3 h-3 ml-1 stroke-current stroke-2" />
                  </div>
                </div>
              </div>
            </>
        )}
      {showModal
        && <Confirm
          isShow={showModal}
          title={t('datasetDocuments.segment.delete')}
          confirmText={t('common.operation.sure')}
          onConfirm={async () => { await onDelete?.(id) }}
          onCancel={() => setShowModal(false)}
        />
      }
    </div>
  )
}

export default SegmentCard
