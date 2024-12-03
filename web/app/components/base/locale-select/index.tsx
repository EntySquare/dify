'use client'

import type { FC } from 'react'
import React from 'react'
import { useContext } from 'use-context-selector'
import I18n from '@/context/i18n'
import Select from '@/app/components/base/select/locale'
import type { Locale } from '@/i18n'
import { languages } from '@/i18n/language'

type LocaleSelectorProps = {
  reloadPage?: boolean
}

const LocaleSelector: FC<LocaleSelectorProps> = ({ reloadPage }) => {
  const { locale, setLocaleOnClient } = useContext(I18n)

  return <Select
    value={locale}
    items={languages.filter(item => item.supported)}
    onChange={(value) => {
      console.log(value)
      setLocaleOnClient(value as Locale, reloadPage)
    }}
  />
}

LocaleSelector.displayName = 'LocaleSelector'

export default LocaleSelector
