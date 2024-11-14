'use client'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageIndentLeft } from '../../base/icons/src/vender/line/editor'
import { Markdown } from '../../base/markdown'
import LoadingAnim from '../../base/chat/chat/loading-anim'

type ResultTextProps = {
  isRunning?: boolean
  outputs?: any
  error?: string
  onClick?: () => void
}

const ResultText: FC<ResultTextProps> = ({
  isRunning,
  outputs,
  error,
  onClick,
}) => {
  const { t } = useTranslation()
  return (
    <div className='bg-gray-50 dark:bg-tgai-panel-background-2 py-2'>
      {isRunning && !outputs && (
        <div className='pt-4 pl-[26px]'>
          <LoadingAnim type='text' />
        </div>
      )}
      {!isRunning && error && (
        <div className='px-4'>
          <div className='px-3 py-[10px] rounded-lg !bg-[#fef3f2] dark:!bg-tgai-panel-background-4 border-[0.5px] border-[rbga(0,0,0,0.05)] dark:border-stone-600/95 shadow-xs dark:shadow-stone-800'>
            <div className='text-xs leading-[18px] text-[#d92d20]'>{error}</div>
          </div>
        </div>
      )}
      {!isRunning && !outputs && !error && (
        <div className='mt-[120px] px-4 py-2 flex flex-col items-center text-[13px] leading-[18px] text-tgai-text-2'>
          <ImageIndentLeft className='w-6 h-6 text-tgai-text-3' />
          <div className='mr-2'>{t('runLog.resultEmpty.title')}</div>
          <div>
            {t('runLog.resultEmpty.tipLeft')}
            <span onClick={onClick} className='cursor-pointer text-tgai-primary'>{t('runLog.resultEmpty.link')}</span>
            {t('runLog.resultEmpty.tipRight')}
          </div>
        </div>
      )}
      {outputs && (
        <div className='px-4 py-2'>
          <Markdown content={outputs} />
        </div>
      )}
    </div>
  )
}

export default ResultText
