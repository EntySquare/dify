"use client";

import React, { useImperativeHandle, useRef, useState } from "react";
import useSWR, { mutate, useSWRConfig } from "swr";
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
import {
  commentTwitter,
  createIndividual,
  deleteDoc,
  getKnowledgeDoclist,
  selectTwitterUrl,
  tweetsUserNameList,
} from "@/service/xai";
import TextArea from "rc-textarea";
import { DocDetailsModal, DocDetailsRefType } from "./doc-details";

const FormItem = Form.Item;
const InputSearch = Input.Search;
const Option = Select.Option;

export type DetailsType = string;

export type detailDataType = {
  app_count: number;
  created_at: number;
  created_by: string;
  data_source_type: string;
  description: string;
  document_count: number;
  id: string;
  indexing_technique: string;
  name: string;
  permission: string;
  updated_at: number;
  updated_by: string;
  word_count: number;
};

type DetailsProps = {
  //   tweetsUrl: string | undefined;
  detailData: detailDataType;
  setDetailData: React.Dispatch<React.SetStateAction<detailDataType>>;
};

export type DetailsRefType = {
  show: () => Promise<DetailsType | false>;
};

const DetailsModal = React.forwardRef<DetailsRefType, DetailsProps>(
  ({ detailData, setDetailData }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const [form] = Form.useForm<any>();
    const [pageSize, setPageSize] = useState(1);
    const [limit, setLimit] = useState(10);
    const [documentId, setDocumentId] = useState("");
    const DocDetailsModalRef = useRef<DocDetailsRefType>(null);
    const {
      data: tableList,
      error,
      isLoading,
    } = useSWR(
      detailData?.id
        ? [
            `/knowledge/docList?page=${pageSize}&limit=${limit}&dataset_id=${detailData.id}`,
          ]
        : null,
      () => getKnowledgeDoclist(pageSize, limit, detailData.id)
    );

    const promiseRef = useRef<{
      resolve: (value: DetailsType | false) => void;
    }>();

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
        setPageSize(1);
        setLimit(10);
        return new Promise((resolve) => {
          promiseRef.current = { resolve };
        });
      },
    }));

    const formatSourceType = (type: any) => {
      switch (type) {
        case "upload_file":
          return "文件类型";
          break;
        case "upload_text":
          return "文本类型";
          break;
        default:
          return "其他";
          break;
      }
    };

    const formatSourceStatus = (status: any) => {
      switch (status) {
        case "completed":
          return "完成";
          break;
        default:
          return "其他";
          break;
      }
    };

    const columns: TableColumnProps[] = [
      {
        title: "文件名字",
        dataIndex: "name",
      },
      {
        title: "数据源类型",
        render: (_col, item) => (
          <div>{formatSourceType(item.data_source_type)}</div>
        ),
      },
      {
        title: "文件大小",
        render: (_col, item) => <div>{item.word_count} 字符</div>,
      },
      {
        title: "当前状态",
        render: (_col, item) => (
          <div>{formatSourceStatus(item.indexing_status)}</div>
        ),
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
              <Button
                type="secondary"
                size="small"
                onClick={() => {
                  onDocDetailHandler(item);
                }}
              >
                详情
              </Button>
              <Popconfirm
                focusLock
                title="提示"
                content="确定要删除该文件吗？"
                onOk={() => {
                  onDeleteHandler(item);
                }}
              >
                <Button type="secondary" status="danger" size="small">
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
    const onDocDetailHandler = async (item: any) => {
      await setDocumentId(item.id);
      const result = await DocDetailsModalRef.current!.show();
      if (!result) return;
      mutate([
        `/knowledge/docList?page=${pageSize}&limit=${limit}&dataset_id=${detailData.id}`,
      ]);
    };

    const onDeleteHandler = async (item: any) => {
      try {
        const res = await deleteDoc(detailData.id, item.id);
        if (res.code != 0) {
          Message.error({
            content: res.data?.data?.message,
          });
          return;
        }
        Message.success({
          content: "删除成功",
        });
        mutate([
          `/knowledge/docList?page=${pageSize}&limit=${limit}&dataset_id=${detailData.id}`,
        ]);
        setDetailData((prevDetailData: any) => ({
          ...prevDetailData,
          word_count: prevDetailData.word_count - item.word_count, // 假设 item 有 word_count
        }));
        promiseRef.current?.resolve("成功");
      } catch (error: any) {
        Message.error({
          content: "删除失败",
        });
      } finally {
      }
    };

    const handleCancel = () => {
      promiseRef.current?.resolve(false);
      form.resetFields();
      setVisible(false);
    };

    return (
      <Modal
        title="个体详情"
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        autoFocus={false}
        focusLock={true}
        unmountOnExit={true}
        mountOnEnter={true}
        className={"!w-[95%] md:!w-[85%] xl:!w-[100%] max-w-[1440px]"}
      >
        <Space
          style={{
            display: "grid",
            alignItems: "flex-start",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
          className={"mb-5"}
        >
          <Card>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <div className="flex">
                <div className="inline-block min-w-20 text-right">个体ID：</div>
                <div>{detailData.id}</div>
              </div>
              <div>
                <span className="inline-block min-w-20 text-right">
                  当前状态：
                </span>
                <span
                  className="inline-block px-1.5 rounded-sm"
                  style={{
                    backgroundColor: "rgba(232, 255, 234, 1)",
                    color: "green",
                    fontWeight: 700,
                  }}
                >
                  完整
                </span>
              </div>
              <div className="flex">
                <div className="inline-block min-w-20 text-right">
                  个体昵称：
                </div>
                <div>{detailData.name}</div>
              </div>
              <div>
                <span className="inline-block min-w-20 text-right">
                  创建时间：
                </span>
                {formatTime(detailData.created_at)}
              </div>
            </div>
          </Card>
          <Card>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <div className="flex">
                <div className="inline-block min-w-20 text-right">知识库：</div>
                <div>{tableList ? tableList.data.total : 0} 份</div>
              </div>
              <div className="flex">
                <div className="inline-block min-w-28 text-right">
                  知识库容量：
                </div>
                <div>{detailData.word_count} 字符</div>
              </div>
              <div className="flex">
                <div className="inline-block min-w-20 text-right">
                  推文喂料：
                </div>
                <div>{"0"} 条</div>
              </div>
              <div className="flex">
                <div className="inline-block min-w-28 text-right">
                  推文生产次数：
                </div>
                <div>{"0"} 次</div>
              </div>
              <div className="flex">
                <div className="inline-block min-w-20 text-right">
                  回复喂料：
                </div>
                <div>{"0"} 条</div>
              </div>
              <div className="flex">
                <div className="inline-block min-w-28 text-right">
                  回复生产次数：
                </div>
                <div>{"0"} 次</div>
              </div>
            </div>
          </Card>
        </Space>
        <Card>
          <Typography.Title heading={6}>相关知识库</Typography.Title>
          <Divider />
          <Table
            columns={columns}
            data={tableList ? tableList.data.data : undefined}
            pagination={false}
            loading={isLoading}
            rowKey={"id"}
          />
          <div className="pt-4">
            <Pagination
              size={"small"}
              total={tableList ? tableList.data.total : 0}
              showTotal
              sizeCanChange
              current={pageSize}
              pageSize={limit}
              onChange={(page) => {
                setPageSize(page); // 设置当前页码
              }}
              onPageSizeChange={(size: number, current: number) => {
                setPageSize(1);
                setLimit(size);
              }}
            />
          </div>
        </Card>
        <DocDetailsModal
          docDetailData={{
            dataset_id: detailData?.id || "",
            document_id: documentId,
          }}
          setDetailData={setDetailData}
          ref={DocDetailsModalRef}
        />
      </Modal>
    );
  }
);

DetailsModal.displayName = "DetailsModal";

export { DetailsModal };
