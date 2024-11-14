'use client'
import type { FC } from 'react'
import React from 'react'
import cn from '../../../../../../utils/classnames'

type OPTION = {
  label: string
  value: any
}

type Props = {
  className?: string
  options: OPTION[]
  value: any
  onChange: (value: any) => void
}

const RadioGroup: FC<Props> = ({
  className = '',
  options,
  value,
  onChange,
}) => {
  return (
    <div className={cn(className, 'flex')}>
      {options.map(item => (
        <div
          key={item.value}
          className={cn("grow flex items-center h-8 px-2.5 rounded-lg",
            "bg-gray-25 dark:bg-tgai-input-background border border-gray-100 dark:border-stone-600", 
            "cursor-pointer space-x-2", 
            "hover:bg-white dark:hover:bg-zinc-600 hover:border-[#B2CCFF] dark:hover:border-tgai-primary-5",
            "hover:shadow-[0px_12px_16px_-4px_rgba(16,_24,_40,_0.08),_0px_4px_6px_-2px_rgba(16,_24,_40,_0.03)] dark:hover:shadow-stone-700 dark:hover:shadow-lg",
            item.value === value && "bg-white dark:bg-zinc-600 border-[#528BFF] dark:border-tgai-primary shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.08),_0px_1px_3px_0px_rgba(16,_24,_40,_0.10)] dark:shadow-stone-700 dark:shadow-md")}
          onClick={() => onChange(item.value)}
        >
          <div className={cn("w-4 h-4 border-[2px] border-gray-200 rounded-full dark:border-stone-600", item.value === value && "border-[5px] !border-tgai-primary")}></div>
          <div className='text-[13px] font-medium text-tgai-text-1'>{item.label}</div>
        </div>
      ))}
    </div>
  )
}
export default React.memo(RadioGroup)


