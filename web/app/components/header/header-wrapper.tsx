'use client'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import classNames from '../../../utils/classnames'
import s from './index.module.css'

type HeaderWrapperProps = {
  children: React.ReactNode
}

const HeaderWrapper = ({
  children,
}: HeaderWrapperProps) => {
  const pathname = usePathname()
  const isBordered = ['/apps', '/datasets', '/datasets/create', '/tools', '/data-cleansing'].includes(pathname)
  const isWorkflow = useMemo(() => {
    return pathname.includes('/apps') || pathname.includes('/datasets') || pathname.includes('/tools') || pathname.includes('/explore') || pathname.includes('/data-cleansing')
  }, [pathname])

  return (
    <div className={classNames(
      'top-0 left-0 right-0 z-30 flex flex-col grow-0 shrink-0 basis-auto min-h-[56px]',
      s.header,
      isBordered ? 'border-b border-tgai-panel-border' : '',
      isWorkflow ? 'sticky' : 'hidden',
    )}
    >
      {children}
    </div>
  )
}
export default HeaderWrapper
