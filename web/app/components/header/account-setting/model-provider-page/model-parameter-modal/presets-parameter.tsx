import type { FC } from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { RiArrowDownSLine } from '@remixicon/react'
import Dropdown from '../../../../base/dropdown'
import { SlidersH } from '../../../../base/icons/src/vender/line/mediaAndDevices'
import { Brush01 } from '../../../../base/icons/src/vender/solid/editor'
import { Scales02 } from '../../../../base/icons/src/vender/solid/FinanceAndECommerce'
import { Target04 } from '../../../../base/icons/src/vender/solid/general'
import { TONE_LIST } from '../../../../../../config'

type PresetsParameterProps = {
  onSelect: (toneId: number) => void
}
const PresetsParameter: FC<PresetsParameterProps> = ({
  onSelect,
}) => {
  const { t } = useTranslation()
  const renderTrigger = useCallback((open: boolean) => {
    return (
      <div
        className={`
          flex items-center px-[7px] h-7 rounded-md border-[0.5px] border-gray-200 dark:border-stone-600 shadow-xs
          text-xs font-medium text-tgai-text-2 cursor-pointer
          ${open && 'bg-gray-100 dark:bg-tgai-input-background'}
        `}
      >
        <SlidersH className='mr-[5px] w-3.5 h-3.5 text-tgai-text-3' />
        {t('common.modelProvider.loadPresets')}
        <RiArrowDownSLine className='ml-0.5 w-3.5 h-3.5 text-tgai-text-3' />
      </div>
    )
  }, [])
  const getToneIcon = (toneId: number) => {
    const className = 'mr-2 w-[14px] h-[14px]'
    const res = ({
      1: <Brush01 className={`${className} text-tgai-primary`} />,
      2: <Scales02 className={`${className} text-tgai-primary-5`} />,
      3: <Target04 className={`${className} text-tgai-text-2`} />,
    })[toneId]
    return res
  }
  const options = TONE_LIST.slice(0, 3).map((tone) => {
    return {
      value: tone.id,
      text: (
        <div className='flex items-center h-full'>
          {getToneIcon(tone.id)}
          {t(`common.model.tone.${tone.name}`) as string}
        </div>
      ),
    }
  })

  return (
    <Dropdown
      renderTrigger={renderTrigger}
      items={options}
      onSelect={item => onSelect(item.value as number)}
      popupClassName='z-[1003]'
    />
  )
}

export default PresetsParameter
