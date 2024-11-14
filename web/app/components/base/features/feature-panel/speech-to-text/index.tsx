'use client'
import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Microphone01 } from '../../../icons/src/vender/solid/mediaAndDevices'

const SpeechToTextConfig: FC = () => {
  const { t } = useTranslation()

  return (
    <div className='flex items-center px-3 h-12 bg-gray-50 dark:bg-neutral-700 rounded-xl overflow-hidden'>
      <div className='shrink-0 flex items-center justify-center mr-1 w-6 h-6'>
        <Microphone01 className='w-4 h-4 text-[#7839EE]' />
      </div>
      <div className='shrink-0 mr-2 flex items-center whitespace-nowrap text-sm text-tgai-text-1 font-semibold'>
        <div>{t('appDebug.feature.speechToText.title')}</div>
      </div>
      <div className='grow'></div>
      <div className='text-xs text-tgai-text-2'>{t('appDebug.feature.speechToText.resDes')}</div>
    </div>
  )
}
export default React.memo(SpeechToTextConfig)
