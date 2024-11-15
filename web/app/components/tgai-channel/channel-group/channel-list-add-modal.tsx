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
import { getTGAIAllChannelList } from "@/service/tgai";
import type { TGAIAllChannelList } from "@/models/tgai-channel";
import { TGAI_API_PREFIX } from "@/config";
import { AddChannelModalType } from "./channel-group-card";

type ChannelListAddModalProps = {
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

const ChannelListAddModal = React.memo(
  ({
    addChannelToSetData,
    onCancel,
    onOk,
    onChannelSelectedHandler,
  }: ChannelListAddModalProps) => {
    const { mutate } = useSWRConfig();
    const [currentPage, setCurrentPage] = useState(1);

    const [modalHasAction, setModalHasAction] = useState(false);
    const { data, isLoading } = useSWR(
      [`/channel/all/${currentPage}`],
      () =>
        getTGAIAllChannelList({
          current_page: currentPage,
          page_size: 25,
        }),
      { keepPreviousData: true },
    );

    const tableColumns: TableColumnProps<TGAIAllChannelList>[] = [
      {
        title: "群名字",
        dataIndex: "name",
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
            addChannelToSetData.mode === AddChannelModalType.ALL
          }
          className={"!w-[95%] md:!w-[80%] xl:!w-[900px]"}
          onOk={async () => {
            if (modalHasAction) return;

            setModalHasAction(true);

            await onOk();

            setCurrentPage(1);

            setModalHasAction(false);
          }}
          onCancel={() => {
            if (modalHasAction) {
              Message.warning("请等待请求结束！");
              return;
            }

            setCurrentPage(1);

            onCancel();
          }}
          autoFocus={false}
          focusLock={true}
        >
          <div className="flex flex-col gap-4">
            <Table
              data={data ? data.data.channels : undefined}
              columns={tableColumns}
              rowKey={"channel_id"}
              scroll={{ y: 350 }}
              pagination={{
                current: currentPage,
                pageSize: 25,
                total: data?.data.total,
                onChange: (pageNumber) => setCurrentPage(pageNumber),
                showTotal: true,
              }}
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
                    (row: TGAIAllChannelList) => row.channel_id,
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
                      data
                        ? data.data.channels.map(
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
              loading={isLoading || modalHasAction}
            />
          </div>
        </Modal>
      </>
    );
  },
);

ChannelListAddModal.displayName = "ChannelListAddModal";

export { ChannelListAddModal };
