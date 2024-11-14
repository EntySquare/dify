'use client'
import type { FC } from 'react'
import React from 'react'
import cn from '../../../../../../../utils/classnames'

type Props = {
  className?: string
  label: string
  labelClassName?: string
  value: string | number
  onChange: (value: string) => void
  isRequired?: boolean
  placeholder?: string
}

const Field: FC<Props> = ({
  className,
  label,
  labelClassName,
  value,
  onChange,
  isRequired = false,
  placeholder = '',
}) => {
  return (
    <div className={cn(className)}>
      <div className='flex py-[7px]'>
        <div className={cn(labelClassName, 'flex items-center h-[18px] text-[13px] font-medium text-tgai-text-1')}>{label} </div>
        {isRequired && <span className='ml-0.5 text-xs font-semibold text-[#D92D20]'>*</span>}
      </div>
      <input
        type='text'
        value={value}
        onChange={e => onChange(e.target.value)}
        className='flex h-9 w-full py-1 px-2 text-tgai-text-1 rounded-lg text-xs leading-normal bg-gray-100 dark:bg-tgai-input-background caret-primary-600 dark:caret-tgai-primary hover:bg-gray-100 dark:hover:bg-tgai-input-background focus:ring-1 focus:ring-inset focus:ring-gray-200 dark:focus:ring-stone-600 focus-visible:outline-none focus:bg-gray-50 dark:focus:bg-zinc-700 placeholder:text-tgai-text-3'
        placeholder={placeholder}
      />
    </div>
  )
}
export default React.memo(Field)
