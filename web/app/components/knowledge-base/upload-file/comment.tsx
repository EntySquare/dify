"use client";

import React, { useImperativeHandle, useRef, useState } from "react";
import {
  Button,
  Form,
  Input,
  Message,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  TableInstance,
  Upload,
} from "@arco-design/web-react";
import {
  commentTwitter,
  createDocFile,
  getKnowledgeList,
  selectTwitterUrl,
  tweetsUserNameList,
} from "@/service/xai";
import TextArea from "rc-textarea";

const FormItem = Form.Item;
const InputSearch = Input.Search;
const Option = Select.Option;

export type CommentModalType = string;

type CommentModalProps = {
  //   tweetsUrl: string | undefined;
};

export type CommentModalRefType = {
  show: () => Promise<CommentModalType | false>;
};

const CommentModal = React.forwardRef<CommentModalRefType, CommentModalProps>(
  ({ }, ref) => {
    const [visible, setVisible] = useState(false);
    const table = useRef<TableInstance>(null);
    const [form] = Form.useForm<any>();
    const [fileData, setFileData] = useState<File | null>(null)
    const [options, setOptions] = useState([] as any);
    const [selectedValues, setSelectedValues] = useState('');

    const promiseRef = useRef<{
      resolve: (value: CommentModalType | false) => void;
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

    const isAcceptFile = (file: any, accept: any) => {
      if (accept && file) {
        const accepts = Array.isArray(accept)
          ? accept
          : accept
            .split(',')
            .map((x: any) => x.trim())
            .filter((x: any) => x);
        const fileExtension = file.name.indexOf('.') > -1 ? file.name.split('.').pop() : '';
        return accepts.some((type: any) => {
          const text = type && type.toLowerCase();
          const fileType = (file.type || '').toLowerCase();
          if (text === fileType) {
            return true;
          }
          if (new RegExp('\/\*').test(text)) {
            // image/* 这种通配的形式处理
            const regExp = new RegExp('\/.*$')
            return fileType.replace(regExp, '') === text.replace(regExp, '');
          }
          if (new RegExp('\..*').test(text)) {
            // .jpg 等后缀名
            return text === `.${fileExtension && fileExtension.toLowerCase()}`;
          }
          return false;
        });
      }
      return !!file;
    }

    const handleChange = (value: string) => {
      setSelectedValues(value); // value 是一个数组，包含所有选中的 id
    };

    const handleConfirm = async () => {
      try {
        await form.validate();
        const { searchUrl, timeInterval } = form.getFields();
        if (searchUrl === "" || searchUrl === undefined || searchUrl === null) {
          Message.error("请选择投喂个体");
          return;
        }
        await createDocFile({
          file: fileData, dataset_id: selectedValues, data: {
            "indexing_technique": "high_quality",
            "process_rule": {
              "rules": "",
              "mode": "automatic"
            }
          }
        })
        form.resetFields();
        setVisible(false);
        Message.success({
          content: "投喂成功",
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
        title="文件投喂"
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
        <div className="flex flex-wrap justify-evenly items-start">
          <Form
            form={form}
            style={{ width: "max-content" }}
            requiredSymbol={false}
          >
            <FormItem
              label="投喂个体"
              field="searchUrl"
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
              label="上传文件"
              field=""
            >
              <Upload
                drag
                multiple
                accept='text/plain'
                action='/'
                onDrop={(e) => {
                  console.log('uploadFile', e);
                  let uploadFile = e.dataTransfer.files[0]
                  if (isAcceptFile(uploadFile, 'text/plain')) {
                    return
                  } else {
                    Message.info('不接受的文件类型，请重新上传指定文件类型~');
                  }
                }}
                beforeUpload={async (file, fileList) => {
                  setFileData(file);
                  return true;
                }}
                tip='仅支持上传 txt 文件'
                limit={1}
              />
            </FormItem>
          </Form>
        </div>
        <div className="flex justify-center items-center mt-10">
          <Button shape="round" type="primary" onClick={handleConfirm}>
            提交喂料
          </Button>
        </div>
      </Modal>
    );
  }
);

CommentModal.displayName = "CommentModal";

export { CommentModal };
