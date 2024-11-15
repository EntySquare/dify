'use client'

import React, { useImperativeHandle, useMemo, useRef } from 'react'
import { Divider, Form, Input, InputNumber, Message, Modal, Select } from '@arco-design/web-react'
import type { TGAIGroupStrategy } from '@/models/tgai-strategy'
import type { GroupTemplate } from '@/models/tgai-template'
import type { TGAIAccount } from '@/models/tgai-user'
import { TGAIChannelSet } from '@/models/tgai-channel'
import { createTGAIGroupStrategy, updateTGAIGroupStrategy } from '@/service/tgai'
import { AxiosError } from 'axios'

const FormItem = Form.Item

const hourValues: { value: number; label: string }[] = new Array(24)

for (let i = 0; i < 24; i++) {
    hourValues[i] = {
        value: i,
        label: `${i}时`,
    }
}

enum GroupStrategyEditMode {
    CREATE,
    EDIT
}

export type GroupStrategyEditModalType = string

type GroupStrategyEditModalProps = {
    groupTemplatesList: GroupTemplate[] | undefined
    loggedAccountList: TGAIAccount[] | undefined
    channelSetsList: TGAIChannelSet[] | undefined
}

export type GroupStrategyEditModalRefType = {
    show: (initData?: TGAIGroupStrategy) => Promise<GroupStrategyEditModalType | false>
}

