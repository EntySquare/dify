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
import {
  selectTwitterUrl,
  supportTwitter,
  tweetsUserNameList,
} from "@/service/xai";

const FormItem = Form.Item;
const InputSearch = Input.Search;

export type PraiseModalType = string;

type PraiseModalProps = {
  //   tweetsUrl: string | undefined;
};

export type PraiseModalRefType = {
  show: () => Promise<PraiseModalType | false>;
};

const PraiseModal = React.forwardRef<PraiseModalRefType, PraiseModalProps>(
  ({}, ref) => {
    const [visible, setVisible] = React.useState(false);
    const [sreachTweetsType, setSreachTweetsType] = React.useState(false);
    const [tableLoading, setTableLoading] = React.useState(false);
    const [tweetAccount, setTweetAccount] = React.useState("");
    const [tweetContent, setTweetContent] = React.useState("");
    const [tweetsUserList, setTweetsUserList] = React.useState([] as any);
    const table = useRef<TableInstance>(null);
    // 用于存储选中的 username 的数组
    const [selectedUsernames, setSelectedUsernames] = React.useState([] as any);
    const [form] = Form.useForm<any>();

    const sreachTweets = async (value: any) => {
      setSreachTweetsType(true);
      const res = await selectTwitterUrl(value);
      setTweetAccount(res.data.tweet_account);
      setTweetContent(res.data.content);
      promiseRef.current?.resolve("成啦！");
      setSreachTweetsType(false);
    };

    const getTweetsUserList = async () => {
      setTableLoading(true);
      const res = await tweetsUserNameList();
      setTweetsUserList(res.data.tweets_user_name_list);
      promiseRef.current?.resolve(false);
      setTableLoading(false);
    };

    const promiseRef = useRef<{
      resolve: (value: PraiseModalType | false) => void;
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
        setTweetAccount("");
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
        const { searchUrl } = form.getFields();
        if (searchUrl === "" || searchUrl === undefined || searchUrl === null) {
          Message.error("请输入推文链接");
          return;
        }
        if (!selectedUsernames.length) {
          Message.error("选择执行账号");
          return;
        }
        await supportTwitter(selectedUsernames, searchUrl);
        form.resetFields();
        setVisible(false);
        Message.success({
          content: "操作成功！请等待设备调备",
          duration: 5000,
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
        title="点赞推文"
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
              label="搜索推文"
              field="searchUrl"
              rules={[{ required: true, message: "请输入推文链接" }]}
            >
              <InputSearch
                loading={sreachTweetsType}
                searchButton="搜索"
                allowClear
                placeholder="请输入推文链接"
                onSearch={sreachTweets}
              />
            </FormItem>
          </div>
          {tweetAccount && (
            <div className="border-dashed border-gray-200 border-2 p-2.5 mb-10">
              <div className="mb-2">{tweetAccount}</div>
              <div className="text-slate-500">{tweetContent}</div>
            </div>
          )}
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

PraiseModal.displayName = "PraiseModal";

export { PraiseModal };
