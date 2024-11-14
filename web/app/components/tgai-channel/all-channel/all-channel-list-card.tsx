'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Link, Table, Typography } from '@arco-design/web-react'
import React, { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import { useShallow } from 'zustand/react/shallow'
import { ChannelDetailCard } from './channel-detail-card'
import { useAllChannelStore } from './store'
import type { TGAIAllChannelList } from '@/models/tgai-channel'
import { getTGAIAllChannelList } from '@/service/tgai'
import { Input } from '@arco-design/web-react';
import {AddChannelDbTemplate} from "@/app/components/tgai-channel/tgai-components/add-channel-db";

export const AllChannelListCard = () => {
  const [currentPage, setCurrentPage] = useState(1)

  const { channelDetailId, setChannelDetailId } = useAllChannelStore(useShallow(state => ({
    channelDetailId: state.channelDetailId,
    setChannelDetailId: state.setChannelDetailId,
  })))

  const { mutate } = useSWRConfig()

  const { data, isLoading } = useSWR([`/channel/all/${currentPage}`], () => getTGAIAllChannelList({
    current_page: currentPage,
    page_size: 25,
  }), { keepPreviousData: true })

  const columns: TableColumnProps<TGAIAllChannelList>[] = [
    {
      title: 'ID',
      dataIndex: 'channel_id',
    },
    {
      title: '群人数',
      dataIndex: 'participants_count',
    },
    {
      title: '群名',
      dataIndex: 'name',
    },
    {
      title: '群用户名',
      dataIndex: 'domain',
    },
    {
      title: '链接',
      dataIndex: 'link',
      render: (col: TGAIAllChannelList['link']) => <Link href={col}>{col}</Link>,
    },
    {
      title: '操作',
      render: (_col, item) => <Button type='outline' onClick={() => setChannelDetailId(item.channel_id)}>详情</Button>,
    },
  ]

  useEffect(() => {
    return () => setChannelDetailId()
  }, [])

  return <Card className={'px-4'}>
    {!channelDetailId && <>
      <div className="flex flex-row justify-between items-center">
        <Typography.Title heading={5}>全部群列表</Typography.Title>
        <Button type="primary" loading={isLoading} onClick={() => mutate([`/channel/all/${currentPage}`], undefined)}>刷新</Button>
      </div>
      <Divider/>
      <AddChannelDbTemplate fun={() => mutate([`/channel/all/${currentPage}`], undefined)}/>
      <Divider/>
      <Table size={'mini'} columns={columns} loading={isLoading} data={data ? data.data.channels : undefined} pagination={{
        current: currentPage,
        pageSize: 25,
        total: data?.data.total,
        onChange: pageNumber => setCurrentPage(pageNumber),
        showTotal: true
      }} rowKey={'channel_id'}/>
    </>}
    {channelDetailId && <ChannelDetailCard/>}
  </Card>
}
