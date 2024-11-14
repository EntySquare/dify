import {
  memo,
  useCallback,
  useState,
} from 'react'
import Textarea from 'rc-textarea'
import { useTranslation } from 'react-i18next'

type TitleInputProps = {
  value: string
  onBlur: (value: string) => void
}

export const TitleInput = memo(({
  value,
  onBlur,
}: TitleInputProps) => {
  const { t } = useTranslation()
  const [localValue, setLocalValue] = useState(value)

  const handleBlur = () => {
    if (!localValue) {
      setLocalValue(value)
      onBlur(value)
      return
    }

    onBlur(localValue)
  }

  return (
    <input
      value={localValue}
      onChange={e => setLocalValue(e.target.value)}
      className={`
        grow mr-2 px-1 h-6 text-base text-tgai-text-1 font-semibold rounded-lg border border-transparent appearance-none outline-none dark:bg-tgai-workflow-panel-background
        hover:bg-gray-50 dark:hover:bg-tgai-input-background
        focus:border-gray-300 focus:shadow-xs dark:focus:border-stone-600 dark:focus:shadow-stone-800 focus:bg-components-panel-bg dark:focus:bg-tgai-workflow-panel-background caret-tgai-primary
      `}
      placeholder={t('workflow.common.addTitle') || ''}
      onBlur={handleBlur}
    />
  )
})
TitleInput.displayName = 'TitleInput'

type DescriptionInputProps = {
  value: string
  onChange: (value: string) => void
}
export const DescriptionInput = memo(({
  value,
  onChange,
}: DescriptionInputProps) => {
  const { t } = useTranslation()
  const [focus, setFocus] = useState(false)
  const handleFocus = useCallback(() => {
    setFocus(true)
  }, [])
  const handleBlur = useCallback(() => {
    setFocus(false)
  }, [])

  return (
    <div
      className={`
        group flex px-2 py-[5px] max-h-[60px] rounded-lg overflow-y-auto dark:bg-tgai-workflow-panel-background
        border border-transparent hover:bg-gray-50 leading-0 dark:hover:bg-tgai-input-background
        tgai-custom-scrollbar
        ${focus && '!border-gray-300 shadow-xs !bg-gray-50 dark:!border-stone-600 dark:!bg-tgai-input-background dark:shadow-stone-600'}
      `}
    >
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={1}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`
          w-full text-xs text-tgai-text-1 leading-[18px] bg-transparent
          appearance-none outline-none resize-none
          placeholder:text-gray-400 caret-tgai-primary
        `}
        placeholder={t('workflow.common.addDescription') || ''}
        autoSize
      />
    </div>
  )
})
DescriptionInput.displayName = 'DescriptionInput'
