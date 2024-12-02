"use client";

import React, { useImperativeHandle, useRef, useState } from "react";
import s from './list.module.css'
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
  getKnowledgeList,
  selectTwitterUrl,
  tweetsUserNameList,
} from "@/service/xai";
import TextArea from "rc-textarea";

const FormItem = Form.Item;
const InputSearch = Input.Search;
const Option = Select.Option;

export type CommentType = string;

type CommentProps = {
  //   tweetsUrl: string | undefined;
};

export type ReplyModalRefType = {
  show: () => Promise<CommentType | false>;
};

const ReplyModal = React.forwardRef<
  ReplyModalRefType,
  CommentProps
>(({ }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [qualityType, setQualityType] = React.useState(1);
  const [form] = Form.useForm<any>();
  const [options, setOptions] = useState([] as any);
  const [selectedValues, setSelectedValues] = useState('');
  const promiseRef = useRef<{
    resolve: (value: CommentType | false) => void;
  }>();

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      getIndividualList();
      return new Promise((resolve) => {
        promiseRef.current = { resolve };
      });
    },
  }));

  const getIndividualList = async () => {
    try {
      const res = await getKnowledgeList({ page: 1, limit: 999999999 })
      setOptions(res.data.data)
    } catch (error) { }
  }

  const handleChange = (value: string) => {
    setSelectedValues(value); // value 是一个数组，包含所有选中的 id
  };

  const changeQualityType = (value: any) => {
    setQualityType(value)
  }

  const handleConfirm = async () => {
    try {
      await form.validate();
      const { userName } = form.getFields();
      if (userName === "" || userName === undefined || userName === null) {
        Message.error("请选择投喂个体");
        return;
      }
      const res = await createIndividual({
        name: '',
        permission: "all_team_members", //配置知识库权限
        indexing_technique: qualityType === 1 ? 'high_quality' : 'economy'
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
        content: "创建成功",
      });
    } catch (error: any) {

    }
  };

  const handleCancel = () => {
    promiseRef.current?.resolve(false);
    form.resetFields();
    setVisible(false);
  };

  return (
    <Modal
      title="单条添加（回复模版）"
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
            placeholder='请选择投喂的个体'
            style={{ width: 345 }}
            showSearch
            onChange={handleChange}
          >
            {options.map((item: any) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          label="个体质量"
        >
          <Radio.Group name='card-radio-group' defaultValue={qualityType} onChange={changeQualityType}>
            {[{ id: 1, title: '高质量', tip: '需要额外的费用' }, { id: 2, title: '经济型', tip: '免费提供功能' }].map((item) => {
              return (
                <Radio key={item.id} value={item.id}>
                  {({ checked }) => {
                    return (
                      <Space
                        align='start'
                        className={`${s.customRadioCard} ${checked ? s.customRadioCardChecked : ''}`}
                      >
                        <div className={s.customRadioCardMask}>
                          <div className={s.customRadioCardMaskDot}></div>
                        </div>
                        <div>
                          <div className={s.customRadioCardTitle}>{item.title}</div>
                          <Typography.Text type='secondary'>{item.tip}</Typography.Text>
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
          <Button shape="round" type="primary" onClick={handleConfirm}>
            创建个体
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

ReplyModal.displayName = "ReplyModal";

export { ReplyModal };
