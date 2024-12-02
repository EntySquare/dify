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
import {
  commentTwitter,
  createIndividual,
  selectTwitterUrl,
  tweetsUserNameList,
} from "@/service/xai";
import TextArea from "rc-textarea";

const FormItem = Form.Item;
const InputSearch = Input.Search;
const Option = Select.Option;

export type CreatType = string;

type CreatProps = {
  //   tweetsUrl: string | undefined;
};

export type CreatRefType = {
  show: () => Promise<CreatType | false>;
};

const CreatIndividualModal = React.forwardRef<CreatRefType, CreatProps>(
  ({}, ref) => {
    const [visible, setVisible] = React.useState(false);
    const [qualityType, setQualityType] = React.useState(1);
    const [form] = Form.useForm<any>();
    const [loading, setLoading] = useState(false);
    const promiseRef = useRef<{
      resolve: (value: CreatType | false) => void;
    }>();

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true);
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
        const { userName } = form.getFields();
        if (userName === "" || userName === undefined || userName === null) {
          Message.error("请输入个体昵称");
          return;
        }
        setLoading(true);
        const res = await createIndividual({
          name: userName,
          permission: "all_team_members", //配置知识库权限
          indexing_technique: qualityType === 1 ? "high_quality" : "economy",
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
          content: "创建成功",
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
        title="创建个体"
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
            label="个体昵称"
            field="userName"
            rules={[{ required: true, message: "请输入个体昵称" }]}
          >
            <Input allowClear placeholder="请输入个体昵称" />
          </FormItem>
          <FormItem label="个体质量">
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
          <div className="flex justify-center items-center mt-4">
            <Button
              shape="round"
              type="primary"
              loading={loading}
              onClick={handleConfirm}
            >
              创建个体
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
);

CreatIndividualModal.displayName = "CreatIndividualModal";

export { CreatIndividualModal };
