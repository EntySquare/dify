'use client'

import React, { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { RiErrorWarningLine } from '@remixicon/react'
import useSWR from 'swr'
import Input from '@/app/components/base/input'
import ListItem from '@/app/components/enty-chat/chat-side-panel/list-item'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import { getXAIDeviceList } from '@/service/xai'
import { DeviceInfoType, type KnowLedge } from '@/service/xai'
import cn from '@/utils/classnames'

type PersonalitySelectionProps = {
  data?: KnowLedge[]
}

const deviceInfoEnumNameMap: Record<DeviceInfoType, string> = {
  [DeviceInfoType.X]: 'X',
  [DeviceInfoType.INSTAGRAM]: 'Instagram',
  [DeviceInfoType.TRUTHSOCIAL]: 'TruthSocial',
  [DeviceInfoType.NOT_SET]: '',
}

const PersonalitySelection = React.memo<PersonalitySelectionProps>(({ data }) => {
  const [search, setSearch] = React.useState('')

  const { data: deviceListData } = useSWR(
    ['/adminApi/deviceList'],
    getXAIDeviceList,
  )

  const personalityAccountPlatformMap = useMemo(() => {
    if (!deviceListData)
      return {} as Record<string, DeviceInfoType>

    const res = deviceListData.data.device_list.reduce((pv, device) => {
      if (device.tweet_account_list.length > 0)
        pv[device.tweet_account_list[0].tweet_account] = device.info_type
      return pv
    }, {} as Record<string, DeviceInfoType>)

    return res
  }, [deviceListData])

  const {
    selectedPersonality,
    setSelectedPersonality,
    isChatStarted,
  } = useEntyAIChatStore(useShallow(state => ({
    selectedPersonality: state.selectedPersonality,
    setSelectedPersonality: state.setSelectedPersonality,
    isChatStarted: state.isChatStarted,
  })))

  const onItemClick = useCallback((knowledge: KnowLedge) => {
    if (isChatStarted)
      return
    if (selectedPersonality === knowledge.id)
      return

    setSelectedPersonality(knowledge.id)
  }, [selectedPersonality, isChatStarted])

  const searchFilterList = useMemo(() => {
    if (!data || data.length === 0)
      return []

    return data.filter(value => value.name.toLowerCase().includes(search.trim().toLowerCase()))
  }, [data, search])

  return <div className={'mt-3'}>
    {(!data || data.length === 0) && <div className={'text-tgai-text-2'}>没有 AI 人设</div>}
    {data && data.length > 0 && <div className={'flex flex-col gap-3'}>
      <div className={'flex gap-2'}>
        <Input value={search} showLeftIcon showClearIcon onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          disabled={isChatStarted}
        />
      </div>
      <div className={'flex flex-col gap-[6px]'}>
        {searchFilterList.length > 0
          ? searchFilterList.map(personality => <ListItem key={personality.id}
            text={personality.name}
            value={personality.id}
            type={'radio'}
            selected={selectedPersonality === personality.id}
            disabled={!personality.tweet_account}
            onClick={() => onItemClick(personality)}
          >
            <>
              <span className='truncate'>{personality.name}</span>
              {personality.tweet_account
                ? <span className={cn('text-xs truncate w-full')}>{personality.tweet_account}</span>
                : <span className={cn('text-xs flex flex-row flex-nowrap items-center truncate w-full')}><RiErrorWarningLine className='size-4 stroke-1' />未绑定账号</span>
              }
              {personality.tweet_account && personalityAccountPlatformMap[personality.tweet_account] !== undefined && <span className='truncate w-full font-semibold text-xs'>{deviceInfoEnumNameMap[personalityAccountPlatformMap[personality.tweet_account]]}</span>}
            </>
          </ListItem>)
          : <div className={'text-tgai-text-2'}>未找到匹配的人设</div>}
      </div>
    </div>}

  </div>
})

PersonalitySelection.displayName = 'PersonalitySelection'

export default PersonalitySelection
