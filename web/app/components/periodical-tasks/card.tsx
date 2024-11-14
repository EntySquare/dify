'use client'

import React, { useCallback, useMemo, useRef, useState } from "react"
import cn from '@/utils/classnames'
import { PeriodicalTaskRes, PeriodicalTaskStateEnum } from "@/models/tgai-periodical-task"
import { usePeriodicalTasksStore } from "./store"
import { TGAIWorkflow } from "@/models/tgai-workflow"
import Indicator from "@/app/components/header/indicator"
import Tooltip from "@/app/components/base/tooltip"
import { RiDeleteBinLine, RiQuestionLine } from "@remixicon/react"
import Divider from "@/app/components/base/divider"
import Switch from "@/app/components/base/switch"
import { postPeriodicalTaskState } from "@/service/tgai"
import Toast from "@/app/components/base/toast"
import { mutate } from "swr"
import Confirm from "@/app/components/base/confirm"
import { describeCronToCN } from "@/utils/cron"
import { AlertTriangle } from "../base/icons/src/vender/line/alertsAndFeedback"



export const TaskStateItem = React.memo<{ state: PeriodicalTaskStateEnum, reverse?: boolean }>(({ state, reverse }) => {

    const STATE_INFO_MAP = useMemo(() => ({
        [PeriodicalTaskStateEnum.RUNNING]: {
            text: "运行中",
            color: "green"
        },
        [PeriodicalTaskStateEnum.PAUSE]: {
            text: "未启动",
            color: "orange",
        },
        [PeriodicalTaskStateEnum.DELETE]: {
            text: "错误",
            color: "red"
        }
    } as const), [])

    return <div className={
        cn('flex items-center', reverse ? "flex-row" : "flex-row-reverse")
    }>
        <Indicator color={STATE_INFO_MAP[state].color} className={cn(reverse ? 'mr-2' : 'ml-2')} />
        <span className={cn('text-tgai-text-2 text-xs text-nowrap')}>{STATE_INFO_MAP[state].text}</span>
        {/* {
             (
                <Tooltip
                    selector='dataset-document-detail-item-status'
                    htmlContent={
                        <div className='max-w-[260px] break-all'>{"test"}</div>
                    }
                >
                    <RiQuestionLine className='ml-1 w-[14px] h-[14px] text-tgai-text-2' />
                </Tooltip>
            )
        } */}
    </div>
})

type Props = {
    active: boolean
    task: PeriodicalTaskRes
    arrangementList: TGAIWorkflow[] | undefined
}

