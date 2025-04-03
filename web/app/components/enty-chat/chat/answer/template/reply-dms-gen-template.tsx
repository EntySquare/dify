'use client'

import React from 'react'

import classNames from '@/utils/classnames'
import AutoHeightTextarea from '@/app/components/base/auto-height-textarea/common'


type ReplyDmsGenTemplateProps = {
  name?: string
  username?: string
  content: string
  editingContent?: string
  onEditContentChange?: (value: string) => void
  children?: JSX.Element
  incomingMsg?: string
  isFirstAction: boolean
};

const ReplyDmsGenTemplate = React.memo<ReplyDmsGenTemplateProps>(
  ({ name, username, content, editingContent, onEditContentChange, children, incomingMsg, isFirstAction }) => {
    return (
      <div
        className={
          "bg-white dark:bg-black px-4 pt-5 flex flex-col items-end rounded-2xl border shadow-xs dark:shadow-gray-600 border-gray-200 dark:border-gray-600"
        }
      >
        {incomingMsg && (
          <div className='flex flex-col gap-1'>
            <span className='ml-1'>收到私信</span>
            <div
              className={
                classNames("mr-4 bg-[rgb(29,_155,_240)] py-3 px-4 rounded-3xl text-white hover:bg-[rgb(26,_140,_216)] text-[15px] break-words w-[408px] max-w-full font-medium mb-4", 'rounded-tl-[4px]')
              }
            >
              {incomingMsg}
            </div>
          </div>
        )}
        {!isFirstAction && (
          <div className='flex flex-col gap-1'>
            <span className='self-end mr-1'>回复内容</span>
            <div
              className={
                classNames("ml-4 bg-[rgb(29,_155,_240)] py-3 px-4 rounded-3xl text-white hover:bg-[rgb(26,_140,_216)] text-[15px] break-words w-[408px] max-w-full font-medium mb-4", 'rounded-br-[4px]')
              }
            >
              <AutoHeightTextarea
                value={editingContent ?? content}
                onChange={(e) => {
                  onEditContentChange && onEditContentChange(e.target.value)
                }}
                placeholder={'请输入私信内容...'}
                disabled={editingContent === undefined}
                className={classNames('!text-[15px] bg-transparent tgai-custom-scrollbar')}
              />
            </div>
          </div>
        )}
        {/*<div className={'mt-[6px] text-tgai-text-2 text-[13px] font-medium'}>6:34 PM</div>*/}
        {children}
      </div>
    );
  }
);

ReplyDmsGenTemplate.displayName = "ReplyDmsGenTemplate";

export default ReplyDmsGenTemplate;
