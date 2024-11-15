import type { CSSProperties } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseCircleFill, RiErrorWarningLine, RiSearchLine } from '@remixicon/react'
import { type VariantProps, cva } from 'class-variance-authority'
import cn from '@/utils/classnames'

export const inputVariants = cva(
  '',
  {
    variants: {
      size: {
        regular: 'px-3 radius-md system-sm-regular',
        large: 'px-4 radius-lg system-md-regular',
      },
    },
    defaultVariants: {
      size: 'regular',
    },
  },
)

export type InputProps = {
  showLeftIcon?: boolean
  showClearIcon?: boolean
  onClear?: () => void
  disabled?: boolean
  destructive?: boolean
  wrapperClassName?: string
  styleCss?: CSSProperties
} & React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

const Input = ({
  size,
  disabled,
  destructive,
  showLeftIcon,
  showClearIcon,
  onClear,
  wrapperClassName,
  className,
  styleCss,
  value,
  placeholder,
  onChange,
  ...props
}: InputProps) => {
  const { t } = useTranslation()
  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      {showLeftIcon && <RiSearchLine className={cn('absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-components-input-text-placeholder')} />}
      <input
        style={styleCss}
        className={cn(
          'w-full py-[7px] bg-components-input-bg-normal dark:bg-tgai-input-background border border-transparent dark:border-stone-700 text-components-input-text-filled dark:text-tgai-text-1 hover:bg-components-input-bg-hover dark:hover:bg-zinc-600 hover:border-components-input-border-hover dark:hover:border-stone-600 focus:bg-components-input-bg-active dark:focus:bg-zinc-600 focus:border-components-input-border-active dark:focus:border-stone-600 focus:shadow-xs dark:focus:shadow-stone-800 placeholder:text-components-input-text-placeholder dark:placeholder:text-tgai-text-3 appearance-none outline-none caret-tgai-primary',
          inputVariants({ size }),
          showLeftIcon && 'pl-[26px]',
          showLeftIcon && size === 'large' && 'pl-7',
          showClearIcon && value && 'pr-[26px]',
          showClearIcon && value && size === 'large' && 'pr-7',
          destructive && 'pr-[26px]',
          destructive && size === 'large' && 'pr-7',
          disabled && 'bg-components-input-bg-disabled dark:bg-zinc-800 border-transparent dark:border-transparent text-components-input-text-filled-disabled dark:text-tgai-text-2 cursor-not-allowed hover:bg-components-input-bg-disabled dark:hover:bg-zinc-800 hover:border-transparent dark:hover:border-transparent',
          destructive && 'bg-components-input-bg-destructive dark:bg-components-input-bg-destructive border-components-input-border-destructive dark:border-components-input-border-destructive text-components-input-text-filled dark:text-components-input-text-filled hover:bg-components-input-bg-destructive dark:hover:bg-components-input-bg-destructive hover:border-components-input-border-destructive dark:hover:border-components-input-border-destructive focus:bg-components-input-bg-destructive dark:focus:bg-components-input-bg-destructive focus:border-components-input-border-destructive dark:focus:border-components-input-border-destructive',
          className,
        )}
        placeholder={placeholder ?? (showLeftIcon ? t('common.operation.search') ?? '' : t('common.placeholder.input'))}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {showClearIcon && value && !disabled && !destructive && (
        <div className={cn('absolute right-2 top-1/2 -translate-y-1/2 group p-[1px] cursor-pointer')} onClick={onClear}>
          <RiCloseCircleFill className='w-3.5 h-3.5 text-tgai-text-4 cursor-pointer group-hover:text-tgai-text-3' />
        </div>
      )}
      {destructive && (
        <RiErrorWarningLine className='absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-destructive-secondary' />
      )}
    </div>
  )
}

export default Input
