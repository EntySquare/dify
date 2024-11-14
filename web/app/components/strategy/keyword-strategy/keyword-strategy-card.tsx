'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, InputNumber, Message, Popconfirm, Switch, Table, Typography } from '@arco-design/web-react'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-react/icon'
import type { TGAIKeywordStrategy } from '@/models/tgai-strategy'
import useSWR, { useSWRConfig } from 'swr'
import { getTGAIKeywordStrategyList, getTGAILoggedAccount, getTGAIKwStrategyAllInterval, getTGAIGroupList, setTGAIKwStrategyAllInterval, setTGAIKwStrategyFlag, deleteTGAIKwStrategy, getTGAIAllWorkflows } from '@/service/tgai'
import { useCallback, useRef, useState } from 'react'
import { KeywordStrategyEditModal, KeywordStrategyEditModalRefType } from './keyword-strategy-edit-modal'

function GroupTriggerIntervalSetter() {

  const [triggerInterval, setTriggerInterval] = useState(0)

  const { mutate } = useSWRConfig()
  useSWR(['/keyValues/get'], getTGAIKwStrategyAllInterval, {
    onSuccess: (data) => {
      if (data) setTriggerInterval(data.data.group_trigger_interval_minute)
    }
  })


  const [isUpdating, setIsUpdating] = useState(false)

  const updateGroupTriggerInterval = async () => {
    if (isUpdating || Number.isNaN(triggerInterval) || triggerInterval < 0) return
    try {
      setIsUpdating(true)
      await setTGAIKwStrategyAllInterval(triggerInterval)
      Message.success(`设置频率成功！当前频率为: ${triggerInterval} 分钟。`)
      mutate(['/keyValues/get'])
    } catch (_err) {
    } finally {
      setIsUpdating(false)
    }
  }

  return <div className='flex items-center'>每个群的频率：<InputNumber hideControl min={1} suffix={'分钟'} placeholder='输入分钟' className={'!w-[150px]'} value={triggerInterval} onChange={(value) => setTriggerInterval(value)} /><Button type='primary' loading={isUpdating} onClick={updateGroupTriggerInterval}>保存</Button></div>
}

export const KeywordStrategyCard = () => {
  const keywordStrategyEditModalRef = useRef<KeywordStrategyEditModalRefType>(null)

  const { mutate } = useSWRConfig()
  const { data: loggedUserData } = useSWR(['/account/hasLogged'], getTGAILoggedAccount)
  const { data: keywordData, isLoading } = useSWR(['/groupTrigger/list'], () => getTGAIKeywordStrategyList())
  const { data: workflowsData } = useSWR(['/workflow/all'], getTGAIAllWorkflows)
  
  const onEditClickHandler = async (data: TGAIKeywordStrategy) => {
    if (!loggedUserData) return

    const result = await keywordStrategyEditModalRef.current!.show(data)

    if (!result)
      return

    Message.success(result)
    mutate((key: Array<string>) => key[0] === '/groupTrigger/list' || key[0] === '/account/hasLogged')
  }

  const onCreateClickHandler = async () => {
    if (!loggedUserData) return

    const result = await keywordStrategyEditModalRef.current!.show()

    if (!result)
      return
    
    Message.success(result)
    mutate((key: Array<string>) => key[0] === '/groupTrigger/list' || key[0] === '/account/hasLogged')
  }

  const updateKwStrategyFlag = useCallback(async (id: number, flag: number) => {
    try {
      await setTGAIKwStrategyFlag(id, flag)
      Message.success("更改生效状态成功！")
      mutate(['/groupTrigger/list'])

    } catch (_err) {
    }
  }, [])

  const deleteKwStrategy = useCallback(async (id: number) => {
    try {
      await deleteTGAIKwStrategy(id)
      Message.success("删除策略成功！")
      mutate(['/groupTrigger/list'])
    } catch (_err) {
    }
  }, [])

  const columns: TableColumnProps<TGAIKeywordStrategy>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户手机号',
      dataIndex: 'phone',
    },
    {
      title: '群名',
      dataIndex: 'group_name',
    },
    {
      title: '关键字',
      dataIndex: 'keyword',
    },
    // {
    //   title: '回复',
    //   dataIndex: 'reply',
    // },
    {
      title: '命中次数',
      dataIndex: 'hit_count',

    },
    {
      title: '回复次数',
      dataIndex: 'reply_count',
    },
    {
      title: '是否生效',
      dataIndex: 'flag',
      render: (col, item) => <Popconfirm
        focusLock
        title='确认'
        content={col === 0 ? '是否设置本策略状态为生效？' : '是否设置本策略状态为未生效？'}
        onOk={() => {
          const flag = item.flag === 1 ? 0 : 1
          return updateKwStrategyFlag(item.id, flag)
        }
        }
      > <Switch checkedText='生效' uncheckedText='未生效' checked={col === 1} /></Popconfirm >,
    },
    {
      title: '操作',
      render: (_col, item) => <div className='flex items-center gap-2'>
        <Button type='primary' onClick={() => onEditClickHandler(item)}><IconEdit />修改</Button>
        <Popconfirm
          focusLock
          title='确认'
          content='确定要删除这条策略吗？'
          onOk={() => {
            return deleteKwStrategy(item.id)
          }}
        >
          <Button type='primary' status='danger'><IconDelete />删除</Button></Popconfirm>

      </div>,
    },
  ]

  return <Card className={'px-4'}>
    <Typography.Title heading={5}>策略（关键字触发）</Typography.Title>
    <Divider />
    <div className='flex flex-row items-center gap-16'>
      <Button type='primary' onClick={onCreateClickHandler}><IconPlus />新增关键字触发</Button>
      <GroupTriggerIntervalSetter />
    </div>

    <Divider />
    <Table columns={columns} data={keywordData ? keywordData.data : undefined} pagination={false} rowKey={'id'} loading={isLoading} />
    {loggedUserData && <KeywordStrategyEditModal ref={keywordStrategyEditModalRef} loggedAccount={loggedUserData.data} workflowData={workflowsData ? workflowsData.data.workflow_array : undefined} />}
  </Card>
}
