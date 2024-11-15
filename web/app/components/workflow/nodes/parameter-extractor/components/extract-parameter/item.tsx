'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiDeleteBinLine,
  RiEditLine,
} from '@remixicon/react'
import type { Param } from '../../types'
import { Variable02 } from '../../../../../base/icons/src/vender/solid/development'
import classNames from '@/utils/classnames'
const i18nPrefix = 'workflow.nodes.parameterExtractor'

type Props = {
  payload: Param
  onEdit: () => void
  onDelete: () => void
}

const Item: FC<Props> = ({
  payload,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation()

  return (
    <div className='relative px-2.5 py-2 rounded-lg bg-white dark:bg-tgai-input-background border-[0.5px] border-gray-200 dark:border-stone-600 hover:shadow-xs dark:hover:shadow-stone-800 group'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <Variable02 className='w-3.5 h-3.5 text-primary-500 dark:text-tgai-primary-5' />
          <div className='ml-1 text-[13px] font-medium text-tgai-text-1'>{payload.name}</div>
          <div className='ml-2 text-xs font-normal text-tgai-text-3 capitalize'>{payload.type}</div>
        </div>
        {payload.required && (
          <div className='uppercase leading-4 text-xs font-normal text-tgai-text-3'>{t(`${i18nPrefix}.addExtractParameterContent.required`)}</div>
        )}
      </div>
      <div className='mt-0.5 leading-[18px] text-xs font-normal text-tgai-text-3'>{payload.description}</div>
      <div
        className={classNames('group-hover:flex absolute top-0 right-1 hidden h-full items-center w-[119px] justify-end space-x-1 rounded-lg',
          "bg-gradient-to-l from-[#FFF] to-[rgba(255,_255,_255,_0.00)] from-[49.99%] to-[98.1%] dark:from-tgai-input-background"
        )}
      >
        <div
          className='p-1 cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-zinc-600/95'
          onClick={onEdit}
        >
          <RiEditLine className='w-4 h-4 text-tgai-text-3' />
        </div>

        <div
          className='p-1 cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-zinc-600/95'
          onClick={onDelete}
        >
          <RiDeleteBinLine className='w-4 h-4 text-tgai-text-3' />
        </div>
      </div>
    </div>
  )
}
export default React.memo(Item)
