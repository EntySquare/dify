'use client'

import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
import {
  Button,
  Form,
  Input,
  Message,
  Modal,
  Select,
} from '@arco-design/web-react'
import useSWR from 'swr'

import { HuoXuanListItemType } from '@/models/xai-huoxuan'

import { addHuoXuanTask, getXAIAllWorkflows } from '@/service/xai'
import { describeCronToCN } from '@/utils/cron'

const FormItem = Form.Item
const Option = Select.Option
const Textarea = Input.TextArea

export type CreateHuoxuanModalType = string

type CreateHuoxuanModalProps = {
  createType: HuoXuanListItemType
}

export type CreateHuoxuanModalRefType = {
  show: () => Promise<CreateHuoxuanModalType | false>
}

const CreateHuoxuanModal = React.forwardRef<CreateHuoxuanModalRefType, CreateHuoxuanModalProps>(({ createType }, ref) => {
  const [visible, setVisible] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const [form] = Form.useForm<any>()

  const { data: workflows, isLoading } = useSWR(['/workflow/all'], getXAIAllWorkflows)

  const workflowOptions = useMemo(() => {
    return workflows ? workflows.data.workflow_array : []
  }, [workflows])

  const promiseRef = useRef<{
    resolve: (value: CreateHuoxuanModalType | false) => void
  }>()

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true)
      return new Promise((resolve) => {
        promiseRef.current = { resolve }
      })
    },
  }))

  const handleConfirm = async () => {
    if (isAdding)
      return
    try {
      await form.validate()

      setIsAdding(true)

      const { tweet_url, content, cron_spec, workflow_id } = form.getFields()

      if (!tweet_url || !content || describeCronToCN(cron_spec) === null || !workflow_id) {
        console.log('not working!')
        return
      }

      const requestPayload = {
        tweet_url,
        content,
        cron_spec,
        workflow_id,
        types_str: createType,
      }

      const res = await addHuoXuanTask(requestPayload)

      Message.success({
        content: '操作成功！请等待设备调备',
        duration: 5000,
      })

      promiseRef.current?.resolve('成啦！')
      setVisible(false)
    }
    catch (err) {

    }
    finally {
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    if (isAdding)
      return

    promiseRef.current?.resolve(false)
    form.resetFields()
    setVisible(false)
  }

  return (
    <Modal
      title={createType === HuoXuanListItemType.HUO ? '创建火推' : '创建宣推'}
      visible={visible}
      footer={null}
      onCancel={handleCancel}
      autoFocus={false}
      focusLock={true}
      maskClosable={false}
      unmountOnExit={true}
      mountOnEnter={true}
      className={'!w-[95%] md:!w-[85%] xl:!w-[70%] max-w-[1440px]'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 justify-center">
        <Form
          form={form}
          labelAlign="left"
          layout="vertical"
          className={'w-full px-10 border-b xl:border-r xl:border-b-0 border-gray-200 dark:border-stone-700 xl:pb-0 pb-5'}
          requiredSymbol={false}
        >
          <div>
            <FormItem
              label="推文链接"
              field="tweet_url"
              rules={[{ required: true, message: '请输入推文链接' }]}
            >
              <Input
                allowClear
                placeholder="请输入推文链接"
              />
            </FormItem>
            <FormItem
              label="评论内容（要推广的内容）"
              field="content"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <Textarea
                allowClear
                placeholder="请输入要推广的内容"
              />
            </FormItem>
            <FormItem
              label="间隔时间（通过右侧工具获取）"
              field="cron_spec"
              rules={[{ required: true, message: '请输入间隔时间' }]}
            >
              <Input allowClear placeholder="Crontab表达式" />
            </FormItem>
            <FormItem
              label="工作流）"
              field="workflow_id"
              rules={[{ required: true, message: '请要执行的工作流' }]}
            >
              <Select
                placeholder="请选择"
                disabled={isLoading}
              >
                {workflowOptions.map(workflow => (
                  <Option key={workflow.workflow_id} value={workflow.workflow_id}>
                    {workflow.workflow_name}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </div>
        </Form>
        <iframe
          src="https://www.toolnb.com/tools/croncreate.html"
          className='w-full px-10 min-h-[700px] pt-5 xl:pt-0'
          allowFullScreen
        ></iframe>
      </div>
      <div className="flex justify-center items-center mt-10">
        <Button shape="round" type="primary" onClick={handleConfirm} loading={isAdding}>
          确认执行
        </Button>
      </div>
    </Modal>
  )
})

CreateHuoxuanModal.displayName = 'CreateHuoxuanModal'

export default CreateHuoxuanModal
