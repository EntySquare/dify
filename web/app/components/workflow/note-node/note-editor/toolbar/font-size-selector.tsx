import { memo } from 'react'
import { RiFontSize } from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import { useFontSize } from './hooks'
import cn from '../../../../../../utils/classnames'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '../../../../base/portal-to-follow-elem'
import { Check } from '../../../../base/icons/src/vender/line/general'

const FontSizeSelector = () => {
  const { t } = useTranslation()
  const FONT_SIZE_LIST = [
    {
      key: '12px',
      value: t('workflow.nodes.note.editor.small'),
    },
    {
      key: '14px',
      value: t('workflow.nodes.note.editor.medium'),
    },
    {
      key: '16px',
      value: t('workflow.nodes.note.editor.large'),
    },
  ]
  const {
    fontSizeSelectorShow,
    handleOpenFontSizeSelector,
    fontSize,
    handleFontSize,
  } = useFontSize()

  return (
    <PortalToFollowElem
      open={fontSizeSelectorShow}
      onOpenChange={handleOpenFontSizeSelector}
      placement='bottom-start'
      offset={2}
    >
      <PortalToFollowElemTrigger onClick={() => handleOpenFontSizeSelector(!fontSizeSelectorShow)}>
        <div className={cn(
          'flex items-center pl-2 pr-1.5 h-8 rounded-md text-[13px] font-medium text-tgai-text-3 dark:hover:text-tgai-text-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-600',
          fontSizeSelectorShow && 'bg-gray-50 dark:bg-zinc-600 dark:text-tgai-text-1',
        )}>
          <RiFontSize className='mr-1 w-4 h-4' />
          {FONT_SIZE_LIST.find(font => font.key === fontSize)?.value || t('workflow.nodes.note.editor.small')}
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent>
        <div className='p-1 w-[120px] bg-white dark:bg-tgai-panel-background-3 border-[0.5px] border-gray-200 dark:border-stone-600 rounded-md shadow-xl text-tgai-text-2 dark:shadow-stone-800'>
          {
            FONT_SIZE_LIST.map(font => (
              <div
                key={font.key}
                className='flex items-center justify-between pl-3 pr-2 h-8 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-600'
                onClick={(e) => {
                  e.stopPropagation()
                  handleFontSize(font.key)
                  handleOpenFontSizeSelector(false)
                }}
              >
                <div
                  style={{ fontSize: font.key }}
                >
                  {font.value}
                </div>
                {
                  fontSize === font.key && (
                    <Check className='w-4 h-4 text-tgai-primary-5' />
                  )
                }
              </div>
            ))
          }
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default memo(FontSizeSelector)
