"use client";

import {
  Button,
  Card,
  Divider,
  Input,
  Message,
  Modal,
} from "@arco-design/web-react";
import useSWR, { mutate } from "swr";
import { useCallback, useState } from "react";
import { diff } from "radash";
import { GroupInfoCard } from "./group-info-card";
import { SetChannelAddModal } from "./set-channel-add-modal";
import { ChannelListAddModal } from "./channel-list-add-modal";
import {
  createTGAIChannelSet,
  getTGAIChannelSets,
  updateTGAIChannelSetItem,
} from "@/service/tgai";

export enum AddChannelModalType {
  ACCOUNT_BASED = 1,
  ALL,
}

export const ChannelGroupCard = () => {
  const [createSetModalOpen, setCreateSetModalOpen] = useState(false);
  const [createSetName, setCreateSetName] = useState("");

  const [addChannelToSetData, setAddChannelToSetData] = useState<{
    channel_ids: number[];
    set_id: number | undefined;
    channels_snapshot: Set<number>;
    mode: AddChannelModalType | null;
  }>({
    channel_ids: [],
    set_id: undefined,
    channels_snapshot: new Set(),
    mode: null,
  });

  const { data: allSetsData, isLoading: isSetsLoading } = useSWR(
    ["/channel/getAllSet"],
    getTGAIChannelSets,
  );

  const onCreateSetClickHandler = useCallback(async () => {
    if (!createSetName) {
      Message.warning("请输入要创建的群组名称！");
      return;
    }

    try {
      const res = await createTGAIChannelSet(createSetName, []);
      setCreateSetModalOpen(false);
      setCreateSetName("");
      Message.success("创建群组成功！");
      mutate(["/channel/getAllSet"]);
    } catch (err) {}
  }, [createSetName]);

  const openSetChannelAddModal = useCallback(
    (
      set_id: number,
      channel_ids: number[],
      mode: AddChannelModalType | null,
    ) => {
      setAddChannelToSetData({
        set_id,
        channel_ids,
        channels_snapshot: new Set([...channel_ids]),
        mode,
      });
    },
    [],
  );

  const cancelSetChannelAddModal = useCallback(() => {
    setAddChannelToSetData({
      channel_ids: [],
      set_id: undefined,
      channels_snapshot: new Set(),
      mode: null,
    });
  }, []);

  const onSelectedChannelChanged = useCallback((values: number[]) => {
    setAddChannelToSetData((prev) => ({
      ...prev,
      channel_ids: values,
    }));
  }, []);

  const onUpdateChannelInSetHandler = useCallback(async () => {
    const { set_id, channel_ids, channels_snapshot } = addChannelToSetData;

    if (!set_id) {
      Message.error("未知错误，请尝试重新操作！");
      return;
    }
    try {
      const diff_from_snapshot = diff(channel_ids, [...channels_snapshot]);
      if (diff_from_snapshot.length > 0) {
        await updateTGAIChannelSetItem(set_id, diff_from_snapshot);
        Message.success("更新群组内的群成功！");
        mutate(["/channel/getAllSet"]);
      }
      setAddChannelToSetData({
        channel_ids: [],
        set_id: undefined,
        channels_snapshot: new Set(),
      });
    } catch (err) {}
  }, [addChannelToSetData]);

  return (
    <Card className={"px-4"}>
      <Button type="primary" onClick={() => setCreateSetModalOpen(true)}>
        创建群组
      </Button>
      <Divider />
      <Card bordered={false} loading={isSetsLoading} bodyStyle={{ padding: 0 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {allSetsData &&
            allSetsData.data.channel_sets.length > 0 &&
            allSetsData.data.channel_sets.map((set) => (
              <GroupInfoCard
                key={set.id}
                setData={set}
                onAddChannelToSet={openSetChannelAddModal}
              />
            ))}
        </div>
      </Card>
      <Modal
        visible={createSetModalOpen}
        onCancel={() => {
          setCreateSetModalOpen(false);
          setCreateSetName("");
        }}
        onConfirm={() => onCreateSetClickHandler()}
        title="新增群组"
        maskClosable={false}
      >
        <div className="flex flex-row gap-2 items-center">
          <span className="text-nowrap">群组名称</span>
          <Input
            placeholder="请输入群组名称"
            value={createSetName}
            onChange={setCreateSetName}
          />
        </div>
      </Modal>
      <SetChannelAddModal
        addChannelToSetData={addChannelToSetData}
        onCancel={cancelSetChannelAddModal}
        onChannelSelectedHandler={onSelectedChannelChanged}
        onOk={onUpdateChannelInSetHandler}
      />
      <ChannelListAddModal
        addChannelToSetData={addChannelToSetData}
        onCancel={cancelSetChannelAddModal}
        onChannelSelectedHandler={onSelectedChannelChanged}
        onOk={onUpdateChannelInSetHandler}
      />
    </Card>
  );
};
