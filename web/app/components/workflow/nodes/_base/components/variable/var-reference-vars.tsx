'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import { useBoolean, useHover } from 'ahooks'
import {
  RiSearchLine,
} from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import cn from '../../../../../../../utils/classnames'
import { type NodeOutPutVar, type ValueSelector, type Var, VarType } from '../../../../types'
import { Variable02 } from '../../../../../base/icons/src/vender/solid/development'
import { ChevronRight } from '../../../../../base/icons/src/vender/line/arrows'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '../../../../../base/portal-to-follow-elem'
import { XCircle } from '../../../../../base/icons/src/vender/solid/general'
import { BubbleX, Env } from '../../../../../base/icons/src/vender/line/others'
import { checkKeys } from '../../../../../../../utils/var'

type ObjectChildrenProps = {
  nodeId: string
  title: string
  data: Var[]
  objPath: string[]
  onChange: (value: ValueSelector, item: Var) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
}

type ItemProps = {
  nodeId: string
  title: string
  objPath: string[]
  itemData: Var
  onChange: (value: ValueSelector, item: Var) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
}

const Item: FC<ItemProps> = ({
  nodeId,
  title,
  objPath,
  itemData,
  onChange,
  onHovering,
  itemWidth,
}) => {
  const isObj = itemData.type === VarType.object && itemData.children && itemData.children.length > 0
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
            isHovering && (isObj ? 'bg-primary-50 dark:bg-zinc-600' : 'bg-gray-50 dark:bg-neutral-600'),
            'relative w-full flex items-center h-6 pl-3  rounded-md cursor-pointer')
          }
          onClick={handleChosen}
        >
          <div className='flex items-center w-0 grow'>
            {!isEnv && !isChatVar && <Variable02 className='shrink-0 w-3.5 h-3.5 text-tgai-primary-5' />}
            {isEnv && <Env className='shrink-0 w-3.5 h-3.5 text-util-colors-violet-violet-600' />}
            {isChatVar && <BubbleX className='w-3.5 h-3.5 text-util-colors-teal-teal-700' />}
            {!isEnv && !isChatVar && (
              <div title={itemData.variable} className='ml-1 w-0 grow truncate text-[13px] font-normal text-tgai-text-1'>{itemData.variable}</div>
            )}
            {isEnv && (
              <div title={itemData.variable} className='ml-1 w-0 grow truncate text-[13px] font-normal text-tgai-text-1'>{itemData.variable.replace('env.', '')}</div>
            )}
            {isChatVar && (
              <div title={itemData.des} className='ml-1 w-0 grow truncate text-[13px] font-normal text-tgai-text-1'>{itemData.variable.replace('conversation.', '')}</div>
            )}
          </div>
          <div className='ml-1 shrink-0 text-xs font-normal text-tgai-text-3 capitalize'>{itemData.type}</div>
          {isObj && (
            <ChevronRight className='ml-0.5 w-3 h-3 text-tgai-text-3' />
          )}
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent style={{
        zIndex: 100,
      }}>
        {isObj && (
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          <ObjectChildren
            nodeId={nodeId}
            title={title}
            objPath={[...objPath, itemData.variable]}
            data={itemData.children as Var[]}
            onChange={onChange}
            onHovering={setIsChildrenHovering}
            itemWidth={itemWidth}
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
  onChange: (value: ValueSelector, item: Var) => void
  itemWidth?: number
}
const VarReferenceVars: FC<Props> = ({
  hideSearch,
  searchBoxClassName,
  vars,
  onChange,
  itemWidth,
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

  const [isFocus, {
    setFalse: setBlur,
    setTrue: setFocus,
  }] = useBoolean(false)
  return (
    <>
      {
        !hideSearch && (
          <>
            <div
              className={cn(searchBoxClassName, isFocus && 'shadow-sm bg-white dark:bg-tgai-panel-background dark:shadow-stone-700', 'mb-2 mx-1 flex items-center px-2 rounded-lg bg-gray-100 dark:bg-tgai-input-background ')}
              onClick={e => e.stopPropagation()}
            >

              <RiSearchLine className='shrink-0 ml-[1px] mr-[5px] w-3.5 h-3.5 text-tgai-text-3' />
              <input
                value={searchText}
                className='grow px-0.5 py-[7px] text-[13px] text-tgai-text-2 bg-transparent appearance-none outline-none caret-tgai-primary placeholder:text-gray-400'
                placeholder={t('workflow.common.searchVar') || ''}
                onChange={e => setSearchText(e.target.value)}
                onFocus={setFocus}
                onBlur={setBlur}
                autoFocus
              />
              {
                searchText && (
                  <div
                    className='flex items-center justify-center ml-[5px] w-[18px] h-[18px] cursor-pointer'
                    onClick={() => setSearchText('')}
                  >
                    <XCircle className='w-[14px] h-[14px] text-tgai-text-3' />
                  </div>
                )
              }
            </div>
            <div className='h-[0.5px] bg-black/5 dark:bg-stone-600/95 relative left-[-4px]' style={{
              width: 'calc(100% + 8px)',
            }}></div>
          </>
        )
      }

      {filteredVars.length > 0
        ? <div className='max-h-[85vh] overflow-y-auto tgai-custom-scrollbar'>

          {
            filteredVars.map((item, i) => (
              <div key={i}>
                <div
                  className='leading-[22px] px-3 text-xs font-medium text-tgai-text-3 uppercase truncate'
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
