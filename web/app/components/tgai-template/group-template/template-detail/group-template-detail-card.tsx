'use client'

import { GroupTemplate, ReqChatterRole } from "@/models/tgai-template"
import { createTGAIGroupTemplate, getActiveGroupTemplateList, getTGAIJoinedChannelList, getTGAILoggedAccount, testTGAIGroupTemplate, testTGAISingleTemplate, updateTGAIGroupTemplate } from "@/service/tgai"
import classNames from "@/utils/classnames"
import { Button, Card, Divider, Form, Input, InputNumber, Link, Message, Modal, Popconfirm, Select, Table, TableColumnProps } from "@arco-design/web-react"
import Textarea from "@arco-design/web-react/es/Input/textarea"
import { IconLeft } from "@arco-design/web-react/icon"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

const FormItem = Form.Item

function generateColors(numColors: number) {
    const colors = ['bg-emerald-100', 'bg-lime-100', 'bg-stone-100', 'bg-violet-100', 'bg-zinc-100'] as const; // 可以添加更多颜色
    const generatedColors: (typeof colors[number])[] = [];

    for (let i = 0; i < numColors; i++) {
        generatedColors.push(colors[i % colors.length]);
    }

    return generatedColors;
}

function transformArray(messages: string[], roles: ReqChatterRole[]) {
    const colors = generateColors(roles.length);

    const colorMap = new Map<number, {
        role: string,
        color: string
    }>()

    roles.forEach((role, index) => {
        colorMap.set(role.id, {
            role: role.role,
            color: colors[index]
        })
    })

    const arr = messages.map((str) => {
        const match = str.match(/^(\d+):(.+)/);
        if (match) {
            const id = parseInt(match[1], 10);
            const text = match[2];
            const roleInfo = colorMap.get(id)

            if (!roleInfo) return

            return {
                role: roleInfo.role,
                text,
                color: roleInfo.color,
            };
        }
    });
    return arr.filter(item => item !== undefined)
}


const GroupTemplateDetailCardTitle = React.memo(() => {
    const router = useRouter()
    return <div className="flex flex-row items-center text-xl pb-3 pt-4 gap-1">
        <Button
            type="text"
            shape="circle"
            icon={<IconLeft className="text-lg leading-[normal] !text-[rgb(78,89,105)]" />}
            className={'!grid place-items-center'}
            onClick={() => router.push('/templates/group-chat')}
        />
        <span>群聊模版详情</span>
    </div>
})

const GroupTemplateChatSimulator = React.memo(() => {

    const [phone, setPhone] = useState<string>()
    const [channel, setChannel] = useState<string>()
    const [chatCount, setChatCount] = useState(1)
    const [msgInChat, setMsgInChat] = useState<{ role: string, color: string, text: string }[]>([])
    const [isTesting, setIsTesting] = useState(false)

    const { form } = Form.useFormContext()

    const { data: loggedAccount } = useSWR(['/account/hasLogged'], getTGAILoggedAccount)
    const accountOptions = useMemo(() => loggedAccount ? loggedAccount.data.map(account => ({
        value: account.phone,
        label: account.phone
    })) : undefined, [loggedAccount])

    const { data: channelData } = useSWR(phone ? [`/channel/list/${phone}`] : null, phone ? () => getTGAIJoinedChannelList(phone) : null)
    const channelOptions = useMemo(() => channelData ? channelData.data.map(channel => ({ value: channel.channel_id, label: channel.channel_title })) : undefined, [channelData])

    const onClearTestChatHistory = () => {
        if (isTesting) return
        setMsgInChat([])
    }

    const onTestClickHandler = async (mode: 'simple' | 'history') => {
        if (isTesting) return

        if (mode === 'history') {
            if (!phone) {
                Message.warning("请先选择账号！")
                return
            }
            if (!channel) {
                Message.warning("请先选择群组！")
                return
            }
            if (chatCount <= 0) {
                Message.warning("对话次数必须大于0！")
                return
            }
        }
        try {
            setIsTesting(true)
            await form.validate()

            const { name, roles, min_length, scene, extra, max_length } = form.getFields()

            if (name && roles && min_length && scene && max_length) {
                const role_count = roles.length

                if (mode === 'simple') {

                    const res = await testTGAIGroupTemplate({
                        name, roles, min_length, scene, extra, max_length, role_count
                    })
                    setMsgInChat(transformArray(res.data.talk_text_list, roles))

                } else {
                    const res = await testTGAIGroupTemplate({
                        name, roles, min_length, scene, extra, max_length, role_count, phone, channel_id: Number(channel), chat_count: chatCount
                    })
                    setMsgInChat(transformArray(res.data.talk_text_list, roles))
                }
            }
        } catch (err) {
        } finally {
            setIsTesting(false)
        }
    }

    useEffect(() => {
        setChannel(undefined)
    }, [phone])

    return <div className="flex flex-col gap-4">
        <Card>
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-base font-semibold">简单测试</h2>
                <Button type="primary" loading={isTesting} onClick={() => onTestClickHandler('simple')}>执行测试</Button>
            </div>
            <Divider />
            <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-base font-semibold">历史聊天测试</h2>
                    <Button type="primary" loading={isTesting} onClick={() => onTestClickHandler('history')}>执行测试</Button>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4 items-center">
                        <pre>选择账号</pre>
                        <Select placeholder={'选择用户'} value={phone} onChange={setPhone} options={accountOptions} />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <pre>选择群组</pre>
                        <Select placeholder={'选择群组'} value={channel} onChange={setChannel} disabled={!phone} options={channelOptions} />
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <pre>对话次数</pre>
                        <InputNumber min={1} placeholder="请输入对话次数" value={chatCount} onChange={setChatCount} />
                    </div>
                </div>
            </div>
        </Card>
        <Card className={'overflow-y-auto max-h-[600px]'}>
            <div className="flex flex-col gap-4">
                {msgInChat.length > 0 && msgInChat.map((msg, index) => <div className={classNames('flex flex-col gap-1 py-3 px-4 rounded-lg border-blue-50 shadow text-black', msg.color)} key={index}>
                    <div className="text-base font-medium">{msg.role}</div>
                    <div className="text-sm break-all">{msg.text}</div>
                </div>)}
            </div>
        </Card>
    </div >
})

