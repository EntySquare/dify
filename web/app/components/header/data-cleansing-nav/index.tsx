'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  RiDatabaseLine,
  RiDatabaseFill,
} from '@remixicon/react'
import classNames from '../../../../utils/classnames'
type DataCleansingNavProps = {
  className?: string
}

const DataCleansingNav = ({
  className,
}: DataCleansingNavProps) => {
  const { t } = useTranslation()
  const selectedSegment = useSelectedLayoutSegment()
  const actived = selectedSegment === 'data-cleansing'

  return (
    <Link href="/data-cleansing" className={classNames(
      className, 'group',
      actived && 'bg-components-main-nav-nav-button-bg-active dark:bg-zinc-600  shadow-md',
      actived ? 'text-tgai-primary' : 'text-tgai-text-2 hover:bg-gray-200 dark:hover:bg-zinc-800',
    )}>
      {
        actived
          ? <RiDatabaseFill className='mr-2 w-4 h-4' />
          : <RiDatabaseLine className='mr-2 w-4 h-4' />
      }
      数据整理
    </Link>
  )
}

export default DataCleansingNav
