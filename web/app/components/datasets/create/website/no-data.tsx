'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon3Dots } from '../../../base/icons/src/vender/line/others'
import Button from '../../../base/button'

const I18N_PREFIX = 'datasetCreation.stepOne.website'

type Props = {
  onConfig: () => void
}

const NoData: FC<Props> = ({
  onConfig,
}) => {
  const { t } = useTranslation()

  return (
    <div className='max-w-[640px] p-6 rounded-2xl bg-gray-50 dark:bg-tgai-panel-background-3'>
      <div className='flex w-11 h-11 items-center justify-center bg-gray-50 dark:bg-tgai-panel-background-4 rounded-xl border-[0.5px] border-gray-100 dark:border-stone-600 shadow-lg dark:shadow-stone-700'>
        🔥
      </div>
      <div className='my-2'>
        <span className='text-tgai-text-2 font-semibold'>{t(`${I18N_PREFIX}.fireCrawlNotConfigured`)}<Icon3Dots className='inline relative -top-3 -left-1.5' /></span>
        <div className='mt-1 pb-3 text-tgai-text-3 text-[13px] font-normal'>
          {t(`${I18N_PREFIX}.fireCrawlNotConfiguredDescription`)}
        </div>
      </div>
      <Button variant='primary' onClick={onConfig}>
        {t(`${I18N_PREFIX}.configure`)}
      </Button>
    </div>
  )
}
export default React.memo(NoData)