const PeriodicalTaskCard = React.memo(({ active, task, arrangementList }: Props) => {

    const setCurrentTask = usePeriodicalTasksStore(state => state.setCurrentTask)

    const foundWorkflow = useMemo(() => {
        return arrangementList ? arrangementList.find(arrangement => arrangement.workflow_id === task.workflow_id) : undefined
    }, [arrangementList, task])

    const workflowName = useMemo(() => foundWorkflow ? foundWorkflow.workflow_name || "" : "", [foundWorkflow])

    const switchingRef = useRef(false)

    const [showConfirmDelete, setShowConfirmDelete] = useState(false)

    const onStateSwitch = async (state: PeriodicalTaskStateEnum) => {
        if (switchingRef.current || !foundWorkflow) return
        try {
            switchingRef.current = true
            await postPeriodicalTaskState(task.id, state)
            mutate(["/cron/list"])
            Toast.notify({
                type: "success",
                message: state === PeriodicalTaskStateEnum.RUNNING ? "启动主动任务成功！" : "停止主动任务成功！"
            })
        } catch (err) {
            console.log(err)
        } finally {
            switchingRef.current = false
        }
    }

    const onConfirmDelete = useCallback(async () => {
        if (switchingRef.current) return

        try {
            switchingRef.current = true
            await postPeriodicalTaskState(task.id, PeriodicalTaskStateEnum.DELETE)
            mutate(["/cron/list"])
            Toast.notify({
                type: "success",
                message: "删除主动任务成功！"
            })
        } catch (err) {
            console.log(err)
        } finally {
            switchingRef.current = false
            setShowConfirmDelete(false)
        }
    }, [task])

    return (
        <div
            className={cn(
                'group col-span-1 flex flex-col min-h-[160px] justify-between relative',
                'bg-tgai-panel-background-3',
                'border-2 border-solid border-transparent rounded-xl dark:hover:border-stone-600',
                'shadow-sm dark:shadow-stone-800 hover:shadow-lg dark:hover:bg-zinc-700',
                'cursor-pointer',
                active && '!border-tgai-primary'
            )}
            onClick={() => {
                if (!foundWorkflow) return
                setCurrentTask(task.id)
            }}
        >
            <div className='flex pt-[14px] px-[14px] pb-3 h-[66px] gap-3 grow-0 shrink-0'>
                <div className='grow w-0 py-[1px]'>
                    <div className='flex text-sm leading-5 font-semibold text-tgai-text-1 justify-between items-start'>
                        <div className='truncate z-10'>
                            <div className='truncate'>{task.name}</div>
                        </div>
                        <div className="flex items-center box-border z-10">
                            <TaskStateItem state={(arrangementList && !foundWorkflow) ? PeriodicalTaskStateEnum.DELETE : task.state} />
                            {task.state !== PeriodicalTaskStateEnum.DELETE && arrangementList && foundWorkflow && (
                                <div className="hidden group-hover:inline-flex items-center">
                                    <Divider type="vertical" className="!h-2" />
                                    <div
                                        onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
                                            e.stopPropagation()
                                        }
                                        className="inline-flex items-center"
                                    >
                                        <Switch
                                            size='md'
                                            defaultValue={task.state === PeriodicalTaskStateEnum.RUNNING}
                                            onChange={async (val) => {
                                                await onStateSwitch(val ? PeriodicalTaskStateEnum.RUNNING : PeriodicalTaskStateEnum.PAUSE)
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            <div className={cn("flex flex-row items-end justify-between bottom-0 left-0 w-full px-[14px] dark:group-hover:bg-zinc-700 rounded-b-xl text-tgai-text-2 pb-[14px] overflow-hidden",
            )}>
                <div className="flex flex-col gap-1 overflow-hidden mr-2">
                    <div className="flex flex-col text-xs">
                        <span className="truncate">任务</span>
                        <span className="truncate">{workflowName}</span>
                    </div>
                    <div className="flex flex-col text-xs">
                        <span className="truncate">执行间隔</span>
                        <span className="truncate">{describeCronToCN(task.cron_spec) || ""}</span>
                    </div>
                </div>
                <div className='hidden shrink-0 w-6 h-6 group-hover:flex items-center justify-center rounded-md hover:bg-red-100 hover:text-red-600 cursor-pointer group/delete' onClick={(e) => {
                    e.stopPropagation()
                    !switchingRef.current && setShowConfirmDelete(true)
                }}>
                    <RiDeleteBinLine className='w-[14px] h-[14px] text-tgai-text-3 group-hover/delete:text-red-600' />
                </div>
            </div>

            {showConfirmDelete && (
                <Confirm
                    title="确认删除主动任务？"
                    content="删除主动任务将无法撤销，但任务的执行日志将会保留。"
                    isShow={showConfirmDelete}
                    onConfirm={onConfirmDelete}
                    onCancel={() => setShowConfirmDelete(false)}
                />
            )}
            {arrangementList && !foundWorkflow && (
                <div className="absolute w-full h-full flex justify-center items-center rounded-xl backdrop-blur-md bg-red-800/40 p-[14px]">
                    <div className="text-tgai-text-2 group-hover:hidden flex flex-col gap-1 justify-center items-center xl:flex-row">
                        <AlertTriangle />
                        <span className="text-tgai-text-1 font-medium">未找到对应的任务</span>
                    </div>
                    <div className='hidden shrink-0 w-8 h-8 group-hover:flex items-center justify-center rounded-md hover:bg-red-100 hover:text-red-600 cursor-pointer group/delete' onClick={(e) => {
                        e.stopPropagation()
                        !switchingRef.current && setShowConfirmDelete(true)
                    }}>
                        <RiDeleteBinLine className='w-[20px] h-[20px] text-tgai-text-3 group-hover/delete:text-red-600' />
                    </div>
                </div>
            )}
        </div>
    )
})

PeriodicalTaskCard.displayName = "PeriodicalTaskCard"

export default PeriodicalTaskCard