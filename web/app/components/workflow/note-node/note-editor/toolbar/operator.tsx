import {
  memo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { RiMoreFill } from '@remixicon/react'
import cn from '../../../../../../utils/classnames'
import ShortcutsName from '../../../shortcuts-name'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '../../../../base/portal-to-follow-elem'
import Switch from '../../../../base/switch'

export type OperatorProps = {
  onCopy: () => void
  onDuplicate: () => void
  onDelete: () => void
  showAuthor: boolean
  onShowAuthorChange: (showAuthor: boolean) => void
}
const Operator = ({
  onCopy,
  onDelete,
  onDuplicate,
  showAuthor,
  onShowAuthorChange,
}: OperatorProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-end'
      offset={4}
    >
      <PortalToFollowElemTrigger onClick={() => setOpen(!open)}>
        <div
          className={cn(
            'flex items-center justify-center w-8 h-8 cursor-pointer rounded-lg hover:bg-black/5 dark:hover:bg-zinc-600',
            open && 'bg-black/5',
          )}
        >
          <RiMoreFill className='w-4 h-4 text-tgai-text-3' />
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent>
        <div className='min-w-[192px] bg-tgai-panel-background-3 rounded-md border-[0.5px] border-gray-200 dark:border-stone-600 shadow-xl dark:shadow-stone-800'>
          <div className='p-1'>
            <div
              className='flex items-center justify-between px-3 h-8 cursor-pointer rounded-md text-sm text-tgai-text-2 hover:bg-black/5 dark:hover:bg-zinc-600'
              onClick={() => {
                onCopy()
                setOpen(false)
              }}
            >
              {t('workflow.common.copy')}
              <ShortcutsName keys={['ctrl', 'c']} />
            </div>
            <div
              className='flex items-center justify-between px-3 h-8 cursor-pointer rounded-md text-sm text-tgai-text-2 hover:bg-black/5 dark:hover:bg-zinc-600'
              onClick={() => {
                onDuplicate()
                setOpen(false)
              }}
            >
              {t('workflow.common.duplicate')}
              <ShortcutsName keys={['ctrl', 'd']} />
            </div>
          </div>
          <div className='h-[1px] bg-gray-100 dark:bg-zinc-600'></div>
          <div className='p-1'>
            <div
              className='flex items-center justify-between px-3 h-8 cursor-pointer rounded-md text-sm text-tgai-text-2 hover:bg-black/5 dark:hover:bg-zinc-600'
              onClick={e => e.stopPropagation()}
            >
              <div>{t('workflow.nodes.note.editor.showAuthor')}</div>
              <Switch
                size='l'
                defaultValue={showAuthor}
                onChange={onShowAuthorChange}
              />
            </div>
          </div>
          <div className='h-[1px] bg-gray-100 dark:bg-zinc-600'></div>
          <div className='p-1'>
            <div
              className='flex items-center justify-between px-3 h-8 cursor-pointer rounded-md text-sm text-tgai-text-2 hover:text-[#D92D20] hover:bg-[#FEF3F2]'
              onClick={() => {
                onDelete()
                setOpen(false)
              }}
            >
              {t('common.operation.delete')}
              <ShortcutsName keys={['del']} />
            </div>
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default memo(Operator)
