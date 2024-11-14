'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Message, Popconfirm, Table, Typography } from '@arco-design/web-react'
import { TemplateValidFlagEnum, type GroupTemplate } from '@/models/tgai-template'
import { IconPlus, IconPlusCircle, IconMinusCircle, IconInfoCircle } from '@arco-design/web-react/icon'
import useSWR, { useSWRConfig } from 'swr'
import { copyGroupTemplate, deleteGroupTemplate, getActiveGroupTemplateList } from '@/service/tgai'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

export const GroupTemplateCard = () => {

    const router = useRouter()

    const { mutate } = useSWRConfig()
    const { data: groupTemplatesList } = useSWR(['/template/getActiveTemplateList'], getActiveGroupTemplateList)

    const [copyLoadingState, setCopyLoadingState] = useState<Set<number>>(new Set())
    const [deleteLoadingState, setDeleteLoadingState] = useState<Set<number>>(new Set())

    const onCopyClickHandler = useCallback(async (id: number) => {
        try {
            setCopyLoadingState(prev => new Set(prev.add(id)))
            await copyGroupTemplate(id)
            Message.success('复制群聊模版成功！')
            mutate(['/template/getActiveTemplateList'])
        } catch (err) {
        } finally {
            setCopyLoadingState(prev => {
                prev.delete(id)
                return new Set(prev)
            })
        }
    }, [])

    const onDeleteClickHandler = useCallback(async (id: number) => {
        try {
            setDeleteLoadingState(prev => new Set(prev.add(id)))
            await deleteGroupTemplate(id)
            Message.success('删除群聊模版成功！')
            mutate(['/template/getActiveTemplateList'])
        } catch (err) {
        } finally {
            setDeleteLoadingState(prev => {
                prev.delete(id)
                return new Set(prev)
            })
        }
    }, [])

    const columns: TableColumnProps<GroupTemplate>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '模版昵称',
            dataIndex: 'name',
        },
        {
            title: '（人数）角色组',
            dataIndex: 'roles',
            render: (col: GroupTemplate['roles']) => {
                const arr = col.map(role => role.role)
                arr.unshift(`（${col.length}）`)
                return arr.map((item, index) => <span className='px-1 text-nowrap' key={index}>{item}</span>)
            }
        },
        {
            title: '对话场景',
            dataIndex: 'scene',
            ellipsis: true
        },
        {
            title: '额外要求',
            dataIndex: 'extra',
            ellipsis: true
        },
        {
            title: '最小对话长度',
            dataIndex: 'min_length',
        },
        {
            title: '最大对话长度',
            dataIndex: 'max_length',
        },
        {
            title: '是否生效',
            dataIndex: 'flag',
            render: (col) => col === TemplateValidFlagEnum.INVALID ? "无效" : "有效"
        },
        {
            title: '操作',
            render: (_col, item) => <div className='flex flex-wrap items-center gap-2'>
                <Button type="primary" onClick={() => router.push('/templates/group-chat/template-detail?template_id=' + item.id)}><IconPlusCircle />编辑</Button>
                <Popconfirm
                    focusLock
                    title='确认'
                    content='确定要删除这个模版吗？'
                    onOk={() => onDeleteClickHandler(item.id)}
                >
                    <Button loading={deleteLoadingState.has(item.id)} type="primary" status='danger'><IconMinusCircle />删除</Button>
                </Popconfirm>
                <Button loading={copyLoadingState.has(item.id)} onClick={() => onCopyClickHandler(item.id)}><IconInfoCircle />复制</Button>
            </div>,
        },
    ]


    return <Card className={'px-4'}>
        <Typography.Title heading={5}>群聊模版</Typography.Title>
        <Divider />
        <Button type='primary' onClick={() => router.push('/templates/group-chat/template-detail')}><IconPlus />创建群聊模版</Button>
        <Divider />
        <Table columns={columns} data={groupTemplatesList ? groupTemplatesList.data.template_list : undefined} pagination={false} rowKey={'id'} />
    </Card>
}
