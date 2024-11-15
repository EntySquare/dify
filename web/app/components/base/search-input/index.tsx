import type { FC } from 'react'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiSearchLine } from '@remixicon/react'
import cn from '@/utils/classnames'
import { XCircle } from '@/app/components/base/icons/src/vender/solid/general'

type SearchInputProps = {
  placeholder?: string
  className?: string
  value: string
  onChange: (v: string) => void
  white?: boolean
  dark?: boolean;
}

const SearchInput: FC<SearchInputProps> = ({
  placeholder,
  className,
  value,
  onChange,
  white,
  dark,
}) => {
  const { t } = useTranslation()
  const [focus, setFocus] = useState<boolean>(false)
  const isComposing = useRef<boolean>(false)

  return (
    <div className={cn(
      'group flex items-center px-2 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 border border-transparent overflow-hidden',
      focus && '!bg-white hover:bg-white shadow-xs !border-gray-300',
      !focus && value && 'hover:!bg-gray-200 hover:!shadow-xs hover:!border-black/5',
      white && '!bg-white hover:!bg-white shadow-xs !border-gray-300 hover:!border-gray-300',
      dark && '!bg-tgai-input-background hover:!bg-tgai-input-background shadow-xs !border-zinc-600 hover:!border-zinc-600',
      className,
    )}>
      <div className="pointer-events-none shrink-0 flex items-center mr-1.5 justify-center w-4 h-4">
        <RiSearchLine className="h-3.5 w-3.5 text-tgai-text-3" aria-hidden="true" />
      </div>
      <input
        type="text"
        name="query"
        className={cn(
          'grow block h-[18px] bg-gray-200 border-0 text-tgai-text-1 text-[13px] placeholder:text-gray-500 appearance-none outline-none group-hover:bg-gray-300 caret-blue-600',
          focus && '!bg-white hover:bg-white group-hover:bg-white placeholder:!text-gray-400',
          !focus && value && 'hover:!bg-gray-200 group-hover:!bg-gray-200',
          white && '!bg-white hover:!bg-white group-hover:!bg-white placeholder:!text-gray-400',
          dark && '!bg-tgai-input-background hover:!bg-tgai-input-background group-hover:!bg-tgai-input-background placeholder:!text-tgai-text-2 !caret-tgai-primary',
        )}
        placeholder={placeholder || t('common.operation.search')!}
        value={value}
        onChange={(e) => {
          if (!isComposing.current)
            onChange(e.target.value)
        }}
        onCompositionStart={() => {
          isComposing.current = true
        }}
        onCompositionEnd={() => {
          isComposing.current = false
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        autoComplete="off"
      />
      {value && (
        <div
          className='shrink-0 flex items-center justify-center w-4 h-4 cursor-pointer group/clear'
          onClick={() => onChange('')}
        >
          <XCircle className='w-3.5 h-3.5 text-gray-400 group-hover/clear:text-gray-600 dark:group-hover/clear:text-gray-200' />
        </div>
      )}
    </div>
  )
}

export default SearchInput
