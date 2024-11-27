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
import { PraiseModal, PraiseModalRefType } from "./praise";
import { ForwardModal, ForwardModalRefType } from "./forward";
import { ForwardQuoteModal, ForwardQuoteModalRefType } from "./forward-quote";
import { CommentModal, CommentModalRefType } from "./comment";
import { ReleaseModal, ReleaseModalRefType } from "./release";
import { AttentionsModal, AttentionsModalRefType } from "./attentions";

const SWR_KEYS = [
  "/adminApi/deviceList",
  "/template/getActiveTemplateList",
  "/account/hasLogged",
  "/channel/getAllSet",
];

export const HeatOverview = () => {
  const { mutate } = useSWRConfig();
  const { data: groupStrategies, isLoading } = useSWR(
    ["/adminApi/deviceList"],
    getXAIDeviceList
  );
  // const { data: groupTemplates } = useSWR(
  //   ["/template/getActiveTemplateList"],
  //   getActiveGroupTemplateList
  // );
  // const { data: accountLists } = useSWR(
  //   ["/account/hasLogged"],
  //   getTGAILoggedAccount
  // );
  // const { data: channel_sets_lists } = useSWR(
  //   ["/channel/getAllSet"],
  //   getTGAIChannelSets
  // );

  const formatStatus = (status: number) => {
    switch (status) {
      case -1:
        return "失败";

        break;
      case 0:
        return "初始化";

        break;
      case 1:
        return "已下达";

        break;
      case 2:
        return "完成";

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
  const AttentionsModalRef = useRef<AttentionsModalRefType>(null);
  const PraiseModalRef = useRef<PraiseModalRefType>(null);
  const ForwardModalRef = useRef<ForwardModalRefType>(null);
  const ForwardQuoteModalRef = useRef<ForwardQuoteModalRefType>(null);
  const CommentModalRef = useRef<CommentModalRefType>(null);
  const ReleaseModalRef = useRef<ReleaseModalRefType>(null);

  const onAttentionsClickHandler = async () => {
    const result = await AttentionsModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };
  const onPraiseClickHandler = async () => {
    const result = await PraiseModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };
  const onForwardClickHandler = async () => {
    const result = await ForwardModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };
  const onForwardQuoteClickHandler = async () => {
    const result = await ForwardQuoteModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };
  const onCommentClickHandler = async () => {
    const result = await CommentModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };
  const onReleaseClickHandler = async () => {
    const result = await ReleaseModalRef.current!.show();
    if (!result) return;
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };
  const onCreateClickHandler = async () => {
    const result = await groupStrategyEditModalRef.current!.show();
    if (!result) return;

    Message.success("创建群聊策略成功！");
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };

  const onEditClickHandler = async (data: TGAIGroupStrategy) => {
    const result = await groupStrategyEditModalRef.current!.show(data);

    if (!result) return;

    Message.success("修改群聊策略成功！");
    mutate((key: Array<string>) => SWR_KEYS.includes(key[0]));
  };

  const columns: TableColumnProps<any>[] = [
    {
      title: "序号",
      render: (_col, item, index) => index + 1,
    },
    {
      title: "设备ID",
      dataIndex: "device_id",
    },
    {
      title: "登录用户",
      render: (_col, item) => (
        <div className="flex-col items-center justify-start gap-2">
          {item.tweet_account_list.map((account: any, index: any) => (
            <div className="h-7 my-2" key={index}>
              {account.tweet_account}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "控制记录",
      render: (_col, item) => (
        <div className="flex-col items-center justify-start gap-2">
          {item.tweet_account_list.map((account: any, index: any) => (
            <div className="h-7 my-2" key={index}>
              <span
                style={{
                  color: formatStatusColor(account.control_status),
                  fontWeight: "700",
                }}
              >
                {formatStatus(account.control_status)}
              </span>
              &nbsp;
              {formatContent(account.control_cmd)
                ? formatContent(account.control_cmd)
                : ""}
              {account.data_time ? `（${account.data_time}）` : ""}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "查看详情",
      render: (_col, item) => (
        <div>
          {item.tweet_account_list.map((account: any, index: any) => (
            <div
              className="flex items-center justify-start gap-2 my-2"
              key={index}
            >
              <Button
                type="secondary"
                size="small"
                // onClick={() => onEditClickHandler(account)}
              >
                控制记录
              </Button>
              <Button
                type="secondary"
                size="small"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      item.tweet_account_list[index].tweet_account
                    );
                    Message.success("复制成功");
                  } catch (err) {
                    console.error("Failed to copy text to clipboard:", err);
                  }
                }}
              >
                用户链接
              </Button>
              <Button
                type="secondary"
                size="small"
                // onClick={() => onEditClickHandler(account)}
              >
                粉丝/关注
              </Button>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Card className={"px-4"}>
      <Typography.Title heading={5}>手机群控</Typography.Title>
      <Divider />
      <Space direction="vertical">
        <div>
          <Space>
            <IconMessage />
            用户互动
            <Button
              type="outline"
              size="small"
              onClick={onAttentionsClickHandler}
            >
              关注用户
            </Button>
          </Space>
        </div>
        <div style={{ margin: "5px 0" }}>
          <Space>
            <IconMessage />
            推文互动
            <Button type="outline" size="small" onClick={onPraiseClickHandler}>
              点赞
            </Button>
            <Button type="outline" size="small" onClick={onForwardClickHandler}>
              转发
            </Button>
            <Button
              type="outline"
              size="small"
              onClick={onForwardQuoteClickHandler}
            >
              转发+引用
            </Button>
            <Button type="outline" size="small" onClick={onCommentClickHandler}>
              评论推文
            </Button>
          </Space>
        </div>
        <div>
          <Space>
            <IconEdit />
            发布推文
            <Button type="outline" size="small" onClick={onReleaseClickHandler}>
              发布推文
            </Button>
          </Space>
        </div>
      </Space>
      <Divider />
      <Table
        columns={columns}
        data={groupStrategies ? groupStrategies.data.device_list : undefined}
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
      <AttentionsModal ref={AttentionsModalRef} />
      <PraiseModal ref={PraiseModalRef} />
      <ForwardModal ref={ForwardModalRef} />
      <ForwardQuoteModal ref={ForwardQuoteModalRef} />
      <CommentModal ref={CommentModalRef} />
      <ReleaseModal ref={ReleaseModalRef} />
    </Card>
  );
};
