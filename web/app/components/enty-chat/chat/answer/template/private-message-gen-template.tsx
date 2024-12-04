'use client'

import React from 'react'

type PrivateMessageGenTemplateProps = {
  name?: string
  username?: string
  content: string
  children?: JSX.Element
  incomingMsg?: string
}

const PrivateMessagetGenTemplate = React.memo<PrivateMessageGenTemplateProps>(({ name, username, content, children, incomingMsg }) => {
  return <div
    className={'bg-white dark:bg-black px-4 pt-5 flex flex-col items-end rounded-2xl border shadow-xs dark:shadow-gray-600 border-gray-200 dark:border-gray-600'}
  >
    <div
      className={'bg-[rgb(29,_155,_240)] py-3 px-4 rounded-3xl rounded-br-[4px] text-white hover:bg-[rgb(26,_140,_216)] text-[15px] break-words w-[408px] max-w-full font-medium'}
    >
      {content}
    </div>
    <div className={'mt-[6px] text-tgai-text-2 text-[13px] font-medium'}>6:34 PM</div>
    {
      children
    }
  </div>
})

PrivateMessagetGenTemplate.displayName = 'PrivateMessagetGenTemplate'

export default PrivateMessagetGenTemplate
