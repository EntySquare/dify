'use client'

import React, { useCallback, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Input from '@/app/components/base/input'
import ListItem from '@/app/components/enty-chat/chat-side-panel/list-item'
import { useEntyAIChatStore } from '@/app/components/enty-chat/store'
import type { KnowLedge } from '@/service/xai'

type PersonalitySelectionProps = {
  data?: KnowLedge[]
}

const PersonalitySelection = React.memo<PersonalitySelectionProps>(({ data }) => {
  const [search, setSearch] = React.useState('')

  const { selectedPersonality, setSelectedPersonality } = useEntyAIChatStore(useShallow(state => ({ selectedPersonality: state.selectedPersonality, setSelectedPersonality: state.setSelectedPersonality })))

  const onItemClick = useCallback((item: string) => {
    if (selectedPersonality === item)
      return

    setSelectedPersonality(item)
  }, [selectedPersonality])

  const searchFilterList = useMemo(() => {
    if (!data || data.length === 0)
      return []

    return data.filter(value => value.name.toLowerCase().includes(search.trim().toLowerCase()))
  }, [data, search])

  return <div className={'mt-3'}>
    { (!data || data.length === 0) && <div className={'text-tgai-text-2'}>没有 AI 人设</div> }
    { data && data.length > 0 && <div className={'flex flex-col gap-3'}>
      <div className={'flex gap-2'}>
        <Input value={search} showLeftIcon showClearIcon onChange={e => setSearch(e.target.value)}
          onClear={() => setSearch('')}
        />
      </div>
      <div className={'flex flex-col gap-[6px]'}>
        {searchFilterList.length > 0
          ? searchFilterList.map(personality => <ListItem key={personality.id}
            text={personality.name}
            value={personality.id}
            type={'radio'}
            selected={selectedPersonality === personality.id}
            onClick={() => onItemClick(personality.id)}
          />)
          : <div className={'text-tgai-text-2'}>未找到匹配的人设</div>}
      </div>
    </div> }

  </div>
})

PersonalitySelection.displayName = 'PersonalitySelection'

export default PersonalitySelection
