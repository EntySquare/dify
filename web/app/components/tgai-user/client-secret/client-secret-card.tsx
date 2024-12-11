'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Input, Message, Popconfirm, Table, Typography } from '@arco-design/web-react'
import { IconCheckCircle, IconDelete } from '@arco-design/web-react/icon'
import useSWR, { useSWRConfig } from 'swr'
import { useCallback, useMemo, useState } from 'react'
import { deleteTGAITokenConfig, getTGAITokenConfig, setTGAITokenConfig } from '@/service/tgai'
import type { TGAITokenConfig } from '@/models/tgai-user'

export const ClientSecretCard = () => {
  const [inputPhone, setInputPhone] = useState('')
  const [appId, setAppId] = useState('')
  const [appHash, setAppHash] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const { mutate } = useSWRConfig()
  const { data: configData, isLoading } = useSWR(['/config/all'], getTGAITokenConfig)

  const onConfigConfirmClickHandler = async () => {
    if (isUpdating)
      return

    if (!inputPhone) {
      Message.warning('请输入手机号！')
      return
    }
    if (!appId) {
      Message.warning('请输入 App ID')
      return
    }
    if (!appHash) {
      Message.warning('请输入 App Hash！')
      return
    }

    try {
      setIsUpdating(true)
      const res = await setTGAITokenConfig({
        phone: inputPhone,
        appId,
        appHash,
      })
      mutate(['/config/all'])
      Message.success('添加密钥配置成功！')
    }
    catch (err) {

    }
    finally {
      setIsUpdating(false)
    }
  }

  const canDeleteConfig = useMemo(() => {
    return configData ? configData.data && configData.data.conf_data && configData.data.conf_data.length > 1 : false
  }, [configData])

  const deleteSecretConfig = useCallback(async (app_id: string) => {
    if (isUpdating || !canDeleteConfig)
      return
    try {
      const res = await deleteTGAITokenConfig(app_id)
      mutate(['/config/all'])
      Message.success('删除密钥配置成功！')
    }
    catch (_err) {
    }
    finally {
      setIsUpdating(false)
    }
  }, [isUpdating, canDeleteConfig])

  const columns: TableColumnProps<TGAITokenConfig>[] = [
    {
      title: '手机号(包含区号)',
      dataIndex: 'phone',
    },
    {
      title: 'App ID',
      dataIndex: 'appId',
    },
    {
      title: 'App Hash',
      dataIndex: 'appHash',
    },
    {
      title: '操作',
      render: (_col, item) => <div className='flex items-center gap-2 flex-wrap'>
        {canDeleteConfig && <Popconfirm
          focusLock
          title='确认'
          content='确定要删除这条策略吗？'
          onOk={() => {
            return deleteSecretConfig(item.appId)
          }}
        >
          <Button type='primary' status='danger' loading={isUpdating}>
            <IconDelete />删除
          </Button>
        </Popconfirm>}
      </div>,
    },
  ]

  return <Card className={'px-4'}>
    <Typography.Title heading={5}>客户端密钥</Typography.Title>
    <Divider/>
    <div className='flex flex-row gap-6 items-center'>
      <Input value={inputPhone} onChange={setInputPhone} placeholder='手机号(包含区号)'
        className={'max-w-[250px]'}
      />
      <Input value={appId} onChange={setAppId} placeholder='App ID' className={'max-w-[200px]'}/>
      <Input value={appHash} onChange={setAppHash} placeholder='App Hash' className={'max-w-[300px]'}/>
      <Popconfirm
        focusLock
        title="确认"
        content={'确认要更新配置？'}
        onOk={() => {
          if (isUpdating)
            return
          return onConfigConfirmClickHandler()
        }
        }
      >
        <Button type='primary' loading={isUpdating}><IconCheckCircle/>确认</Button>
      </Popconfirm>
    </div>
    <Divider/>
    <Table columns={columns} data={(configData && configData.data && configData.data.conf_data) ? configData.data.conf_data : []} pagination={false} rowKey={'appHash'}
      loading={isLoading || isUpdating}
    />
  </Card>
}
