'use client'
import React from 'react'

import { HeaderThemeSwitcher } from '../components/header/tgai-header/header-theme-switcher'

import LocaleSelector from '@/app/components/base/locale-select'

const Header = () => {

  return (
    <div className="flex items-center justify-end p-6 w-full gap-8">
      {/* <TGAILogo className="text-tgai-text-1 h-16 w-auto" /> */}
      {/* <RiTwitterXLine className={'text-tgai-text-1 size-14'} /> */}
      <LocaleSelector reloadPage={false}/>
      <HeaderThemeSwitcher className="h-16 w-16" />
    </div>
  )
}

export default Header
