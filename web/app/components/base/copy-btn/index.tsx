'use client'
import { useState } from 'react'
import { t } from 'i18next'
import copy from 'copy-to-clipboard'
import Tooltip from '@/app/components/base/tooltip'
import Copy from '@/app/components/develop/secret-key/assets/copy.svg'
import Copied from '@/app/components/develop/secret-key/assets/copied.svg'

type ICopyBtnProps = {
  value: string
  className?: string
  isPlain?: boolean
}

const CopyBtn = ({
  value,
  className,
  isPlain,
}: ICopyBtnProps) => {
  const [isCopied, setIsCopied] = useState(false)

  return (
    <div className={`${className}`}>
      <Tooltip
        popupContent={(isCopied ? t('appApi.copied') : t('appApi.copy'))}
      >
        <div
          className={'box-border p-0.5 flex items-center justify-center rounded-md bg-white dark:bg-tgai-panel-background-2 cursor-pointer'}
          style={!isPlain
            ? {
              boxShadow: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
            }
            : {}}
          onClick={() => {
            copy(value)
            setIsCopied(true)
          }}
        >
          <div className={'w-6 h-6 rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 text-tgai-text-3 flex justify-center items-center'}>
            {isCopied ? <Copied /> : <Copy />}
          </div>
        </div>
      </Tooltip>
    </div>
  )
}

export default CopyBtn
