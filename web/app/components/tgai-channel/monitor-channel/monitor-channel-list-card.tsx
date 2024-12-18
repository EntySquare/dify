"use client";

import type { TableColumnProps } from "@arco-design/web-react";
import {
  Button,
  Card,
  Divider,
  Link,
  Select,
  Space,
  Table,
  Typography,
} from "@arco-design/web-react";
import React, { useEffect, useMemo, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { useShallow } from "zustand/react/shallow";
import { ChannelDetailCard } from "./channel-detail-card";
import { useAllChannelStore } from "./store";
import type { TGAIAllChannelList } from "@/models/tgai-channel";
import { getTGAIAllChannelList, getTGAILoggedAccount } from "@/service/tgai";
import { Input } from "@arco-design/web-react";
import { AddChannelDbTemplate } from "@/app/components/tgai-channel/tgai-components/add-channel-db";

export const MonitorChannelListCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [phone, setPhone] = useState<string>();
  const { data: loggedAccount } = useSWR(
    ["/account/hasLogged"],
    getTGAILoggedAccount
  );
  const accountOptions = useMemo(
    () =>
      loggedAccount
        ? loggedAccount.data.map((account) => ({
            value: account.phone,
            label: account.phone,
          }))
        : undefined,
    [loggedAccount]
  );
  const { channelDetailId, setChannelDetailId } = useAllChannelStore(
    useShallow((state) => ({
      channelDetailId: state.channelDetailId,
      setChannelDetailId: state.setChannelDetailId,
    }))
  );

  const { mutate } = useSWRConfig();

  const { data, isLoading } = useSWR(
    [`/channel/all/${currentPage}`],
    () =>
      getTGAIAllChannelList({
        current_page: currentPage,
        page_size: 25,
      }),
    { keepPreviousData: true }
  );

  const columns: TableColumnProps<TGAIAllChannelList>[] = [
    {
      title: "账号",
      dataIndex: "channel_id",
    },
    {
      title: "群名",
      dataIndex: "name",
    },
    {
      title: "群用户名",
      dataIndex: "domain",
    },
    {
      title: "任务ID",
      dataIndex: "domain",
    },
    {
      title: "任务名",
      dataIndex: "domain",
    },
    {
      title: "监听状态",
      dataIndex: "domain",
      render: (_col, item, index) =>
        item.listen_flag === "" && (
          <div style={{ color: "#fb006d" }}>未生效</div>
        ),
      // item.listen_flag === '' && <div>未生效</div>
    },
    // {
    //   title: "操作",
    //   render: (_col, item) => (
    //     <Button
    //       type="outline"
    //       onClick={() => setChannelDetailId(item.channel_id)}
    //     >
    //       详情
    //     </Button>
    //   ),
    // },
  ];

  useEffect(() => {
    return () => setChannelDetailId();
  }, []);

  return (
    <Card className={"px-4"}>
      {!channelDetailId && (
        <>
          <div className="flex flex-row justify-between items-center">
            <Typography.Title heading={5}>群监听列表</Typography.Title>
            <Button
              type="primary"
              loading={isLoading}
              onClick={() => mutate([`/channel/all/${currentPage}`], undefined)}
            >
              刷新
            </Button>
          </div>
          <Divider />
          <Space direction="vertical">
            <Button
              type="primary"
              // onClick={() => mutate([`/channel/all/${currentPage}`], undefined)}
            >
              创建监听
            </Button>
            <Space>
              <Typography.Text>当前执行账号:</Typography.Text>
              <Select
                placeholder={"选择用户"}
                style={{ width: 200 }}
                value={phone}
                onChange={setPhone}
                options={accountOptions}
              />
              <Button type="primary">执行监听</Button>
            </Space>
          </Space>

          <Divider />
          <Table
            // size={"mini"}
            columns={columns}
            loading={isLoading}
            data={data ? data.data.channels : undefined}
            pagination={{
              current: currentPage,
              pageSize: 25,
              total: data?.data.total,
              onChange: (pageNumber) => setCurrentPage(pageNumber),
              showTotal: true,
            }}
            rowKey={"channel_id"}
          />
        </>
      )}
      {channelDetailId && <ChannelDetailCard />}
    </Card>
  );
};
