"use client";

import type { TableColumnProps } from "@arco-design/web-react";
import {
  Button,
  Card,
  Divider,
  Input,
  Message,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "@arco-design/web-react";
import {
  IconDelete,
  IconEdit,
  IconMessage,
  IconPause,
  IconPlayArrow,
  IconPlus,
} from "@arco-design/web-react/icon";
import useSWR, { useSWRConfig } from "swr";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AxiosError } from "axios";
import type { TGAIGroupStrategy } from "@/models/tgai-strategy";
import { getXAIDeviceList } from "@/service/xai";
import { CommentModal, CommentModalRefType } from "./comment";
import { CommentTextModal, CommentTextModalRefType } from "./comment-text";

const SWR_KEYS = [
  "/adminApi/deviceList",
  "/template/getActiveTemplateList",
  "/account/hasLogged",
  "/channel/getAllSet",
];

export const KnowledgeBaseUpLoadFileHomeView = () => {
  const { mutate } = useSWRConfig();
  const { data: groupStrategies, isLoading } = useSWR(
    ["/adminApi/deviceList"],
    getXAIDeviceList
  );
  const [tableList, setTableList] = useState([
    {
      device_id: 100,
      type: "creat",
      user_name: "@特朗普",
      content: "推文内容推文内容推文内容推文内容推文内容推文内容",
      tip: "这是个不错的推文",
      creat_at: "2024-12-2",
    },
    {
      device_id: 101,
      type: "creat",
      user_name: "@特朗普",
      content: "推文内容推文内容推文内容推文内容推文内容推文内容",
      tip: "这是个不错的推文",
      creat_at: "2024-12-2",
    },
    {
      device_id: 102,
      type: "creat",
      user_name: "@特朗普",
      content: "推文内容推文内容推文内容推文内容推文内容",
      tip: "这是个不错的推文",
      creat_at: "2024-12-2",
    },
    {
      device_id: 103,
      type: "get",
      user_name: "@特朗普",
      content: "推文内容推文内容推文内容推文内容推文内容推文内容",
      tip: "",
      creat_at: "2024-12-1",
    },
    {
      device_id: 104,
      type: "get",
      user_name: "@特朗普",
      content: "推文内容推文内容",
      tip: "",
      creat_at: "2024-12-1",
    },
  ]);
  const CommentModalRef = useRef<CommentModalRefType>(null);
  const CommentTextModalRef = useRef<CommentTextModalRefType>(null);

  const onCommentClickHandler = async () => {
    const result = await CommentModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };
  const onCommentTextClickHandler = async () => {
    const result = await CommentTextModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };

  const changeItemTip = (value: any, index: number) => {
    const updatedList = [...tableList];
    updatedList[index].tip = value;
    setTableList(updatedList);
  };
  const onClickHandler = (item: any, index: number) => {
    if (item.tip === "") {
      Message.error("请输入喂料内容");
    } else {
      const updatedList = [...tableList];
      updatedList[index].type = "creat";
      Message.success("提交成功");
      setTableList(updatedList);
    }
  };

  const columns: TableColumnProps<any>[] = [
    {
      title: "序号",
      render: (_col, item, index) => index + 1,
    },
    {
      title: "发布者",
      dataIndex: "user_name",
    },
    {
      title: "内容",
      dataIndex: "content",
    },
    {
      title: "AI提示",
      dataIndex: "tip",
      render: (_col, item, index) => (
        <div>
          {item.type === "get" && (
            <Input
              style={{ width: 250 }}
              allowClear
              placeholder="请输入喂料内容"
              onChange={(e) => {
                changeItemTip(e, index);
              }}
            />
          )}
          {item.type === "creat" && <div>{item.tip}</div>}
        </div>
      ),
    },
    {
      title: "操作",
      render: (_col, item, index) => (
        <div>
          {item.type === "get" && (
            <Popconfirm
              focusLock
              title="提示"
              content="确定要发起提交喂料吗？"
              onOk={() => {
                onClickHandler(item, index);
              }}
            >
              <Button type="outline" size="small">
                提交喂料
              </Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card className={"px-4"}>
      <Typography.Title heading={5}>喂料管理</Typography.Title>
      <Divider />
      <Space direction="vertical">
        <div>
          <Space>
            <Button type="outline" size="small" onClick={onCommentClickHandler}>
              文件投喂
            </Button>
            <Button
              type="outline"
              size="small"
              onClick={onCommentTextClickHandler}
            >
              文档投喂
            </Button>
          </Space>
        </div>
      </Space>
      <Divider />
      <Table
        columns={columns}
        data={tableList}
        pagination={false}
        loading={isLoading}
        rowKey={"device_id"}
      />
      <CommentModal ref={CommentModalRef} />
      <CommentTextModal ref={CommentTextModalRef} />
    </Card>
  );
};