const GroupTemplateFormBody = React.memo(() => {
    const [roleDefaultValue, setRoleDefaultValue] = useState<ReqChatterRole & {
        mode: 'create' | 'update'
    }>()

    const { form } = Form.useFormContext()
    const minLengthState = Form.useWatch('min_length', form)
    const rolesState: ReqChatterRole[] = Form.useWatch('roles', form)

    const onDeleteRoleFromRolesHandler = (id: number) => {
        const prev_roles: ReqChatterRole[] = form.getFieldValue('roles')
        const role_index = prev_roles.findIndex(role => role.id === id)
        if (role_index === -1) return



        prev_roles.length > 1 ? prev_roles.splice(role_index, 1) && form.setFieldValue('roles', prev_roles) : form.setFieldValue('roles', undefined)
    }

    const onAddRoleToRolesHandler = () => {
        const prev_roles: ReqChatterRole[] | undefined = form.getFieldValue('roles')
        if (prev_roles && prev_roles.length === 5) {
            Message.warning("角色不能超过 5 个")
            return
        }

        setRoleDefaultValue({
            id: (prev_roles && prev_roles.length > 0) ? prev_roles[prev_roles.length - 1].id + 1 : 0,
            personality: '',
            role: "",
            purpose: "",
            keyword: '',
            mode: 'create'
        })
    }

    const onEditRoleClickHandler = (value: ReqChatterRole) => {
        setRoleDefaultValue({
            ...value,
            mode: 'update'
        })
    }

    const onRoleModalOkHandler = useCallback((value: ReqChatterRole) => {
        const prev_roles: ReqChatterRole[] | undefined = form.getFieldValue('roles')
        if (prev_roles === undefined || prev_roles.length === 0) {
            form.setFieldValue('roles', [value])
        } else {
            const index = prev_roles.findIndex(role => role.id === value.id)
            if (index === -1) form.setFieldValue('roles', [...prev_roles, value])
            else {
                const new_roles = prev_roles.map(role => role.id === value.id ? value : role)
                form.setFieldValue('roles', new_roles)
            }

        }
        setRoleDefaultValue(undefined)
    }, [form])

    const onRoleModalCancelHandler = useCallback(() => {
        setRoleDefaultValue(undefined)
    }, [])


    const roleTableColumns: TableColumnProps<ReqChatterRole>[] = [
        {
            title: "角色编号",
            dataIndex: 'id'
        },
        {
            title: '角色',
            dataIndex: 'role',
            render: (col) => <Link>{col}</Link>
        },
        {
            title: '性格',
            dataIndex: 'personality',
            render: (col) => <Link>{col}</Link>
        },
        {
            title: '行为',
            dataIndex: 'purpose',
            render: (col) => <Link>{col}</Link>
        },
        {
            title: '操作',
            render: (_col, item) => <div className="flex flex-row flex-wrap gap-1">
                <Button type="primary" onClick={() => onEditRoleClickHandler(item)}>编辑</Button>
                <Popconfirm
                    title={'删除角色'}
                    content={'确认删除此角色？'}
                    onOk={() => onDeleteRoleFromRolesHandler(item.id)}
                >
                    <Button>删除</Button>
                </Popconfirm>
            </div>
        }
    ]

    return <><FormItem label="模版名称" field={'name'} rules={[{ required: true, message: "请输入模版名称" }]} requiredSymbol={false}>
        <Input placeholder="请输入模版名称" />
    </FormItem>
        <div className="flex flex-row gap-4">
            <FormItem label="最小对话条数" field={'min_length'} rules={[{ required: true, message: "请输入大于 0 的最小对话条数", type: 'number', min: 1 }]} requiredSymbol={false} className={'max-w-[400px]'}>
                <InputNumber min={1} placeholder="例如：3" />
            </FormItem>
            <FormItem label="最大对话条数" field={'max_length'} rules={[{ required: true, message: "请输入大于最小对话条数的的最大对话条数", type: 'number', min: minLengthState }]} requiredSymbol={false} className={'max-w-[400px]'}>
                <InputNumber min={minLengthState} placeholder="例如：6" />
            </FormItem>
        </div>
        <Divider />
        <div className="mb-4 flex flex-col gap-3">
            <div className="flex flew-row justify-between flex-wrap gap-2">
                <span>角色设置</span>
                <Button type="primary" onClick={onAddRoleToRolesHandler}>新增角色（最多5人）</Button>
            </div>
            <Table columns={roleTableColumns} rowKey={'id'} pagination={false} data={(rolesState && rolesState.length > 0) ? rolesState : undefined} />
        </div>
        <FormItem label="场景：" field={'scene'} rules={[{ required: true, message: "请输入场景" }]} requiredSymbol={false}>
            <Textarea placeholder="招聘者发起招聘，两名应聘者对招聘内容回复，最终一名招聘者表示有兴趣" />
        </FormItem>
        <FormItem label="附加（选填）：" field={'extra'}>
            <Textarea placeholder="招聘需求有2年以上工作经验..." />
        </FormItem>
        <FormItem field={'roles'} hidden />
        {roleDefaultValue && <GroupTemplateDetailFormRoleModal defaultValue={roleDefaultValue} onOk={onRoleModalOkHandler} onCancel={onRoleModalCancelHandler} />}
    </>
})

