'use client'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

import { useCallback } from 'react'
import s from './index.module.css'
import cn from '@/utils/classnames'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { ArrowNarrowLeft } from '@/app/components/base/icons/src/vender/line/arrows'
import { Check } from '@/app/components/base/icons/src/vender/line/general'


type IStepsNavBarProps = {
  step: number
  datasetId?: string
}

const STEP_T_MAP: Record<number, string> = {
  1: 'datasetCreation.steps.one',
  2: 'datasetCreation.steps.two',
  3: 'datasetCreation.steps.three',
}

const STEP_LIST = [1, 2, 3]

const StepsNavBar = ({
  step,
  datasetId,
}: IStepsNavBarProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile

  const navBackHandle = useCallback(() => {
    if (!datasetId)
      router.replace('/datasets')
    else
      router.replace(`/datasets/${datasetId}/documents`)
  }, [router, datasetId])

  return (
    <div className='w-full pt-4'>
      <div className={cn(s.stepsHeader, isMobile && '!px-0 justify-center')}>
        <div onClick={navBackHandle} className={cn(s.navBack, isMobile && '!mr-0', "dark:!bg-tgai-panel-background-3 dark:!border-stone-600 dark:hover:!border-stone-500 dark:!shadow-[0px_12px_16px_-4px_rgba(87,_83,_78,_0.92),_0px_4px_6px_-2px_rgba(87,_83,_78,_0.97)]")} >
          <ArrowNarrowLeft className='!text-tgai-primary' />
        </div>
        {!isMobile && (!datasetId ? t('datasetCreation.steps.header.creation') : t('datasetCreation.steps.header.update'))}
      </div>
      <div className={cn(s.stepList, isMobile && '!p-0')}>
        {STEP_LIST.map(item => (
          <div
            key={item}
            className={cn(s.stepItem,
              s[`step${item}`],
              "dark:before:!bg-stone-600",
              item === 2 && "dark:after:!bg-tgai-panel-background",
              step === item && s.active,
              step > item && s.done,
              isMobile && 'px-0'
            )}
          >
            <div className={cn(s.stepNum,
              "dark:!border-stone-600",
              step === item && "dark:!bg-tgai-primary dark:!text-tgai-text-1",
              step > item && "dark:!bg-tgai-primary-7 dark:!text-tgai-text-2"
            )}>
              {step > item ? '' : item}
              {/*{step > item && <Check className='size-3' />}*/}
            </div>
            <div className={cn(s.stepName)}>{isMobile ? '' : t(STEP_T_MAP[item])}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StepsNavBar
