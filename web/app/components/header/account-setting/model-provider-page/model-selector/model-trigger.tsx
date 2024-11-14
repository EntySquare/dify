import type { FC } from 'react'
import { RiArrowDownSLine } from '@remixicon/react'
import type {
  Model,
  ModelItem,
} from '../declarations'
import {
  MODEL_STATUS_TEXT,
  ModelStatusEnum,
} from '../declarations'
import { useLanguage } from '../hooks'
import ModelIcon from '../model-icon'
import ModelName from '../model-name'
import { AlertTriangle } from '../../../../base/icons/src/vender/line/alertsAndFeedback'
import TooltipPlus from '../../../../base/tooltip-plus'

type ModelTriggerProps = {
  open: boolean
  provider: Model
  model: ModelItem
  className?: string
  readonly?: boolean
}
const ModelTrigger: FC<ModelTriggerProps> = ({
  open,
  provider,
  model,
  className,
  readonly,
}) => {
  const language = useLanguage()

  return (
    <div
      className={`
        group flex items-center px-2 h-8 rounded-lg bg-gray-100 dark:bg-tgai-input-background
        ${!readonly && 'hover:bg-gray-200 dark:hover:bg-zinc-600 cursor-pointer'}
        ${className}
        ${open && '!bg-gray-200 dark:!bg-zinc-600'}
        ${model.status !== ModelStatusEnum.active && '!bg-[#FFFAEB] dark:!bg-red-800'}
      `}
    >
      <ModelIcon
        className='shrink-0 mr-1.5'
        provider={provider}
        modelName={model.model}
      />
      <ModelName
        className='grow'
        modelItem={model}
        showMode
        showFeatures
      />
      {!readonly && (
        <div className='shrink-0 flex items-center justify-center w-4 h-4'>
          {
            model.status !== ModelStatusEnum.active
              ? (
                <TooltipPlus popupContent={MODEL_STATUS_TEXT[model.status][language]}>
                  <AlertTriangle className='w-4 h-4 text-[#F79009]' />
                </TooltipPlus>
              )
              : (
                <RiArrowDownSLine
                  className='w-3.5 h-3.5 text-tgai-text-2'
                />
              )
          }
        </div>
      )}

    </div>
  )
}

export default ModelTrigger
