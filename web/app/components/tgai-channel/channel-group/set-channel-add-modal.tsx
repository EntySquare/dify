"use client";

import type { TableColumnProps } from "@arco-design/web-react";
import {
  Avatar,
  Button,
  Image,
  Message,
  Modal,
  Select,
  Table,
} from "@arco-design/web-react";
import { IconSearch } from "@arco-design/web-react/icon";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { diff } from "radash";
import { getTGAIJoinedChannelList, getTGAILoggedAccount } from "@/service/tgai";
import type { TGAIJoinedChannelList } from "@/models/tgai-channel";
import { TGAI_API_PREFIX } from "@/config";
import { AddChannelModalType } from "./channel-group-card";

type SetChannelAddModalProps = {
  onOk: () => any;
  onCancel: () => any;
  addChannelToSetData: {
    set_id: number | undefined;
    channel_ids: number[];
    channels_snapshot: Set<number>;
    mode: AddChannelModalType | null;
  };
  onChannelSelectedHandler: (values: number[]) => void;
};

const SetChannelAddModal = React.memo(
  ({
    addChannelToSetData,
    onCancel,
    onOk,
    onChannelSelectedHandler,
  }: SetChannelAddModalProps) => {
    const { mutate } = useSWRConfig();
    const [selectedAccount, setSelectedAccount] = useState<string>();

    const [modalHasAction, setModalHasAction] = useState(false);
    const { data: loggedAccountData } = useSWR(
      ["/account/hasLogged"],
      getTGAILoggedAccount,
    );
    const { data: joinedChannelData, isLoading: channelDataLoading } = useSWR(
      selectedAccount ? [`/channel/list/${selectedAccount}`] : null,
      selectedAccount ? () => getTGAIJoinedChannelList(selectedAccount) : null,
    );

    const accountOptions = loggedAccountData
      ? loggedAccountData.data.map((account) => ({
          value: account.phone,
          label: account.phone,
        }))
      : undefined;

    const tableColumns: TableColumnProps<TGAIJoinedChannelList>[] = [
      {
        title: "群名字",
        dataIndex: "channel_title",
      },
      {
        title: "群头像",
        render: (_col, item) => (
          <Avatar>
            <Image
              src={`${TGAI_API_PREFIX}/file/group-avatars/${item.channel_name}`}
            />
          </Avatar>
        ),
      },
      {
        title: "人数",
        dataIndex: "participants_count",
      },
    ];

    return (
      <>
        <Modal
          title="群选择器（多选）"
          visible={
            !!addChannelToSetData.set_id &&
            addChannelToSetData.mode === AddChannelModalType.ACCOUNT_BASED
          }
          className={"!w-[95%] md:!w-[80%] xl:!w-[900px]"}
          onOk={async () => {
            if (modalHasAction) return;

            setModalHasAction(true);

            await onOk();

            setSelectedAccount(undefined);
            setModalHasAction(false);
          }}
          onCancel={() => {
            if (modalHasAction) {
              Message.warning("请等待请求结束！");
              return;
            }
            onCancel();
            setSelectedAccount(undefined);
          }}
          autoFocus={false}
          focusLock={true}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-2">
              <Select
                options={accountOptions}
                value={selectedAccount}
                onChange={(value) => setSelectedAccount(value)}
                placeholder="请选择账号"
                className={"max-w-[400px]"}
                disabled={modalHasAction}
              />
              <Button
                type="primary"
                disabled={modalHasAction}
                loading={channelDataLoading}
                onClick={() => {
                  if (!selectedAccount) {
                    Message.warning("请选择一个账号！");
                    return;
                  }
                  mutate([`/channel/list/${selectedAccount}`]);
                }}
              >
                <IconSearch />
                查询
              </Button>
            </div>
            <Table
              data={joinedChannelData ? joinedChannelData.data : undefined}
              columns={tableColumns}
              pagination={false}
              rowKey={"channel_id"}
              scroll={{ y: 350 }}
              rowSelection={{
                selectedRowKeys: addChannelToSetData.channel_ids,
                onSelect: (selected, record) => {
                  const currentData = new Set(addChannelToSetData.channel_ids);
                  if (!selected) {
                    if (
                      addChannelToSetData.channels_snapshot.has(
                        record.channel_id,
                      )
                    )
                      return;
                    currentData.delete(record.channel_id);
                    onChannelSelectedHandler([...currentData]);
                  } else {
                    onChannelSelectedHandler([
                      ...currentData.add(record.channel_id),
                    ]);
                  }
                },
                onSelectAll: (selected, selectedRows) => {
                  const selectedIds = selectedRows.map(
                    (row: TGAIJoinedChannelList) => row.channel_id,
                  );
                  if (selected) {
                    const selectedData = new Set([
                      ...selectedIds,
                      ...addChannelToSetData.channel_ids,
                    ]);
                    onChannelSelectedHandler([...selectedData]);
                  } else {
                    const diff_from_prev = diff(
                      addChannelToSetData.channel_ids,
                      joinedChannelData
                        ? joinedChannelData.data.map(
                            (channel) => channel.channel_id,
                          )
                        : [],
                    );
                    const selectedData = new Set([
                      ...diff_from_prev,
                      ...addChannelToSetData.channels_snapshot,
                    ]);
                    onChannelSelectedHandler([...selectedData]);
                  }
                },
              }}
              loading={channelDataLoading || modalHasAction}
            />
          </div>
        </Modal>
      </>
    );
  },
);

SetChannelAddModal.displayName = "SetChannelAddModal";

export { SetChannelAddModal };
