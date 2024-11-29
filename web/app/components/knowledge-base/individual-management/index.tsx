"use client";

import type { TableColumnProps } from "@arco-design/web-react";
import {
  Button,
  Card,
  Divider,
  Message,
  Pagination,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tooltip,
  Typography,
} from "@arco-design/web-react";
import {
  IconDelete,
  IconEdit,
  IconMessage,
  IconPause,
  IconPlayArrow,
  IconPlus,
} from "@arco-design/web-react/icon";
import useSWR, { useSWRConfig } from "swr";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AxiosError } from "axios";
import type { TGAIGroupStrategy } from "@/models/tgai-strategy";
import { getKnowledgeList } from "@/service/xai";
import { CreatIndividualModal, CreatRefType } from "./creat";
import { DetailsModal, DetailsRefType } from "./details";

const SWR_KEYS = [
  "/knowledge/list",
  "/template/getActiveTemplateList",
  "/account/hasLogged",
  "/channel/getAllSet",
];

export const KnowledgeBaseIndividualManagementHomeView = () => {
  const { mutate } = useSWRConfig();
  const [pageSize, setPageSize] = useState(1)
  const [limit, setLimit] = useState(10)
  const { data: knowledgeList, isLoading } = useSWR(
    [`/knowledge/list?page=${pageSize}&limit=${limit}`],
    () => getKnowledgeList(pageSize, limit)
  );
  const CreatIndividualModalRef = useRef<CreatRefType>(null);
  const DetailsModalRef = useRef<DetailsRefType>(null);
  const [detailData, setDetailData] = useState([] as any)

  const onClickHandler = async () => {
    const result = await CreatIndividualModalRef.current!.show();
    if (!result) return;
    mutate([`/knowledge/list?page=${pageSize}&limit=${limit}`]);
  };

  const formatTime = (timestamp: any) => {
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以要加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const formatPermission = (time: any) => {
    switch (time) {
      case 'only_me':
        return '仅自己'
        break;
      case 'all_team_members':
        return '所有团队成员'
        break;
      case 'partial_members':
        return '部分团队成员'
        break;
      default:
        return ''
        break;
    }
  }

  const formatSourceType = (type: any) => {
    switch (type) {
      case 'upload_file':
        return '文件类型'
        break;
      case 'upload_text':
        return '文本类型'
        break;
      default:
        return '其他'
        break;
    }
  }

  const onDetailHandler = async (item: any) => {
    await setDetailData(item)
    const result = await DetailsModalRef.current!.show();
    if (!result) return;
    mutate([`/knowledge/list?page=${pageSize}&limit=${limit}`]);
  }

  const columns: TableColumnProps<any>[] = [
    // {
    //   title: "序号",
    //   render: (_col, item, index) => index + 1,
    // },
    {
      title: "个体ID",
      dataIndex: "id",
      width: 200
    },
    {
      title: "个体昵称",
      dataIndex: "name",
    },
    {
      title: "数据源类型",
      render: (_col, item) => <div>{formatSourceType(item.data_source_type)}</div>,
    },
    {
      title: "文档数量",
      dataIndex: "document_count",
    },
    {
      title: "知识库容量",
      render: (_col, item) => <div>{item.word_count} 字符</div>,
    },
    {
      title: "权限",
      render: (_col, item) => <div>{formatPermission(item.permission)}</div>,
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
              onClick={() => { onDetailHandler(item) }}
            >
              详情
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Card className={"px-4"}>
      <Typography.Title heading={5}>个体管理</Typography.Title>
      <Divider />
      <Space direction="vertical">
        <div>
          <Space>
            <Button type="outline" size="small" onClick={onClickHandler}>
              创建个体
            </Button>
          </Space>
        </div>
      </Space>
      <Divider />
      <Table
        columns={columns}
        data={knowledgeList ? knowledgeList.data.data : undefined}
        pagination={false}
        loading={isLoading}
        rowKey={"id"}
      />
      <div className="pt-4">
        <Pagination size={'small'} total={knowledgeList?.data.total || 0} showTotal sizeCanChange current={pageSize} pageSize={limit} onChange={(page) => {
          setPageSize(page); // 设置当前页码
        }} onPageSizeChange={(size: number, current: number) => {
          setPageSize(1)
          setLimit(size)
        }} />
      </div>
      <CreatIndividualModal ref={CreatIndividualModalRef} />
      <DetailsModal detailData={detailData} ref={DetailsModalRef} />
    </Card>
  );
};
