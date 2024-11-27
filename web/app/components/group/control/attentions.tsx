"use client";

import React, { useImperativeHandle, useRef } from "react";
import {
  Button,
  Form,
  Input,
  Message,
  Modal,
  Table,
  TableInstance,
} from "@arco-design/web-react";
import { followTwitterUser, tweetsUserNameList } from "@/service/xai";
import { useSWRConfig } from "swr";

const FormItem = Form.Item;
const InputSearch = Input.Search;

export type AttentionsModalType = string;

type AttentionsModalProps = {
  //   tweetsUrl: string | undefined;
};

export type AttentionsModalRefType = {
  show: () => Promise<AttentionsModalType | false>;
};

const AttentionsModal = React.forwardRef<
  AttentionsModalRefType,
  AttentionsModalProps
>(({}, ref) => {
  const { mutate } = useSWRConfig();
  const [visible, setVisible] = React.useState(false);
  const [tableLoading, setTableLoading] = React.useState(false);
  const [tweetsUserList, setTweetsUserList] = React.useState([] as any);
  const table = useRef<TableInstance>(null);
  // 用于存储选中的 username 的数组
  const [selectedUsernames, setSelectedUsernames] = React.useState([] as any);
  const [form] = Form.useForm<any>();
  const [userNameText, setUserNameText] = React.useState("");

  const getTweetsUserList = async () => {
    setTableLoading(true);
    const res = await tweetsUserNameList();
    setTweetsUserList(res.data.tweets_user_name_list);
    setTableLoading(false);
  };

  const promiseRef = useRef<{
    resolve: (value: AttentionsModalType | false) => void;
  }>();

  // 转换为对象数组
  const tableData = tweetsUserList.map((item: any, index: number) => ({
    key: index,
    username: item,
  }));

  // 定义表格的列
  const columns = [
    {
      title: "账号",
      dataIndex: "username", // 表示 username 字段
    },
  ];

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      getTweetsUserList();
      return new Promise((resolve) => {
        promiseRef.current = { resolve };
      });
    },
  }));

  const changeUserName = (value: any) => {
    setUserNameText(value);
  };

  // 处理选中项的变化
  const handleRowSelectionChange = (
    selectedRowKeys: any[],
    selectedRows: any[]
  ) => {
    const usernames = selectedRows.map((row) => row.username); // 提取 username
    setSelectedUsernames(usernames); // 更新状态
  };

  const handleConfirm = async () => {
    try {
      await form.validate();
      const { userName } = form.getFields();
      if (
        userNameText === "" ||
        userNameText === undefined ||
        userNameText === null
      ) {
        Message.error("请输入要关注的用户名");
        return;
      }
      if (!selectedUsernames.length) {
        Message.error("选择执行账号");
        return;
      }
      await followTwitterUser(selectedUsernames, userNameText);
      promiseRef.current?.resolve("成啦！");
      form.resetFields();
      setVisible(false);
      Message.success({
        content: "操作成功",
      });
    } catch (error) {}
  };
  const handleCancel = () => {
    promiseRef.current?.resolve(false);
    form.resetFields();
    setVisible(false);
  };

  return (
    <Modal
      title="关注用户"
      visible={visible}
      footer={null}
      onCancel={handleCancel}
      autoFocus={false}
      focusLock={true}
      maskClosable={false}
      unmountOnExit={true}
      mountOnEnter={true}
      className={"!w-[95%] md:!w-[85%] xl:!w-[35%] max-w-[1440px]"}
    >
      <Form
        form={form}
        labelAlign="left"
        layout="vertical"
        requiredSymbol={false}
      >
        <div>
          <FormItem
            label="用户名"
            field="userName"
            rules={[{ required: true, message: "请输入要关注的用户名" }]}
          >
            <Input
              value={userNameText}
              allowClear
              placeholder="示例：@abc123ABC"
              onChange={changeUserName}
            />
          </FormItem>
        </div>
        <div className="mb-2 mt-2">选择执行账号</div>
        <Table
          loading={tableLoading}
          ref={table}
          virtualized
          scroll={{
            y: 700,
          }}
          border
          columns={columns}
          data={tableData}
          pagination={false}
          rowSelection={{
            onChange: handleRowSelectionChange, // 监听选中项变化
          }}
        />
        <div className="flex justify-center items-center mt-10">
          <Button shape="round" type="primary" onClick={handleConfirm}>
            确认执行（{selectedUsernames.length}）
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

AttentionsModal.displayName = "AttentionsModal";

export { AttentionsModal };
