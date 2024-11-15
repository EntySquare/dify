'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'
import type { InputVarType } from '@/app/components/workflow/types'
import InputVarTypeIcon from '@/app/components/workflow/nodes/_base/components/input-var-type-icon'
export type ISelectTypeItemProps = {
  type: InputVarType
  selected: boolean
  onClick: () => void
}

const i18nFileTypeMap: Record<string, string> = {
  'file': 'single-file',
  'file-list': 'multi-files',
}

const SelectTypeItem: FC<ISelectTypeItemProps> = ({
  type,
  selected,
  onClick,
}) => {
  const { t } = useTranslation()
  const typeName = t(`appDebug.variableConfig.${i18nFileTypeMap[type] || type}`)

  return (
    <div
      className={cn(
        'flex flex-col justify-center items-center h-[58px] rounded-lg border border-components-option-card-option-border bg-components-option-card-option-bg dark:bg-tgai-panel-background dark:border-stone-600 space-y-1',
        selected ? 'border-[1.5px] border-components-option-card-option-selected-border dark:border-tgai-primary bg-components-option-card-option-selected-bg dark:bg-stone-700 shadow-xs dark:!shadow-stone-600 system-xs-medium' : ' hover:border-components-option-card-option-border-hover dark:hover:border-tgai-primary-5 hover:bg-components-option-card-option-bg-hover dark:hover:bg-stone-700 hover:shadow-xs dark:hover:shadow-stone-600 cursor-pointer system-xs-regular')}
      onClick={onClick}
    >
      <div className='shrink-0'>
        <InputVarTypeIcon type={type} className='w-5 h-5' />
      </div>
      <span>{typeName}</span>
    </div>
  )
}
export default React.memo(SelectTypeItem)
