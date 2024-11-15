'use client'

import React, { useImperativeHandle, useRef } from 'react'
import { Form, Modal, Radio, Select } from '@arco-design/web-react'
import type { TGAISingleStrategy } from '@/models/tgai-strategy'
import { TGAIWorkflow } from '@/models/tgai-workflow'
import { SingleTemplate } from '@/models/tgai-template'
import { updateTGAISingleStrategy } from '@/service/tgai'

const FormItem = Form.Item

export type SingleStrategyEditModalType = string

type SingleStrategyEditModalProps = {
  workflowData: TGAIWorkflow[] | undefined
  singleTemplatesData: SingleTemplate[] | undefined
}

export type SingleStrategyEditModalRefType = {
  show: (initData: TGAISingleStrategy) => Promise<SingleStrategyEditModalType | false>
}

const SingleStrategyEditModal = React.forwardRef<SingleStrategyEditModalRefType, SingleStrategyEditModalProps>(({ workflowData, singleTemplatesData }, ref) => {
  const [visible, setVisible] = React.useState(false)
  const [form] = Form.useForm<TGAISingleStrategy>()

  const promiseRef = useRef<{ resolve: (value: SingleStrategyEditModalType | false) => void }>()

  const singleTemplateOptions = singleTemplatesData ? singleTemplatesData.map(item => ({
    label: item.name,
    value: item.id
  })) : undefined

  const workflowOptions = workflowData ? workflowData.map(item => ({
    label: item.workflow_name,
    value: item.workflow_id
  })) : undefined


  useImperativeHandle(ref, () => ({
    show: (initData) => {
      setVisible(true)
      const { phone, counter, flag, listen_state } = initData
      const selectedWorkflow = workflowData ? workflowData.find(option => option.workflow_id === initData.workflow_id) : undefined
      const selectedSingleTemplate = singleTemplatesData ? singleTemplatesData.find(option => option.id === initData.smart_id) : undefined
      form.setFieldsValue({ phone, workflow_id: selectedWorkflow ? selectedWorkflow.workflow_id : undefined, counter, flag, listen_state, smart_id: selectedSingleTemplate ? selectedSingleTemplate.id : undefined })
      return new Promise((resolve) => {
        promiseRef.current = { resolve }
      })
    },
  }))


  const handleConfirm = async () => {
    try {
      await form.validate()
      if (!workflowData || !singleTemplatesData) return

      const { phone, counter, flag, listen_state, smart_id, workflow_id } = form.getFields()
      const workflow_name = workflowData.find(workflow => workflow.workflow_id === workflow_id)?.workflow_name
      const smart_name = singleTemplatesData.find(template => template.id === smart_id)?.name

      if (!(phone && counter && flag && listen_state && smart_id && workflow_id && workflow_name && smart_name)) return
      await updateTGAISingleStrategy({
        phone, counter, flag, listen_state, smart_id, workflow_id, workflow_name, smart_name
      })

      promiseRef.current?.resolve("成啦！")
      setVisible(false)
    }
    catch (error) {
    }
  }
  const handleCancel = () => {
    promiseRef.current?.resolve(false)
    setVisible(false)
  }

  return (
    <Modal
      title='单聊配置'
      visible={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      autoFocus={false}
      focusLock={true}
      maskClosable={false}
      unmountOnExit={true}
      mountOnEnter={true}
    >
      <Form layout='vertical' form={form}>
        <FormItem field='phone' hidden />
        <FormItem field='counter' hidden />
        <FormItem label="监听开关" field='listen_state'>
          <Radio.Group type='radio'>
            <Radio value='1'>开</Radio>
            <Radio value='0'>关</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="策略类型" field='flag'>
          <Radio.Group type='radio'>
            <Radio value={1}>模版</Radio>
            <Radio value={2}>任务</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="模板" field='smart_id' rules={[{ required: true, message: '请选择一个模版' }]}>
          <Select
            placeholder='选择模版'
            options={singleTemplateOptions}
          />
        </FormItem>
        <FormItem label="任务" field='workflow_id' rules={[{ required: true, message: '请选择一个任务' }]}>
          <Select
            placeholder='选择任务'
            options={workflowOptions}
          />
        </FormItem>
      </Form>
    </Modal>)
})

SingleStrategyEditModal.displayName = 'SingleStrategyEditModal'

export { SingleStrategyEditModal }
