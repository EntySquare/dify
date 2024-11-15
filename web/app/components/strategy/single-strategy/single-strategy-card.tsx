'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Message, Table, Typography } from '@arco-design/web-react'
import { useMemo, useRef } from 'react'
import type { SingleStrategyEditModalRefType } from './single-strategy-edit-modal'
import { SingleStrategyEditModal } from './single-strategy-edit-modal'
import { TGAISingleStrategyFlag, type TGAISingleStrategy } from '@/models/tgai-strategy'
import useSWR, { useSWRConfig } from 'swr'
import { getActiveSingleTemplateList, getTGAIAllWorkflows, getTGAISingleStrategies } from '@/service/tgai'

const USED_SWR_KEY = ['/message/allListen', '/workflow/all', '/singleTemplate/getActiveSingleTemplateList']

export const SingleStrategyCard = () => {
  const { mutate } = useSWRConfig()
  const { data, isLoading } = useSWR(['/message/allListen'], getTGAISingleStrategies)
  const { data: workflowsData } = useSWR(['/workflow/all'], getTGAIAllWorkflows)
  const { data: activeSingleTemplates } = useSWR(['/singleTemplate/getActiveSingleTemplateList'], getActiveSingleTemplateList)

  const singleStrategyEditModalRef = useRef<SingleStrategyEditModalRefType>(null)

  const onEditClickHandler = async (data: TGAISingleStrategy) => {
    const result = await singleStrategyEditModalRef.current!.show(data)

    if (!result)
      return

    Message.success("修改单聊策略成功！")
    mutate((key: Array<string>) => USED_SWR_KEY.includes(key[0]))
  }

  const columns: TableColumnProps<TGAISingleStrategy>[] = [
    {
      title: '账号',
      dataIndex: 'phone',
    },
    {
      title: '监听状态',
      dataIndex: 'listen_state',
      render: (col) => col === '1' ? '开' : '关'
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
      render: (col) => col === TGAISingleStrategyFlag.TEMPLATE ? '模版' : '任务'
    },
    {
      title: '操作',
      render: (_col, item) => <Button type="outline" onClick={() => onEditClickHandler(item)}>修改</Button>,
    },
  ]

  const singleStrategies = useMemo(() => data ? data.data.map((item, index) => ({ key: index, ...item })) : undefined, [data])

  return <Card className={'px-4'}>
    <Typography.Title heading={5}>单聊策略</Typography.Title>
    <Divider />
    <Table columns={columns} data={singleStrategies} pagination={false} loading={isLoading} />
    <SingleStrategyEditModal
      ref={singleStrategyEditModalRef}
      workflowData={workflowsData ? workflowsData.data.workflow_array : undefined}
      singleTemplatesData={activeSingleTemplates ? activeSingleTemplates.data.single_template_list : undefined}
    />
  </Card>
}
