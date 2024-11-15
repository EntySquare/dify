'use client'

import { PeriodicalTaskRes, PeriodicalTaskStateEnum } from "@/models/tgai-periodical-task"
import React, { useCallback, useMemo, useRef, useState } from "react"
import Divider from "@/app/components/base/divider"
import cn from '@/utils/classnames'
import { describeCronToCN } from "@/utils/cron"
import dayjs from "dayjs"
import { TGAIWorkflow } from "@/models/tgai-workflow"
import { TaskStateItem } from "./card"
import Switch from "@/app/components/base/switch"
import { mutate } from "swr"
import { postExecutePeriodicalTaskOnce, postPeriodicalTaskState } from "@/service/tgai"
import Toast from "@/app/components/base/toast"
import Button from "@/app/components/base/button"

type TableProps = {
    data: { label: string, value: string | number }[]
}

const DetailTable = React.memo<TableProps>(({ data }) => {

    return <div className="flex flex-col gap-1">
        {data.map((item, index) => {
            return <div key={index} className={cn("flex flex-row min-h-7 h-7 gap-4 items-start")}>
                <div className="w-[40%] max-w-32 overflow-hidden truncate text-xs leading-4 font-medium text-tgai-text-3">{item.label}</div>
                <div className="w-[60%] text-xs leading-4 text-tgai-text-2">{item.value}</div>
            </div>
        })}
    </div>
})

type Props = {
    task: PeriodicalTaskRes
    arrangementList: TGAIWorkflow[] | undefined
}

const PeriodicalTaskDetail = React.memo(({ task, arrangementList }: Props) => {

    const workflowName = useMemo(() => arrangementList ? arrangementList.find(arrangement => arrangement.workflow_id === task.workflow_id)?.workflow_name || "" : "", [arrangementList, task])

    const switchingRef = useRef(false)
    const [executing, setExecuting] = useState(false)

    const variablesData = useMemo(() => [
        { label: "任务名", value: workflowName },
        { label: "执行间隔", value: describeCronToCN(task.cron_spec) || "Cron 表达式解析错误" },
    ], [workflowName, task])

    const runResultData = useMemo(() => [
        { label: "已执行次数", value: task.run_num },
        { label: "最近一次执行", value: dayjs(task.last_run_time_unix * 1000).format("YYYY-MM-DD HH:mm:ss") },
    ], [task])

    const onStateSwitch = async (state: PeriodicalTaskStateEnum) => {
        if (switchingRef.current) return
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

    const onInstantExecutedOnce = useCallback(async () => {
        if (executing) return

        try {
            setExecuting(true)
            await postExecutePeriodicalTaskOnce(task.id)
            Toast.notify({
                type: "success",
                message: "成功执行任务一次！"
            })
        } catch (_err) {

        } finally {
            setExecuting(false)
        }

    }, [executing, task])


    return <div className='px-6 py-5 overflow-y-auto tgai-custom-scrollbar'>
        <div className="flex flex-col gap-1">
            <div className="truncate text-tgai-text-1 font-semibold text-lg">{task.name}</div>
            <div className="flex items-center box-border group">
                <TaskStateItem state={task.state} />
                {task.state !== PeriodicalTaskStateEnum.DELETE && (
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
                                disabled={false}
                                defaultValue={task.state === PeriodicalTaskStateEnum.RUNNING}

                                onChange={async (val) => {
                                    await onStateSwitch(val ? PeriodicalTaskStateEnum.RUNNING : PeriodicalTaskStateEnum.PAUSE)
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
            <Button variant={'primary'} loading={executing} disabled={executing} onClick={onInstantExecutedOnce} className="mt-1">立即执行一次本任务</Button>
        </div>
        <div>


        </div>
        <div className="truncate text-tgai-text-1 font-semibold mt-8">
            任务参数
        </div>
        <Divider />
        <DetailTable data={variablesData} />
        <div className="truncate text-tgai-text-1 font-semibold mt-8">
            运行数据
        </div>
        <Divider />
        <DetailTable data={runResultData} />
    </div>
})

PeriodicalTaskDetail.displayName = "PeriodicalTaskDetail"

export default PeriodicalTaskDetail