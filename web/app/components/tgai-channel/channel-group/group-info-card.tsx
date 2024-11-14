"use client";

import type { TableColumnProps } from "@arco-design/web-react";
import {
  Button,
  Card,
  Message,
  Popconfirm,
  Table,
} from "@arco-design/web-react";
import { IconPlus } from "@arco-design/web-react/icon";
import React, { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import { deleteTGAIChannelSet, deleteTGAIChannelSetItem } from "@/service/tgai";
import type { TGAIAllChannelList, TGAIChannelSet } from "@/models/tgai-channel";
import { AddChannelModalType } from "./channel-group-card";

type GroupInfoCardTitleProps = {
  title: string;
  onSetDeleteClick: () => Promise<void>;
  hasAction: boolean;
};

const GroupInfoCardTitle = React.memo(
  ({ title, onSetDeleteClick, hasAction }: GroupInfoCardTitleProps) => {
    return (
      <div className="flex flex-row justify-between items-center">
        <span>{title}</span>
        <Popconfirm
          focusLock
          title="确认"
          content={"确认要删除吗？"}
          onOk={() => onSetDeleteClick()}
          disabled={hasAction}
        >
          <Button disabled={hasAction}>删除</Button>
        </Popconfirm>
      </div>
    );
  },
);

type GroupInfoCardChannelsTableProps = {
  channels_list: TGAIAllChannelList[];
  onItemDeleteClick: (channel_id: number) => Promise<void>;
  hasAction: boolean;
};

const GroupInfoCardChannelsTable = React.memo(
  ({
    channels_list,
    onItemDeleteClick,
    hasAction,
  }: GroupInfoCardChannelsTableProps) => {
    const channelsTableColumn: TableColumnProps<TGAIAllChannelList>[] = [
      {
        title: "ID",
        dataIndex: "id",
        width: "30%",
      },
      {
        title: "名字",
        dataIndex: "name",
        width: "100%",
      },
      {
        title: "域名",
        dataIndex: "domain",
        width: "60%",
      },
      {
        title: "操作",
        render: (_col, item) => (
          <Popconfirm
            focusLock
            title="确认"
            content={"确认要从群组内删除此群吗？"}
            onOk={() => onItemDeleteClick(item.channel_id)}
          >
            <Button>删除</Button>
          </Popconfirm>
        ),
        align: "center",
        width: 90,
      },
    ];

    return (
      <Table
        columns={channelsTableColumn}
        data={channels_list}
        pagination={false}
        scroll={{ y: 350 }}
        size="mini"
        rowKey={"id"}
        loading={hasAction}
      />
    );
  },
);

type GroupInfoCardProps = {
  setData: TGAIChannelSet;
  onAddChannelToSet: (
    set_id: number,
    channel_ids: number[],
    mode: AddChannelModalType | null,
  ) => void;
};

const GroupInfoCard = React.memo(
  ({ setData, onAddChannelToSet }: GroupInfoCardProps) => {
    const [hasAction, setHasAction] = useState(false);

    const { mutate } = useSWRConfig();

    const selectedChannelIds = setData.channels.map(
      (channel) => channel.channel_id,
    );

    const deleteChannelItem = useCallback(
      async (channel_id: number) => {
        if (hasAction) return;

        try {
          setHasAction(true);
          await deleteTGAIChannelSetItem(setData.id, [channel_id]);
          mutate(["/channel/getAllSet"]);
          Message.success("从群组中删除群成功！");
        } catch (err) {
        } finally {
          setHasAction(false);
        }
      },
      [setData],
    );

    const deleteChannelSet = useCallback(async () => {
      if (hasAction) return;

      try {
        setHasAction(true);
        await deleteTGAIChannelSet(setData.id);
        Message.success("删除群组成功！");
        mutate(["/channel/getAllSet"]);
      } catch (err) {
      } finally {
        setHasAction(false);
      }
    }, [setData]);

    return (
      <Card
        title={
          <GroupInfoCardTitle
            title={setData.set_name}
            hasAction={hasAction}
            onSetDeleteClick={deleteChannelSet}
          />
        }
        bodyStyle={{ display: "flex", flex: "1 1 0" }}
        className={"flex flex-col"}
      >
        <div className="flex flex-col size-full gap-4">
          {setData.channels.length > 0 && (
            <>
              <div className="flex flex-row gap-2 flex-wrap items-center">
                <Button
                  type="primary"
                  className={"self-start"}
                  onClick={() =>
                    onAddChannelToSet(
                      setData.id,
                      selectedChannelIds,
                      AddChannelModalType.ACCOUNT_BASED,
                    )
                  }
                  disabled={hasAction}
                >
                  <IconPlus />
                  添加群
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    onAddChannelToSet(
                      setData.id,
                      selectedChannelIds,
                      AddChannelModalType.ALL,
                    )
                  }
                  disabled={hasAction}
                >
                  <IconPlus />
                  群列表
                </Button>
              </div>
              <GroupInfoCardChannelsTable
                channels_list={setData.channels}
                onItemDeleteClick={deleteChannelItem}
                hasAction={hasAction}
              />
            </>
          )}
          {setData.channels.length === 0 && (
            <div className="size-full border-separate border flex-1 rounded-md border-dashed py-12 border-tgai-primary grid place-content-center gap-4 text-center">
              <span className="text-center">目前组内没有群</span>
              <div className="flex flex-row flex-wrap gap-2 items-center justify-center">
                <Button
                  type="primary"
                  onClick={() =>
                    onAddChannelToSet(
                      setData.id,
                      selectedChannelIds,
                      AddChannelModalType.ACCOUNT_BASED,
                    )
                  }
                  disabled={hasAction}
                >
                  <IconPlus />
                  添加群
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    onAddChannelToSet(
                      setData.id,
                      selectedChannelIds,
                      AddChannelModalType.ALL,
                    )
                  }
                  disabled={hasAction}
                >
                  <IconPlus />
                  群列表
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  },
);

GroupInfoCard.displayName = "GroupInfoCard";

export { GroupInfoCard };
