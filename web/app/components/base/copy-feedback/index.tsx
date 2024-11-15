'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash-es'
import copy from 'copy-to-clipboard'
import copyStyle from './style.module.css'
import Tooltip from '@/app/components/base/tooltip'
import Copy from '@/app/components/develop/secret-key/assets/copy.svg'
import CopyHover from '@/app/components/develop/secret-key/assets/copy-hover.svg'
import Copied from '@/app/components/develop/secret-key/assets/copied.svg'

type Props = {
  content: string
  className?: string
}

const prefixEmbedded = 'appOverview.overview.appInfo.embedded'

const CopyFeedback = ({ content, className }: Props) => {
  const { t } = useTranslation()
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const onClickCopy = debounce(() => {
    copy(content)
    setIsCopied(true)
  }, 100)

  const onMouseLeave = debounce(() => {
    setIsCopied(false)
  }, 100)

  return (
    <Tooltip
      popupContent={
        (isCopied
          ? t(`${prefixEmbedded}.copied`)
          : t(`${prefixEmbedded}.copy`)) || ''
      }
    >
      <div
        className={`w-8 h-8 cursor-pointer hover:bg-gray-100 rounded-lg ${
          className ?? ''
        }`}
      >
        <div
          onClick={onClickCopy}
          onMouseLeave={onMouseLeave}
          className={`w-full h-full text-tgai-text-3 hover:text-tgai-text-1 flex justify-center items-center ${isCopied && '!text-tgai-text-1'}`}
        >
          {isCopied ? <Copied /> : <Copy />}
        ></div>
      </div>
    </Tooltip>
  )
}

export default CopyFeedback

export const CopyFeedbackNew = ({ content, className }: Pick<Props, 'className' | 'content'>) => {
  const { t } = useTranslation()
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const onClickCopy = debounce(() => {
    copy(content)
    setIsCopied(true)
  }, 100)

  const onMouseLeave = debounce(() => {
    setIsCopied(false)
  }, 100)

  return (
    <Tooltip
      popupContent={
        (isCopied
          ? t(`${prefixEmbedded}.copied`)
          : t(`${prefixEmbedded}.copy`)) || ''
      }
    >
      <div
        className={`w-8 h-8 cursor-pointer hover:bg-gray-100 rounded-lg ${
          className ?? ''
        }`}
      >
        <div
          onClick={onClickCopy}
          onMouseLeave={onMouseLeave}
          className={`w-full h-full text-tgai-text-3 hover:text-tgai-text-1 flex justify-center items-center ${isCopied && '!text-tgai-text-1'}`}
        >
          {isCopied ? <Copied /> : <Copy />}
        </div>
      </div>
    </Tooltip>
  )
}
