"use client";

import type { TableColumnProps } from "@arco-design/web-react";
import {
  Button,
  Card,
  Divider,
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
import type { GroupStrategyEditModalRefType } from "./group-strategy-edit-modal";
import { GroupStrategyEditModal } from "./group-strategy-edit-modal";
import type { TGAIGroupStrategy } from "@/models/tgai-strategy";
import { getXAIDeviceList } from "@/service/xai";
import { CommentModal, CommentModalRefType } from "./comment";

const SWR_KEYS = [
  "/adminApi/deviceList",
  "/template/getActiveTemplateList",
  "/account/hasLogged",
  "/channel/getAllSet",
];

export const FireHomeView = () => {
  const { mutate } = useSWRConfig();
  const { data: groupStrategies, isLoading } = useSWR(
    ["/adminApi/deviceList"],
    getXAIDeviceList
  );

  const formatStatus = (status: number) => {
    switch (status) {
      case -1:
        return "暂停";

        break;
      case 0:
        return "申请中";

        break;
      case 1:
        return "进行中";

        break;

      default:
        return "未知";
        break;
    }
  };

  const formatStatusColor = (status: number) => {
    switch (status) {
      case -1:
        return "red";

        break;
      case 0:
        return "orange";

        break;
      case 1:
        return "grey";

        break;
      case 2:
        return "green";

        break;

      default:
        return "";
        break;
    }
  };

  const formatContent = (content: string) => {
    switch (content) {
      case "1":
        return "转发";

        break;
      case "2":
        return "转发评论";

        break;
      case "3":
        return "评论";

        break;
      case "4":
        return "点赞";

        break;
      case "5":
        return "发推";

        break;
      case "6":
        return "关注用户";

        break;
      case "7":
        return "取关用户";

        break;
      case "9":
        return "模糊搜索文章链接";

        break;
      case "10":
        return "同步文章详情";

        break;

      default:
        return "";
        break;
    }
  };

  const groupStrategyEditModalRef = useRef<GroupStrategyEditModalRefType>(null);
  const CommentModalRef = useRef<CommentModalRefType>(null);

  const onCommentClickHandler = async () => {
    const result = await CommentModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };

  const onEditClickHandler = async () => {
    const result = await groupStrategyEditModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
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
      render: (_col, item) => <div>内容内容内容内容内容内容内容</div>,
    },
    {
      title: "工作流",
      render: (_col, item) => <div>推文宣推工作流V1</div>,
    },
    {
      title: "状态",
      render: (_col, item) => <div>{formatStatus(item.status)}</div>,
    },
    {
      title: "详情",
      render: (_col, item) => (
        <div>
          <div className="flex items-center justify-start gap-2 my-2">
            <Button
              type="secondary"
              size="small"
              // onClick={() => onEditClickHandler()}
            >
              查看详情
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "操作",
      render: (_col, item) => (
        <div>
          <div className="flex items-center justify-start gap-2 my-2">
            <Button
              type="secondary"
              size="small"
              // onClick={() => onEditClickHandler()}
            >
              立即执行
            </Button>
            <Button
              type="secondary"
              size="small"
              // onClick={() => onEditClickHandler()}
            >
              设置
            </Button>
            <Button
              type="secondary"
              size="small"
              // onClick={() => onEditClickHandler()}
            >
              删除
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card className={"px-4"}>
      <Typography.Title heading={5}>
        火推&nbsp;
        <span style={{ fontSize: 14, opacity: 0.5 }}>在自己的推文下抄热度</span>
      </Typography.Title>
      <Divider />
      <Space direction="vertical">
        <div>
          <Space>
            <Button type="outline" size="small" onClick={onCommentClickHandler}>
              发布火推
            </Button>
          </Space>
        </div>
      </Space>
      <Divider />
      <Table
        columns={columns}
        data={
          // groupStrategies
          //   ? groupStrategies.data.device_list
          //   :
          [
            {
              device_id: 100,
              status: -1,
              user_name: "@特朗普",
              tweet_account_list: [],
            },
            {
              device_id: 101,
              status: -1,
              user_name: "@特朗普",
              tweet_account_list: [],
            },
            {
              device_id: 102,
              status: 1,
              user_name: "@特朗普",
              tweet_account_list: [],
            },
            {
              device_id: 103,
              status: 1,
              user_name: "@特朗普",
              tweet_account_list: [],
            },
            {
              device_id: 104,
              status: 1,
              user_name: "@特朗普",
              tweet_account_list: [],
            },
          ]
        }
        pagination={false}
        loading={isLoading}
        rowKey={"device_id"}
      />
      <GroupStrategyEditModal
        ref={groupStrategyEditModalRef}
        groupTemplatesList={[]}
        loggedAccountList={[]}
        channelSetsList={[]}
      />
      <CommentModal ref={CommentModalRef} />
    </Card>
  );
};