type GroupTemplateDetailFormRoleModalProps = {
    defaultValue: ReqChatterRole & {
        mode: 'create' | 'update'
    }
    onOk: (value: ReqChatterRole) => void
    onCancel?: () => void
}

const GroupTemplateDetailFormRoleModal = React.memo(({ defaultValue, onOk, onCancel }: GroupTemplateDetailFormRoleModalProps) => {

    const [form] = Form.useForm<ReqChatterRole>()

    form.setFieldsValue({
        id: defaultValue.id,
        keyword: defaultValue.keyword,
        personality: defaultValue.personality,
        purpose: defaultValue.purpose,
        role: defaultValue.role
    })

    return <Modal
        title={defaultValue.mode === 'create' ? '新增角色' : '编辑角色'}
        visible={!!defaultValue}
        onOk={async () => {
            try {
                await form.validate()
                const { id, role, personality, purpose, keyword } = form.getFields()
                if (id !== undefined && role && purpose)
                    onOk({ id, role, personality, purpose, keyword })

            } catch (err) {

            }
        }}
        onCancel={onCancel}
        className={'xl:!w-[800px]'}
    >
        <Form form={form}>
            <FormItem label='角色定位' field={'role'} rules={[{ required: true, message: "请输入角色定位" }]} requiredSymbol={false}>
                <Input />
            </FormItem>
            <FormItem label='性格（选填）' field={'personality'}>
                <Input />
            </FormItem>
            <FormItem label='强调语句（选填）' field={'keyword'}>
                <Input />
            </FormItem>
            <FormItem label='聊天目的，目标' field={'purpose'} rules={[{ required: true, message: "请输入聊天目标" }]} requiredSymbol={false}>
                <Input />
            </FormItem>
            <FormItem hidden field={'id'} />
        </Form>
    </Modal>
})

type GroupTemplateConfirmResultModalProps = {
    resInfo: {
        resType: 'create' | 'update',
        id: number
    }
    onOk?: () => void
    onCancel?: () => void
}

