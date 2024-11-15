'use client'

import { Avatar, Dropdown, Menu } from '@arco-design/web-react'
import { IconUser, IconExport } from '@arco-design/web-react/icon'
import { allTokenRemove } from '@/utils'

export const HeaderUserProfile = () => {

  const loginOut = () => {
    allTokenRemove();
    window.location.href = '/signin'

  }
  const dropList = (
    <Menu>
      <Menu.Item key='1' onClick={loginOut}><IconExport className='mr-2' />退出登录</Menu.Item>
    </Menu>
  )
  return (
    <Dropdown droplist={dropList} trigger='click' position='br'>
      <Avatar className='cursor-pointer'>
        <IconUser />
      </Avatar>
    </Dropdown>
  )
}
