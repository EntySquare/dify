'use client'


import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Form, Modal, Radio, Select, Input } from '@arco-design/web-react'
import { TGAIReplyTypeEnum, type TGAIKeywordStrategy } from '@/models/tgai-strategy'
import { TGAIAccount } from '@/models/tgai-user'
import useSWR from 'swr'
import { createTGAIKwStrategy, editTGAIKwStrategy, getTGAIGroupList } from '@/service/tgai'
import { TGAIGroupTypeEnum } from '@/models/tgai-channel'
import { TGAIWorkflow } from '@/models/tgai-workflow'


const FormItem = Form.Item


enum keywordStrategyEditMode {
  CREATE,
  EDIT
}

export type KeywordStrategyEditModalType = string

export type KeywordStrategyEditModalProps = {
  loggedAccount: TGAIAccount[]
  workflowData: TGAIWorkflow[] | undefined
}

export type KeywordStrategyEditModalRefType = {
  show: (initData?: TGAIKeywordStrategy) => Promise<KeywordStrategyEditModalType | false>
}
const KeywordStrategyEditModal = React.forwardRef<KeywordStrategyEditModalRefType, KeywordStrategyEditModalProps>(({ loggedAccount, workflowData }, ref) => {
  const [visible, setVisible] = React.useState(false)
  const [mode, setMode] = React.useState<keywordStrategyEditMode>(keywordStrategyEditMode.CREATE)
  const [form] = Form.useForm()

  const replyTypeState = Form.useWatch('reply_type', form)
  const phoneState = Form.useWatch('phone', form)

  const { data: joinedGroupListData } = useSWR(phoneState ? `/group/list/${phoneState}` : null, () => getTGAIGroupList(phoneState))

  const promiseRef = useRef<{ resolve: (value: KeywordStrategyEditModalType | false) => void }>()

  const accountOptions = loggedAccount.map(account => ({
    label: account.phone,
    value: account.phone
  }))

  const workflowOptions = workflowData ? workflowData.map(item => ({
    label: item.workflow_name,
    value: item.workflow_id
  })) : undefined

  const groupOptions = joinedGroupListData ? joinedGroupListData.data.map(group => ({
    label: `${group.group_title}|${group.group_types === TGAIGroupTypeEnum.CHANNEL ? '频道' : '群聊'}`,
    value: group.group_id
  })
  ) : undefined

  useImperativeHandle(ref, () => ({
    show: (initData) => {
      setVisible(true)
      if (initData) {
        setMode(keywordStrategyEditMode.EDIT)
        const { flag, reply_type, keyword, id, flow_id } = initData
        const phone = loggedAccount.findIndex(account => account.phone === initData.phone) === -1 ? undefined : initData.phone
        const group_id = phone ? initData.group_id : undefined
        form.setFieldsValue({ phone, keyword, group_id, reply_type, id, flow_id })
      } else {
        setMode(keywordStrategyEditMode.CREATE)
        form.setFieldsValue({ reply_type: TGAIReplyTypeEnum.KEYWORD_TRIGGER })
      }


      return new Promise((resolve) => {
        promiseRef.current = { resolve }
      })
    },
  }))

  const handleConfirm = async () => {
    try {

      await form.validate()
      if (!joinedGroupListData) return

      const { id, group_id, keyword, phone, reply_type, flow_id } = form.getFields()

      const group = joinedGroupListData.data.find(group => group.group_id === group_id)

      if (!group) return

      const initReqData = {
        group_id,
        group_name: group.group_title,
        group_types: group.group_types,
        phone,
        reply_type,
        flow_id,
        keyword: reply_type === TGAIReplyTypeEnum.KEYWORD_TRIGGER ? keyword : undefined
      }

      if (mode === keywordStrategyEditMode.CREATE) {

        await createTGAIKwStrategy(initReqData)
        promiseRef.current?.resolve('创建关键词策略成功！')

      } else if (mode === keywordStrategyEditMode.EDIT) {
        await editTGAIKwStrategy({ id, ...initReqData })
        promiseRef.current?.resolve('修改关键词策略成功！')
      }
      form.resetFields()
      setVisible(false)
    } catch (_error) {
    }
  }
  const handleCancel = () => {
    promiseRef.current?.resolve(false)
    form.resetFields()
    setVisible(false)
  }

  return (
    <Modal
      title={mode === keywordStrategyEditMode.CREATE ? '新增关键词触发' : '修改关键词触发'}
      visible={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      autoFocus={false}
      focusLock={true}
      maskClosable={false}
      unmountOnExit={true}
      mountOnEnter={true}
    >
      <Form layout='vertical' form={form} className={'gap-y-4'}>
        <div>
          <FormItem label="回复类型" field='reply_type' rules={[{ required: true }]}>
            <Radio.Group type='radio'>
              <Radio value={TGAIReplyTypeEnum.KEYWORD_TRIGGER}>关键字</Radio>
              <Radio value={TGAIReplyTypeEnum.QUOTE}>引用</Radio>
              <Radio value={TGAIReplyTypeEnum.MENTION}>@</Radio>
            </Radio.Group>
          </FormItem>
          <span>提示：选引用和@我时直接回复。</span>
        </div>
        {replyTypeState === TGAIReplyTypeEnum.KEYWORD_TRIGGER && (
          <div>
            <FormItem label="关键字" field='keyword' rules={[{
              required: replyTypeState === TGAIReplyTypeEnum.KEYWORD_TRIGGER,
              message: "请输入关键字！"
            }]}>
              <Input placeholder='请输入关键字' />
            </FormItem>
            <span>案例：‘找工作’</span>
            <span>将命中的信息：[我去哪找工作][现在去哪找工作好]</span>
          </div>
        )}
        <FormItem label="选择账号" field='phone' required rules={[{ required: true, message: '请选择一个账号！' }]}>
          <Select
            placeholder='选择账号'
            options={accountOptions}
            onChange={() => form.setFieldValue('group_id', undefined)}
          />
        </FormItem>
        <FormItem label="选择生效群组" field='group_id' rules={[{ required: true, message: '请选择策略生效的群组！' }]}
          disabled={!phoneState}>
          <Select
            placeholder='选择群组'
            options={groupOptions}
          />
        </FormItem>
        {/*<div>*/}
        {/*  <FormItem label="回复：" field='reply' rules={[{required: true, message: '请输入回复语句！'}]}>*/}
        {/*    <Input placeholder='请输入回复语句' />*/}
        {/*  </FormItem>*/}
        {/*  <span>提示：将用回复语句在群内回复命中的关键字。</span>*/}
        {/*</div>*/}
        <FormItem label="矩阵任务配置：" field='flow_id' rules={[{ required: true, message: '请选择一个矩阵任务！' }]}>
          <Select
            placeholder='请选择矩阵任务'
            options={workflowOptions}
          />
        </FormItem>
        <FormItem field='id' hidden rules={[{ required: mode === keywordStrategyEditMode.EDIT }]} />
      </Form>
    </Modal>)


})

KeywordStrategyEditModal.displayName = 'KeywordStrategyEditModal'

export { KeywordStrategyEditModal }
