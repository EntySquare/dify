'use client'
import React, { useEffect, useState } from 'react'
import copy from 'copy-to-clipboard'
import { t } from 'i18next'
import s from './style.module.css'
import Tooltip from '@/app/components/base/tooltip'

import Copy from './assets/copy.svg'
import Copied from './assets/copied.svg'
import classNames from '@/utils/classnames'

type IInputCopyProps = {
  value?: string
  className?: string
  readOnly?: boolean
  children?: React.ReactNode
}

const InputCopy = ({
  value = '',
  className,
  readOnly = true,
  children,
}: IInputCopyProps) => {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false)
      }, 1000)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [isCopied])

  return (
    <div className={`flex rounded-lg bg-gray-50 dark:bg-tgai-input-background hover:bg-gray-50 dark:hover:bg-tgai-input-background py-2 items-center ${className}`}>
      <div className="flex items-center flex-grow h-5">
        {children}
        <div className='flex-grow bg-gray-50 dark:bg-tgai-input-background text-[13px] relative h-full'>
          <div className='absolute top-0 left-0 w-full pl-2 pr-2 truncate cursor-pointer r-0' onClick={() => {
            copy(value)
            setIsCopied(true)
          }}>
            <Tooltip
              popupContent={isCopied ? `${t('appApi.copied')}` : `${t('appApi.copy')}`}
              position='bottom'
            >
              {value}
            </Tooltip>
          </div>
        </div>
        <div className="flex-shrink-0 h-4 bg-gray-200 dark:bg-zinc-600 dark:border-zinc-600 border" />
        <Tooltip
          popupContent={isCopied ? `${t('appApi.copied')}` : `${t('appApi.copy')}`}
          position='bottom'
        >
          <div className="px-0.5 flex-shrink-0">
            <div className={classNames("box-border w-[30px] h-[30px] flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-600 cursor-pointer text-tgai-text-3 hover:text-tgai-text-1", isCopied ? "!text-tgai-text-1" : "" )} onClick={() => {
              copy(value)
              setIsCopied(true)
            }}>
              {!isCopied && <Copy />}
              {isCopied && <Copied />}
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}

export default InputCopy
