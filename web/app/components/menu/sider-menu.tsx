'use client'
import { Menu } from '@arco-design/web-react'
import { IconApps, IconDice, IconPenFill, IconTool, IconUser, IconUserGroup } from '@arco-design/web-react/icon'
import { useTranslation } from 'react-i18next'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import classNames from '@/utils/classnames'

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

type SideBarMenuItems = {
  type: 'sub' | 'group' | 'item'
  title: string
  href: string
  children?: SideBarMenuItems[]
  icon?: ReactNode
  key: string
}

const SiderMenu = () => {
  const { t } = useTranslation()

  const path = usePathname()

  const routesItems: SideBarMenuItems[] = useMemo(() => [
    {
      type: 'sub',
      title: '热度',
      href: '',
      children: [
        {
          type: 'item',
          title: '热度总览',
          href: '/heat/list',
          key: '/heat/list',
        },
      ],
      icon: <IconApps />,
      key: 'heat',
    },
    {
      type: 'sub',
      title: '用户',
      href: '',
      children: [
        {
          type: 'item',
          title: '客户端密钥',
          href: '/user/client-secret',
          key: '/user/client-secret',
        },
        {
          type: 'item',
          title: '账号',
          href: '/user/account',
          key: '/user/account',
        },
        {
          type: 'item',
          title: '通讯录',
          href: '/user/contacts',
          key: '/user/contacts',
        },
        {
          type: 'item',
          title: '物理矩阵',
          href: '/user/mobile',
          key: '/user/mobile',
        },
      ],
      icon: <IconUser />,
      key: 'user',
    },
    {
      type: 'sub',
      title: '群',
      href: '',
      children: [
        {
          type: 'item',
          title: '群组',
          href: '/channel/groups',
          key: '/channel/groups',
        },
        {
          type: 'item',
          title: '爬虫搜索',
          href: '/channel/third-engine',
          key: '/channel/third-engine',
        },
        {
          type: 'item',
          title: '群列表',
          href: '/channel/all-channel',
          key: '/channel/all-channel',
        },
        {
          type: 'item',
          title: '已加入群',
          href: '/channel/joined',
          key: '/channel/joined',
        },
      ],
      icon: <IconUserGroup />,
      key: 'channel',
    },
    {
      type: 'sub',
      title: '模版',
      href: '',
      children: [
        {
          type: 'item',
          title: '单聊模版',
          href: '/templates/single-chat',
          key: '/templates/single-chat',
        },
        {
          type: 'item',
          title: '群聊模版',
          href: '/templates/group-chat',
          key: '/templates/group-chat',
        },
      ],
      icon: <IconDice />,
      key: 'templates',
    },
    {
      type: 'sub',
      title: '策略',
      href: '',
      children: [
        {
          type: 'item',
          title: '关键词策略',
          href: '/strategy/keyword-strategy',
          key: '/strategy/keyword-strategy',
        },
        {
          type: 'item',
          title: '单聊策略',
          href: '/strategy/single-strategy',
          key: '/strategy/single-strategy',
        },
        {
          type: 'item',
          title: '群聊策略',
          href: '/strategy/group-strategy',
          key: '/strategy/group-strategy',
        },
      ],
      icon: <IconPenFill />,
      key: 'strategy',
    },
    {
      type: 'sub',
      title: '工具',
      href: '',
      children: [
        {
          type: 'item',
          title: '清除记录',
          href: '/instrument/clear-history',
          key: '/instrument/clear-history',
        },
      ],
      icon: <IconTool />,
      key: 'instrument',
    },
    {
      type: 'sub',
      title: '电子员工管理',
      href: '',
      children: [
        // {
        //   type: 'item',
        //   title: t('common.menus.explore'),
        //   href: '/explore/apps',
        //   key: '/explore/apps',
        // },
        {
          type: 'item',
          title: '任务中心',
          href: '/apps',
          key: '/apps',
        }, {
          type: 'item',
          title: '向量记录',
          href: '/datasets',
          key: '/datasets',
        }, {
          type: 'item',
          title: '能力',
          href: '/tools',
          key: '/tools',
        }, {
          type: 'item',
          title: '主动任务',
          href: '/periodical-tasks',
          key: '/periodical-tasks',
        }, {
          type: 'item',
          title: "数据整理",
          href: '/data-cleansing',
          key: '/data-cleansing',
        }
      ],
      icon: <IconApps />,
      key: 'workflow',
    }
  ], [])

  const subMenuKeys = useMemo(() => routesItems.map(item => item.key), [routesItems])

  const keyMap = useMemo(() => {
    const map = new Map<string, string>()
    map.set('/templates/single-chat/template-detail', '/templates/single-chat')
    map.set('/templates/group-chat/template-detail', '/templates/group-chat')
    return map
  }, [])

  const [currentSelected, setCurrentSelected] = useState<string>(path)
  const [collapsed, setCollapsed] = useState(false)

  const renderRoutes = (routes: SideBarMenuItems[]) => {
    return routes.map((route) => {
      if (route.children && (route.type === 'sub' || route.type === 'group')) {
        // Nested route with children
        return route.type === 'sub'
          ? <SubMenu key={route.key} title={<>{route.icon && route.icon}{route.title}</>}>
            {renderRoutes(route.children)}
          </SubMenu>
          : <MenuItemGroup key={route.key} title={<>{route.icon && route.icon}{route.title}</>}>
            <>{route.icon && route.icon}{route.title}</>
            {renderRoutes(route.children)}</MenuItemGroup>
      }
      else {
        // Single route without children
        return (
          <MenuItem key={route.key}><Link href={route.href}>{route.icon && route.icon}{route.title}</Link></MenuItem>
        )
      }
    })
  }



  useEffect(() => {
    const keyInMap = keyMap.get(path)
    setCurrentSelected(keyInMap ? keyInMap : path)
  }, [path])

  // collapse tgai side menu when into certain route
  useEffect(() => {
    const paths = path.split("/")
    if (paths.length < 2) return

    const startPath = paths[1]

    if (startPath === 'app' || startPath === 'apps' || startPath === 'datasets' || startPath === 'tools' || startPath === 'data-cleansing') {
      setCollapsed(true)
    }

  }, [path])

  return (
    <div className={classNames('tgai-side-menu-wrapper h-full transition-[width_300ms_ease-in-out]', collapsed ? 'w-[48px]' : 'w-[250px]')}>
      <Menu
        className={classNames('h-full overflow-y-auto tgai-custom-scrollbar w-full')}
        selectedKeys={[currentSelected]}
        autoOpen
        hasCollapseButton
        defaultOpenKeys={subMenuKeys}
        onCollapseChange={collapse => setCollapsed(collapse)}
        collapse={collapsed}
        mode='vertical'
      >
        {renderRoutes(routesItems)}
      </Menu>
    </div>
  )
}

export default SiderMenu
