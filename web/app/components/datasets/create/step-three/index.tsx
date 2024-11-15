'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EmbeddingProcess from '../embedding-process'

import s from './index.module.css'
import cn from '../../../../../utils/classnames'
import useBreakpoints, { MediaType } from '../../../../../hooks/use-breakpoints'
import type { FullDocumentDetail, createDocumentResponse } from '../../../../../models/datasets'

type StepThreeProps = {
  datasetId?: string
  datasetName?: string
  indexingType?: string
  creationCache?: createDocumentResponse
}

const StepThree = ({ datasetId, datasetName, indexingType, creationCache }: StepThreeProps) => {
  const { t } = useTranslation()

  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile

  return (
    <div className='flex w-full h-full'>
      <div className={'h-full w-full overflow-y-scroll tgai-custom-scrollbar px-6 sm:px-16'}>
        <div className='max-w-[636px]'>
          {!datasetId && (
            <>
              <div className={s.creationInfo}>
                <div className={cn(s.title, "dark:!text-tgai-text-1")}>{t('datasetCreation.stepThree.creationTitle')}</div>
                <div className={cn(s.content, "dark:!text-tgai-text-3")}>{t('datasetCreation.stepThree.creationContent')}</div>
                <div className={cn(s.label, "dark:!text-tgai-text-1")}>{t('datasetCreation.stepThree.label')}</div>
                <div className={cn(s.datasetName, "dark:!bg-tgai-input-background dark:!text-tgai-text-1")}>{datasetName || creationCache?.dataset?.name}</div>
              </div>
              <div className={cn(s.dividerLine, "dark:!bg-stone-700")} />
            </>
          )}
          {datasetId && (
            <div className={s.creationInfo}>
              <div className={cn(s.title, "dark:!text-tgai-text-1")}>{t('datasetCreation.stepThree.additionTitle')}</div>
              <div className={cn(s.content, "dark:!text-tgai-text-2")}>{`${t('datasetCreation.stepThree.additionP1')} ${datasetName || creationCache?.dataset?.name} ${t('datasetCreation.stepThree.additionP2')}`}</div>
            </div>
          )}
          <EmbeddingProcess
            datasetId={datasetId || creationCache?.dataset?.id || ''}
            batchId={creationCache?.batch || ''}
            documents={creationCache?.documents as FullDocumentDetail[]}
            indexingType={indexingType || creationCache?.dataset?.indexing_technique}
          />
        </div>
      </div>
      {!isMobile && <div className={cn(s.sideTip, "dark:!border-l-stone-600")}>
        <div className={cn(s.tipCard, "dark:!bg-tgai-panel-background-4")}>
          <span className={cn(s.icon, "dark:!border-stone-600")} />
          <div className={cn(s.title, "dark:!text-tgai-text-1")}>{t('datasetCreation.stepThree.sideTipTitle')}</div>
          <div className={cn(s.content, "dark:!text-tgai-text-2")}>{t('datasetCreation.stepThree.sideTipContent')}</div>
        </div>
      </div>}
    </div>
  )
}

export default StepThree
