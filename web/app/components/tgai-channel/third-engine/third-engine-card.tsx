'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Input, Link, Message, Select, Spin, Table, Tooltip, Typography } from '@arco-design/web-react'
import { IconExport, IconMinusCircle, IconPlusCircle, IconRefresh, IconSearch } from '@arco-design/web-react/icon'
import useSWR from 'swr'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useTGAIWebSocket } from '../../http/tgai-ws-provider'
import { useThirdEngineStore } from './store'
import { checkAccountInChannel, getTGAIEngineSearchChannel, getTGAILoggedAccount, letAccountJoinChannel, letAccountLeaveChannel } from '@/service/tgai'
import { TGAIAccountJoinedChannelFlag, type ThirdEngineSearchResItem } from '@/models/tgai-channel'

type ThirdEngineActionPanelProps = {}

const ThirdEngineActionPanel = (props: ThirdEngineActionPanelProps) => {
  const [keyword, setKeyword] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<string>()
  const { send } = useTGAIWebSocket()

  const { searchParams, setSearchParams, actionLoading } = useThirdEngineStore(useShallow(state => ({
    searchParams: state.searchParams,
    setSearchParams: state.setSearchParams,
    actionLoading: state.actionLoading,
  })))

  const { data: searchChannelRes, isLoading: isSearching } = useSWR(searchParams ? [`/engine/third/${searchParams.keyword}/${searchParams.phone}`] : null, searchParams ? () => getTGAIEngineSearchChannel(searchParams.keyword, searchParams.phone) : null)

  const { data: loggedAccount } = useSWR(['/account/hasLogged'], getTGAILoggedAccount)

  const accountOptions = useMemo(() => loggedAccount
    ? loggedAccount.data.map(item => ({
      value: item.phone,
      label: item.phone,
    }))
    : undefined, [loggedAccount])

  const onAccountSelectHandler = (value: string) => {
    setSearchParams()
    setSelectedAccount(value)
  }
  const onSearchClickHandler = () => {
    if (!keyword) {
      Message.error('请先输入关键词！')
      return
    }
    if (!selectedAccount) {
      Message.error('请先选择一个账户！')
      return
    }

    setSearchParams({
      keyword,
      phone: selectedAccount,
    })
  }

  const onResetClickHandler = () => {
    setSearchParams()
    setKeyword('')
    setSelectedAccount(undefined)
  }

  const onExportClickHandler = useCallback(() => {
    if (!searchChannelRes || searchChannelRes.data.search_res_list.length === 0) {
      Message.error('当前无数据！')
      return
    }
    const data = searchChannelRes.data.search_res_list
    const _headers = Object.keys(data[0]).map(item => item.includes(',') ? `"${item}"` : item)

    let csv = `${_headers.join(',')}\n`
    data.forEach((item) => {
      const arr: (string | number)[] = []
      for (const key in item) {
        const a = key as keyof typeof item
        arr.push(item[a].includes(',') ? `"${item[a]}"` : item[a])
      }
      csv += arr.join(',')
      csv += '\n'
    })

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `查询结果-${Date.now()}.csv`

    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
  }, [searchChannelRes])

  const onJoinAllClick = () => {
    if (!searchChannelRes || searchChannelRes.data.search_res_list.length === 0) {
      Message.info('没有可以尝试加入的群组！')
      return
    }
    if (!searchParams || !searchParams.phone) {
      Message.info('必须先选择要加入群组的账号！')
      return
    }

    const req = {
      types: 'join',
      phone: searchParams.phone,
      channel_names: searchChannelRes.data.search_res_list.map(item => item.domain),
    }

    const res = send(JSON.stringify(req))
    res === 'start' && Message.warning('正在请求批量操作加入,请稍等!')
  }

  const onLeaveAllClick = () => {
    if (!searchChannelRes || searchChannelRes.data.search_res_list.length === 0) {
      Message.info('没有可以尝试退出的群组！')
      return
    }
    if (!searchParams || !searchParams.phone) {
      Message.info('必须先选择要退出群组的账号！')
      return
    }

    const req = {
      types: 'leave',
      phone: searchParams.phone,
      channel_names: searchChannelRes.data.search_res_list.map(item => item.domain),
    }

    const res = send(JSON.stringify(req))
    res === 'start' && Message.warning('正在请求批量操作退出,请稍等!')
  }

  useEffect(() => {
    return () => setSearchParams()
  }, [])

  return <div className='flex flex-row gap-x-4 items-center'>
    <Input className={'max-w-[350px]'} placeholder='关键词' value={keyword} onChange={value => setKeyword(value.trim())} disabled={isSearching} />
    <Select className={'max-w-[350px]'} placeholder='选择用户' options={accountOptions} onChange={value => onAccountSelectHandler(value)} value={selectedAccount} disabled={isSearching}></Select>
    <Button type='primary' loading={isSearching} onClick={onSearchClickHandler}><IconSearch />搜索</Button>
    <Button onClick={onResetClickHandler}><IconRefresh />重置</Button>
    <Button type='primary' onClick={onExportClickHandler} disabled={isSearching}><IconExport />导出</Button>
    <Tooltip content={'当操作一键加入时,请勿刷新。'}><Button type='primary' disabled={isSearching || actionLoading.size > 0} onClick={onJoinAllClick}>一键加入</Button></Tooltip>
    <Tooltip content={'当操作一键退出时,请勿刷新。'}><Button type='primary' disabled={isSearching || actionLoading.size > 0} onClick={onLeaveAllClick}>一键退出</Button></Tooltip>
    {/* <IconNotification /> */}
  </div>
}

