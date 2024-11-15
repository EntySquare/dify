'use client'

import React, { useImperativeHandle, useRef } from 'react'
import { Form, Input, Modal } from '@arco-design/web-react'
import { type SendTGAIContactMsgReq, sendTGAIContactMsg } from '@/service/tgai'

const FormItem = Form.Item

export type ContactSendMsgModalType = string

export type ContactSendMsgModalProps = {
}

export type ContactSendMsgModalRefType = {
  show: (initData: Omit<SendTGAIContactMsgReq, 'input'>) => Promise<ContactSendMsgModalType | false>
}

const ContactSendMsgModal = React.forwardRef<ContactSendMsgModalRefType, ContactSendMsgModalProps>((_props, ref) => {
  const [visible, setVisible] = React.useState(false)

  const [form] = Form.useForm<SendTGAIContactMsgReq>()

  const promiseRef = useRef<{ resolve: (value: ContactSendMsgModalType | false) => void }>()

  useImperativeHandle(ref, () => ({
    show: (initData) => {
      setVisible(true)
      console.log(initData)
      form.setFieldsValue(initData)
      return new Promise((resolve) => {
        promiseRef.current = { resolve }
      })
    },
  }))

  const handleConfirm = async () => {
    try {
      await form.validate()
      const { input, domain, link, sender, phone } = form.getFields()
      if (!input || domain === undefined || !link || !sender || phone === undefined)
        return
      await sendTGAIContactMsg({ input, domain, link, sender, phone })
      promiseRef.current?.resolve('success')
      form.resetFields()
      setVisible(false)
    }
    catch (_error) {
    }
  }
  const handleCancel = () => {
    promiseRef.current?.resolve(false)
    form.resetFields()
    setVisible(false)
  }

  return (
    <Modal
      title={'消息内容'}
      visible={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      autoFocus={false}
      focusLock={true}
      maskClosable={false}
      unmountOnExit={true}
      mountOnEnter={true}
    >
      <Form form={form}>
        <FormItem field={'input'} rules={[{ required: true, message: '消息不能为空！' }]} wrapperCol={{ span: 24 }}>
          <Input placeholder='新消息内容'/>
        </FormItem>
        <FormItem hidden field={'sender'} />
        <FormItem hidden field={'domain'} />
        <FormItem hidden field={'link'} />
        <FormItem hidden field={'phone'} />
      </Form>
    </Modal>)
})

ContactSendMsgModal.displayName = 'ContactSendMsgModal'

export { ContactSendMsgModal }
