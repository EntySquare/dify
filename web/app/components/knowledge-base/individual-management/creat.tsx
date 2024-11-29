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

const CreatIndividualModal = React.forwardRef<
  CreatRefType,
  CreatProps
>(({ }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [form] = Form.useForm<any>();

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

  const handleConfirm = async () => {
    try {
      await form.validate();
      const { userName } = form.getFields();
      if (userName === "" || userName === undefined || userName === null) {
        Message.error("请输入个体昵称");
        return;
      }
      await createIndividual({
        name: userName,
        permission: "all_team_members", //配置知识库权限
      });
      promiseRef.current?.resolve("成功");
      form.resetFields();
      setVisible(false);
      Message.success({
        content: "创建成功",
      });
    } catch (error) { }
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
        <div>
          <FormItem
            label="个体昵称"
            field="userName"
            rules={[{ required: true, message: "请输入个体昵称" }]}
          >
            <Input allowClear placeholder="请输入个体昵称" />
          </FormItem>
        </div>
        <div className="flex justify-center items-center mt-4">
          <Button shape="round" type="primary" onClick={handleConfirm}>
            创建个体
          </Button>
        </div>
      </Form>
    </Modal>
  );
});

CreatIndividualModal.displayName = "CreatIndividualModal";

export { CreatIndividualModal };
