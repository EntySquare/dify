"use client";

import React, { useImperativeHandle, useRef } from "react";
import {
  Button,
  Form,
  Input,
  Message,
  Modal,
  Select,
  Switch,
  Table,
  TableInstance,
} from "@arco-design/web-react";
import {
  sendTwitter,
  selectTwitterUrl,
  tweetsUserNameList,
} from "@/service/xai";
import TextArea from "rc-textarea";

const FormItem = Form.Item;
const InputSearch = Input.Search;
const Option = Select.Option;

export type ReleaseModalType = string;

type ReleaseModalProps = {
  //   tweetsUrl: string | undefined;
};

export type ReleaseModalRefType = {
  show: () => Promise<ReleaseModalType | false>;
};

const ReleaseModal = React.forwardRef<ReleaseModalRefType, ReleaseModalProps>(
  ({}, ref) => {
    const [visible, setVisible] = React.useState(false);
    const [tableLoading, setTableLoading] = React.useState(false);
    const [releaseContent, setReleaseContent] = React.useState("");
    const [tweetsUserList, setTweetsUserList] = React.useState([] as any);
    const table = useRef<TableInstance>(null);
    // 用于存储选中的 username 的数组
    const [selectedUsernames, setSelectedUsernames] = React.useState([] as any);
    const [form] = Form.useForm<any>();
    const options = ["AI优化"];

    const getTweetsUserList = async () => {
      setTableLoading(true);
      const res = await tweetsUserNameList();
      setTweetsUserList(res.data.tweets_user_name_list);
      promiseRef.current?.resolve(false);
      setTableLoading(false);
    };

    const promiseRef = useRef<{
      resolve: (value: ReleaseModalType | false) => void;
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
        if (releaseContent === "") {
          Message.error("请输入推文内容");
          return;
        }
        if (!selectedUsernames.length) {
          Message.error("选择执行账号");
          return;
        }
        await sendTwitter(releaseContent, selectedUsernames, "");
        form.resetFields();
        setVisible(false);
        Message.success({
          content: "操作成功！请等待设备调备",
          duration: 5000,
        });
      } catch (error) {}
    };

    const changeReleaseContent = (event: any) => {
      setReleaseContent(event.target.value);
    };

    const handleCancel = () => {
      promiseRef.current?.resolve(false);
      form.resetFields();
      setVisible(false);
    };

    return (
      <Modal
        title="发布推文"
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        autoFocus={false}
        focusLock={true}
        maskClosable={false}
        unmountOnExit={true}
        mountOnEnter={true}
        className={"!w-[95%] md:!w-[85%] xl:!w-[30%] max-w-[1440px]"}
      >
        <Form
          form={form}
          labelAlign="left"
          layout="vertical"
          requiredSymbol={false}
        >
          <div>
            <div className="flex justify-between items-center">
              <div>推文内容</div>
              <div className="flex justify-end items-center">
                <Select
                  placeholder="请选择"
                  bordered={false}
                  style={{ minWidth: 100 }}
                  onChange={(value) => console.log("value", value)}
                >
                  {options.map((option, index) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
            <TextArea
              placeholder="请输入推文内容..."
              style={{
                minHeight: 70,
                padding: 10,
                width: "100%",
                backgroundColor: "rgba(242, 243, 245, 1)",
              }}
              onChange={changeReleaseContent}
            />
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
  }
);

ReleaseModal.displayName = "ReleaseModal";

export { ReleaseModal };
