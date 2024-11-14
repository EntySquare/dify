'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Link, Message, Select, Table, Typography } from '@arco-design/web-react'
import { IconSearch } from '@arco-design/web-react/icon'
import useSWR, { useSWRConfig } from 'swr'
import { useCallback, useMemo, useRef, useState } from 'react'
import { ContactSendMsgModal, type ContactSendMsgModalRefType } from './contact-send-msg-modal'
import type { SendTGAIContactMsgReq } from '@/service/tgai'
import { getTGAILoggedAccount, getTGAIUserContancts } from '@/service/tgai'
import type { TGAccountRes } from '@/models/tgai-user'

export const ContactsCard = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>()

  const contactSendMsgModalRef = useRef<ContactSendMsgModalRefType>(null)

  const { mutate } = useSWRConfig()
  const { data: loggedUserData } = useSWR(['/account/hasLogged'], getTGAILoggedAccount)
  const { data: contactResData, isLoading } = useSWR(selectedAccount ? [`/contact/list/${selectedAccount}`] : null, selectedAccount ? () => getTGAIUserContancts(selectedAccount) : null)

  const accountOptions = useMemo(() => loggedUserData
    ? loggedUserData.data.map(item => ({
      label: item.phone,
      value: item.phone,
    }))
    : undefined, [loggedUserData])

  const onSearchClickHandler = useCallback(() => {
    if (!selectedAccount)
      Message.warning('请先选择账号！')

    mutate([`/contact/list/${selectedAccount}`])
  }, [selectedAccount])

  const onSendMsgClickHandler = async (data: Omit<SendTGAIContactMsgReq, 'input'>) => {
    const result = await contactSendMsgModalRef.current!.show(data)

    if (!result)
      return

    Message.success('信息发送成功！')
  }

  const columns: TableColumnProps<TGAccountRes>[] = [
    {
      title: '序号',
      dataIndex: 'number',
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '名字',
      dataIndex: 'first_name',
    },
    {
      title: '姓氏',
      dataIndex: 'last_name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      render: col => col ? '是' : '否',
    },
    {
      title: '互为联系人',
      dataIndex: 'mutual_contact',
      render: col => col ? '是' : '否',
    },
    {
      title: '机器人',
      dataIndex: 'bot',
      render: col => col ? '是' : '否',
    },
    {
      title: '链接',
      dataIndex: 'link',
      render: (col: TGAccountRes['link']) => <Link href={col}>{col}</Link>,
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      render: (_col, item) => <Button type='primary' onClick={() => {
        if (!selectedAccount)
          return
        onSendMsgClickHandler({
          phone: item.phone,
          domain: item.username,
          link: item.link,
          sender: selectedAccount,
        })
      }}> 发送消息</Button>,
    },
  ]

  return <Card className={'px-4'}>
    <Typography.Title heading={5}>群聊模版</Typography.Title>
    <Divider />
    <div className='flex flex-row gap-8 items-center'>
      <Select className={'max-w-[350px]'} placeholder='选择用户' options={accountOptions} value={selectedAccount} onChange={value => setSelectedAccount(value)}/>
      <Button type='primary' onClick={onSearchClickHandler}><IconSearch />查询</Button>
    </div>
    <Divider />
    <Table columns={columns} data={contactResData ? contactResData.data.contact_res_list : undefined} pagination={false} rowKey={'id'} loading={isLoading}/>
    <ContactSendMsgModal ref={contactSendMsgModalRef} />
  </Card>
}
