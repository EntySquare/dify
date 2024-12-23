"use client";

import type { TableColumnProps } from "@arco-design/web-react";
import {
  Button,
  Card,
  Divider,
  Link,
  Message,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
} from "@arco-design/web-react";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useSWR, { useSWRConfig } from "swr";
import { useShallow } from "zustand/react/shallow";
import {
  createGroupListenReq,
  deleteGroupListen,
  getGroupListenCurrent,
  getGroupListenList,
  getTGAIAllChannelList,
  getTGAIAllWorkflows,
  getTGAILoggedAccount,
  updateGroupListen,
} from "@/service/tgai";
import { Input } from "@arco-design/web-react";
import {
  MonitorChannelAddModal,
  MonitorChannelAddModalRefType,
} from "./monitor-channel-add-modal";

export const MonitorChannelListCard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bthLoading, setBthLoading] = useState(false);
  const [phone, setPhone] = useState<string>();
  const monitorChannelAddModalRef = useRef<MonitorChannelAddModalRefType>(null);
  const [deleteLoadingState, setDeleteLoadingState] = useState<Set<number>>(
    new Set()
  );
  const { data: groupListenCurrent } = useSWR(
    ["/groupListen/current"],
    getGroupListenCurrent
  );
  const { data: loggedAccount } = useSWR(
    ["/account/hasLogged"],
    getTGAILoggedAccount
  );
  const { data: workflowsData } = useSWR(
    ["/workflow/all"],
    getTGAIAllWorkflows
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

  const { mutate } = useSWRConfig();

  const { data, isLoading } = useSWR(
    [`/groupListen/list?current_page=${currentPage}&page_size=25`],
    () => getGroupListenList(currentPage, 25),
    { keepPreviousData: true }
  );

  const columns: TableColumnProps<createGroupListenReq>[] = [
    {
      title: "账号",
      dataIndex: "phone",
    },
    {
      title: "群名",
      dataIndex: "group_name",
    },
    {
      title: "群用户名",
      dataIndex: "group_domain",
    },
    {
      title: "任务ID",
      dataIndex: "workflow_id",
    },
    {
      title: "任务名",
      dataIndex: "workflow_name",
    },
    {
      title: "监听状态",
      render: (_col, item) => {
        let statusText;
        let statusStyle;
        switch (item.state) {
          case "0":
            statusText = "未执行";
            statusStyle = { color: "#fb006d" };
            break;
          case "1":
            statusText = "已执行";
            statusStyle = { color: "#00b42a" };
            break;
          default:
            statusText = "未知状态";
            statusStyle = { color: "#ccc" };
            break;
        }

        return <div style={statusStyle}>{statusText}</div>;
      },
    },
    {
      title: "操作",
      render: (_col, item) => (
        <div>
          <Popconfirm
            title={"删除任务"}
            content={"确认删除此任务？"}
            onOk={() => {
              delGroupTask(item.id!);
            }}
          >
            <Button loading={deleteLoadingState.has(item.id!)} status="danger">
              删除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const showAddModal = async (data: any) => {
    const result = await monitorChannelAddModalRef.current!.show(data);
    if (!result) return;

    Message.success("创建成功！");
    mutate(
      [`/groupListen/list?current_page=${currentPage}&page_size=25`],
      undefined
    );
  };

  const changeMonitorUser = async () => {
    if (phone === undefined || phone === "" || phone === null) {
      Message.error("请选择执行账号");
      return;
    }
    if (groupListenCurrent?.data === phone) {
      Message.error("该账号执行中");
      return;
    }
    try {
      setBthLoading(true);
      await updateGroupListen({
        old_phone: groupListenCurrent ? groupListenCurrent?.data : "",
        new_phone: phone,
        state: "1",
      });
      Message.success("执行成功！");
      mutate(
        [`/groupListen/list?current_page=${currentPage}&page_size=25`],
        undefined
      );
      mutate(["/groupListen/current"], undefined);
    } catch (error) {
    } finally {
      setBthLoading(false);
    }
  };
  const delGroupTask = useCallback(async (id: number) => {
    try {
      setDeleteLoadingState((prev) => new Set(prev.add(id)));
      await deleteGroupListen(id);
      Message.success("删除成功！");
      mutate(
        [`/groupListen/list?current_page=${currentPage}&page_size=25`],
        undefined
      );
      mutate(["/groupListen/current"], undefined);
    } catch (err) {
    } finally {
      setDeleteLoadingState((prev) => {
        prev.delete(id);
        return new Set(prev);
      });
    }
  }, []);

  return (
    <Card className={"px-4"}>
      <div className="flex flex-row justify-between items-center">
        <Typography.Title heading={5}>群监听列表</Typography.Title>
        <Button
          type="primary"
          loading={isLoading}
          onClick={() => {
            mutate(
              [`/groupListen/list?current_page=${currentPage}&page_size=25`],
              undefined
            );
            mutate(["/groupListen/current"], undefined);
          }}
        >
          刷新
        </Button>
      </div>
      <Divider />
      <Space direction="vertical">
        <Button type="primary" onClick={showAddModal}>
          创建群监听
        </Button>
        <Space className={"my-2.5"}>
          <Typography.Text>
            当前执行账号：
            {groupListenCurrent ? groupListenCurrent?.data || "暂无执行账号"  : "暂无执行账号"}
          </Typography.Text>
        </Space>
        <Space>
          {/* <Typography.Text>修改执行账号:</Typography.Text> */}
          <Select
            placeholder={"选择执行账号"}
            style={{ width: 220 }}
            value={phone}
            onChange={setPhone}
            options={accountOptions}
          />
          <Button
            type="primary"
            loading={bthLoading}
            onClick={changeMonitorUser}
          >
            执行监听
          </Button>
        </Space>
      </Space>

      <Divider />
      <Table
        // size={"mini"}
        columns={columns}
        loading={isLoading}
        data={
          data
            ? data.data.group_listen_list === null
              ? []
              : data.data.group_listen_list
            : undefined
        }
        pagination={{
          current: currentPage,
          pageSize: 25,
          total: data?.data.total,
          onChange: (pageNumber) => setCurrentPage(pageNumber),
          showTotal: true,
        }}
        rowKey={"id"}
      />
      <MonitorChannelAddModal
        ref={monitorChannelAddModalRef}
        workflowData={
          workflowsData ? workflowsData.data.workflow_array : undefined
        }
        loggedAccountData={loggedAccount ? loggedAccount.data : undefined}
      />
    </Card>
  );
};
