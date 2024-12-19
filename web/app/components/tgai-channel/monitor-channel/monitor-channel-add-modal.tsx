"use client";

import React, { useImperativeHandle, useRef } from "react";
import {
  Form,
  Input,
  Message,
  Modal,
  Radio,
  Select,
} from "@arco-design/web-react";
import { TGAIWorkflow } from "@/models/tgai-workflow";
import {
  createGroupListen,
  createGroupListenReq,
  updateTGAISingleStrategy,
} from "@/service/tgai";
import { TGAIAccount } from "@/models/tgai-user";

const FormItem = Form.Item;

export type MonitorChannelAddModalType = string;

type MonitorChannelAddModalProps = {
  workflowData: TGAIWorkflow[] | undefined;
  loggedAccountData: TGAIAccount[] | undefined;
};

export type MonitorChannelAddModalRefType = {
  show: (
    initData: createGroupListenReq
  ) => Promise<MonitorChannelAddModalType | false>;
};

const MonitorChannelAddModal = React.forwardRef<
  MonitorChannelAddModalRefType,
  MonitorChannelAddModalProps
>(({ workflowData, loggedAccountData }, ref) => {
  const [visible, setVisible] = React.useState(false);
  const [form] = Form.useForm<createGroupListenReq>();

  const promiseRef = useRef<{
    resolve: (value: MonitorChannelAddModalType | false) => void;
  }>();

  const singleTemplateOptions = loggedAccountData
    ? loggedAccountData.map((item) => ({
        label: item.phone,
        value: item.phone,
      }))
    : undefined;

  const workflowOptions = workflowData
    ? workflowData.map((item) => ({
        label: item.workflow_name,
        value: item.workflow_id,
      }))
    : undefined;

  useImperativeHandle(ref, () => ({
    show: (initData) => {
      setVisible(true);
      const { group_domain, phone, workflow_id } = initData;
      const selectedWorkflow = workflowData
        ? workflowData.find(
            (option) => option.workflow_id === initData.workflow_id
          )
        : undefined;
      form.setFieldsValue({
        workflow_id: selectedWorkflow
          ? selectedWorkflow.workflow_id
          : undefined,
        group_domain,
        phone,
      });
      return new Promise((resolve) => {
        promiseRef.current = { resolve };
      });
    },
  }));

  const handleConfirm = async () => {
    try {
      await form.validate();
      if (!workflowData || !loggedAccountData) return;

      const { group_domain, phone, workflow_id } = form.getFields();
      const workflow_name = workflowData.find(
        (workflow) => workflow.workflow_id === workflow_id
      )?.workflow_name;

      if (!(group_domain && phone && workflow_id && workflow_name)) return;
      await createGroupListen({
        group_domain,
        phone,
        workflow_id,
        workflow_name,
        state: "0",
      });
      promiseRef.current?.resolve("成啦！");
      setVisible(false);
    } catch (error) {}
  };
  const handleCancel = () => {
    promiseRef.current?.resolve(false);
    setVisible(false);
  };

  return (
    <Modal
      title="创建群监听"
      visible={visible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      autoFocus={false}
      focusLock={true}
      maskClosable={false}
      unmountOnExit={true}
      mountOnEnter={true}
    >
      <Form layout="vertical" form={form}>
        <FormItem
          label="群链接"
          field="group_domain"
          rules={[{ required: true, message: "请填写群链接" }]}
        >
          <Input
            style={{ width: "100%" }}
            allowClear
            placeholder="群链接 案例:xxxx"
            value={""}
            onChange={() => {}}
          />
        </FormItem>
        <FormItem
          label="执行账号"
          field="phone"
          rules={[{ required: true, message: "请选择执行账号" }]}
        >
          <Select placeholder="选择执行账号" options={singleTemplateOptions} />
        </FormItem>
        <FormItem
          label="任务"
          field="workflow_id"
          rules={[{ required: true, message: "请选择一个任务" }]}
        >
          <Select placeholder="选择任务" options={workflowOptions} />
        </FormItem>
      </Form>
    </Modal>
  );
});

MonitorChannelAddModal.displayName = "MonitorChannelAddModal";

export { MonitorChannelAddModal };
