'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Message, Popconfirm, Table, Typography } from '@arco-design/web-react'
import { IconDelete, IconEdit, IconPlus } from '@arco-design/web-react/icon'
import useSWR, { useSWRConfig } from 'swr'
import { useCallback, useRef, useState } from 'react'
import type { InteractionStrategyEditModalRefType } from './interaction-strategy-edit-modal'
import { InteractionStrategyEditModal } from './interaction-strategy-edit-modal'
import { deleteGroupChatListen, getGroupChatListenList, getTGAIAllChannelList } from '@/service/tgai'

// 定义群聊监听数据类型
export type GroupChatListen = {
  id: number
  phone: string
  group_link: string
  monitor_content: string
  chat_purpose: string
  state: number
  start_time: string
  end_time: string
  group_domain: string
}

export const InteractionStrategyCard = () => {
  const { mutate } = useSWRConfig()
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 弹窗引用
  const interactionStrategyEditModalRef = useRef<InteractionStrategyEditModalRefType>(null)

  // 使用SWR获取频道列表
  const { data: channelsData } = useSWR(['/channel/all'], () => getTGAIAllChannelList({ current_page: 1, page_size: 100 }))

  // 使用SWR获取群聊监听列表
  const { data: groupChatData, isLoading } = useSWR(
    ['/groupChat/list', currentPage, pageSize],
    () => getGroupChatListenList(currentPage, pageSize),
  )

  // 获取频道列表数据 - 根据TGAIAllChannelListRes类型，channels应该在data.channels中
  const channelsList = channelsData?.data.channels || []

  // 获取群聊监听列表数据
  const groupChatList = groupChatData?.data.group_chat_listen_list || []
  const total = groupChatData?.data.total || 0

  // 删除群聊监听
  const onDeleteClick = useCallback(async (id: number) => {
    try {
      await deleteGroupChatListen(id)
      Message.success('删除成功！')
      mutate((key: Array<any>) => key[0] === '/groupChat/list')
    }
    catch (error) {
      console.error('删除失败:', error)
      Message.error('删除失败！')
    }
  }, [mutate])

  // 新增群聊监听
  const onCreateClick = async () => {
    try {
      const result = await interactionStrategyEditModalRef.current?.show()
      if (!result)
        return

      Message.success('创建成功！')
      mutate((key: Array<any>) => key[0] === '/groupChat/list')
    }
    catch (error) {
      console.error('打开新增弹窗失败:', error)
      Message.error('打开新增弹窗失败，请稍后重试')
    }
  }

  // 编辑群聊监听
  const onEditClick = async (data: GroupChatListen) => {
    try {
      console.log('onEditClick被调用，data:', data)
      if (interactionStrategyEditModalRef.current) {
        console.log('interactionStrategyEditModalRef.current存在，准备调用show方法')
        const result = await interactionStrategyEditModalRef.current.show(data)
        console.log('show方法返回结果:', result)
        if (!result)
          return

        Message.success('修改成功！')
        mutate((key: Array<any>) => key[0] === '/groupChat/list')
      }
      else {
        console.error('interactionStrategyEditModalRef.current不存在')
      }
    }
    catch (error) {
      console.error('打开编辑弹窗失败:', error)
      Message.error('打开编辑弹窗失败，请稍后重试')
    }
  }

  // 表格列定义
  const columns: TableColumnProps<GroupChatListen>[] = [
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 150,
    },
    // {
    //   title: '群ID',
    //   dataIndex: 'group_id',
    //   width: 120
    // },
    // {
    //   title: '群名称',
    //   dataIndex: 'group_id',
    //   width: 180,
    //   render: (group_id) => {
    //     // 使用正确的TGAIAllChannelList类型和字段名
    //     const channel = channelsList.find((channelItem: TGAIAllChannelList) => channelItem.channel_id === group_id)
    //     return channel ? channel.name : group_id
    //   },
    // },

    {
      title: '群聊id',
      dataIndex: 'group_id',
      width: 250,
    },
    {
      title: '群名称',
      dataIndex: 'group_name',
      width: 250,
    },
    {
      title: '群用户名',
      dataIndex: 'group_domain',
      width: 250,
    },
    {
      title: '群聊链接',
      dataIndex: 'group_link',
      width: 250,
    },
    {
      title: '监听内容',
      dataIndex: 'monitor_content',
      width: 250,
    },
    {
      title: '聊天目的',
      dataIndex: 'chat_purpose',
      width: 180,
    },
    {
      title: '每日开始时间',
      dataIndex: 'start_time',
      width: 150,
    },
    {
      title: '每日结束时间',
      dataIndex: 'end_time',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: 120,
      render: state => state === 1 ? '开启' : '关闭',
    },
    {
      title: '操作',
      width: 180,
      render: (_, item) => (
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            size="small"
            icon={<IconEdit />}
            onClick={() => onEditClick(item)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => onDeleteClick(item.id)}
          >
            <Button
              type="text"
              size="small"
              icon={<IconDelete />}
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <Card className={'px-4'}>
      <div className="flex items-center justify-between mb-4">
        <Typography.Title heading={5}>群聊互动</Typography.Title>
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={onCreateClick}
        >
          新增
        </Button>
      </div>

      <Table
        columns={columns}
        data={groupChatList}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (page, size) => {
            setCurrentPage(page)
            setPageSize(size)
          },
          showTotal: total => `共 ${total} 条`,
          // pageSizeOptions: [10, 20, 50, 100]
        }}
      />

      <InteractionStrategyEditModal
        ref={interactionStrategyEditModalRef}
        channelsList={channelsList}
      />
    </Card>
  )
}
