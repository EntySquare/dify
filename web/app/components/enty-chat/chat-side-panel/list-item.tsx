'use client'

import { RiCheckboxBlankFill, RiCheckboxFill, RiRadioButtonFill } from '@remixicon/react'
import React from 'react'
import cn from '@/utils/classnames'

type ListItemProps = {
  text: string
  value: string
  selected: boolean
  onClick?: (value: string) => void
  type?: 'check' | 'radio'
}

const ListItem = React.memo<ListItemProps>(({ text, value, selected, onClick, type }) => {
  const onClickHandler = (value: string) => {
    onClick && onClick(value)
  }

  const selectedIcon = type !== 'radio' ? <RiCheckboxFill className={'text-tgai-primary size-4'}/> : <RiRadioButtonFill className={'text-tgai-primary size-4'} />
  const notSelectedIcon = type !== 'radio' ? <RiCheckboxBlankFill className={'text-transparent size-4'}/> : <RiRadioButtonFill className={'dark:text-neutral-700 text-gray-200 group-hover:text-tgai-primary-5 dark:group-hover:text-tgai-primary-7 size-4'} />

  return <div
    className={cn('group rounded-lg relative px-3 py-3 outline-1 outline outline-gray-200 dark:outline-slate-600 flex items-center justify-between cursor-pointer hover:outline-tgai-primary-5 dark:hover:outline-tgai-primary-7 hover:outline-2 hover:bg-gray-50 dark:hover:bg-zinc-700',
      selected && 'dark:bg-zinc-600 bg-gray-100 dark:hover:bg-zinc-600 hover:bg-gray-100 outline-2 hover:outline-tgai-primary outline-tgai-primary dark:outline-tgai-primary dark:hover:outline-tgai-primary')}
    onClick={() => onClickHandler(value)}>
    <div className={'text-tgai-text-1 font-medium truncate'}>{text}</div>
    {selected ? selectedIcon : notSelectedIcon }
  </div>
})

ListItem.displayName = 'ListItem'

export default ListItem
