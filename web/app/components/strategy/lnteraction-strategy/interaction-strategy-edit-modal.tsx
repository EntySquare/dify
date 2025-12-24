'use client'

import React, { useImperativeHandle } from 'react'
import { Form, Input, Message, Modal, Radio, TimePicker } from '@arco-design/web-react'
import type { GroupChatListen } from './interaction-strategy-card'
import type { TGAIAllChannelList } from '@/models/tgai-channel'
import { createGroupChatListen, updateGroupChatListen } from '@/service/tgai'

const FormItem = Form.Item

enum InteractionStrategyEditMode {
  CREATE,
  EDIT,
}

export type InteractionStrategyEditModalType = 'success' | 'cancel' | false

type InteractionStrategyEditModalProps = {
  channelsList: TGAIAllChannelList[] | undefined
}

export type InteractionStrategyEditModalRefType = {
  show: (initData?: GroupChatListen) => Promise<InteractionStrategyEditModalType | false>
}

const InteractionStrategyEditModal = React.forwardRef<InteractionStrategyEditModalRefType, InteractionStrategyEditModalProps>(({ channelsList }, ref) => {
  const [visible, setVisible] = React.useState(false)
  const [mode, setMode] = React.useState(InteractionStrategyEditMode.CREATE)
  const [loading, setLoading] = React.useState(false)
  const [form] = Form.useForm()

  // 频道选择选项
  const channelOptions = channelsList
    ? channelsList.map(channel => ({
      value: channel.channel_id,
      label: channel.name,
    }))
    : []

  const promiseRef = React.useRef<{ resolve: (value: InteractionStrategyEditModalType | false) => void }>()

  useImperativeHandle(ref, () => ({
    show: (initData) => {
      console.log('show方法被调用，initData:', initData)
      setVisible(true)
      if (initData) {
        setMode(InteractionStrategyEditMode.EDIT)
        // 直接使用API返回的snake_case字段名
        const fieldsToSet = {
          id: initData.id,
          phone: initData.phone,
          group_link: initData.group_domain, // 兼容旧数据
          monitor_content: initData.monitor_content,
          chat_purpose: initData.chat_purpose,
          state: initData.state, // 直接使用数字值
          start_time: initData.start_time,
          end_time: initData.end_time,
        }
        console.log('准备设置的表单字段:', fieldsToSet)
        form.setFieldsValue(fieldsToSet)
        // 由于setFieldsValue是异步操作，需要使用setTimeout来获取最新值
        setTimeout(() => {
          console.log('设置后的表单值:', form.getFieldsValue())
        }, 0)
      }
      else {
        setMode(InteractionStrategyEditMode.CREATE)
        // 移除可能导致错误的resetFields调用，直接设置默认值
        form.setFieldsValue({
          phone: '',
          group_link: '',
          monitor_content: '',
          chat_purpose: '',
          state: 1, // 使用数字值，1表示开启
          start_time: '00:00:00',
          end_time: '23:59:59',
        })
      }
      return new Promise((resolve) => {
        promiseRef.current = { resolve }
      })
    },
  }))

  const handleCancel = () => {
    console.log('取消编辑，关闭弹窗')
    setVisible(false)
    promiseRef.current?.resolve(false)
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      console.log('确认按钮点击时，表单当前值:', form.getFields())
      await form.validate()
      const values = form.getFields()
      console.log('表单验证通过，获取到的值:', values)

      if (mode === InteractionStrategyEditMode.CREATE) {
        // 新增逻辑
        await createGroupChatListen({
          phone: values.phone,
          group_link: values.group_link,
          monitor_content: values.monitor_content,
          chat_purpose: values.chat_purpose,
          state: values.state,
          start_time: values.start_time,
          end_time: values.end_time,
        })
      }
      else {
        // 编辑逻辑
        await updateGroupChatListen({
          id: values.id!,
          phone: values.phone,
          group_link: values.group_link,
          monitor_content: values.monitor_content,
          chat_purpose: values.chat_purpose,
          state: values.state,
          start_time: values.start_time,
          end_time: values.end_time,
        })
      }

      setVisible(false)
      promiseRef.current?.resolve('success')
    }
    catch (error) {
      console.error('提交失败:', error)
      if (error instanceof Error)
        Message.error(error.message)
      else
        Message.error('提交失败，请检查表单内容')
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={mode === InteractionStrategyEditMode.CREATE ? '新增群聊互动策略' : '编辑群聊互动策略'}
      visible={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
      >
        {/* 隐藏ID字段，仅在编辑时使用 */}
        <FormItem field="id" hidden>
          <Input />
        </FormItem>

        <FormItem
          field="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' },
          ]}
        >
          <Input placeholder="请输入手机号" />
        </FormItem>

        <FormItem
          field="group_link"
          label="群链接"
          rules={[{ required: true, message: '请输入群链接' }]}
        >
          <Input placeholder="请输入群链接" />
        </FormItem>

        <FormItem
          field="monitor_content"
          label="监听内容"
          rules={[{ required: true, message: '请输入监听内容' }]}
        >
          <Input.TextArea
            placeholder="请输入监听内容"
            rows={4}
          />
        </FormItem>

        <FormItem
          field="chat_purpose"
          label="聊天目的"
          rules={[{ required: true, message: '请输入聊天目的' }]}
        >
          <Input.TextArea
            placeholder="请输入聊天目的"
            rows={3}
          />
        </FormItem>

        <FormItem
          field="state"
          label="状态"
          rules={[{ required: true, message: '请选择状态' }]}
        >
          <Radio.Group type='radio'>
            <Radio value={1}>开启</Radio>
            <Radio value={0}>关闭</Radio>
          </Radio.Group>
        </FormItem>

        <div className="flex gap-4">
          <FormItem
            field="start_time"
            label="每日开始时间"
            rules={[
              { required: true, message: '请选择开始时间' },
            ]}
            className="flex-1"
          >
            <TimePicker
              placeholder="请选择开始时间"
              format="HH:mm:ss"
              allowClear={false}
            />
          </FormItem>

          <FormItem
            field="end_time"
            label="每日结束时间"
            rules={[
              { required: true, message: '请选择结束时间' },
            ]}
            className="flex-1"
          >
            <TimePicker
              placeholder="请选择结束时间"
              format="HH:mm:ss"
              allowClear={false}
            />
          </FormItem>
        </div>
      </Form>
    </Modal>
  )
})

InteractionStrategyEditModal.displayName = 'InteractionStrategyEditModal'

export { InteractionStrategyEditModal }
