'use client'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageIndentLeft } from '@/app/components/base/icons/src/vender/line/editor'
import { Markdown } from '@/app/components/base/markdown'
import LoadingAnim from '@/app/components/base/chat/chat/loading-anim'
import StatusContainer from '@/app/components/workflow/run/status-container'
import { FileList } from '@/app/components/base/file-uploader'
import type { FileEntity } from '@/app/components/base/file-uploader/types'

type ResultTextProps = {
  isRunning?: boolean
  outputs?: any
  error?: string
  onClick?: () => void
  allFiles?: FileEntity[]
}

const ResultText: FC<ResultTextProps> = ({
  isRunning,
  outputs,
  error,
  onClick,
  allFiles,
}) => {
  const { t } = useTranslation()
  return (
    <div className='bg-background-section-burn dark:dark:bg-tgai-panel-background-2 py-2'>
      {isRunning && !outputs && (
        <div className='pt-4 pl-[26px]'>
          <LoadingAnim type='text' />
        </div>
      )}
      {!isRunning && error && (
        <div className='px-4'>
          <StatusContainer status='failed'>
            {error}
          </StatusContainer>
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
          {!!allFiles?.length && (
            <FileList
              files={allFiles}
              showDeleteAction={false}
              showDownloadAction
              canPreview
            />
          )}
        </div>
      )}
    </div>
  )
}

export default ResultText
