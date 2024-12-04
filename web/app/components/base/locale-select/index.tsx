'use client'

import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
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

  const { i18n } = useTranslation()

  return <Select
    value={i18n.language}
    items={languages.filter(item => item.supported)}
    onChange={(value) => {
      setLocaleOnClient(value as Locale, reloadPage)
    }}
    outerContainerClassName={'z-50'}
  />
}

LocaleSelector.displayName = 'LocaleSelector'

export default LocaleSelector
