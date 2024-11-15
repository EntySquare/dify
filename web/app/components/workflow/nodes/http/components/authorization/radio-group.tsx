'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import cn from '../../../../../../../utils/classnames'

type Option = {
  value: string
  label: string
}

type ItemProps = {
  title: string
  onClick: () => void
  isSelected: boolean
}
const Item: FC<ItemProps> = ({
  title,
  onClick,
  isSelected,
}) => {
  return (
    <div
      className={cn(
        isSelected ? 'border-[2px] border-primary-400 dark:border-tgai-primary-7 bg-white dark:bg-zinc-700 shadow-xs' : 'border border-gray-100 dark:border-stone-600 bg-gray-25 dark:bg-neutral-800',
        'w-0 grow flex items-center justify-center h-8 cursor-pointer rounded-lg text-[13px] font-normal text-tgai-text-1')
      }
      onClick={onClick}
    >
      {title}
    </div>
  )
}

type Props = {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

const RadioGroup: FC<Props> = ({
  options,
  value,
  onChange,
}) => {
  const handleChange = useCallback((value: string) => {
    return () => onChange(value)
  }, [onChange])
  return (
    <div className='flex space-x-2'>
      {options.map(option => (
        <Item
          key={option.value}
          title={option.label}
          onClick={handleChange(option.value)}
          isSelected={option.value === value}
        />
      ))}
    </div>
  )
}
export default React.memo(RadioGroup)
