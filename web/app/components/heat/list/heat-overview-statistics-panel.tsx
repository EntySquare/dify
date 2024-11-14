'use client'

import { HeatOverviewData } from "@/models/tgai-heat"
import { Avatar, Card, Divider } from "@arco-design/web-react"
import { IconBug, IconList, IconMindMapping, IconSafe, IconSelectAll, IconUser, IconUserGroup } from "@arco-design/web-react/icon"
import React from "react"

type HeatStatisticsPanelProps = {
    data?: HeatOverviewData 
    isLoading: boolean
}

const HeatStatisticsPanel = React.memo(({data,isLoading}: HeatStatisticsPanelProps)=> {




    return <Card className={"px-4 col-span-1 xl:col-span-2"} loading={isLoading}>
    <div
      style={{ width: "100%" }}
      className="flex items-centergap-0 divide-x"
    >
      <div className="w-1/4 h-20 flex items-center px-5">
        <Avatar size={54} style={{ backgroundColor: "#6688fa" }}>
          <IconUser />
        </Avatar>
        <div className="ml-5">
          <div className="mb-2 text-sm font-medium">已登录账户</div>
          <div className="text-3xl font-bold">{data?.acc_signed || 0}</div>
        </div>
      </div>
      <div className="w-1/4 h-20 flex items-center px-5">
        <Avatar size={54} style={{ backgroundColor: "#b42dd5" }}>
          <IconUser />
        </Avatar>
        <div className="ml-5">
          <div className="mb-2 text-sm font-medium">总账户</div>
          <div className="text-3xl font-bold">{data?.acc_total || 0}</div>
        </div>
      </div>
      <div className="w-1/4 h-20 flex items-center px-5">
        <Avatar size={54} style={{ backgroundColor: "#fa9866" }}>
          <IconUserGroup />
        </Avatar>
        <div className="ml-5">
          <div className="mb-2 text-sm font-medium">已监听群</div>
          <div className="text-3xl font-bold">{data?.channel_listen || 0}</div>
        </div>
      </div>
      <div className="w-1/4 h-20 flex items-center px-5">
        <Avatar size={54} style={{ backgroundColor: "#2fa6f6" }}>
          <IconBug />
        </Avatar>
        <div className="ml-5">
          <div className="mb-2 text-sm font-medium">爬虫群数量</div>
          <div className="text-3xl font-bold">{data?.crawler_channel || 0}</div>
        </div>
      </div>
    </div>
    <Divider />
    <div
      style={{ width: "100%" }}
      className="flex items-center gap-0 divide-x"
    >
      <div className="w-1/4 h-20 flex items-center px-5">
        <Avatar size={54} style={{ backgroundColor: "#6688fa" }}>
          <IconSafe />
        </Avatar>
        <div className="ml-5">
          <div className="mb-2 text-sm font-medium">关键词命中次数</div>
          <div className="text-3xl font-bold">{data?.keyword_hit || 0}</div>
        </div>
      </div>
      <div className="w-1/4 h-20 flex items-center px-5">
        <Avatar size={54} style={{ backgroundColor: "#b42dd5" }}>
          <IconMindMapping />
        </Avatar>
        <div className="ml-5">
          <div className="mb-2 text-sm font-medium">策略执行数量</div>
          <div className="text-3xl font-bold">{data?.plan_exe_count || 0}</div>
        </div>
      </div>
      <div className="w-1/4 h-20 flex items-center px-5">
        <Avatar size={54} style={{ backgroundColor: "#fa9866" }}>
          <IconList />
        </Avatar>
        <div className="ml-5">
          <div className="mb-2 text-sm font-medium">引用和回复次数</div>
          <div className="text-3xl font-bold">{data?.at_reply || 0}</div>
        </div>
      </div>
      <div className="w-1/4 h-20 flex items-center px-5">
        <Avatar size={54} style={{ backgroundColor: "#2fa6f6" }}>
          <IconSelectAll />
        </Avatar>
        <div className="ml-5">
          <div className="mb-2 text-sm font-medium">有效私聊数</div>
          <div className="text-3xl font-bold">{data?.valid_chat}</div>
        </div>
      </div>
    </div>
  </Card>
})

HeatStatisticsPanel.displayName = 'HeatStatisticsPanel'

export {HeatStatisticsPanel}