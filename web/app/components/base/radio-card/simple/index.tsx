'use client'
import type { FC } from 'react'
import React from 'react'
import s from './style.module.css'
import cn from '../../../../../utils/classnames'

type Props = {
  className?: string
  title: string | JSX.Element | null
  description: string
  isChosen: boolean
  onChosen: () => void
  chosenConfig?: React.ReactNode
  icon?: JSX.Element
  extra?: React.ReactNode
}

const RadioCard: FC<Props> = ({
  title,
  description,
  isChosen,
  onChosen,
  icon,
  extra,
}) => {
  return (
    <div
      className={cn(s.item,
        "dark:!border-stone-700 dark:!bg-tgai-panel-background-4 dark:hover:!bg-zinc-700 dark:hover:!border-tgai-primary-7",
        "dark:!shadow-sm dark:!shadow-stone-700 dark:hover:!shadow-lg dark:hover:!shadow-stone-700",
        isChosen && s.active,
        isChosen && "dark:!border-tgai-primary dark:hover:!border-tgai-primary dark:hover:!shadow-sm"
      )}
      onClick={onChosen}
    >
      <div className='flex px-3 py-2'>
        {icon}
        <div>
          <div className='flex justify-between items-center'>
            <div className='leading-5 text-sm font-medium text-tgai-text-1'>{title}</div>
            <div className={cn(s.radio, "dark:!border-stone-600", isChosen && "dark:!border-tgai-primary")}></div>
          </div>
          <div className='leading-[18px] text-xs font-normal text-tgai-text-3'>{description}</div>
        </div>
      </div>
      {extra}
    </div>
  )
}
export default React.memo(RadioCard)
