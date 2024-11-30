'use client'

import React, { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import ListItem from '@/app/components/enty-chat/chat-side-panel/list-item'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'

type XAccountSelectionProps = {
  data?: string[]
}

export const XAccountSelection = React.memo<XAccountSelectionProps>(({ data }) => {
  const [search, setSearch] = React.useState('')

  const { selectedAccounts, setSelectedAccounts } = useEntyAIChatStore(useShallow(state => ({ selectedAccounts: state.selectedAccounts, setSelectedAccounts: state.setSelectedAccounts })))

  const onItemClick = useCallback((item: string) => {
    const set = new Set(selectedAccounts)

    if (set.has(item))
      set.delete(item)
    else set.add(item)

    setSelectedAccounts([...set])
  }, [selectedAccounts])

  const searchFilterList = useMemo(() => {
    if (!data || data.length === 0)
      return []

    return data.filter(value => value.toLowerCase().includes(search.trim().toLowerCase()))
  }, [data, search])

  const allSelected = data ? data.length === selectedAccounts.length : false

  const onSelectAllClick = () => {
    if (!data)
      return
    allSelected ? setSelectedAccounts([]) : setSelectedAccounts([...data])
  }

  return <div className={'mt-3'}>
    { (!data || data.length === 0) && <div className={'text-tgai-text-2'}>没有已登录的 X 账号</div> }
    {data && data.length > 0 && searchFilterList && <div className={'flex flex-col gap-3'}>
      <div className={'flex gap-2'}>
        <Input value={search} showLeftIcon showClearIcon onChange={e => setSearch(e.target.value)} onClear={() => setSearch('')} />
        <Button onClick={() => onSelectAllClick()}>{allSelected ? '清空' : '全选'}</Button>
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
