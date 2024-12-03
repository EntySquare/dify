"use client";

import React, { useImperativeHandle, useRef, useState } from "react";
import s from "./list.module.css";
import {
  Button,
  Form,
  Input,
  InputTag,
  Message,
  Modal,
  Radio,
  Select,
  Space,
  Switch,
  Table,
  TableInstance,
  Typography,
} from "@arco-design/web-react";
import {
  commentTwitter,
  createIndividual,
  createSegText,
  selectTwitterUrl,
  tweetsUserNameList,
} from "@/service/xai";

const FormItem = Form.Item;
const InputSearch = Input.Search;
const Option = Select.Option;
const TextArea = Input.TextArea;

export type CreatSegTextType = string;

export type detailDataType = {
  dataset_id: string;
  document_id: string;
};

type CreatSegTextProps = {
  docDetailData: detailDataType;
  updateListData: () => void;
};

export type CreatSegTextRefType = {
  show: () => Promise<CreatSegTextType | false>;
};

const CreatSegTextModal = React.forwardRef<
  CreatSegTextRefType,
  CreatSegTextProps
>(({ docDetailData }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [qualityType, setQualityType] = React.useState(2);
  const [form] = Form.useForm<any>();
  const [loading, setLoading] = useState(false);
  const [keywordList, setKeywordList] = useState([] as any);
  const [answerText, setAnswerText] = useState("");
  const promiseRef = useRef<{
    resolve: (value: CreatSegTextType | false) => void;
  }>();

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      setAnswerText("");
      setKeywordList([]);
      return new Promise((resolve) => {
        promiseRef.current = { resolve };
      });
    },
  }));

  const changeQualityType = (value: any) => {
    setQualityType(value);
  };

  const handleConfirm = async () => {
    try {
      await form.validate();
      const { contentText } = form.getFields();
      if (
        contentText === "" ||
        contentText === undefined ||
        contentText === null
      ) {
        Message.error("请输入段落内容");
        return;
      }
      setLoading(true);
      const res = await createSegText({
        dataset_id: docDetailData.dataset_id,
        document_id: docDetailData.document_id,
        segments: [
          {
            answer: answerText,
            content: contentText,
            keywords: keywordList,
          },
        ],
      });
      if (res.code != 0) {
        Message.error({
          content: res.data?.data?.message,
        });
        return;
      }
      promiseRef.current?.resolve("成功");
      form.resetFields();
      setVisible(false);
      Message.success({
        content: "添加成功",
      });
    } catch (error: any) {
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
      title="添加段落"
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
      <Form form={form} requiredSymbol={false}>
        <FormItem
          label="段落内容"
          field="contentText"
          rules={[{ required: true, message: "请输入段落内容" }]}
        >
          <TextArea
            placeholder="请输入段落内容"
            style={{ minHeight: 76, width: "100%" }}
          />
        </FormItem>
        <FormItem label="回复内容">
          <TextArea
            value={answerText}
            placeholder="请输入回复内容（选填）"
            style={{ minHeight: 76, width: "100%" }}
            onChange={(value: any) => {
              setAnswerText(value);
            }}
          />
        </FormItem>
        <FormItem label="关键字">
          <InputTag
            allowClear
            value={keywordList}
            placeholder="请输入关键字（选填）"
            style={{ maxWidth: "100%" }}
            onChange={(value) => {
              setKeywordList(value);
            }}
          />
        </FormItem>
        <div className="flex justify-center items-center mt-4">
          <Button
            shape="round"
            type="primary"
            loading={loading}
            onClick={handleConfirm}
          >
            添加段落
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

CreatSegTextModal.displayName = "CreatSegTextModal";

export { CreatSegTextModal };
