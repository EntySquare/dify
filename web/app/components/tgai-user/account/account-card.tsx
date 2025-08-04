'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Message,
  Modal,
  Popconfirm,
  Popover, Table, Typography,
} from '@arco-design/web-react'
import { IconCheckCircle } from '@arco-design/web-react/icon'
import useSWR, { useSWRConfig } from 'swr'
import { useState } from 'react'
import {
  addTGAIAccount,
  deleteTGAIAccount,
  getTGAIAllAccount,
  sendTGAIAccountLoginCode,
  signinTGAccountWithCode,
  updateRemarkAccount,
} from '@/service/tgai'
import { type TGAIAccount, TGAIAccountIsStartEnum } from '@/models/tgai-user'

export const AccountCard = () => {
  const [inputPhone, setInputPhone] = useState('')
  const [inputRemaks, setInputRemaks] = useState('')
  const [actionState, setActionState] = useState<Set<string>>(new Set())
  const [awaitSignin, setAwaitSignin] = useState<{
    phone: string | undefined
    code: string | undefined
    code_hash: string | undefined
  }>({
    phone: undefined,
    code: undefined,
    code_hash: undefined,
  })
  const [openedPopover, setOpenedPopover] = useState<string | undefined>()

  const { mutate } = useSWRConfig()
  const { data: allAccountData, isLoading } = useSWR(
    ['/account/all'],
    getTGAIAllAccount,
  )
  const FormItem = Form.Item
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [phoneID, setPhoneID] = useState('')
  const formItemLayout = {
    // labelCol: {
    //   span: 4,
    // },
    // wrapperCol: {
    //   span: 20,
    // },
  }
  const onAddAccountClickHandler = async () => {
    if (!inputPhone) {
      Message.warning('请先输入手机号！')
      return
    }
    try {
      await addTGAIAccount(inputPhone)
      setInputPhone('')
      Message.success('新增成功！')
    }
    catch (err) {
    }
    finally {
      mutate(['/account/all'])
    }
  }

  const onSendCodeClickHandler = async (phone: string) => {
    if (actionState.has(phone))
      return

    try {
      setActionState(prev => new Set(prev.add(phone)))
      const res = await sendTGAIAccountLoginCode(phone)
      setAwaitSignin(prev => ({
        ...prev,
        code_hash: res.data.code_hash,
        phone,
      }))
      Message.success('验证码发送成功！')
    }
    catch (err) {
      setAwaitSignin({
        phone: undefined,
        code: '',
        code_hash: undefined,
      })
    }
    finally {
      setActionState((prev) => {
        prev.delete(phone)
        return new Set(prev)
      })
    }
  }

  const onSigninClickHandler = async (clickedPhone: string) => {
    if (actionState.has(clickedPhone))
      return

    const { code, code_hash, phone } = awaitSignin
    if (!code) {
      Message.warning('请输入验证码！')
      return
    }

    if (!code_hash || !phone || phone !== clickedPhone) {
      Message.error('未知原因丢失登录凭证，请重新发送验证码！')
      setAwaitSignin({
        phone: undefined,
        code: '',
        code_hash: undefined,
      })
      return
    }

    try {
      setActionState(prev => new Set(prev.add(clickedPhone)))
      const res = await signinTGAccountWithCode({
        code_hash,
        code,
        phone,
      })
      Message.success('登录成功！')
      setAwaitSignin({
        phone: undefined,
        code: '',
        code_hash: undefined,
      })
      setOpenedPopover(undefined)
    }
    catch (err) {
    }
    finally {
      mutate(['/account/all'])
      setActionState((prev) => {
        prev.delete(clickedPhone)
        return new Set(prev)
      })
    }
  }

  const onDeleteClickHandler = async (phone: string) => {
    try {
      setActionState(prev => new Set(prev.add(phone)))
      await deleteTGAIAccount(phone)
      Message.success('账号删除成功！')
    }
    catch (err) {
    }
    finally {
      mutate(['/account/all'])
      setActionState((prev) => {
        prev.delete(phone)
        return new Set(prev)
      })
    }
  }
  const openRemark = async (item: TGAIAccount) => {
    setVisible(true)
    setPhoneID(item.phone)
    console.log(phoneID)
  }
  const onOkRemark = async () => {
    try {
      setConfirmLoading(true)
      const res = await updateRemarkAccount(inputRemaks, phoneID)
      Message.success('Success')
      setConfirmLoading(false)
      setVisible(false)
    }
    catch (err) {
      setConfirmLoading(false)
    }
    finally {
      mutate(['/account/all'])
      setVisible(false)
      setInputRemaks('')
    }
  }
  const columns: TableColumnProps<TGAIAccount>[] = [
    {
      title: '手机号(包含区号)',
      dataIndex: 'phone',
    },
    {
      title: '用户名',
      dataIndex: 'name',
      render: (_col, item) => {
        return <div>{item.name || '-'}</div>
      },
    },
    {
      title: 'ID',
      dataIndex: 'user_id',
      render: (_col, item) => {
        return <div>{item.user_id || '-'}</div>
      },
    },
    {
      title: 'AccessHash',
      dataIndex: 'access_hash',
      render: (_col, item) => {
        return <div>{item.access_hash || '-'}</div>
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (_col, item) => {
        return <div>{item.remark || '-'}</div>
      },
    },
    {
      title: '启动状态',
      dataIndex: 'is_start',
      render: (col) => {
        const disabled
          = col === TGAIAccountIsStartEnum.IS_SIGNINED
          || col === TGAIAccountIsStartEnum.IS_STARTED
        let text
        let status
        if (col === TGAIAccountIsStartEnum.IS_STARTED) {
          text = '已启动'
        }
        else if (col === TGAIAccountIsStartEnum.IS_SIGNINED) {
          text = '已登录'
          status = 'success' as const
        }
        else {
          text = '点击启动'
        }
        return (
          <Button type="text" disabled={disabled} status={status}>
            {text}
          </Button>
        )
      },
    },
    {
      title: '设备在线状态',
      render: (_col, item) => {
        return item.device_online === '0'
          ? (
            <Button type="text" disabled style={{ color: '#aaa' }}>
            未知
            </Button>
          )
          : item.device_online === '1'
            ? (
              <Button type="text" disabled status="danger">
            离线
              </Button>
            )
            : item.device_online === '2'
              ? (
                <Button type="text" disabled status="success">
            在线
                </Button>
              )
              : null
      },
    },
    {
      title: '操作',
      render: (_col, item) => (
        <div className="flex flex-row flex-wrap gap-2">
          <Button onClick={() => onSendCodeClickHandler(item.phone)}>
            发送验证码
          </Button>
          <Button onClick={() => openRemark(item)}>
            备注
          </Button>
          <Popover
            trigger="click"
            title="输入验证码"
            popupVisible={
              openedPopover === item.phone
              && openedPopover === awaitSignin.phone
            }
            onVisibleChange={(value) => {
              if (value) {
                setOpenedPopover(item.phone)
              }
              else {
                setOpenedPopover(undefined)
                setAwaitSignin(prev => ({ ...prev, code: '' }))
              }
            }}
            content={
              <div className="flex flex-row">
                <Input
                  placeholder="输入验证码"
                  value={awaitSignin.code}
                  onChange={value =>
                    setAwaitSignin(prev => ({ ...prev, code: value }))
                  }
                />
                <Button
                  onClick={() => onSigninClickHandler(item.phone)}
                  loading={actionState.has(item.phone)}
                >
                  确认
                </Button>
              </div>
            }
            disabled={
              awaitSignin.phone !== item.phone || !awaitSignin.code_hash
            }
          >
            <Button
              disabled={
                awaitSignin.phone !== item.phone || !awaitSignin.code_hash
              }
            >
              登录
            </Button>
          </Popover>
          <Popconfirm
            focusLock
            title="确认"
            content={'确认要删除此账号？'}
            onOk={() => {
              if (actionState.has(item.phone))
                return
              return onDeleteClickHandler(item.phone)
            }}
          >
            <Button status="danger">删除</Button>
          </Popconfirm>
        </div>
      ),
    },
  ]

  return (
    <Card className={'px-4'}>
      <Typography.Title heading={5}>账号信息</Typography.Title>
      <Divider />
      <div className="flex flex-row gap-8 items-center">
        <Input
          value={inputPhone}
          onChange={setInputPhone}
          placeholder="手机号(包含区号)"
          className={'max-w-[350px]'}
        />
        <Popconfirm
          focusLock
          title="确认"
          content={'确认添加此手机号？'}
          onOk={() => onAddAccountClickHandler()}
        >
          <Button type="primary">
            <IconCheckCircle />
            新增
          </Button>
        </Popconfirm>
      </div>
      <Divider />
      <Table
        columns={columns}
        data={allAccountData ? allAccountData.data : undefined}
        pagination={false}
        rowKey={'phone'}
        loading={isLoading || actionState.size > 0}
      />
      <Modal
        title='Add remark'
        visible={visible}
        onOk={onOkRemark}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}>
        <Form
          form={form}
        >
          <FormItem label='备注'>
            <Input placeholder='' value={inputRemaks} onChange={setInputRemaks} />
          </FormItem>
        </Form>
      </Modal>
    </Card >

  )
}
