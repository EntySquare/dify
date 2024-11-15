'use client'

import { clearTGAIAccountChatHistory, DeletedMessage, getTGAIJoinedChannelList, getTGAILoggedAccount } from '@/service/tgai'
import { Button, Card, Divider, Form, Message, Select, Typography } from '@arco-design/web-react'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

const FormItem = Form.Item

const test_messages = [
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-11 12:00:38"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-11 07:33:16"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-11 07:30:53"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-11 07:22:17"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-11 07:21:27"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-11 07:04:08"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-11 06:22:35"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-11 05:59:27"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-10 14:13:53"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-10 14:10:26"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-10 13:54:46"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-10 13:31:19"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-10 13:27:49"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-10 13:08:55"
  },
  {
    "phone": "447463143237",
    "channel_name": "AIPAY Group",
    "channel_id": 0,
    "message_string": "hi,hello",
    "date": "2024-09-10 07:58:52"
  }
]


export const ClearHistoryCard = () => {

  const [isCleaning, setIsCleaning] = useState(false)
  const [clearHistory, setClearHistory] = useState<DeletedMessage[]>([])

  const [form] = Form.useForm<{
    phone: string,
    channel_id: number
    days: number
  }>()

  const selectedAccount: string | undefined = Form.useWatch('phone', form as any)

  const { data: loggedAccountData } = useSWR(
    ['/account/hasLogged'],
    getTGAILoggedAccount,
  )

  const { data: joinedChannelData, isLoading: joinedChannelDataLoading } = useSWR(selectedAccount ? [`/channel/list/${selectedAccount}`] : null, selectedAccount ? () => getTGAIJoinedChannelList(selectedAccount) : null)

  const accountOptions = useMemo(() => loggedAccountData ? loggedAccountData.data.map(account => ({
    value: account.phone,
    label: account.phone
  })) : undefined, [loggedAccountData])

  const joinedChannelOptions = useMemo(() => joinedChannelData ? joinedChannelData.data.map(channel => ({
    value: channel.channel_id,
    label: channel.channel_title
  })) : undefined, [joinedChannelData])

  const onConfirmCleaningClickHandler = async () => {
    if (isCleaning) return
    const { channel_id, phone, days } = form.getFields()

    if (!phone) {
      Message.warning("请选择要清除记录的账号！")
      return
    }

    if (!channel_id) {
      Message.warning("请选择要清除记录的群组！")
      return
    }

    if (days === undefined) {
      Message.warning("请选择要清除记录的时间范围！")
      return
    }

    try {
      setIsCleaning(true)
      setClearHistory([])
      const res = await clearTGAIAccountChatHistory({
        phone,
        channel_id,
        days
      })
      if (res.data.deleted_message_list === null || res.data.deleted_message_list.length === 0) {
        Message.info("无可删除的消息！")
      } else {
        res.data.deleted_message_list.forEach((message, index) => setTimeout(() => {
          setClearHistory(prev => [message, ...prev])
        }, index * 500))
      }
    } catch (err) {
    } finally {
      setIsCleaning(false)
    }

  }

  useEffect(() => {
    form.resetFields('channel_id')
  }, [selectedAccount])

  return <Card className={'px-4'}>
    <Typography.Title heading={5}>清除聊天记录</Typography.Title>
    <Divider />
    <div className="flex flex-col gap-4">
      <Typography.Title heading={6}>清除有关账户群组聊天记录</Typography.Title>
      <Form className={'flex flex-col items-center justify-center'} form={form}>
        <FormItem label='选择账户' field='phone' labelAlign='left'>
          <Select
            placeholder='选择账户'
            options={accountOptions}
            allowClear
            disabled={isCleaning}
          />
        </FormItem>
        <FormItem label='选择群组' field='channel_id' labelAlign='left'>
          <Select
            placeholder='选择群组'
            loading={joinedChannelDataLoading}
            disabled={!selectedAccount || isCleaning}
            options={joinedChannelOptions}
          />
        </FormItem>
        <FormItem label='信息时间' field='days' labelAlign='left'>
          <Select
            placeholder='选择时间范围'
            disabled={isCleaning}
            options={[
              {
                label: '一天',
                value: 1,
              },
              {
                label: '一周',
                value: 7,
              },
              {
                label: '一月',
                value: 30,
              },
              {
                label: '全部',
                value: 0
              }
            ]}
          />
        </FormItem>
        <FormItem wrapperCol={{ span: 24 }} className={'text-center'}>
          <Button
            loading={isCleaning}
            onClick={onConfirmCleaningClickHandler}
            type='primary'
            className={'mt-4'}
          >
            确认执行
          </Button>
        </FormItem>
      </Form>
      <Typography.Title heading={6}>清除聊天记录</Typography.Title>
      <div className="bg-slate-800 text-white text-md px-2 py-3 flex flex-col gap-1">
        {clearHistory.length === 0 && <div className='text-center'>暂无删除记录</div>}
        {clearHistory.length > 0 && clearHistory.map((message, index) => <div key={index}>清除成功: 群={message.channel_name},账号={
          message.phone
        },日期:{message.date},信息:{message.message_string})</div>)}
      </div>
    </div>
  </Card>
}
