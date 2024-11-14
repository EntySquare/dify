import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiAddLine,
} from '@remixicon/react'
import { useSelectOrDelete, useTrigger } from '../../hooks'
import { UPDATE_DATASETS_EVENT_EMITTER } from '../../constants'
import type { Dataset } from './index'
import { DELETE_CONTEXT_BLOCK_COMMAND } from './index'
import { File05, Folder } from '../../../icons/src/vender/solid/files'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '../../../portal-to-follow-elem'
import { useEventEmitterContextContext } from '../../../../../../context/event-emitter'

type ContextBlockComponentProps = {
  nodeKey: string
  datasets?: Dataset[]
  onAddContext: () => void
  canNotAddContext?: boolean
}

const ContextBlockComponent: FC<ContextBlockComponentProps> = ({
  nodeKey,
  datasets = [],
  onAddContext,
  canNotAddContext,
}) => {
  const { t } = useTranslation()
  const [ref, isSelected] = useSelectOrDelete(nodeKey, DELETE_CONTEXT_BLOCK_COMMAND)
  const [triggerRef, open, setOpen] = useTrigger()
  const { eventEmitter } = useEventEmitterContextContext()
  const [localDatasets, setLocalDatasets] = useState<Dataset[]>(datasets)

  eventEmitter?.useSubscription((v: any) => {
    if (v?.type === UPDATE_DATASETS_EVENT_EMITTER)
      setLocalDatasets(v.payload)
  })

  return (
    <div className={`
      group inline-flex items-center pl-1 pr-0.5 h-6 border border-transparent bg-[#F4F3FF] text-[#6938EF] dark:text-tgai-primary rounded-[5px] hover:bg-[#EBE9FE] dark:hover:bg-neutral-500
      ${open ? 'bg-[#EBE9FE] dark:bg-neutral-500' : 'bg-[#F4F3FF] dark:bg-neutral-600'}
      ${isSelected && '!border-[#9B8AFB] dark:!border-tgai-primary-5'}
    `} ref={ref}>
      <File05 className='mr-1 w-[14px] h-[14px]' />
      <div className='mr-1 text-xs font-medium'>{t('common.promptEditor.context.item.title')}</div>
      {!canNotAddContext && (
        <PortalToFollowElem
          open={open}
          onOpenChange={setOpen}
          placement='bottom-end'
          offset={{
            mainAxis: 3,
            alignmentAxis: -147,
          }}
        >
          <PortalToFollowElemTrigger ref={triggerRef}>
            <div className={`
            flex items-center justify-center w-[18px] h-[18px] text-[11px] font-semibold rounded cursor-pointer
            ${open ? 'bg-[#6938EF] text-white dark:bg-tgai-primary' : 'bg-white/50 dark:bg-neutral-700/50 group-hover:bg-white dark:group-hover:bg-neutral-700 group-hover:shadow-xs dark:group-hover:shadow-stone-600'}
          `}>{localDatasets.length}</div>
          </PortalToFollowElemTrigger>
          <PortalToFollowElemContent style={{ zIndex: 100 }}>
            <div className='w-[360px] bg-white dark:bg-tgai-panel-background rounded-xl shadow-lg dark:shadow-stone-800'>
              <div className='p-4'>
                <div className='mb-2 text-xs font-medium text-tgai-text-3'>
                  {t('common.promptEditor.context.modal.title', { num: localDatasets.length })}
                </div>
                <div className='max-h-[270px] overflow-y-auto tgai-custom-scrollbar'>
                  {
                    localDatasets.map(dataset => (
                      <div key={dataset.id} className='flex items-center h-8'>
                        <div className='flex items-center justify-center shrink-0 mr-2 w-6 h-6 bg-[#F5F8FF] dark:bg-neutral-700 rounded-md border-[0.5px] border-[#EAECF5] dark:border-stone-600'>
                          <Folder className='w-4 h-4 text-[#444CE7] dark:text-tgai-primary' />
                        </div>
                        <div className='text-sm text-tgai-text-1 truncate' title=''>{dataset.name}</div>
                      </div>
                    ))
                  }
                </div>
                <div className='flex items-center h-8 text-tgai-primary cursor-pointer' onClick={onAddContext}>
                  <div className='shrink-0 flex justify-center items-center mr-2 w-6 h-6 rounded-md border-[0.5px] border-gray-100 dark:border-stone-600'>
                    <RiAddLine className='w-[14px] h-[14px]' />
                  </div>
                  <div className='text-[13px] font-medium' title=''>{t('common.promptEditor.context.modal.add')}</div>
                </div>
              </div>
              <div className='px-4 py-3 text-xs text-tgai-text-3 bg-gray-50 dark:bg-tgai-panel-background-3 border-t-[0.5px] border-gray-50 dark:border-stone-600 rounded-b-xl'>
                {t('common.promptEditor.context.modal.footer')}
              </div>
            </div>
          </PortalToFollowElemContent>
        </PortalToFollowElem>
      )}

    </div>
  )
}

export default ContextBlockComponent
