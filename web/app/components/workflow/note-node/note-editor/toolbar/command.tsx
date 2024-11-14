import {
  memo,
  useMemo,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiBold,
  RiItalic,
  RiLink,
  RiListUnordered,
  RiStrikethrough,
} from '@remixicon/react'
import { useStore } from '../store'
import { useCommand } from './hooks'
import cn from '../../../../../../utils/classnames'
import TooltipPlus from '../../../../base/tooltip-plus'

type CommandProps = {
  type: 'bold' | 'italic' | 'strikethrough' | 'link' | 'bullet'
}
const Command = ({
  type,
}: CommandProps) => {
  const { t } = useTranslation()
  const selectedIsBold = useStore(s => s.selectedIsBold)
  const selectedIsItalic = useStore(s => s.selectedIsItalic)
  const selectedIsStrikeThrough = useStore(s => s.selectedIsStrikeThrough)
  const selectedIsLink = useStore(s => s.selectedIsLink)
  const selectedIsBullet = useStore(s => s.selectedIsBullet)
  const { handleCommand } = useCommand()

  const icon = useMemo(() => {
    switch (type) {
      case 'bold':
        return <RiBold className={cn('w-4 h-4', selectedIsBold && 'text-tgai-primary')} />
      case 'italic':
        return <RiItalic className={cn('w-4 h-4', selectedIsItalic && 'text-tgai-primary')} />
      case 'strikethrough':
        return <RiStrikethrough className={cn('w-4 h-4', selectedIsStrikeThrough && 'text-tgai-primary')} />
      case 'link':
        return <RiLink className={cn('w-4 h-4', selectedIsLink && 'text-tgai-primary')} />
      case 'bullet':
        return <RiListUnordered className={cn('w-4 h-4', selectedIsBullet && 'text-tgai-primary')} />
    }
  }, [type, selectedIsBold, selectedIsItalic, selectedIsStrikeThrough, selectedIsLink, selectedIsBullet])

  const tip = useMemo(() => {
    switch (type) {
      case 'bold':
        return t('workflow.nodes.note.editor.bold')
      case 'italic':
        return t('workflow.nodes.note.editor.italic')
      case 'strikethrough':
        return t('workflow.nodes.note.editor.strikethrough')
      case 'link':
        return t('workflow.nodes.note.editor.link')
      case 'bullet':
        return t('workflow.nodes.note.editor.bulletList')
    }
  }, [type, t])

  return (
    <TooltipPlus popupContent={tip}>
      <div
        className={cn(
          'flex items-center justify-center w-8 h-8 cursor-pointer rounded-md text-tgai-text-3 hover:text-tgai-text-1 hover:bg-black/5 dark:hover:bg-zinc-600',
          type === 'bold' && selectedIsBold && 'bg-primary-50 dark:bg-zinc-600',
          type === 'italic' && selectedIsItalic && 'bg-primary-50 dark:bg-zinc-600',
          type === 'strikethrough' && selectedIsStrikeThrough && 'bg-primary-50 dark:bg-zinc-600',
          type === 'link' && selectedIsLink && 'bg-primary-50 dark:bg-zinc-600',
          type === 'bullet' && selectedIsBullet && 'bg-primary-50 dark:bg-zinc-600',
        )}
        onClick={() => handleCommand(type)}
      >
        {icon}
      </div>
    </TooltipPlus>
  )
}

export default memo(Command)
