import type { FC } from 'react'
import { useState } from 'react'
import {
  RiMoreFill,
} from '@remixicon/react'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '../portal-to-follow-elem'

export type Item = {
  value: string | number
  text: string | JSX.Element
}
type DropdownProps = {
  items: Item[]
  secondItems?: Item[]
  onSelect: (item: Item) => void
  renderTrigger?: (open: boolean) => React.ReactNode
  popupClassName?: string
}
const Dropdown: FC<DropdownProps> = ({
  items,
  onSelect,
  secondItems,
  renderTrigger,
  popupClassName,
}) => {
  const [open, setOpen] = useState(false)

  const handleSelect = (item: Item) => {
    setOpen(false)
    onSelect(item)
  }

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-end'
    >
      <PortalToFollowElemTrigger onClick={() => setOpen(v => !v)}>
        {
          renderTrigger
            ? renderTrigger(open)
            : (
              <div
                className={`
                  flex items-center justify-center w-6 h-6 cursor-pointer rounded-md
                  ${open && 'bg-black/5 dark:bg-tgai-input-background/95'}
                `}
              >
                <RiMoreFill className='w-4 h-4 text-tgai-text-3' />
              </div>
            )
        }
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className={popupClassName}>
        <div className='rounded-lg border-[0.5px] border-gray-200 dark:border-stone-600 bg-white dark:bg-tgai-panel-background-3 shadow-lg text-sm text-tgai-text-2'>
          {
            !!items.length && (
              <div className='p-1'>
                {
                  items.map(item => (
                    <div
                      key={item.value}
                      className='flex items-center px-3 h-8 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-600'
                      onClick={() => handleSelect(item)}
                    >
                      {item.text}
                    </div>
                  ))
                }
              </div>
            )
          }
          {
            (!!items.length && !!secondItems?.length) && (
              <div className='h-[1px] bg-gray-100' />
            )
          }
          {
            !!secondItems?.length && (
              <div className='p-1'>
                {
                  secondItems.map(item => (
                    <div
                      key={item.value}
                      className='flex items-center px-3 h-8 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-600'
                      onClick={() => handleSelect(item)}
                    >
                      {item.text}
                    </div>
                  ))
                }
              </div>
            )
          }
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default Dropdown
