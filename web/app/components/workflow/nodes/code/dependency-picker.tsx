import type { FC } from 'react'
import React, { useCallback, useState } from 'react'
import { t } from 'i18next'
import {
  RiArrowDownSLine,
  RiSearchLine,
} from '@remixicon/react'
import type { CodeDependency } from './types'
import { PortalToFollowElem, PortalToFollowElemContent, PortalToFollowElemTrigger } from '../../../base/portal-to-follow-elem'
import { Check } from '../../../base/icons/src/vender/line/general'
import { XCircle } from '../../../base/icons/src/vender/solid/general'

type Props = {
  value: CodeDependency
  available_dependencies: CodeDependency[]
  onChange: (dependency: CodeDependency) => void
}

const DependencyPicker: FC<Props> = ({
  available_dependencies,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState('')

  const handleChange = useCallback((dependency: CodeDependency) => {
    return () => {
      setOpen(false)
      onChange(dependency)
    }
  }, [onChange])

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-start'
      offset={4}
    >
      <PortalToFollowElemTrigger onClick={() => setOpen(!open)} className='flex-grow cursor-pointer'>
        <div className='flex items-center h-8 justify-between px-2.5 rounded-lg border-0 bg-gray-100 dark:bg-tgai-input-background text-tgai-text-1 text-[13px]'>
          <div className='grow w-0 truncate' title={value.name}>{value.name}</div>
          <RiArrowDownSLine className='shrink-0 w-3.5 h-3.5 text-tgai-text-2' />
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent style={{
        zIndex: 100,
      }}>
        <div className='p-1 bg-tgai-panel-background rounded-lg shadow-sm dark:shadow-stone-800 dark:border dark:border-stone-600' style={{
          width: 350,
        }}>
          <div
            className='shadow-sm bg-white mb-2 mx-1 flex items-center px-2 rounded-lg bg-gray-100 dark:bg-tgai-input-background'
          >
            <RiSearchLine className='shrink-0 ml-[1px] mr-[5px] w-3.5 h-3.5 text-tgai-text-3' />
            <input
              value={searchText}
              className='grow px-0.5 py-[7px] text-[13px] text-tgai-text-2 bg-transparent appearance-none outline-none caret-tgai-primary placeholder:text-gray-400'
              placeholder={t('workflow.nodes.code.searchDependencies') || ''}
              onChange={e => setSearchText(e.target.value)}
              autoFocus
            />
            {
              searchText && (
                <div
                  className='flex items-center justify-center ml-[5px] w-[18px] h-[18px] cursor-pointer'
                  onClick={() => setSearchText('')}
                >
                  <XCircle className='w-[14px] h-[14px] text-tgai-text-3' />
                </div>
              )
            }
          </div>
          <div className='max-h-[30vh] overflow-y-auto tgai-custom-scrollbar'>
            {available_dependencies.filter((v) => {
              if (!searchText)
                return true
              return v.name.toLowerCase().includes(searchText.toLowerCase())
            }).map(dependency => (
              <div
                key={dependency.name}
                className='flex items-center h-[30px] justify-between pl-3 pr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-tgai-text-1 text-[13px] cursor-pointer'
                onClick={handleChange(dependency)}
              >
                <div className='w-0 grow truncate'>{dependency.name}</div>
                {dependency.name === value.name && <Check className='shrink-0 w-4 h-4 text-tgai-primary' />}
              </div>
            ))}
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

export default React.memo(DependencyPicker)
