'use client'

import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Message, Popconfirm, Table, Typography } from '@arco-design/web-react'
import { TemplateValidFlagEnum, type SingleTemplate } from '@/models/tgai-template'
import { IconPlus, IconPlusCircle, IconMinusCircle, IconInfoCircle } from '@arco-design/web-react/icon'
import useSWR, { useSWRConfig } from 'swr'
import { copySingleTemplate, deleteSingleTemplate, getActiveSingleTemplateList } from '@/service/tgai'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

export const SingleTemplateCard = () => {

    const router = useRouter()

    const { mutate } = useSWRConfig()
    const { data: singleTemplateList, isLoading } = useSWR(['/singleTemplate/getActiveSingleTemplateList'], getActiveSingleTemplateList)

    const [copyLoadingState, setCopyLoadingState] = useState<Set<number>>(new Set())
    const [deleteLoadingState, setDeleteLoadingState] = useState<Set<number>>(new Set())

    const onCopyClickHandler = useCallback(async (id: number) => {
        try {
            setCopyLoadingState(prev => new Set(prev.add(id)))
            await copySingleTemplate(id)
            Message.success('复制单聊模版成功！')
            mutate(['/singleTemplate/getActiveSingleTemplateList'])
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
            await deleteSingleTemplate(id)
            Message.success('删除单聊模版成功！')
            mutate(['/singleTemplate/getActiveSingleTemplateList'])
        } catch (err) {
        } finally {
            setDeleteLoadingState(prev => {
                prev.delete(id)
                return new Set(prev)
            })
        }
    }, [])

    const columns: TableColumnProps<SingleTemplate>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: '模版昵称',
            dataIndex: 'name',
        },
        {
            title: '角色',
            dataIndex: 'role',
        },
        {
            title: '场景',
            dataIndex: 'scene',
            ellipsis: true
        },
        {
            title: '额外要求',
            dataIndex: 'extra',
            ellipsis: true
        },
        {
            title: '对话次数',
            dataIndex: 'chat_times',
        },
        {
            title: '结束语',
            dataIndex: 'end_word',
        },
        {
            title: '是否生效',
            dataIndex: 'flag',
            render: (col) => col === TemplateValidFlagEnum.INVALID ? "无效" : "有效"
        },
        {
            title: '操作',
            render: (_col, item) => <div className='flex flex-wrap items-center gap-2'>
                <Button type="primary" onClick={() => router.push('/templates/single-chat/template-detail?template_id=' + item.id)}><IconPlusCircle />编辑</Button>
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
        <Typography.Title heading={5}>单聊模版</Typography.Title>
        <Divider />
        <Button type='primary' onClick={() => router.push('/templates/single-chat/template-detail')}><IconPlus />创建单聊模版</Button>
        <Divider />
        <Table columns={columns} data={singleTemplateList ? singleTemplateList.data.single_template_list : undefined} pagination={false} rowKey={'id'} loading={isLoading} />
    </Card>
}
