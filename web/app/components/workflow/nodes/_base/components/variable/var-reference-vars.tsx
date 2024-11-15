'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useHover } from 'ahooks'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'
import { type NodeOutPutVar, type ValueSelector, type Var, VarType } from '@/app/components/workflow/types'
import { Variable02 } from '@/app/components/base/icons/src/vender/solid/development'
import { ChevronRight } from '@/app/components/base/icons/src/vender/line/arrows'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import Input from '@/app/components/base/input'
import { BubbleX, Env } from '@/app/components/base/icons/src/vender/line/others'
import { checkKeys } from '@/utils/var'
import { FILE_STRUCT } from '@/app/components/workflow/constants'

type ObjectChildrenProps = {
  nodeId: string
  title: string
  data: Var[]
  objPath: string[]
  onChange: (value: ValueSelector, item: Var) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
  isSupportFileVar?: boolean
}

type ItemProps = {
  nodeId: string
  title: string
  objPath: string[]
  itemData: Var
  onChange: (value: ValueSelector, item: Var) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
  isSupportFileVar?: boolean
}

const Item: FC<ItemProps> = ({
  nodeId,
  title,
  objPath,
  itemData,
  onChange,
  onHovering,
  itemWidth,
  isSupportFileVar,
}) => {
  const isFile = itemData.type === VarType.file
  const isObj = ([VarType.object, VarType.file].includes(itemData.type) && itemData.children && itemData.children.length > 0)
  const isSys = itemData.variable.startsWith('sys.')
  const isEnv = itemData.variable.startsWith('env.')
  const isChatVar = itemData.variable.startsWith('conversation.')
  const itemRef = useRef(null)
  const [isItemHovering, setIsItemHovering] = useState(false)
  const _ = useHover(itemRef, {
    onChange: (hovering) => {
      if (hovering) {
        setIsItemHovering(true)
      }
      else {
        if (isObj) {
          setTimeout(() => {
            setIsItemHovering(false)
          }, 100)
        }
        else {
          setIsItemHovering(false)
        }
      }
    },
  })
  const [isChildrenHovering, setIsChildrenHovering] = useState(false)
  const isHovering = isItemHovering || isChildrenHovering
  const open = isObj && isHovering
  useEffect(() => {
    onHovering && onHovering(isHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering])
  const handleChosen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isSupportFileVar && isFile)
      return

    if (isSys || isEnv || isChatVar) { // system variable | environment variable | conversation variable
      onChange([...objPath, ...itemData.variable.split('.')], itemData)
    }
    else {
      onChange([nodeId, ...objPath, itemData.variable], itemData)
    }
  }
  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={() => { }}
      placement='left-start'
    >
      <PortalToFollowElemTrigger className='w-full'>
        <div
          ref={itemRef}
          className={cn(
            isObj ? ' pr-1' : 'pr-[18px]',
            isHovering && (isObj ? 'bg-primary-50 dark:bg-zinc-600' : 'bg-state-base-hover dark:bg-neutral-600'),
            'relative w-full flex items-center h-6 pl-3  rounded-md cursor-pointer')
          }
          onClick={handleChosen}
        >
          <div className='flex items-center w-0 grow'>
            {!isEnv && !isChatVar && <Variable02 className='shrink-0 w-3.5 h-3.5 text-text-accent dark:text-tgai-primary-5' />}
            {isEnv && <Env className='shrink-0 w-3.5 h-3.5 text-util-colors-violet-violet-600' />}
            {isChatVar && <BubbleX className='w-3.5 h-3.5 text-util-colors-teal-teal-700' />}
            {!isEnv && !isChatVar && (
              <div title={itemData.variable} className='ml-1 w-0 grow truncate text-text-secondary dark:text-tgai-text-2 system-sm-medium'>{itemData.variable}</div>
            )}
            {isEnv && (
              <div title={itemData.variable} className='ml-1 w-0 grow truncate text-tgai-text-2 system-sm-medium'>{itemData.variable.replace('env.', '')}</div>
            )}
            {isChatVar && (
              <div title={itemData.des} className='ml-1 w-0 grow truncate text-tgai-text-2 system-sm-medium'>{itemData.variable.replace('conversation.', '')}</div>
            )}
          </div>
          <div className='ml-1 shrink-0 text-xs font-normal text-tgai-text-3 capitalize'>{itemData.type}</div>
          {isObj && (
            <ChevronRight className={cn('ml-0.5 w-3 h-3 text-tgai-text-4', isHovering && 'text-tgai-text-3')} />
          )}
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent style={{
        zIndex: 100,
      }}>
        {(isObj && !isFile) && (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <ObjectChildren
            nodeId={nodeId}
            title={title}
            objPath={[...objPath, itemData.variable]}
            data={itemData.children as Var[]}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
            itemWidth={itemWidth}
            isSupportFileVar={isSupportFileVar}
          />
        )}
        {isFile && (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <ObjectChildren
            nodeId={nodeId}
            title={title}
            objPath={[...objPath, itemData.variable]}
            data={FILE_STRUCT}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
            itemWidth={itemWidth}
            isSupportFileVar={isSupportFileVar}
          />
        )}
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  )
}

