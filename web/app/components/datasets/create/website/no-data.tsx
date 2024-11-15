'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import s from './index.module.css'
import { Icon3Dots } from '@/app/components/base/icons/src/vender/line/others'
import Button from '@/app/components/base/button'
import { DataSourceProvider } from '@/models/common'

const I18N_PREFIX = 'datasetCreation.stepOne.website'

type Props = {
  onConfig: () => void
  provider: DataSourceProvider
}

const NoData: FC<Props> = ({
  onConfig,
  provider,
}) => {
  const { t } = useTranslation()

  const providerConfig = {
    [DataSourceProvider.jinaReader]: {
      emoji: <span className={s.jinaLogo} />,
      title: t(`${I18N_PREFIX}.jinaReaderNotConfigured`),
      description: t(`${I18N_PREFIX}.jinaReaderNotConfiguredDescription`),
    },
    [DataSourceProvider.fireCrawl]: {
      emoji: '🔥',
      title: t(`${I18N_PREFIX}.fireCrawlNotConfigured`),
      description: t(`${I18N_PREFIX}.fireCrawlNotConfiguredDescription`),
    },
  }

  const currentProvider = providerConfig[provider]

  return (
    <>
      <div className='max-w-[640px] p-6 rounded-2xl bg-gray-50 dark:bg-tgai-panel-background-3 mt-4'>
        <div className='flex w-11 h-11 items-center justify-center bg-gray-50 dark:bg-tgai-panel-background-4 rounded-xl border-[0.5px] border-gray-100 dark:border-stone-600 shadow-lg dark:shadow-stone-700'>
          {currentProvider.emoji}
        </div>
        <div className='my-2'>
          <span className='text-tgai-text-2 font-semibold'>{currentProvider.title}<Icon3Dots className='inline relative -top-3 -left-1.5' /></span>
          <div className='mt-1 pb-3 text-tgai-text-3 text-[13px] font-normal'>
            {currentProvider.description}
          </div>
        </div>
        <Button variant='primary' onClick={onConfig}>
          {t(`${I18N_PREFIX}.configure`)}
        </Button>
      </div>
    </>
  )
}
export default React.memo(NoData)
