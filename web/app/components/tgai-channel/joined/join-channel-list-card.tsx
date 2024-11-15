'use client'

import { TGAIJoinedChannelList } from '@/models/tgai-channel'
import { getTGAIJoinedChannelList, getTGAILoggedAccount } from '@/service/tgai'
import type { TableColumnProps } from '@arco-design/web-react'
import { Button, Card, Divider, Select, Table, Typography, Link, Avatar, Message, Image } from '@arco-design/web-react'
import { IconSearch, IconExport } from '@arco-design/web-react/icon'
import { useCallback, useMemo, useState } from 'react'
import { TGAI_API_PREFIX } from '@/config'
import useSWR, { useSWRConfig } from 'swr'

export const JoinedChannelListCard = () => {
    const [selectedAccount, setSelectedAccount] = useState<null | string>(null)

    const { mutate } = useSWRConfig()

    const { data: loggedAccount } = useSWR(['/account/hasLogged'], getTGAILoggedAccount)
    const { data: joinedChannelList, isLoading } = useSWR(selectedAccount ? [`/channel/list/${selectedAccount}`] : null, () => selectedAccount ? getTGAIJoinedChannelList(selectedAccount) : undefined)

    const onSearchClick = () => {
        if (selectedAccount === null) {
            Message.error('请先选择要查询的账号！')
            return
        }
        mutate([`/channel/list/${selectedAccount}`], undefined)
    }

    const loggedAccountOptions = useMemo(() => loggedAccount ? loggedAccount.data.map(account => ({
        value: account.phone,
        label: account.phone
    })) : undefined, [loggedAccount])

    const exportCSV = useCallback(() => {

        if (joinedChannelList && joinedChannelList.data.length > 0) {
            const data = joinedChannelList.data
            const _headers = Object.keys(data[0]).map(item=> item.includes(',') ? `"${item}"` : item)

            let csv = _headers.join(",") + '\n'
            data.forEach((item) => {
                const arr: (string | number)[] = []
                for (const key in item) {
                    const a = key as keyof typeof item
                    arr.push(typeof item[a] === 'string' && item[a].includes(',') ? `"${item[a]}"` : item[a])
                }
                csv += arr.join(",")
                csv += '\n'
            })


            const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${selectedAccount}-查询结果-${Date.now()}.csv`;

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);

        }
        else {
            Message.info("不存在可以导出的数据！")
        }
    }, [joinedChannelList])

    const columns: TableColumnProps<TGAIJoinedChannelList>[] = [
        {
            title: '创建时间',
            dataIndex: 'create_time'
        },
        {
            title: 'ID',
            dataIndex: 'channel_id',
        },
        {
            title: 'AccessHash',
            dataIndex: 'access_hash',
        },
        {
            title: '群人数',
            dataIndex: 'participants_count',
        },
        {
            title: '群名',
            dataIndex: 'channel_title',
        },
        {
            title: '群用户名',
            dataIndex: 'channel_name',
        },
        {
            title: '群头像',
            render: (_col, item) => <Avatar ><Image src={`${TGAI_API_PREFIX}/file/group-avatars/${item.channel_name}`} /></Avatar>
        },
        {
            title: '链接',
            dataIndex: 'channel_link',
            render: (col: TGAIJoinedChannelList['channel_link']) => <Link href={col}>{col}</Link>
        },
    ]


    return <Card className={'px-4'}>
        <Typography.Title heading={5}>已加入群列表</Typography.Title>
        <Divider />
        <div className='flex gap-4'><Select onChange={(value) => setSelectedAccount(value)} placeholder='请选择要查询所在群列表的账户' options={loggedAccountOptions} className={'max-w-[500px]'}></Select><Button type='primary' onClick={onSearchClick}><IconSearch />搜索</Button><Button type='primary' onClick={exportCSV}><IconExport />导出</Button></div>
        <Divider />
        <Table columns={columns} data={joinedChannelList ? joinedChannelList.data : undefined} pagination={false} rowKey={'channel_id'} loading={isLoading} />
    </Card>
}
