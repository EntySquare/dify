'use client'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { OnFeaturesChange } from '../../types'
import ParamConfigContent from './param-config-content'
import cn from '../../../../../../utils/classnames'
import { Settings01 } from '../../../icons/src/vender/line/general'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '../../../portal-to-follow-elem'

type ParamsConfigProps = {
  onChange?: OnFeaturesChange
  disabled?: boolean
}
const ParamsConfig = ({
  onChange,
  disabled,
}: ParamsConfigProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-end'
      offset={{
        mainAxis: 4,
      }}
    >
      <PortalToFollowElemTrigger onClick={() => !disabled && setOpen(v => !v)}>
        <div className={cn('flex items-center rounded-md h-7 px-3 space-x-1 text-tgai-text-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-600', open && 'bg-gray-200 dark:bg-zinc-600')}>
          <Settings01 className='w-3.5 h-3.5 ' />
          <div className='ml-1 leading-[18px] text-xs font-medium '>{t('appDebug.voice.settings')}</div>
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent style={{ zIndex: 50 }}>
        <div className='w-80 sm:w-[412px] p-4 bg-tgai-panel-background rounded-lg border-[0.5px] border-gray-200 dark:border-stone-600 shadow-lg dark:shadow-stone-800 space-y-3'>
          <ParamConfigContent onChange={onChange} />
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}
export default memo(ParamsConfig)
