'use client'

import { HeatChatRank } from "@/models/tgai-heat";
import { getTGAIHeatChatRank } from "@/service/tgai";
import { Card, Table, TableColumnProps } from "@arco-design/web-react"
import React from "react"
import useSWR from "swr";

const PrivateChartsTable = React.memo(() => {

    const { data: tableData, isLoading } = useSWR(['/heat/chatRank'], getTGAIHeatChatRank)

    const conversationRecord: TableColumnProps<HeatChatRank>[] = [
        {
            title: "时间",
            dataIndex: "rank_time",
            width: 200,
        },
        {
            title: "发送方",
            dataIndex: "sender",
        },
        {
            title: "接收方",
            dataIndex: "receiver_phone",
        },
        {
            title: "对话次数",
            dataIndex: "chat_count",
            sorter: (a: any, b: any) => a.chat_count - b.chat_count,
            width: 110,
        },
    ];

  const chatsRankData = tableData
    ? tableData.data?.map((item, index) => ({
        ...item,
        key: index
    })) : undefined


    return <Card className={"px-4"}>
        <div className="flex  flex-col gap-6">
            <div className="text-base font-bold">私聊历史记录</div>
            <Table
                columns={conversationRecord}
                data={chatsRankData}
                pagination={false}
                border={false}
                loading={isLoading}
                scroll={{ y: 340 }}
            />
        </div>
    </Card>
})

PrivateChartsTable.displayName = 'PrivateChartsTable'

export { PrivateChartsTable }