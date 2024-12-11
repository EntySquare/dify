'use client'

import React, { useMemo, useRef, useState } from 'react'
import type { TableColumnProps } from '@arco-design/web-react'
import {
  Button,
  Card,
  Divider,
  Link,
  Message,
  Popconfirm,
  Space,
  Switch,
  Table,
  Typography,
} from '@arco-design/web-react'

import useSWR, { useSWRConfig } from 'swr'
import { IconDelete } from '@arco-design/web-react/icon'
import CreateHuoxuanModal from './create-huoxuan-modal'
import type { CreateHuoxuanModalRefType } from './create-huoxuan-modal'
import { executeOnceHuoxuanTask, getHuoXuanList, getXAIAllWorkflows, switchHuoxuanTaskState } from '@/service/xai'
import { describeCronToCN } from '@/utils/cron'
import type { HuoXuanListItem } from '@/models/xai-huoxuan'
import { HuoXuanListItemState, HuoXuanListItemType } from '@/models/xai-huoxuan'

type HuoXuanContainerProps = {
  huoxuanType: HuoXuanListItemType
}

const SWR_KEYS = [
  '/adminApi/huoXuan/list',
  '/workflow/all',
]

const HuoXuanContainer = React.memo<HuoXuanContainerProps>(({ huoxuanType }) => {
  const [onExecutingTaskList, setOnExecutingTaskList] = useState<Set<number>>(new Set())

  const { mutate } = useSWRConfig()
  const { data: huoXuanList, isLoading } = useSWR(
    ['/adminApi/huoXuan/list'],
    getHuoXuanList,
  )
  const { data: workflows, isLoading: isWorkflowListLoading } = useSWR(['/workflow/all'], getXAIAllWorkflows)

  const taskList = useMemo(() => {
    return huoXuanList ? huoXuanList.data[huoxuanType] : undefined
  }, [huoXuanList, huoxuanType])

  const CreateHuoxuanModalRef = useRef<CreateHuoxuanModalRefType>(null)

  const onAddTaskClickHandler = async () => {
    const result = await CreateHuoxuanModalRef.current!.show()
    if (!result)
      return
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
  }

  const onSwitchTaskClick = async (id: number, state: HuoXuanListItemState) => {
    if (onExecutingTaskList.has(id))
      return
    try {
      setOnExecutingTaskList((prev) => {
        prev.add(id)
        return new Set(prev)
      })
      await switchHuoxuanTaskState({ id, state })
      Message.success('更改任务状态成功！')
      mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
    }
    catch (_err) {
    }
    finally {
      setOnExecutingTaskList((prev) => {
        prev.delete(id)
        return new Set(prev)
      })
    }
  }

  const onExecuteOnceClick = async (id: number) => {
    if (onExecutingTaskList.has(id))
      return

    try {
      setOnExecutingTaskList((prev) => {
        prev.add(id)
        return new Set(prev)
      })
      await executeOnceHuoxuanTask(id)
      Message.success('成功执行一次任务！')
      mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
    }
    catch (_err) {

    }
    finally {
      setOnExecutingTaskList((prev) => {
        prev.delete(id)
        return new Set(prev)
      })
    }
  }

  const onDeleteTaskClick = async (id: number) => {
    if (onExecutingTaskList.has(id))
      return

    try {
      setOnExecutingTaskList((prev) => {
        prev.add(id)
        return new Set(prev)
      })
      await switchHuoxuanTaskState({ id, state: HuoXuanListItemState.DELETE })
      Message.success('删除任务成功！')
      mutate((key: Array<string>) => SWR_KEYS.includes(key[0]))
    }
    catch (_err) {
    }
    finally {
      setOnExecutingTaskList((prev) => {
        prev.delete(id)
        return new Set(prev)
      })
    }
  }

  const columns: TableColumnProps<HuoXuanListItem>[] = [
    {
      title: '推文链接',
      render: (_col, item) => <Link href={item.tweet_url}>{item.tweet_url}</Link>,
    },
    {
      title: '推广内容',
      render: (_col, item) => <div>{item.content}</div>,
    },
    {
      title: '工作流',
      render: (_col, item) => {
        const workflow = workflows ? workflows.data.workflow_array.find(wfList => wfList.workflow_id === item.workflow_id) : undefined

        return <div>{workflow ? workflow.workflow_name : ''}</div>
      },
    },
    {
      title: '执行间隔',
      render: (_col, item) => {
        const cron_human_text = describeCronToCN(item.cron_spec)

        return <div>{cron_human_text ?? ''}</div>
      },
    },
    {
      title: '任务类型',
      render: (_col, item) => <div>{huoxuanType === HuoXuanListItemType.HUO ? '火推' : '宣推'}</div>,
    },
    {
      title: '状态切换',
      dataIndex: 'state',
      render: (col, item) => {
        return <Popconfirm
          focusLock
          title='确认'
          content={col === 0 ? '是否设置本任务状态为已启动？' : '是否设置本任务状态为未启动？'}
          onOk={() => {
            const state = item.state === HuoXuanListItemState.ACTIVATE ? 0 : 1
            return onSwitchTaskClick(item.ID, state)
          }
          }
        > <Switch checkedText='已启动' uncheckedText='未启动' checked={col === HuoXuanListItemState.ACTIVATE} loading={onExecutingTaskList.has(item.ID)} />
        </Popconfirm >
      },
    },
    {
      title: '操作',
      render: (_col, item) => (
        <div>
          <div className="flex items-center justify-start gap-2 my-2 flex-wrap">
            <Button
              type="primary"
              onClick={() => onExecuteOnceClick(item.ID)}
              loading={onExecutingTaskList.has(item.ID)}
            >
              执行一次
            </Button>
            <Popconfirm
              focusLock
              title='确认'
              content={`确定要删除此${huoxuanType === HuoXuanListItemType.HUO ? '火推' : '宣推'}任务吗？`}
              onOk={() => {
                return onDeleteTaskClick(item.ID)
              }}
            >
              <Button type='primary' status='danger' loading={onExecutingTaskList.has(item.ID)}><IconDelete />删除</Button></Popconfirm>
          </div>
        </div>
      ),
    },
  ]

  return (
    <Card className={'px-4'}>
      <Typography.Title heading={5}>
        {huoxuanType === HuoXuanListItemType.HUO ? '火推' : '宣推'}
        <span className='text-sm opacity-50 ml-1'>
          {huoxuanType === HuoXuanListItemType.HUO ? '炒火任意推文' : '去其他推文下推广自己的内容'}
        </span>
      </Typography.Title>
      <Divider />
      <Space direction="vertical">
        <div>
          <Space>
            <Button type="outline" size="small" onClick={onAddTaskClickHandler}>
              发布{huoxuanType === HuoXuanListItemType.HUO ? '火推' : '宣推'}
            </Button>
          </Space>
        </div>
      </Space>
      <Divider />
      <Table
        columns={columns}
        data={taskList}
        pagination={false}
        loading={isLoading}
        rowKey={'ID'}
      />
      <CreateHuoxuanModal createType={huoxuanType} ref={CreateHuoxuanModalRef} />
    </Card>
  )
})

HuoXuanContainer.displayName = 'HuoXuanContainer'

export default HuoXuanContainer