const ObjectChildren: FC<ObjectChildrenProps> = ({
  title,
  nodeId,
  objPath,
  data,
  onChange,
  onHovering,
  itemWidth,
  isSupportFileVar,
}) => {
  const currObjPath = objPath
  const itemRef = useRef(null)
  const [isItemHovering, setIsItemHovering] = useState(false)
  const _ = useHover(itemRef, {
    onChange: (hovering) => {
      if (hovering) {
        setIsItemHovering(true)
      }
      else {
        setTimeout(() => {
          setIsItemHovering(false)
        }, 100)
      }
    },
  })
  const [isChildrenHovering, setIsChildrenHovering] = useState(false)
  const isHovering = isItemHovering || isChildrenHovering
  useEffect(() => {
    onHovering && onHovering(isHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovering])
  useEffect(() => {
    onHovering && onHovering(isItemHovering)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isItemHovering])
  // absolute top-[-2px]
  return (
    <div ref={itemRef} className=' bg-white dark:bg-zinc-600 rounded-lg border border-gray-200 dark:border-stone-600 shadow-lg dark:shadow-stone-800 space-y-1' style={{
      right: itemWidth ? itemWidth - 10 : 215,
      minWidth: 252,
    }}>
      <div className='flex items-center h-[22px] px-3 text-xs font-normal text-tgai-text-2'><span className='text-tgai-text-3'>{title}.</span>{currObjPath.join('.')}</div>
      {
        (data && data.length > 0)
        && data.map((v, i) => (
          <Item
            key={i}
            nodeId={nodeId}
            title={title}
            objPath={objPath}
            itemData={v}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
            isSupportFileVar={isSupportFileVar}
          />
        ))
      }
    </div>
  )
}

type Props = {
  hideSearch?: boolean
  searchBoxClassName?: string
  vars: NodeOutPutVar[]
  isSupportFileVar?: boolean
  onChange: (value: ValueSelector, item: Var) => void
  itemWidth?: number
  maxHeightClass?: string
}
const VarReferenceVars: FC<Props> = ({
  hideSearch,
  searchBoxClassName,
  vars,
  isSupportFileVar,
  onChange,
  itemWidth,
  maxHeightClass,
}) => {
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')

  const filteredVars = vars.filter((v) => {
    const children = v.vars.filter(v => checkKeys([v.variable], false).isValid || v.variable.startsWith('sys.') || v.variable.startsWith('env.') || v.variable.startsWith('conversation.'))
    return children.length > 0
  }).filter((node) => {
    if (!searchText)
      return node
    const children = node.vars.filter((v) => {
      const searchTextLower = searchText.toLowerCase()
      return v.variable.toLowerCase().includes(searchTextLower) || node.title.toLowerCase().includes(searchTextLower)
    })
    return children.length > 0
  }).map((node) => {
    let vars = node.vars.filter(v => checkKeys([v.variable], false).isValid || v.variable.startsWith('sys.') || v.variable.startsWith('env.') || v.variable.startsWith('conversation.'))
    if (searchText) {
      const searchTextLower = searchText.toLowerCase()
      if (!node.title.toLowerCase().includes(searchTextLower))
        vars = vars.filter(v => v.variable.toLowerCase().includes(searchText.toLowerCase()))
    }

    return {
      ...node,
      vars,
    }
  })

  return (
    <>
      {
        !hideSearch && (
          <>
            {/*className={cn(searchBoxClassName, isFocus && 'shadow-sm bg-white dark:bg-tgai-panel-background dark:shadow-stone-700', 'mb-2 mx-1 flex items-center px-2 rounded-lg bg-gray-100 dark:bg-tgai-input-background ')}*/}
            <div className={cn('mb-2 mx-1', searchBoxClassName)} onClick={e => e.stopPropagation()}>
              <Input
                showLeftIcon
                showClearIcon
                value={searchText}
                placeholder={t('workflow.common.searchVar') || ''}
                onChange={e => setSearchText(e.target.value)}
                onClear={() => setSearchText('')}
                autoFocus
              />
            </div>
            <div className='h-[0.5px] bg-black/5 dark:bg-stone-600/95 relative left-[-4px]' style={{
              width: 'calc(100% + 8px)',
            }}></div>
          </>
        )
      }

      {filteredVars.length > 0
        ? <div className={cn('max-h-[85vh] overflow-y-auto tgai-custom-scrollbar', maxHeightClass)}>

          {
            filteredVars.map((item, i) => (
              <div key={i}>
                <div
                  className='leading-[22px] px-3 text-text-tertiary dark:text-tgai-text-3 system-xs-medium-uppercase truncate'
                  title={item.title}
                >{item.title}</div>
                {item.vars.map((v, j) => (
                  <Item
                    key={j}
                    title={item.title}
                    nodeId={item.nodeId}
                    objPath={[]}
                    itemData={v}
                    onChange={onChange}
                    itemWidth={itemWidth}
                    isSupportFileVar={isSupportFileVar}
                  />
                ))}
              </div>))
          }
        </div>
        : <div className='pl-3 leading-[18px] text-xs font-medium text-tgai-text-3 uppercase'>{t('workflow.common.noVar')}</div>}
    </ >
  )
}
export default React.memo(VarReferenceVars)