const GroupStrategyEditModal = React.forwardRef<GroupStrategyEditModalRefType, GroupStrategyEditModalProps>(({ groupTemplatesList, loggedAccountList, channelSetsList }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const [mode, setMode] = React.useState(GroupStrategyEditMode.CREATE)
    const [form] = Form.useForm<TGAIGroupStrategy>()

    const groupTemplatesOptions = groupTemplatesList
        ? groupTemplatesList.map(template => ({
            value: template.id,
            label: template.name,
        }))
        : undefined

    const accountOptions = loggedAccountList
        ? loggedAccountList.map(account => ({
            value: account.phone,
            label: account.phone,
        }))
        : undefined

    const channelSetsOptions = channelSetsList ? channelSetsList.map(set => ({
        value: set.id,
        label: set.set_name
    })) : undefined

    const selectedTemplateId = Form.useWatch('template_id', form as any)

    const rolesFormItems = useMemo(() => {
        const selectedTemplate = groupTemplatesList?.find(template => selectedTemplateId === template.id)
        return (selectedTemplate && selectedTemplate.role_count > 0)
            ? selectedTemplate.roles.map((role, index) => (
                <React.Fragment key={role.id}>
                    <FormItem className={'flex !items-stretch'} label={<>{role.role}<span className='text-sm opacity-60 ml-1'>{role.purpose}</span></>} field={`account_phone_list[${index}]`} rules={[{ required: true, message: `请为${role.role}选择一个应用账号` }]}>
                        <Select options={accountOptions} placeholder='请选择用户' showSearch></Select>
                    </FormItem>
                    {(index + 1) !== selectedTemplate.roles.length && <Divider />}
                </React.Fragment>
            ))
            : null
    }, [selectedTemplateId])

    const promiseRef = useRef<{ resolve: (value: GroupStrategyEditModalType | false) => void }>()

    useImperativeHandle(ref, () => ({
        show: (initData) => {
            setVisible(true)
            if (initData) {
                setMode(GroupStrategyEditMode.EDIT)
                const { id, flag, name, active_time_list, template_id, account_phone_list, interval, heat_trigger, chat_count, channel_sets_list } = initData
                form.setFieldsValue({ id, flag, name, active_time_list, template_id, account_phone_list, interval, heat_trigger, chat_count, channel_sets_list })

            } else {
                setMode(GroupStrategyEditMode.CREATE)
            }
            return new Promise((resolve) => {
                promiseRef.current = { resolve }
            })
        },
    }))

    const handleConfirm = async () => {
        try {

            await form.validate()

            const { account_phone_list, channel_sets_list, active_time_list, id, flag, template_id, heat_trigger, interval, chat_count, name } = form.getFields()


            if (name && account_phone_list && channel_sets_list && template_id && interval) {
                if (Array.from(new Set(account_phone_list)).length < account_phone_list.length) {
                    Message.error("不可使用相同的账户作为不同的角色！")
                    return
                }

                if (mode === GroupStrategyEditMode.CREATE) {
                    await createTGAIGroupStrategy({
                        name, account_phone_list, channel_sets_list, template_id, interval, active_time_list, heat_trigger, chat_count
                    })
                    form.resetFields()
                    promiseRef.current?.resolve('成啦！')
                }

                else if (mode === GroupStrategyEditMode.EDIT && id && flag) {
                    await updateTGAIGroupStrategy({ account_phone_list, channel_sets_list, active_time_list, id, flag, template_id, heat_trigger, interval, chat_count, name })
                    promiseRef.current?.resolve('成啦！')

                } else {
                    return
                }

            } else {
                return
            }

            form.resetFields()
            setVisible(false)
        }
        catch (error) {
        }
    }
    const handleCancel = () => {
        promiseRef.current?.resolve(false)
        form.resetFields()
        setVisible(false)
    }

    return (
        <Modal
            title='修改群聊策略'
            visible={visible}
            onOk={handleConfirm}
            onCancel={handleCancel}
            autoFocus={false}
            focusLock={true}
            maskClosable={false}
            unmountOnExit={true}
            mountOnEnter={true}
            className={'!w-[95%] md:!w-[85%] xl:!w-[75%] max-w-[1440px]'}
        >
            <Form form={form} labelAlign='left' labelCol={{ span: 7 }} wrapperCol={{ span: 17 }} requiredSymbol={false}>
                <div className='grid grid-cols-8 gap-8'>
                    <div className='col-span-8 xl:col-span-5'>
                        <div>
                            <h2 className='text-lg font-medium'>策略名称</h2>
                            <FormItem label="策略名称" field='name' rules={[{ required: true, message: '请输入策略名称' }]}>
                                <Input placeholder='请输入策略名称' />
                            </FormItem>
                        </div>
                        <div>
                            <h2 className='text-lg font-medium' >模版配置</h2>
                            <FormItem label="模版（群聊）" field='template_id' rules={[{ required: true, message: '请选择一个模版' }]}>
                                <Select
                                    placeholder='请选择模版'
                                    options={groupTemplatesOptions}
                                />
                            </FormItem>
                        </div>
                        <Divider />
                        <div>
                            <h2 className='text-lg font-medium'>角色配置</h2>
                            {rolesFormItems}
                        </div>
                    </div>
                    <div className='col-span-8 xl:col-span-3'>
                        <div>
                            <h2 className='text-lg font-medium'>执行配置</h2>
                            <FormItem label="执行时间段(可选)：" field='active_time_list'>
                                <Select
                                    placeholder='请选择执行时间'
                                    mode='multiple'
                                    showSearch
                                    options={hourValues}
                                />
                            </FormItem>
                            <FormItem label="间隔时间(秒)：" field='interval' rules={[{ required: true, type: 'number', message: '请输入大于等于 300 间隔时间', min: 300 }]}>
                                <InputNumber placeholder='案例：1即一秒钟执行一次' hideControl min={300} />
                            </FormItem>
                            <FormItem label="历史条数(可选)：" field='chat_count'>
                                <InputNumber placeholder='需要送入ai的历史条数' hideControl min={0}/>
                            </FormItem>
                            <FormItem label="触发热度(可选)：" field='heat_trigger'>
                                <InputNumber placeholder='触发策略所需热度' hideControl min={0}/>
                            </FormItem>
                            <FormItem label="执行群组：" field='channel_sets_list' rules={[{ required: true, message: '请选择一个群组' }]}>
                                <Select
                                    placeholder='选择群组'
                                    mode='multiple'
                                    showSearch
                                    options={channelSetsOptions}
                                />
                            </FormItem>
                        </div>
                    </div>
                </div>
            </Form>
        </Modal>)
})

GroupStrategyEditModal.displayName = 'GroupStrategyEditModal'

export { GroupStrategyEditModal }
