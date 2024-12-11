'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Message, Popconfirm, Table, Typography } from '@arco-design/web-react'
import { IconDelete, IconEdit } from '@arco-design/web-react/icon'
import { useCallback, useMemo, useRef, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import type { SingleStrategyEditModalRefType } from './single-strategy-edit-modal'
import { SingleStrategyEditModal } from './single-strategy-edit-modal'
import { type TGAISingleStrategy, TGAISingleStrategyFlag } from '@/models/tgai-strategy'
import {
  deleteTGAISingleStrategy,
  getActiveSingleTemplateList,
  getTGAIAllWorkflows,
  getTGAISingleStrategies,
} from '@/service/tgai'

const USED_SWR_KEY = ['/message/allListen', '/workflow/all', '/singleTemplate/getActiveSingleTemplateList']

export const SingleStrategyCard = () => {
  const { mutate } = useSWRConfig()
  const { data, isLoading } = useSWR(['/message/allListen'], getTGAISingleStrategies)
  const { data: workflowsData } = useSWR(['/workflow/all'], getTGAIAllWorkflows)
  const { data: activeSingleTemplates } = useSWR(['/singleTemplate/getActiveSingleTemplateList'], getActiveSingleTemplateList)
  const [isUpdating, setIsUpdating] = useState(false)

  const singleStrategyEditModalRef = useRef<SingleStrategyEditModalRefType>(null)

  const onEditClickHandler = async (data: TGAISingleStrategy) => {
    const result = await singleStrategyEditModalRef.current!.show(data)

    if (!result)
      return

    Message.success('修改单聊策略成功！')
    mutate((key: Array<string>) => USED_SWR_KEY.includes(key[0]))
  }

  const deleteSingleStrategy = useCallback(async (phone: string) => {
    if (isUpdating)
      return
    try {
      setIsUpdating(true)
      const res = await deleteTGAISingleStrategy(phone)
      mutate((key: Array<string>) => USED_SWR_KEY.includes(key[0]))
      Message.success('删除单聊策略成功！')
    }
    catch (_err) {

    }
    finally {
      setIsUpdating(false)
    }
  }, [isUpdating])

  const columns: TableColumnProps<TGAISingleStrategy>[] = [
    {
      title: '账号',
      dataIndex: 'phone',
    },
    {
      title: '监听状态',
      dataIndex: 'listen_state',
      render: col => col === '1' ? '开' : '关',
    },
    {
      title: '模版编号',
      dataIndex: 'smart_id',
    },
    {
      title: '模版名称',
      dataIndex: 'smart_name',
    },
    {
      title: '任务',
      dataIndex: 'workflow_name',
    },
    {
      title: '策略类型',
      dataIndex: 'flag',
      render: col => col === TGAISingleStrategyFlag.TEMPLATE ? '模版' : '任务',
    },
    {
      title: '操作',
      render: (_col, item) => <div className='flex items-center gap-2 flex-wrap'>
        <Button type="primary" onClick={() => onEditClickHandler(item)}>
          <IconEdit />修改
        </Button>
        <Popconfirm
          focusLock
          title='确认'
          content='确定要删除这条策略吗？'
          onOk={() => {
            return deleteSingleStrategy(item.phone)
          }}
        >
          <Button type='primary' status='danger'>
            <IconDelete />删除
          </Button>
        </Popconfirm>
      </div>,
    },
  ]

  const singleStrategies = useMemo(() => data ? data.data.map((item, index) => ({ key: index, ...item })) : undefined, [data])

  return <Card className={'px-4'}>
    <Typography.Title heading={5}>单聊策略</Typography.Title>
    <Divider />
    <Table columns={columns} data={singleStrategies} pagination={false} loading={isLoading || isUpdating} />
    <SingleStrategyEditModal
      ref={singleStrategyEditModalRef}
      workflowData={workflowsData ? workflowsData.data.workflow_array : undefined}
      singleTemplatesData={activeSingleTemplates ? activeSingleTemplates.data.single_template_list : undefined}
    />
  </Card>
}
