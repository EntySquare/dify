'use client'

import React, { useImperativeHandle, useRef } from 'react'
import type { TableInstance } from '@arco-design/web-react'
import {
  Button,
  Form,
  Input,
  Message,
  Modal,
  Select,
} from '@arco-design/web-react'
import {
  selectTwitterUrl,
} from '@/service/xai'

const FormItem = Form.Item
const InputSearch = Input.Search
const Option = Select.Option

export type CommentModalType = string

type CommentModalProps = {
  //   tweetsUrl: string | undefined;
}

export type CommentModalRefType = {
  show: () => Promise<CommentModalType | false>
}

const CommentModal = React.forwardRef<CommentModalRefType, CommentModalProps>(
  ({ }, ref) => {
    const [visible, setVisible] = React.useState(false)
    const [sreachTweetsType, setSreachTweetsType] = React.useState(false)
    const [tableLoading, setTableLoading] = React.useState(false)
    const [tweetAccount, setTweetAccount] = React.useState('')
    const [tweetContent, setTweetContent] = React.useState('')
    const [tweetsUserList, setTweetsUserList] = React.useState([] as any)
    const table = useRef<TableInstance>(null)
    const [form] = Form.useForm<any>()
    const options = ['工作流']

    const sreachTweets = async (value: any) => {
      setSreachTweetsType(true)
      const res = await selectTwitterUrl(value)
      setTweetAccount(res.data.tweet_account)
      setTweetContent(res.data.content)
      promiseRef.current?.resolve('成啦！')
      setSreachTweetsType(false)
    }

    // const getTweetsUserList = async () => {
    //   setTableLoading(true);
    //   const res = await tweetsUserNameList();
    //   setTweetsUserList(res.data.tweets_user_name_list);
    //   promiseRef.current?.resolve(false);
    //   setTableLoading(false);
    // };

    const promiseRef = useRef<{
      resolve: (value: CommentModalType | false) => void
    }>()

    // 转换为对象数组
    const tableData = tweetsUserList.map((item: any, index: number) => ({
      key: index,
      username: item,
    }))

    // 定义表格的列
    const columns = [
      {
        title: '账号',
        dataIndex: 'username', // 表示 username 字段
      },
    ]

    useImperativeHandle(ref, () => ({
      show: () => {
        setVisible(true)
        setTweetAccount('')
        return new Promise((resolve) => {
          promiseRef.current = { resolve }
        })
      },
    }))

    const handleConfirm = async () => {
      try {
        await form.validate()
        const { searchUrl, timeInterval } = form.getFields()
        if (searchUrl === '' || searchUrl === undefined || searchUrl === null) {
          Message.error('请输入推文链接')
          return
        }
        if (timeInterval === '') {
          Message.error('请输入时间间隔')
          return
        }
        // await commentTwitter("111", [], searchUrl);
        form.resetFields()
        setVisible(false)
        Message.success({
          content: '操作成功！请等待设备调备',
          duration: 5000,
        })
      }
      catch (error) { }
    }

    const handleCancel = () => {
      promiseRef.current?.resolve(false)
      form.resetFields()
      setVisible(false)
    }

    return (
      <Modal
        title="创建宣推"
        visible={visible}
        footer={null}
        onCancel={handleCancel}
        autoFocus={false}
        focusLock={true}
        maskClosable={false}
        unmountOnExit={true}
        mountOnEnter={true}
        className={'!w-[95%] md:!w-[85%] xl:!w-[70%] max-w-[1440px]'}
      >
        <div className="flex flex-wrap justify-evenly items-start">
          <Form
            form={form}
            labelAlign="left"
            layout="vertical"
            style={{ width: 'max-content' }}
            requiredSymbol={false}
          >
            <div className={'mr-5'}>
              <div>
                <FormItem
                  label="搜索推文"
                  field="searchUrl"
                  rules={[{ required: true, message: '请输入推文链接' }]}
                >
                  <InputSearch
                    loading={sreachTweetsType}
                    searchButton="搜索"
                    allowClear
                    style={{ width: '500px' }}
                    placeholder="请输入推文链接"
                    onSearch={sreachTweets}
                  />
                </FormItem>
              </div>
              {tweetAccount && (
                <div className="border-dashed border-gray-200 border-2 p-2.5 mb-10">
                  <div className="mb-2">{tweetAccount}</div>
                  <div className="text-slate-500">{tweetContent}</div>
                </div>
              )}
              <div>
                <FormItem
                  label="间隔时间（通过右侧工具获取）"
                  field="timeInterval"
                  rules={[{ required: true, message: '请输入间隔时间' }]}
                >
                  <Input allowClear placeholder="Crontab表达式" />
                </FormItem>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <div>工作流</div>
                  <div className="flex justify-end items-center">
                    <Select
                      placeholder="请选择"
                      bordered={false}
                      style={{ minWidth: 100 }}
                      onChange={value => console.log('value', value)}
                    >
                      {options.map((option, index) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </Form>
          <iframe
            src="https://www.toolnb.com/tools/croncreate.html"
            width="550"
            height="700"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex justify-center items-center mt-10">
          <Button shape="round" type="primary" onClick={handleConfirm}>
            确认执行
          </Button>
        </div>
      </Modal>
    )
  },
)

CommentModal.displayName = 'CommentModal'

export { CommentModal }
