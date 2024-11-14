'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { TracingProvider } from './type'
import cn from '../../../../../../../utils/classnames'
import { LangfuseIconBig, LangsmithIconBig } from '../../../../../../components/base/icons/src/public/tracing'
import { Settings04 } from '../../../../../../components/base/icons/src/vender/line/general'

const I18N_PREFIX = 'app.tracing'

type Props = {
  type: TracingProvider
  readOnly: boolean
  isChosen: boolean
  onChoose: () => void
  hasConfigured: boolean
  onConfig: () => void
}

const getIcon = (type: TracingProvider) => {
  return ({
    [TracingProvider.langSmith]: LangsmithIconBig,
    [TracingProvider.langfuse]: LangfuseIconBig,
  })[type]
}

const ProviderPanel: FC<Props> = ({
  type,
  readOnly,
  isChosen,
  onChoose,
  hasConfigured,
  onConfig,
}) => {
  const { t } = useTranslation()
  const Icon = getIcon(type)

  const handleConfigBtnClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onConfig()
  }, [onConfig])

  const handleChosen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (isChosen || !hasConfigured || readOnly)
      return
    onChoose()
  }, [hasConfigured, isChosen, onChoose, readOnly])
  return (
    <div
      className={cn(isChosen ? 'border-primary-400 dark:border-tgai-primary-7' : 'border-transparent', !isChosen && hasConfigured && !readOnly && 'cursor-pointer', 'px-4 py-3 rounded-xl border-[1.5px]  bg-gray-100 dark:bg-tgai-input-background')}
      onClick={handleChosen}
    >
      <div className={'flex justify-between items-center space-x-1'}>
        <div className='flex items-center'>
          <Icon className='h-6' />
          {isChosen && <div className='ml-1 flex items-center h-4  px-1 rounded-[4px] border border-primary-500 dark:border-tgai-primary-5 leading-4 text-xs font-medium text-primary-500 dark:text-tgai-primary-5 uppercase'>{t(`${I18N_PREFIX}.inUse`)}</div>}
        </div>
        {!readOnly && (
          <div
            className='flex px-2 items-center h-6 bg-white dark:bg-neutral-700 rounded-md border-[0.5px] border-gray-200 dark:border-stone-600 shadow-xs dark:shadow-stone-800 cursor-pointer text-tgai-text-2 space-x-1'
            onClick={handleConfigBtnClick}
          >
            <Settings04 className='w-3 h-3' />
            <div className='text-xs font-medium'>{t(`${I18N_PREFIX}.config`)}</div>
          </div>
        )}

      </div>
      <div className='mt-2 leading-4 text-xs font-normal text-tgai-text-3'>
        {t(`${I18N_PREFIX}.${type}.description`)}
      </div>
    </div>
  )
}
export default React.memo(ProviderPanel)