const GroupTemplateConfirmResultModal = React.memo(({ resInfo, onOk, onCancel }: GroupTemplateConfirmResultModalProps) => {

    return <Modal
        title={resInfo.resType === 'create' ? '创建单聊模版结果' : '更新单聊模版结果'}
        visible={!!resInfo}
        onOk={onOk}
        onCancel={onCancel}
    >
        模版{resInfo.resType === 'create' ? '创建' : '更新'}成功！是否去配置策略？
    </Modal>
})

enum DetailPanelMode {
    CREATE,
    UPDATE
}

const GroupTemplateDetailCard = React.memo(() => {

    const router = useRouter()
    const [isUpdating, setIsUpdating] = useState(false)
    const searchParams = useSearchParams()
    const [mode, setMode] = useState(DetailPanelMode.CREATE)
    const [resInfo, setResInfo] = useState<{
        resType: 'create' | 'update',
        id: number
    }>()

    const templateId = searchParams.get('template_id')

    const validTemplateId = !!templateId && !Number.isNaN(Number(templateId))

    const { mutate } = useSWRConfig()

    const { data: groupTemplateList, isLoading } = useSWR(validTemplateId ? ['/template/getActiveTemplateList'] : null, getActiveGroupTemplateList)

    const defaultData = useMemo(() => {
        return (groupTemplateList && validTemplateId) ? groupTemplateList.data.template_list.find(template => template.id === Number(templateId)) : undefined
    }, [groupTemplateList])


    const [form] = Form.useForm<GroupTemplate>()

    useEffect(() => {
        if (templateId) {
            if (!validTemplateId) {
                Message.error("参数非法！")
                router.replace('/templates/group-chat')
            } else {
                setMode(DetailPanelMode.UPDATE)
            }
        }
    }, [])

    useEffect(() => {
        if (validTemplateId && groupTemplateList) {
            if (!defaultData) {
                Message.error("未找到对应 id 的模板！")
                router.replace('/templates/group-chat')
            } else {
                form.setFieldsValue(defaultData)
            }

        }
    }, [defaultData, groupTemplateList])

    const onConfirmClickHandler = async () => {
        if (isUpdating) return

        try {
            setIsUpdating(true)
            await form.validate()
            const { name, roles, min_length, scene, extra, max_length, id } = form.getFields()

            if (!roles || roles.length === 0) {
                Message.warning("必须添加至少一名角色！")
                return
            }

            if (name && roles && roles.length > 0 && scene && min_length && max_length) {

                // role_count required
                const role_count = roles.length
                if (mode === DetailPanelMode.CREATE) {

                    const res = await createTGAIGroupTemplate({
                        name, roles, min_length, scene, extra, max_length, role_count
                    })
                    setResInfo({ resType: "create", id: res.data.id })
                } else {
                    if (!id) {
                        Message.error("参数错误，请稍后重试！")
                        return
                    }
                    const res = await updateTGAIGroupTemplate({
                        name, roles, min_length, scene, extra, max_length, id, role_count
                    })
                    setResInfo({ resType: "update", id: res.data.id })
                }
                mutate(['/template/getActiveTemplateList'], undefined)
            }
        } catch (err) {

        } finally {
            setIsUpdating(false)
        }
    }

    const onSuccessModalOk = useCallback(() => {
        mode === DetailPanelMode.CREATE ? router.replace('/strategy/group-strategy') : router.push('/strategy/group-strategy')
        setResInfo(undefined)
    }, [mode])

    const onSuccessModalCancel = useCallback(() => {
        if (resInfo) {
            mode === DetailPanelMode.CREATE && router.replace('/templates/group-chat/template-detail?template_id=' + resInfo.id.toString())
        } else {
            mode === DetailPanelMode.CREATE ? router.replace('/templates/group-chat') : router.push('/templates/group-chat')
        }
        setResInfo(undefined)
    }, [mode, resInfo])


    return <Form form={form} layout="vertical" disabled={validTemplateId && isLoading}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card title={<GroupTemplateDetailCardTitle />} headerStyle={{ height: 'auto' }} className={'xl:col-span-2'}>
                <div className="flex flex-col">
                    <GroupTemplateFormBody />
                    <Button onClick={onConfirmClickHandler} type="primary" loading={isUpdating}>{mode === DetailPanelMode.CREATE ? '新增' : '保存修改'}</Button>
                </div>
            </Card>
            <GroupTemplateChatSimulator />
        </div>
        {resInfo && <GroupTemplateConfirmResultModal resInfo={resInfo} onOk={onSuccessModalOk} onCancel={onSuccessModalCancel} />}
    </Form>
})

GroupTemplateDetailCard.displayName = 'GroupTemplateDetailCard'

export { GroupTemplateDetailCard }