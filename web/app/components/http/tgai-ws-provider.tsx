'use client'

import type { MutableRefObject } from 'react'
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Divider, Message, Modal } from '@arco-design/web-react'
import { TGAI_WS_PREFIX } from '@/config'

// const TGAIWebSocketContext = createContext<{
//     ws: WebSocket | null,
//     messages: string[]
// }>({
//     ws: null,
//     messages: []
// });

function joinOrLeaveAllMessageGenerator(data: {
  types: any
  accounts: any
  operate_data: any
}) {
  const { types, accounts, operate_data } = data
  const title = types === 'join' ? '一键加入群组结果' : '一键退出群组结果'
  const content = <div className='flex flex-col gap-8 pb-8'>
    {(accounts.length && accounts.length > 0)
      ? accounts.map((account: string, index: number) => operate_data[account]
        ? <div className='flex flex-col gap-2' key={account}>
          <h2 className='text-xl font-semibold'>{account}</h2>
          {operate_data[account].message && <span>{operate_data[account].message}</span>}
          <div className='px-2 mt-6'>
            <div className='flex justify-between'>
              <span>成功数：<span className='text-red'>{operate_data[account].success_count}</span></span>
              <span>已加入数：<span className='text-red'>{operate_data[account].join_already_count}</span></span>
              <span>发送消息成功数：<span className='text-red'>{operate_data[account].send_success_count}</span></span>
            </div>
            <Divider />
            <div className='flex justify-between'>
              <span>失败数：<span className='text-red'>{operate_data[account].fail_count}</span></span>
              {types === 'join' && <span>已发送申请数：<span className='text-red'>{operate_data[account].invite_request_send_count}</span></span>}
              <span>搜索不到、禁止加入：<span className='text-red'>{operate_data[account].search_fail_count}</span></span>
            </div>
          </div>
          {index + 1 !== accounts.length && <Divider />}
        </div>
        : null)
      : '无操作账号'}
  </div>

  return {
    title,
    content,
  }
}

const TGAIWebSocketContext = createContext<{

  ws: MutableRefObject<WebSocket | null> | null
  messages: string[]
  awaitResponse: boolean
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void | 'start'
}
>({ ws: null, messages: [], send: (data) => {}, awaitResponse: false })

export const TGAIWebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<WebSocket | null>(null)
  const [messages, setMessages] = useState<string[]>([]) // Example: to store messages
  const [awaitResponse, setAwaitResponse] = useState(false)

  const initWebSocket = useCallback(() => {
    const ws = new WebSocket(TGAI_WS_PREFIX)

    ws.onopen = () => {
      console.log('WebSocket connected')
      setAwaitResponse(false)
    }

    ws.onmessage = (event) => {
      const newMessage = event.data
      setMessages(prev => [newMessage, ...prev]) // Store messages using useState
      setAwaitResponse(false)
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setAwaitResponse(false)
    }

    ws.onclose = () => {
      console.log('WebSocket disconnected')
      Message.error("连接断开！")
      setAwaitResponse(false)
    }

    return ws
  }, [])
  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (socketRef.current === null || socketRef.current.readyState === socketRef.current.CLOSED) {
      Message.warning('连接断开，尝试重新连接，请稍后重试！')
      const ws = initWebSocket()
      socketRef.current = ws
      return
    }

    if (socketRef.current.readyState === socketRef.current.CONNECTING) {
      Message.warning('服务正在连接中，请稍后重试！')
      return
    }

    if (awaitResponse) {
      Message.warning('上个请求仍未完成，请耐心等待！')
      return
    }

    if (socketRef.current.readyState === socketRef.current.OPEN) {
      setAwaitResponse(true)
      socketRef.current.send(data)
      return 'start'
    }
  }, [awaitResponse])

  useEffect(() => {
    // Check if the WebSocket instance already exists
    if (socketRef.current === null || (socketRef.current && socketRef.current.readyState === socketRef.current.CLOSED)) {
      const ws = initWebSocket()

      socketRef.current = ws
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.onclose = null
        socketRef.current.close()
        setAwaitResponse(false)
        socketRef.current = null // Reset the ref on cleanup
        console.log('WebSocket destroyed!')
      }
    }
  }, [])

  useEffect(() => {
    if (messages[0]) {
      try {
        const message = JSON.parse(messages[0])
        if (message.code === 0) {
          const res = message.data
          const { accounts, operate_data, types } = res

          accounts && operate_data && types && Modal.success({
            ...joinOrLeaveAllMessageGenerator({ accounts, operate_data, types }),
            maskClosable: false,
          })
        }
      }
      catch (err) {
        Message.error(`批量操作出错：${messages[0]}`)
      }
      finally {
        setMessages([])
      }
    }
  }, [messages])

  return (
    <TGAIWebSocketContext.Provider value={{ ws: socketRef, messages, send, awaitResponse }} >
      {children}
    </TGAIWebSocketContext.Provider >
  )
}

export const useTGAIWebSocket = () => {
  return useContext(TGAIWebSocketContext)
}
