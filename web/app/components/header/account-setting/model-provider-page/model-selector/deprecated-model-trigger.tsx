import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ModelIcon from '../model-icon'
import { AlertTriangle } from '../../../../base/icons/src/vender/line/alertsAndFeedback'
import { useProviderContext } from '../../../../../../context/provider-context'
import TooltipPlus from '../../../../base/tooltip-plus'

type ModelTriggerProps = {
  modelName: string
  providerName: string
  className?: string
}
const ModelTrigger: FC<ModelTriggerProps> = ({
  modelName,
  providerName,
  className,
}) => {
  const { t } = useTranslation()
  const { modelProviders } = useProviderContext()
  const currentProvider = modelProviders.find(provider => provider.provider === providerName)

  return (
    <div
      className={`
        group flex items-center px-2 h-8 rounded-lg bg-[#FFFAEB] dark:bg-red-800 cursor-pointer
        ${className}
      `}
    >
      <ModelIcon
        className='shrink-0 mr-1.5'
        provider={currentProvider}
        modelName={modelName}
      />
      <div className='mr-1 text-[13px] font-medium text-tgai-text-1 truncate'>
        {modelName}
      </div>
      <div className='shrink-0 flex items-center justify-center w-4 h-4'>
        <TooltipPlus popupContent={t('common.modelProvider.deprecated')}>
          <AlertTriangle className='w-4 h-4 text-[#F79009]' />
        </TooltipPlus>
      </div>
    </div>
  )
}

export default ModelTrigger
