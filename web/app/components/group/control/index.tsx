"use client";

import type { TableColumnProps } from "@arco-design/web-react";
import { useTranslation } from "react-i18next";
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
  IconEdit,
  IconMessage,
} from "@arco-design/web-react/icon";
import useSWR, { useSWRConfig } from "swr";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const { t } = useTranslation();
  const { mutate } = useSWRConfig();
  const { data: groupStrategies, isLoading } = useSWR(
    ["/adminApi/deviceList"],
    getXAIDeviceList
  );

  const formatStatus = (status: number) => {
    switch (status) {
      case -1:
        return t("group.controlDetails.error");

        break;
      case 0:
        return t("group.controlDetails.initialization");

        break;
      case 1:
        return t("group.controlDetails.Issued");

        break;
      case 2:
        return t("group.controlDetails.complete");

        break;

      default:
        return t("group.unknown");
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
        return t("group.controlDetails.forward");

        break;
      case "2":
        return t("group.controlDetails.forwardComments");

        break;
      case "3":
        return t("group.controlDetails.comment");

        break;
      case "4":
        return t("group.controlDetails.thumbsUp");

        break;
      case "5":
        return t("group.controlDetails.tweet");

        break;
      case "6":
        return t("group.controlDetails.followUsers");

        break;
      case "7":
        return t("group.controlDetails.retrieveUsers");

        break;
      case "9":
        return t("group.controlDetails.searchLinks");

        break;
      case "10":
        return t("group.controlDetails.asyncDetails");

        break;

      default:
        return "";
        break;
    }
  };
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

  const columns: TableColumnProps<any>[] = [
    {
      title: t("group.serialNumber"),
      render: (_col, item, index) => index + 1,
    },
    {
      title: t("group.deviceId"),
      dataIndex: "device_id",
    },
    {
      title: t("group.loginUser"),
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
      title: t("group.controlRecords"),
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
      title: t("group.viewDetails"),
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
                {t("group.controlRecords")}
              </Button>
              <Button
                type="secondary"
                size="small"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(
                      item.tweet_account_list[index].tweet_account
                    );
                    Message.success(`${t("group.replicatingSuccess")}`);
                  } catch (err) {
                    console.error("Failed to copy text to clipboard:", err);
                  }
                }}
              >
                {t("group.userLink")}
              </Button>
              <Button
                type="secondary"
                size="small"
                // onClick={() => onEditClickHandler(account)}
              >
                {t("group.fansAndFollowers")}
              </Button>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Card className={"px-4"}>
      <Typography.Title heading={5}>
        {t("group.mobileGroupControl")}
      </Typography.Title>
      <Divider />
      <Space direction="vertical">
        <div>
          <Space>
            <IconMessage />
            {t("group.userInteraction")}
            <Button
              type="outline"
              size="small"
              onClick={onAttentionsClickHandler}
            >
              {t("group.controlDetails.followUsers")}
            </Button>
          </Space>
        </div>
        <div style={{ margin: "5px 0" }}>
          <Space>
            <IconMessage />
            {t("group.interactiveTweets")}
            <Button type="outline" size="small" onClick={onPraiseClickHandler}>
              {t("group.controlDetails.thumbsUp")}
            </Button>
            <Button type="outline" size="small" onClick={onForwardClickHandler}>
              {t("group.controlDetails.forward")}
            </Button>
            <Button
              type="outline"
              size="small"
              onClick={onForwardQuoteClickHandler}
            >
              {t("group.forwardingAndQuoting")}
            </Button>
            <Button type="outline" size="small" onClick={onCommentClickHandler}>
              {t("group.commentAndTweet")}
            </Button>
          </Space>
        </div>
        <div>
          <Space>
            <IconEdit />
            {t("group.postTweet")}
            <Button type="outline" size="small" onClick={onReleaseClickHandler}>
              {t("group.postTweet")}
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
      <AttentionsModal ref={AttentionsModalRef} />
      <PraiseModal ref={PraiseModalRef} />
      <ForwardModal ref={ForwardModalRef} />
      <ForwardQuoteModal ref={ForwardQuoteModalRef} />
      <CommentModal ref={CommentModalRef} />
      <ReleaseModal ref={ReleaseModalRef} />
    </Card>
  );
};