export const ThirdEngineCard = () => {
  const { searchParams, actionLoading, setActionLoading } = useThirdEngineStore(useShallow(state => ({
    searchParams: state.searchParams,
    actionLoading: state.actionLoading,
    setActionLoading: state.setActionLoading,
  })))

  const { awaitResponse } = useTGAIWebSocket()

  const { data: searchChannelRes, isLoading } = useSWR(searchParams ? [`/engine/third/${searchParams.keyword}/${searchParams.phone}`] : null, searchParams ? () => getTGAIEngineSearchChannel(searchParams.keyword, searchParams.phone) : null)

  //  checkAccountInChannel

  const onActionClickHandler = useCallback(async (channel_name: string, channel_link: string, mode: 'join' | 'exit' = 'join') => {
    if (!searchParams)
      return
    try {
      setActionLoading(new Set(actionLoading.add(channel_name)))
      const checkRes = await checkAccountInChannel(channel_name, searchParams.phone)
      if (mode === 'join') {
        if (checkRes.data.join_flag === TGAIAccountJoinedChannelFlag.JOINED) {
          Message.info('选中的账号已加入该群组！')
          return
        }
        await letAccountJoinChannel(channel_link, searchParams.phone)
        Message.success('加入群组成功！')
      }
      else {
        if (checkRes.data.join_flag === TGAIAccountJoinedChannelFlag.NOT_JOINED) {
          Message.info('选中的账号未加入该群组！')
          return
        }
        await letAccountLeaveChannel(channel_link, searchParams.phone)
        Message.success('退出群组成功！')
      }
    }
    catch (err) {

    }
    finally {
      actionLoading.delete(channel_name)
      setActionLoading(
        new Set(actionLoading),
      )
    }
  }, [searchParams])

  const columns: TableColumnProps<ThirdEngineSearchResItem>[] = [
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '群域名',
      dataIndex: 'domain',
    },
    {
      title: '链接',
      dataIndex: 'link',
      render: (col: ThirdEngineSearchResItem['link']) => <Link href={col}>{col}</Link>,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '人数',
      dataIndex: 'members',
      render: col => <pre>{col}</pre>,
    },
    {
      title: '操作',
      render: (_col, item) => <div className='flex gap-1 flex-row flex-wrap'>
        <Button onClick={() => onActionClickHandler(item.domain, item.link)} loading={actionLoading.has(item.domain)} ><IconPlusCircle />点击加入</Button>
        <Button onClick={() => onActionClickHandler(item.domain, item.link, 'exit')} loading={actionLoading.has(item.domain)} ><IconMinusCircle />点击退出</Button>
      </div>,
    },
  ]

  useEffect(() => {
    return () => setActionLoading(new Set())
  }, [])

  return <Spin
    loading={awaitResponse}
    style={{ display: 'block', marginTop: 8 }}
    tip={'操作进行中！请耐心等待！'}
  >
    <Card className={'px-4'}>
      <Typography.Title heading={5}>爬虫搜索</Typography.Title>
      <Divider />
      <ThirdEngineActionPanel />
      <Divider />
      <Table columns={columns} data={searchChannelRes ? searchChannelRes.data.search_res_list : undefined} pagination={false} rowKey={'link'} loading={isLoading} />
    </Card>
  </Spin>
}
