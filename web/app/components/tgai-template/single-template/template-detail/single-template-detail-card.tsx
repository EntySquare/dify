'use client'

import { SingleTemplate } from "@/models/tgai-template"
import { createTGAISingleTemplate, getActiveSingleTemplateList, testTGAISingleTemplate, updateTGAISingleTemplate } from "@/service/tgai"
import classNames from "@/utils/classnames"
import { Button, Card, Form, Input, InputNumber, Message, Modal } from "@arco-design/web-react"
import Textarea from "@arco-design/web-react/es/Input/textarea"
import { IconLeft } from "@arco-design/web-react/icon"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import useSWR, { useSWRConfig } from "swr"

const FormItem = Form.Item


const SingleTemplateDetailCardTitle = React.memo(() => {
    const router = useRouter()
    return <div className="flex flex-row items-center text-xl pb-3 pt-4 gap-1">
        <Button
            type="text"
            shape="circle"
            icon={<IconLeft className="text-lg leading-[normal] !text-[rgb(78,89,105)]" />}
            className={'!grid place-items-center'}
            onClick={() => router.push('/templates/single-chat')}
        />
        <span>单聊模版详情</span>
    </div>
})

const SingleTemplateChatSimulator = React.memo(() => {

    const [msg, setMsg] = useState('')
    const [msgInChat, setMsgInChat] = useState<string[]>([])
    const [isTesting, setIsTesting] = useState(false)
    const [chatHasError, setChatHasError] = useState(false)

    const { form } = Form.useFormContext()

    const onClearTestChatHistory = () => {
        if (isTesting) return
        setMsgInChat([])
        setChatHasError(false)
    }

    const onSendMsgClickHandler = async () => {
        if (isTesting) return

        try {
            setIsTesting(true)
            await form.validate()
            if (!msg) {
                Message.warning("请输入要发送的消息！")
                return
            }

            const { name, role, personality, scene, extra, chat_times, end_word } = form.getFields()

            if (name && role && scene && chat_times && end_word) {
                const message_list = chatHasError ? [msg] : [...msgInChat, msg]
                setMsgInChat(message_list)

                const res = await testTGAISingleTemplate({
                    name, role, personality, scene, extra, chat_times, end_word, message_list
                })

                setMsgInChat(prev => [...prev, res.data.message])

                // setMsgInChat(prev => [...prev, 'TEST!'])
                setMsg('')
            }
        } catch (err) {
            setChatHasError(true)
        } finally {
            setIsTesting(false)
        }
    }

    return <div className="flex flex-col gap-4">
        <Card>
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-base font-semibold">模拟对话测试</h2>
                <Button type="primary" disabled={isTesting} onClick={onClearTestChatHistory}>清除记录</Button>
            </div>
        </Card>
        <Card className={'overflow-y-auto max-h-[600px]'}>
            <div className="flex flex-col gap-4">
                {msgInChat.length > 0 && msgInChat.map((msg, index) => <div className={classNames('w-[80%] py-3 px-4 rounded-md border-blue-50 shadow text-black text-base break-all', index % 2 === 0 ? 'self-end bg-green-300' : 'self-start bg-white')} key={index}>{msg}</div>)}
            </div>
        </Card>
        <Card>
            <div className="flex flex-row gap-4">
                <Input placeholder="请输入对话内容" value={msg} onChange={(value) => setMsg(value)} />
                <Button type='primary' onClick={onSendMsgClickHandler} loading={isTesting}>发送消息</Button>
            </div>
        </Card >
    </div >
})

const SingleTemplateFormBody = React.memo(() => {


    return <><FormItem label="模版名称" field={'name'} rules={[{ required: true, message: "请输入模版名称" }]} requiredSymbol={false}>
        <Input placeholder="请输入模版名称" />
    </FormItem>
        <div className="flex flex-row gap-4">
            <FormItem label="角色" field={'role'} rules={[{ required: true, message: "请输入角色" }]} requiredSymbol={false} className={'max-w-[400px]'}>
                <Input placeholder="例如：招聘员" />
            </FormItem>
            <FormItem label="性格（选填）" field={'personality'} className={'max-w-[400px]'}>
                <Input placeholder="例如：认真" />
            </FormItem>
        </div>
        <FormItem label="场景：" field={'scene'} rules={[{ required: true, message: "请输入场景" }]} requiredSymbol={false}>
            <Textarea placeholder="招聘员在群内发布了招聘信息，对方来私聊" />
        </FormItem>
        <FormItem label="附加（选填）：" field={'extra'}>
            <Textarea placeholder="招聘需求有2年以上工作经验的客服人员" />
        </FormItem>
        <FormItem label="回复次数(回复多少次后结束对话)" field={'chat_times'} rules={[{ required: true, type: 'number', message: "请输入回复次数（不小于 1）", min: 1 }]} requiredSymbol={false}>
            <InputNumber min={1} className={'max-w-[200px]'} />
        </FormItem>
        <FormItem label="结束语" field={'end_word'} rules={[{ required: true, message: "请输入结束语" }]} requiredSymbol={false}>
            <Textarea placeholder="请到https://www.xxx.org确认详细情况" />
        </FormItem>
    </>
})

