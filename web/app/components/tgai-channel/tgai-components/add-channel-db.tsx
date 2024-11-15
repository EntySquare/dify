'use client'

import {Button, Input, Message, Select} from '@arco-design/web-react'
import React, {useMemo, useState} from 'react'
import {channelAdd, getTGAILoggedAccount} from '@/service/tgai'
import useSWR from "swr";


export const AddChannelDbTemplate = React.memo(({fun}:{
  fun: () => void
})=> {
  const [msg, setMsg] = useState('')
  const [phone, setPhone] = useState<string>()
  const [isTesting, setIsTesting] = useState(false)
  const { data: loggedAccount } = useSWR(['/account/hasLogged'], getTGAILoggedAccount)
  const accountOptions = useMemo(() => loggedAccount ? loggedAccount.data.map(account => ({
    value: account.phone,
    label: account.phone
  })) : undefined, [loggedAccount])


  const onClick = async () => {
    if (!phone) {
      Message.warning("请先选择账号！")
      return
    }
    try {
      await channelAdd(msg,phone)
      fun();
      Message.success('添加成功！')
    }
    catch (_err) {
      // Message.error('添加失败！')
    }
    // alert(msg)
  }
  return <>
    <div className="flex flex-row items-center">
      <span style={{width: 60}}> 添加群: </span>
      <Input style={{width: 350}} allowClear placeholder='群链接 案例:https://t.me/xxxx' value={msg}
             onChange={value => setMsg(value)}/>
      <Select placeholder={'选择用户'} style={{width: 150}}  value={phone} onChange={setPhone} options={accountOptions}/>
      <Button type='primary' onClick={onClick} loading={isTesting}>执行添加</Button>
      {/*<span style={{paddingLeft: 20}}> 添加成功 </span>*/}
    </div>
  </>
})
