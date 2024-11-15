import { memo } from 'react'
import ShortcutsName from '../shortcuts-name'
import Tooltip from '@/app/components/base/tooltip'

type TipPopupProps = {
  title: string
  children: React.ReactNode
  shortcuts?: string[]
}
const TipPopup = ({
  title,
  children,
  shortcuts,
}: TipPopupProps) => {
  return (
    <Tooltip
      offset={4}
      popupClassName='!p-0 !bg-gray-25 dark:!bg-stone-600'
      popupContent={
        <div className='flex items-center gap-1 px-2 h-6 text-xs font-medium text-tgai-text-2 bg-tgai-panel-background-3 rounded-lg border-[0.5px] border-black/5 dark:border-stone-600'>
          {title}
          {
            shortcuts && <ShortcutsName keys={shortcuts} className='!text-[11px]' />
          }
        </div>
      }
    >
      {children}
    </Tooltip>
  )
}

export default memo(TipPopup)
