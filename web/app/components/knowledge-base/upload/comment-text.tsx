"use client";

import React, { useImperativeHandle, useRef, useState } from "react";
import s from "./list.module.css";
import {
  Button,
  Form,
  Input,
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
import { createDocText, getKnowledgeList } from "@/service/xai";

const FormItem = Form.Item;
const InputSearch = Input.Search;
const Option = Select.Option;
const TextArea = Input.TextArea;

export type CommentTextType = string;

type CommentTextProps = {
  //   tweetsUrl: string | undefined;
};

export type CommentTextModalRefType = {
  show: () => Promise<CommentTextType | false>;
};

const CommentTextModal = React.forwardRef<
  CommentTextModalRefType,
  CommentTextProps
>(({}, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [qualityType, setQualityType] = React.useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const [selectedValues, setSelectedValues] = useState("");
  const [options, setOptions] = useState([] as any);
  const promiseRef = useRef<{
    resolve: (value: CommentTextType | false) => void;
  }>();

  const getIndividualList = async () => {
    setIsLoading(true);
    try {
      const res = await getKnowledgeList({ page: 1, limit: 999999999 });
      if (res.code != 0) {
        Message.error("查询个体列表失败");
        return;
      }
      setOptions(res.data.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      setQualityType(1);
      getIndividualList();
      return new Promise((resolve) => {
        promiseRef.current = { resolve };
      });
    },
  }));

  const handleChange = (value: string) => {
    setSelectedValues(value); // value 是一个数组，包含所有选中的 id
  };

  const changeQualityType = (value: any) => {
    setQualityType(value);
  };

  const handleConfirm = async () => {
    try {
      await form.validate();
      const { userName, docName, docContent } = form.getFields();
      if (userName === "" || userName === undefined || userName === null) {
        Message.error("请选择投喂个体");
        return;
      }
      if (docName === "" || docName === undefined || docName === null) {
        Message.error("请输入文档名称");
        return;
      }
      if (
        docContent === "" ||
        docContent === undefined ||
        docContent === null
      ) {
        Message.error("请输入文档内容");
        return;
      }
      setLoading(true);
      const res = await createDocText({
        dataset_id: selectedValues,
        text: docContent,
        name: docName,
        process_rule: {
          mode: "automatic",
        },
        indexing_technique: qualityType === 1 ? "high_quality" : "economy",
      });
      if (res.code != 0) {
        Message.error({
          content: res.data?.data?.message,
        });
      }
      promiseRef.current?.resolve("成功");
      form.resetFields();
      setVisible(false);
      Message.success({
        content: "投喂成功",
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
      title="文档投喂"
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
          label="投喂个体"
          field="userName"
          rules={[{ required: true, message: "请选择投喂的个体" }]}
        >
          <Select
            placeholder="请选择投喂的个体"
            style={{ width: 345 }}
            showSearch
            onChange={handleChange}
            filterOption={(inputValue, option: any) =>
              option?.props?.children
                .toLowerCase()
                .includes(inputValue.toLowerCase())
            }
            loading={isLoading}
          >
            {options.map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="文档质量">
          <Radio.Group
            name="card-radio-group"
            defaultValue={qualityType}
            onChange={changeQualityType}
          >
            {[
              { id: 1, title: "高质量", tip: "需要额外的费用" },
              { id: 2, title: "经济型", tip: "免费提供功能" },
            ].map((item) => {
              return (
                <Radio key={item.id} value={item.id}>
                  {({ checked }) => {
                    return (
                      <Space
                        align="start"
                        className={`${s.customRadioCard} ${
                          checked ? s.customRadioCardChecked : ""
                        }`}
                      >
                        <div className={s.customRadioCardMask}>
                          <div className={s.customRadioCardMaskDot}></div>
                        </div>
                        <div>
                          <div className={s.customRadioCardTitle}>
                            {item.title}
                          </div>
                          <Typography.Text type="secondary">
                            {item.tip}
                          </Typography.Text>
                        </div>
                      </Space>
                    );
                  }}
                </Radio>
              );
            })}
          </Radio.Group>
        </FormItem>
        <FormItem
          label="文档名称"
          field="docName"
          rules={[{ required: true, message: "请输入文档名称" }]}
        >
          <Input
            style={{ width: 350 }}
            allowClear
            placeholder="请输入文档名称"
          />
        </FormItem>
        <FormItem
          label="文档内容"
          field="docContent"
          rules={[{ required: true, message: "请输入文档内容" }]}
        >
          <TextArea
            placeholder="请输入文档内容"
            style={{ minHeight: 64, width: 350 }}
          />
        </FormItem>
        <div className="flex justify-center items-center mt-4">
          <Button
            shape="round"
            type="primary"
            loading={loading}
            onClick={handleConfirm}
          >
            提交投喂
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

CommentTextModal.displayName = "CommentTextModal";

export { CommentTextModal };
