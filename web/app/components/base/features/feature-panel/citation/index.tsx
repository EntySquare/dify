'use client'
import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import Panel from '../../../../app/configuration/base/feature-panel'
import { Citations } from '../../../icons/src/vender/solid/editor'

const Citation: FC = () => {
  const { t } = useTranslation()

  return (
    <Panel
      title={
        <div className='flex items-center gap-2'>
          <div>{t('appDebug.feature.citation.title')}</div>
        </div>
      }
      headerIcon={<Citations className='w-4 h-4 text-[#FD853A]' />}
      headerRight={
        <div className='text-xs text-tgai-text-2'>{t('appDebug.feature.citation.resDes')}</div>
      }
      noBodySpacing
      className='dark:!bg-neutral-700'
    />
  )
}
export default React.memo(Citation)
