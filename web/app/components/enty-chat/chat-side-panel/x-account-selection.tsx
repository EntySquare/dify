'use client'

import React, { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { EntyServiceType, useTGAIGlobalStore } from '@/context/tgai-global-context'
import ListItem from '@/app/components/enty-chat/chat-side-panel/list-item'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'

type XAccountSelectionProps = {
  data?: string[]
}

export const XAccountSelection = React.memo<XAccountSelectionProps>(({ data }) => {
  const [search, setSearch] = React.useState('')

  const { selectedAccounts, setSelectedAccounts, isChatStarted } = useEntyAIChatStore(useShallow(state => ({ selectedAccounts: state.selectedAccounts, setSelectedAccounts: state.setSelectedAccounts, isChatStarted: state.isChatStarted })))

  const serviceType = useTGAIGlobalStore(state => state.serviceType)

  const onItemClick = useCallback((item: string) => {
    if (isChatStarted)
      return

    const set = new Set(selectedAccounts)

    if (set.has(item))
      set.delete(item)
    else set.add(item)

    setSelectedAccounts([...set])
  }, [selectedAccounts, isChatStarted])

  const searchFilterList = useMemo(() => {
    if (!data || data.length === 0)
      return []

    return data.filter(value => value.toLowerCase().includes(search.trim().toLowerCase()))
  }, [data, search])

  const allSelected = data ? data.length === selectedAccounts.length : false

  const onSelectAllClick = () => {
    if (isChatStarted)
      return
    if (!data)
      return
    allSelected ? setSelectedAccounts([]) : setSelectedAccounts([...data])
  }

  const serviceText = useMemo(() => {
    switch (serviceType) {
      case EntyServiceType.X: {
        return 'X'
      }
      case EntyServiceType.INSTAGRAM: {
        return 'Instagram'
      }
      case EntyServiceType.TRUTH_SOCIAL: {
        return 'Truth Social'
      }
      default:
        return 'X'
    }
  }, [serviceType])

  return <div className={'mt-3'}>
    {(!data || data.length === 0) && <div className={'text-tgai-text-2'}>没有已登录的 {serviceText} 账号</div>}
    {data && data.length > 0 && searchFilterList && <div className={'flex flex-col gap-3'}>
      <div className={'flex gap-2'}>
        <Input value={search} showLeftIcon showClearIcon onChange={e => setSearch(e.target.value)} onClear={() => setSearch('')} disabled={isChatStarted} />
        <Button onClick={() => onSelectAllClick()} disabled={isChatStarted}>{allSelected ? '清空' : '全选'}</Button>
      </div>
      <div className={'flex flex-col gap-[6px]'}>
        {searchFilterList.length > 0
          ? searchFilterList.map((account, index) => <ListItem
            key={`${account}-${index}`} text={account} value={account} selected={selectedAccounts.includes(account)}
            onClick={() => onItemClick(account)}
          />)
          : <div className={'text-tgai-text-2'}>未找到匹配的账号</div>}
      </div>
      {selectedAccounts.length > 0 && <span className={'text-tgai-text-3 text-xs'}>{`已选中 ${selectedAccounts.length} 个账号`}</span>}
    </div>}
  </div>
})

XAccountSelection.displayName = 'XAccountSelection'

export default XAccountSelection
