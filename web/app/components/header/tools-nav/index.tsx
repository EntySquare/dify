'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiHammerFill,
  RiHammerLine,
} from '@remixicon/react'
import classNames from '@/utils/classnames'
type ToolsNavProps = {
  className?: string
}

const ToolsNav = ({
  className,
}: ToolsNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const activated = selectedSegment === 'tools'

  return (
    <Link href="/tools" className={classNames(
      className, 'group',
      activated && 'bg-white dark:bg-zinc-600 shadow-md dark:shadow-stone-800',
      activated ? 'text-primary-600 dark:text-tgai-primary' : 'text-tgai-text-2 hover:bg-gray-200 dark:hover:bg-zinc-800',
    )}>
      {
        activated
          ? <RiHammerFill className='mr-2 w-4 h-4' />
          : <RiHammerLine className='mr-2 w-4 h-4' />
      }
      {/* {t('common.menus.tools')} */}
      能力
    </Link>
  )
}

export default ToolsNav
