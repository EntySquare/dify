import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import { useDebounceFn, useMount } from 'ahooks'
import { RiArrowDownSLine } from '@remixicon/react'
import { useStore as useLabelStore } from './store'
import cn from '../../../../utils/classnames'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '../../base/portal-to-follow-elem'
import SearchInput from '../../base/search-input'
import { Tag01, Tag03 } from '../../base/icons/src/vender/line/financeAndECommerce'
import { Check } from '../../base/icons/src/vender/line/general'
import { XCircle } from '../../base/icons/src/vender/solid/general'
import type { Label } from './constant'
import { fetchLabelList } from '../../../../service/tools'
import I18n from '../../../../context/i18n'
import { getLanguage } from '../../../../i18n/language'
import { useTGAIGlobalStore } from '@/context/tgai-global-context'
import { Theme } from '@/types/app'

type LabelFilterProps = {
  value: string[]
  onChange: (v: string[]) => void
}
const LabelFilter: FC<LabelFilterProps> = ({
  value,
  onChange,
}) => {
  const { t } = useTranslation()
  const { locale } = useContext(I18n)
  const language = getLanguage(locale)
  const [open, setOpen] = useState(false)

  const labelList = useLabelStore(s => s.labelList)
  const setLabelList = useLabelStore(s => s.setLabelList)

  const [keywords, setKeywords] = useState('')
  const [searchKeywords, setSearchKeywords] = useState('')
  const { run: handleSearch } = useDebounceFn(() => {
    setSearchKeywords(keywords)
  }, { wait: 500 })
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    handleSearch()
  }

  const filteredLabelList = useMemo(() => {
    return labelList.filter(label => label.name.includes(searchKeywords))
  }, [labelList, searchKeywords])

  const currentLabel = useMemo(() => {
    return labelList.find(label => label.name === value[0])
  }, [value, labelList])

  const selectLabel = (label: Label) => {
    if (value.includes(label.name))
      onChange(value.filter(v => v !== label.name))
    else
      onChange([...value, label.name])
  }

  useMount(() => {
    fetchLabelList().then((res) => {
      setLabelList(res)
    })
  })
  
  const theme = useTGAIGlobalStore(state=>state.theme)

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-start'
      offset={4}
    >
      <div className='relative'>
        <PortalToFollowElemTrigger
          onClick={() => setOpen(v => !v)}
          className='block'
        >
          <div className={cn(
            'flex items-center gap-1 px-2 h-8 rounded-lg border-[0.5px] border-transparent bg-gray-200 dark:bg-tgai-input-background cursor-pointer hover:bg-gray-300 dark:hover:bg-zinc-600 ',
            open && !value.length && '!bg-gray-300 dark:!bg-zinc-600 hover:bg-gray-300 dark:hover:bg-zinc-600',
            !open && !!value.length && '!bg-white/80 dark:!bg-tgai-input-background shadow-xs !border-black/5 hover:!bg-gray-200 dark:hover:!bg-tgai-input-background',
            open && !!value.length && '!bg-gray-200 dark:!bg-tgai-input-background !border-black/5 shadow-xs hover:!bg-gray-200 dark:hover:!bg-tgai-input-background',
          )}>
            <div className='p-[1px]'>
              <Tag01 className='h-3.5 w-3.5 text-tgai-text-2' />
            </div>
            <div className='text-[13px] leading-[18px] text-tgai-text-2'>
              {!value.length && t('common.tag.placeholder')}
              {!!value.length && currentLabel?.label[language]}
            </div>
            {value.length > 1 && (
              <div className='text-xs font-medium leading-[18px] text-tgai-text-2'>{`+${value.length - 1}`}</div>
            )}
            {!value.length && (
              <div className='p-[1px]'>
                <RiArrowDownSLine className='h-3.5 w-3.5 text-tgai-text-2' />
              </div>
            )}
            {!!value.length && (
              <div className='p-[1px] cursor-pointer group/clear' onClick={(e) => {
                e.stopPropagation()
                onChange([])
              }}>
                <XCircle className='h-3.5 w-3.5 text-tgai-text-2 group-hover/clear:text-tgai-text-2' />
              </div>
            )}
          </div>
        </PortalToFollowElemTrigger>
        <PortalToFollowElemContent className='z-[1002]'>
          <div className='relative w-[240px] bg-tgai-panel-background rounded-lg border-[0.5px] border-tgai-panel-border shadow-lg'>
            <div className='p-2 border-b-[0.5px] border-black/5'>
              <SearchInput white={theme === Theme.light} dark={theme === Theme.dark} value={keywords} onChange={handleKeywordsChange} />
            </div>
            <div className='p-1'>
              {filteredLabelList.map(label => (
                <div
                  key={label.name}
                  className='flex items-center gap-2 pl-3 py-[6px] pr-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-600'
                  onClick={() => selectLabel(label)}
                >
                  <div title={label.label[language]} className='grow text-sm text-tgai-text-2 leading-5 truncate'>{label.label[language]}</div>
                  {value.includes(label.name) && <Check className='shrink-0 w-4 h-4 text-tgai-primary' />}
                </div>
              ))}
              {!filteredLabelList.length && (
                <div className='p-3 flex flex-col items-center gap-1'>
                  <Tag03 className='h-6 w-6 text-tgai-text-2' />
                  <div className='text-tgai-text-2 text-xs leading-[14px]'>{t('common.tag.noTag')}</div>
                </div>
              )}
            </div>
          </div>
        </PortalToFollowElemContent>
      </div>
    </PortalToFollowElem>

  )
}

export default LabelFilter