type SingleTemplateConfirmResultModalProps = {
    resInfo: {
        resType: 'create' | 'update',
        id: number
    }
    onOk?: () => void
    onCancel?: () => void
}

const SingleTemplateConfirmResultModal = React.memo(({ resInfo, onOk, onCancel }: SingleTemplateConfirmResultModalProps) => {

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

const SingleTemplateDetailCard = React.memo(() => {

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

    const { data: singleTemplateList, isLoading } = useSWR(validTemplateId ? ['/singleTemplate/getActiveSingleTemplateList'] : null, getActiveSingleTemplateList)

    const defaultData = useMemo(() => {
        return (singleTemplateList && validTemplateId) ? singleTemplateList.data.single_template_list.find(template => template.id === Number(templateId)) : undefined
    }, [singleTemplateList])


    const [form] = Form.useForm<SingleTemplate>()

    useEffect(() => {
        if (templateId) {
            if (!validTemplateId) {
                Message.error("参数非法！")
                router.replace('/templates/single-chat')
            } else {
                setMode(DetailPanelMode.UPDATE)
            }
        }
    }, [])

    useEffect(() => {
        if (validTemplateId && singleTemplateList) {
            if (!defaultData) {
                Message.error("未找到对应 id 的模板！")
                router.replace('/templates/single-chat')
            } else {
                form.setFieldsValue(defaultData)
            }

        }
    }, [defaultData, singleTemplateList])

    const onConfirmClickHandler = async () => {
        if (isUpdating) return

        try {
            setIsUpdating(true)
            await form.validate()
            const { name, role, personality, scene, extra, chat_times, end_word, id } = form.getFields()

            if (name && role && scene && chat_times && end_word) {

                if (mode === DetailPanelMode.CREATE) {

                    const res = await createTGAISingleTemplate({
                        name, role, personality, scene, extra, chat_times, end_word
                    })
                    setResInfo({ resType: "create", id: res.data.id })
                } else {
                    if (!id) {
                        Message.error("参数错误，请稍后重试！")
                        return
                    }
                    const res = await updateTGAISingleTemplate({
                        name, role, personality, scene, extra, chat_times, end_word, id
                    })
                    setResInfo({ resType: "update", id: res.data.id })
                }
                mutate(['/singleTemplate/getActiveSingleTemplateList'], undefined)
            }
        } catch (err) {

        } finally {
            setIsUpdating(false)
        }
    }

    const onSuccessModalOk = useCallback(() => {
        mode === DetailPanelMode.CREATE ? router.replace('/strategy/single-strategy') : router.push('/strategy/single-strategy')
        setResInfo(undefined)
    }, [mode])

    const onSuccessModalCancel = useCallback(() => {
        if (resInfo) {
            mode === DetailPanelMode.CREATE && router.replace('/templates/single-chat/template-detail?template_id=' + resInfo.id.toString())
        } else {
            mode === DetailPanelMode.CREATE ? router.replace('/templates/single-chat/') : router.push('/templates/single-chat/')
        }
        setResInfo(undefined)
    }, [mode, resInfo])


    return <Form form={form} layout="vertical" disabled={validTemplateId && isLoading}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card title={<SingleTemplateDetailCardTitle />} headerStyle={{ height: 'auto' }} className={'xl:col-span-2'}>
                <div className="flex flex-col">
                    <SingleTemplateFormBody />
                    <Button onClick={onConfirmClickHandler} type="primary" loading={isUpdating}>{mode === DetailPanelMode.CREATE ? '新增' : '保存修改'}</Button>
                </div>
            </Card>
            <SingleTemplateChatSimulator />
        </div>
        {resInfo && <SingleTemplateConfirmResultModal resInfo={resInfo} onOk={onSuccessModalOk} onCancel={onSuccessModalCancel} />}
    </Form>
})

SingleTemplateDetailCard.displayName = 'SingleTemplateDetailCard'

export { SingleTemplateDetailCard }