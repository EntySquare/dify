'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Message, Popconfirm, Switch, Table, Tooltip, Typography } from '@arco-design/web-react'
import { IconDelete, IconEdit, IconPause, IconPlayArrow, IconPlus } from '@arco-design/web-react/icon'
import useSWR, { useSWRConfig } from 'swr'
import { useCallback, useRef } from 'react'
import type { AxiosError } from 'axios'
import type { GroupStrategyEditModalRefType } from './group-strategy-edit-modal'
import { GroupStrategyEditModal } from './group-strategy-edit-modal'
import type { TGAIGroupStrategy } from '@/models/tgai-strategy'
import { deleteTGAIGroupStrategy, getActiveGroupTemplateList, getTGAIChannelSets, getTGAIGroupStrategies, getTGAILoggedAccount, runTGAIGroupStrategy, runTGAIGroupStrategyOnce, stopTGAIGroupStrategy, updateTGAIGroupStrategyAutoDeleteStatus } from '@/service/tgai'

const SWR_KEYS = ['/plan/getActivePlan', '/template/getActiveTemplateList', '/account/hasLogged', '/channel/getAllSet']

export const GroupStrategyCard = () => {
  const { mutate } = useSWRConfig()
  const { data: groupStrategies, isLoading } = useSWR(['/plan/getActivePlan'], getTGAIGroupStrategies)
  const { data: groupTemplates } = useSWR(['/template/getActiveTemplateList'], getActiveGroupTemplateList)
  const { data: accountLists } = useSWR(['/account/hasLogged'], getTGAILoggedAccount)
  const { data: channel_sets_lists } = useSWR(['/channel/getAllSet'], getTGAIChannelSets)

  const groupStrategyEditModalRef = useRef<GroupStrategyEditModalRefType>(null)

  const onChangeAutoDeleteStatusClick = useCallback(async (id: number) => {
    try {
      await updateTGAIGroupStrategyAutoDeleteStatus(id)
      Message.success('更改策略自动删除状态成功！')
      mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
    }
    catch (_err) {
    }
  }, [])

  const onDeleteGroupStrategyClick = useCallback(async (id: number) => {
    try {
      await deleteTGAIGroupStrategy(id)
      Message.success('删除群聊策略成功！')
      mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
    }
    catch (_err) {
    }
  }, [])

  const onChangeGroupStrategyClick = useCallback(async (id: number, currentRunning: 0 | 1) => {
    const awaitRun = currentRunning === 0
    try {
      awaitRun ? await runTGAIGroupStrategy(id) : await stopTGAIGroupStrategy(id)
      Message.success(awaitRun ? '启动群聊策略成功！' : '停止群聊策略成功！')
      mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
    }
    catch (_err) {
    }
  }, [])

  const onRunGroupStrategyOnceClick = useCallback(async (id: number) => {
    try {
      await runTGAIGroupStrategyOnce(id)
      Message.success('执行群聊策略一次成功！')
      mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
    }
    catch (_err) {
    }
  }, [])

  const onCreateClickHandler = async () => {
    const result = await groupStrategyEditModalRef.current!.show()
    if (!result)
      return

    Message.success("创建群聊策略成功！")
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
  }

  const onEditClickHandler = async (data: TGAIGroupStrategy) => {
    const result = await groupStrategyEditModalRef.current!.show(data)

    if (!result)
      return

    Message.success("修改群聊策略成功！")
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
  }

  const columns: TableColumnProps<TGAIGroupStrategy>[] = [
    {
      title: '序号',
      render: (_col, item, index) => index + 1,
    },
    {
      title: '策略名',
      dataIndex: 'name',
    },
    {
      title: '模版昵称',
      dataIndex: 'template_name',
    },
    {
      title: '群总数',
      dataIndex: 'channel_sets_list',
      render: (col: TGAIGroupStrategy['channel_sets_list']) => col.length,
    },
    {
      title: '间隔时间',
      dataIndex: 'interval',
      render: (col: TGAIGroupStrategy['interval']) => `${col.toString()}秒`,
    },
    {
      title: '执行时间',
      dataIndex: 'active_time_list',
      render: (col: TGAIGroupStrategy['active_time_list']) => {
 
        return <div className='max-w-[300px]'>{col ? col.map(time => `${time.toString()}时`).join('，') : ''}</div>
      },
    },
    {
      title: '历史条数',
      dataIndex: 'chat_count',
    },
    {
      title: '触发热度',
      dataIndex: 'heat_trigger',
    }, {
      title: '运行次数',
      dataIndex: 'run_times',
    },
    {
      title: '自动删除消息',
      dataIndex: 'auto_delete',
      render: (col, item) => <Popconfirm
        focusLock
        title='确认'
        content={col === 0 ? '是否开启自动删除消息？' : '是否关闭自动删除消息？'}
        onOk={() => onChangeAutoDeleteStatusClick(item.id)}
      ><Tooltip content='开启时，将会在每次执行策略前删除对应群内相关账号过去发送的所有消息。'><Switch checkedText='开' uncheckedText='关' checked={col === 1} /></Tooltip></Popconfirm>,
    },
    {
      title: '是否生效',
      dataIndex: 'is_running',
      render: (col, item) => <Popconfirm
        focusLock
        title='确认'
        content={col === 0 ? '确定要启动这条策略吗？' : '确定要停止这条策略吗？'}
        onOk={() => onChangeGroupStrategyClick(item.id, col)}
      ><Button type='text' className={'size-full cursor-pointer flex justify-center items-center !text-xl'} >{col === 0 ? <IconPlayArrow /> : <IconPause />}</Button></Popconfirm>,
    },
    {
      title: '操作',
      render: (_col, item) => <div className='flex items-center justify-center gap-2'>
        <Popconfirm
          focusLock
          title='确认'
          content='确定要立即执行本策略一次吗？'
          onOk={() => onRunGroupStrategyOnceClick(item.id)}
        >
          <Button type='primary'>立即执行</Button>
        </Popconfirm>
        <Button type='primary' onClick={() => onEditClickHandler(item)}><IconEdit />修改</Button>
        <Popconfirm
          focusLock
          title='确认'
          content='确定要删除这条策略吗？'
          onOk={() => onDeleteGroupStrategyClick(item.id)}
        >
          <Button type='primary' status='danger'><IconDelete />删除</Button></Popconfirm>

      </div>,
    },
  ]

  return <Card className={'px-4'}>
    <Typography.Title heading={5}>群聊策略</Typography.Title>
    <Divider />
    <Button type='primary' onClick={onCreateClickHandler}><IconPlus />创建群聊策略</Button>
    <Divider />
    <Table columns={columns} data={groupStrategies ? groupStrategies.data.plan_list : undefined} pagination={false} loading={isLoading} rowKey={'id'} />
    <GroupStrategyEditModal ref={groupStrategyEditModalRef} groupTemplatesList={groupTemplates?.data.template_list} loggedAccountList={accountLists?.data} channelSetsList={channel_sets_lists?.data.channel_sets} />
  </Card>
}
