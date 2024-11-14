'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseLine } from '@remixicon/react'
import { ArrowNarrowLeft } from '../../base/icons/src/vender/line/arrows'
import NodePanel from './node'
import cn from '../../../../utils/classnames'
import type { NodeTracing } from '../../../../types/workflow'
const i18nPrefix = 'workflow.singleRun'

type Props = {
  list: NodeTracing[][]
  onHide: () => void
  onBack: () => void
  noWrap?: boolean
  showBorder?: boolean
}

const IterationResultPanel: FC<Props> = ({
  list,
  onHide,
  onBack,
  noWrap,
  showBorder
}) => {
  const { t } = useTranslation()

  const main = (
    <>
      <div className={cn(!noWrap && 'shrink-0 ', 'pl-4 pr-3 pt-3')}>
        <div className='shrink-0 flex justify-between items-center h-8'>
          <div className='text-base font-semibold text-tgai-text-1 truncate'>
            {t(`${i18nPrefix}.testRunIteration`)}
          </div>
          <div className='ml-2 shrink-0 p-1 cursor-pointer' onClick={onHide}>
            <RiCloseLine className='w-4 h-4 text-tgai-text-3' />
          </div>
        </div>
        <div className='flex items-center py-2 space-x-1 text-primary-600 dark:text-tgai-primary cursor-pointer' onClick={onBack}>
          <ArrowNarrowLeft className='w-4 h-4' />
          <div className='leading-[18px] text-[13px] font-medium'>{t(`${i18nPrefix}.back`)}</div>
        </div>
      </div>
      {/* List */}
      <div className={cn(!noWrap ? 'h-0 grow' : 'max-h-full', 'overflow-y-auto tgai-custom-scrollbar px-4 pb-4 bg-gray-50 dark:bg-tgai-panel-background')}>
        {list.map((iteration, index) => (
          <div key={index} className={cn('my-4', index === 0 && 'mt-2')}>
            <div className='flex items-center'>
              <div className='shrink-0 leading-[18px] text-xs font-semibold text-tgai-text-3 uppercase'>{t(`${i18nPrefix}.iteration`)} {index + 1}</div>
              <div
                className='ml-3 grow w-0 h-px bg-gradient-to-r from-[#F3F4F6] to-[rgba(243,244,246,0)] dark:from-zinc-600'
              ></div>
            </div>
            <div className='mt-0.5 space-y-1'>
              {iteration.map(node => (
                <NodePanel
                  key={node.id}
                  className='!px-0 !py-0'
                  nodeInfo={node}
                  notShowIterationNav
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
  const handleNotBubble = useCallback((e: React.MouseEvent) => {
    // if not do this, it will trigger the message log modal disappear(useClickAway)
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }, [])

  if (noWrap)
    return main

  return (
    <div
      className={cn('absolute inset-0 z-10 rounded-2xl pt-10 overflow-hidden', showBorder && "inset-[1px]")}
      style={{
        backgroundColor: 'rgba(16, 24, 40, 0.20)',
      }}
      onClick={handleNotBubble}
    >
      <div className='h-full rounded-2xl flex flex-col'>
        {main}
      </div>
    </div >
  )
}
export default React.memo(IterationResultPanel)
