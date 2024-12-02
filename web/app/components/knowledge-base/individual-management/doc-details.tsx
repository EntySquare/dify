"use client";

import React, { useImperativeHandle, useRef, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Message,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  TableColumnProps,
  TableInstance,
  Typography,
} from "@arco-design/web-react";
import { deleteSeg, getKnowledgeDocDetail } from "@/service/xai";
import { detailDataType } from "./details";

export type DocDetailsType = string;

export type docDetailDataType = {
  dataset_id: string;
  document_id: string;
};

type DocDetailsProps = {
  docDetailData: docDetailDataType;
  updateListData: () => void;
};

export type DocDetailsRefType = {
  show: () => Promise<DocDetailsType | false>;
};

const DocDetailsModal = React.forwardRef<DocDetailsRefType, DocDetailsProps>(
  ({ docDetailData, updateListData }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [form] = Form.useForm<any>();
    const [tableList, setTableList] = useState([] as any);
    const promiseRef = useRef<{
      resolve: (value: DocDetailsType | false) => void;
    }>();

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
        setTableList([]);
        getDocDetailsList();
        return new Promise((resolve) => {
          promiseRef.current = { resolve };
        });
      },
    }));

    const getDocDetailsList = async () => {
      setIsLoading(true);
      try {
        const res = await getKnowledgeDocDetail(
          docDetailData.dataset_id,
          docDetailData.document_id
        );
        if (res.code != 0) {
          Message.error("查询文档失败");
          return;
        }
        setTableList(res.data.data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    const columns: TableColumnProps[] = [
      {
        title: "个体ID",
        render: (_col, item) => <div>{docDetailData.dataset_id || "-"}</div>,
        width: 200,
      },
      {
        title: "文档ID",
        render: (_col, item) => <div>{docDetailData.document_id || "-"}</div>,
        width: 200,
      },
      {
        title: "文件大小",
        render: (_col, item) => <div>{item.word_count} 字符</div>,
      },
      {
        title: "文件内容",
        render: (_col, item) => <div>{item.content}</div>,
        width: 300,
      },
      {
        title: "创建时间",
        render: (_col, item) => <div>{formatTime(item.created_at)}</div>,
      },
      {
        title: "操作",
        render: (_col, item) => (
          <div>
            <div className="flex items-center justify-start gap-2 my-2">
              <Popconfirm
                focusLock
                title="提示"
                content="确定要删除该文档分段吗？"
                onOk={() => {
                  onDeleteHandler(item);
                }}
              >
                <Button
                  type="secondary"
                  loading={loading}
                  status="danger"
                  size="small"
                >
                  删除
                </Button>
              </Popconfirm>
            </div>
          </div>
        ),
      },
    ];

    const formatTime = (timestamp: any) => {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从0开始，所以要加1
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const onDeleteHandler = async (item: any) => {
      try {
        setLoading(true);
        const res = await deleteSeg(
          docDetailData.dataset_id,
          docDetailData.document_id,
          item.id
        );
        if (res.code != 0) {
          Message.error({
            content: res.data?.data?.message,
          });
          return;
        }
        Message.success({
          content: "删除成功",
        });
        updateListData();
        promiseRef.current?.resolve("成功");
        form.resetFields();
        setVisible(false);
      } catch (error: any) {
        Message.error({
          content: "删除失败",
        });
      } finally {
        setLoading(false);
      }
    };

    const handleCancel = () => {
      promiseRef.current?.resolve(false);
      form.resetFields();
      setVisible(false);
    };

    return (
      <Modal
        title="文档详情"
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        autoFocus={false}
        focusLock={true}
        unmountOnExit={true}
        mountOnEnter={true}
        className={"!w-[95%] md:!w-[85%] xl:!w-[70%] max-w-[1440px]"}
      >
        <Card>
          <Table
            columns={columns}
            data={tableList}
            pagination={false}
            loading={isLoading}
            rowKey={"id"}
          />
        </Card>
      </Modal>
    );
  }
);

DocDetailsModal.displayName = "DocDetailsModal";

export { DocDetailsModal };
