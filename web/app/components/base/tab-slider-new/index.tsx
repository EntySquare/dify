import type { FC } from 'react'
import cn from '../../../../utils/classnames'

type Option = {
  value: string
  text: string
  icon?: React.ReactNode
}
type TabSliderProps = {
  className?: string
  value: string
  onChange: (v: string) => void
  options: Option[]
}
const TabSliderNew: FC<TabSliderProps> = ({
  className,
  value,
  onChange,
  options,
}) => {
  return (
    <div className={cn(className, 'relative flex')}>
      {options.map(option => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'mr-1 px-3 py-[7px] h-[32px] flex items-center rounded-lg border-[0.5px] border-transparent text-tgai-text-2 text-[13px] font-medium leading-[18px] cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-800',
            value === option.value && 'bg-white dark:bg-zinc-600 border-gray-200 dark:border-zinc-600 shadow-xs text-tgai-primary hover:bg-white dark:hover:bg-zinc-600',
          )}
        >
          {option.icon}
          {option.text}
        </div>
      ))}
    </div>
  )
}

export default TabSliderNew
