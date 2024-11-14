'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
// import s from './style.module.css'
import cn from '../../../../../../utils/classnames'
import type { InputVarType } from '../../../../workflow/types'
import InputVarTypeIcon from '../../../../workflow/nodes/_base/components/input-var-type-icon'
export type ISelectTypeItemProps = {
  type: InputVarType
  selected: boolean
  onClick: () => void
}

const SelectTypeItem: FC<ISelectTypeItemProps> = ({
  type,
  selected,
  onClick,
}) => {
  const { t } = useTranslation()
  const typeName = t(`appDebug.variableConig.${type}`)

  return (
    <div
      className={
        cn("flex flex-col justify-center items-center",
          "h-[58px] w-[98px] rounded-lg",
          "bg-white dark:bg-tgai-panel-background border border-gray-200 dark:border-stone-600",
          "dark:border-stone-600 shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] dark:shadow-stone-700",
          "cursor-pointer space-y-1",
          selected ? "text-[#155EEF] dark:text-tgai-primary dark:bg-stone-700 border-[#528BFF] dark:border-tgai-primary "
            : "hover:border-[#B2CCFF] dark:hover:border-tgai-primary-5 hover:bg-[#F5F8FF] dark:hover:bg-stone-700 text-tgai-text-1",
          selected ? "!shadow-[0px_1px_3px_rgba(16,_24,_40,_0.1),_0px_1px_2px_rgba(16,_24,_40,_0.06) dark:!shadow-stone-600" : "hover:shadow-[0px_4px_8px_-2px_rgba(16,_24,_40,_0.1),_0px_2px_4px_-2px_rgba(16,_24,_40,_0.06) dark:shadow-stone-600"
          )}
      onClick={onClick}
    >
      <div className='shrink-0'>
        <InputVarTypeIcon type={type} className='w-5 h-5' />
      </div>
      <span className={
        cn("font-medium text-[13px] text-tgai-text-2",
           selected ? "text-[#155EEF] dark:text-tgai-primary" : "hover:text-tgai-text-1"
        )}>{typeName}</span>
    </div>
  )
}
export default React.memo(SelectTypeItem)
