'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import type { INavSelectorProps } from './nav-selector'
import NavSelector from './nav-selector'
import classNames from '../../../../utils/classnames'
import { ArrowNarrowLeft } from '../../base/icons/src/vender/line/arrows'
import { useStore as useAppStore } from '../../app/store'

type INavProps = {
  icon: React.ReactNode
  activeIcon?: React.ReactNode
  text: string
  activeSegment: string | string[]
  link: string
  isApp: boolean
} & INavSelectorProps

const Nav = ({
  icon,
  activeIcon,
  text,
  activeSegment,
  link,
  curNav,
  navs,
  createText,
  onCreate,
  onLoadmore,
  isApp,
}: INavProps) => {
  const setAppDetail = useAppStore(state => state.setAppDetail)
  const [hovered, setHovered] = useState(false)
  const segment = useSelectedLayoutSegment()
  const isActived = Array.isArray(activeSegment) ? activeSegment.includes(segment!) : segment === activeSegment

  return (
    <div className={`
      flex items-center h-8 mr-0 sm:mr-3 px-0.5 rounded-xl text-sm shrink-0 font-medium
      ${isActived && 'bg-components-main-nav-nav-button-bg-active dark:bg-zinc-600 shadow-md font-semibold'}
      ${!curNav && !isActived && 'hover:bg-components-main-nav-nav-button-bg-hover dark:hover:bg-zinc-800'}
    `}>
      <Link href={link}>
        <div
          onClick={() => setAppDetail()}
          className={classNames(`
            flex items-center h-7 px-2.5 cursor-pointer rounded-[10px]
            ${isActived ? 'text-tgai-primary' : 'text-tgai-text-2'}
            ${curNav && isActived && 'hover:bg-components-main-nav-nav-button-bg-active-hover'}
          `)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className='mr-2'>
            {
              (hovered && curNav)
                ? <ArrowNarrowLeft className='w-4 h-4' />
                : isActived
                  ? activeIcon
                  : icon
            }
          </div>
          {text}
        </div>
      </Link>
      {
        curNav && isActived && (
          <>
            <div className='font-light text-tgai-text-3'>/</div>
            <NavSelector
              isApp={isApp}
              curNav={curNav}
              navs={navs}
              createText={createText}
              onCreate={onCreate}
              onLoadmore={onLoadmore}
            />
          </>
        )
      }
    </div>
  )
}

export default Nav
