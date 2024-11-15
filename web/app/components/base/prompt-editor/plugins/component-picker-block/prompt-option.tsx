import { memo } from 'react'

type PromptMenuItemMenuItemProps = {
  icon: JSX.Element
  title: string
  disabled?: boolean
  isSelected: boolean
  onClick: () => void
  onMouseEnter: () => void
  setRefElement?: (element: HTMLDivElement) => void
}
export const PromptMenuItem = memo(({
  icon,
  title,
  disabled,
  isSelected,
  onClick,
  onMouseEnter,
  setRefElement,
}: PromptMenuItemMenuItemProps) => {
  return (
    <div
      className={`
        flex items-center px-3 h-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 rounded-md
        ${isSelected && !disabled && '!bg-gray-50 dark:!bg-neutral-700'}
        ${disabled ? 'cursor-not-allowed opacity-30' : 'hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer'}
      `}
      tabIndex={-1}
      ref={setRefElement}
      onMouseEnter={() => {
        if (disabled)
          return
        onMouseEnter()
      }}
      onClick={() => {
        if (disabled)
          return
        onClick()
      }}>
      {icon}
      <div className='ml-1 text-[13px] text-tgai-text-1'>{title}</div>
    </div>
  )
})
PromptMenuItem.displayName = 'PromptMenuItem'
