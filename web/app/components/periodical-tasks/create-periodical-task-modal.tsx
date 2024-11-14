'use client'

import Modal from "@/app/components/base/modal"
import { addPeriodicalTask } from "@/service/tgai"
import React, { useCallback, useMemo, useState } from "react"
import ArrangementSelector from "./arrangement-selector/arrangement-selector"
import Button from "@/app/components/base/button"
import { RiCloseLine, RiQuestionLine } from "@remixicon/react"
import { BookOpen01 } from "@/app/components/base/icons/src/vender/line/education"
import Toast from "@/app/components/base/toast"
import { TGAIWorkflow } from "@/models/tgai-workflow"
import { mutate } from "swr"
import { describeCronToCN } from "@/utils/cron"

type Props = {
    show: boolean
    onClose: () => void
    arrangementList: TGAIWorkflow[] | undefined
}

// export const getTGAIAllWorkflows = () => TGAIPost<{ workflow_array: TGAIWorkflow[] }>('/workflow/all')

const CreatePeriodicalTaskModal = React.memo(({ show, onClose, arrangementList }: Props) => {


    const [submitData, setSubmitData] = useState<{
        task_name: string,
        workflow_id: string | null,
        interval: string
    }>({
        task_name: "",
        workflow_id: null,
        interval: ""
    })

    const [creating, setCreating] = useState(false)

    const handleArrangementSelect = useCallback((workflow_id: string) => {
        setSubmitData(prev => ({ ...prev, workflow_id }))
    }, [submitData])

    const handleCloseModal = () => {
        setSubmitData({
            task_name: "",
            workflow_id: null,
            interval: ""
        })
        onClose()
    }

    const cronDescribeResult = useMemo(() => {
        return describeCronToCN(submitData.interval.trim())
    }, [submitData])

    const canCreateClick = submitData.workflow_id !== null && submitData.task_name.trim() !== "" && submitData.interval.trim() !== "" && cronDescribeResult !== null

    const onCreateTaskClick = async () => {
        if (!canCreateClick || creating || cronDescribeResult === null) return

        try {
            setCreating(true)
            const { task_name, workflow_id, interval } = submitData
            if (workflow_id === null) return
            await addPeriodicalTask({ task_name: task_name.trim(), workflow_id, interval: interval.trim() })
            mutate(["/cron/list"])
            Toast.notify({
                type: 'success',
                message: "创建主动任务成功！",
            })
            handleCloseModal()
        } catch (_err) {
            console.log(_err)
        } finally {
            setCreating(false)
        }
    }

    return (
        <Modal
            overflowVisible
            className='!p-0 !max-w-[720px] !w-[720px] rounded-xl dark:border dark:border-stone-600 dark:bg-tgai-section-background'
            isShow={show}
            onClose={() => { }}
        >
            <div className='shrink-0 flex flex-col h-full bg-white dark:bg-tgai-section-background rounded-t-xl'>
                <div className='shrink-0 pl-8 pr-6 pt-6 pb-3 bg-white dark:bg-tgai-section-background text-xl rounded-t-xl leading-[30px] font-semibold text-tgai-text-1 z-10'>创建主动任务</div>
            </div>
            <div className='py-2 px-8'>
                <div className='py-2 text-sm leading-[20px] font-medium text-tgai-text-1'>主动任务名称</div>
                <input
                    value={submitData.task_name}
                    onChange={e => setSubmitData(prev => ({ ...prev, task_name: e.target.value }))}
                    placeholder="请输入主动任务名称"
                    className={"w-full px-3 text-sm leading-9 text-tgai-text-1 border-0 rounded-lg grow h-9 bg-gray-100 dark:bg-tgai-input-background focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-200 dark:focus:ring-stone-600 dark:focus:bg-zinc-700"}
                />
            </div>
            <div className='py-2 px-8'>
                <div className='py-2 text-sm leading-[20px] font-medium text-tgai-text-1 flex flex-row items-center '>
                    <div>执行间隔（cron 表达式）</div>
                </div>
                <input
                    value={submitData.interval}
                    onChange={e => setSubmitData(prev => ({ ...prev, interval: e.target.value }))}
                    placeholder="示例：0/10 * * * * ? "
                    className={"w-full px-3 text-sm leading-9 text-tgai-text-1 border-0 rounded-lg grow h-9 bg-gray-100 dark:bg-tgai-input-background focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-200 dark:focus:ring-stone-600 dark:focus:bg-zinc-700"}
                />
                {submitData.interval && <pre className="text-tgai-text-3 mt-2">{cronDescribeResult || <span className="text-red-600">Cron 表达式不合法！</span>}</pre>}
                <a
                    href={"https://en.wikipedia.org/wiki/Cron"}
                    target='_blank' rel='noopener noreferrer'
                    className='group flex items-center text-xs text-tgai-text-2 font-normal hover:text-tgai-primary mt-2'
                >
                    <BookOpen01 className='mr-1 w-3 h-3 text-tgai-text-2 group-hover:text-tgai-primary' />
                    学习如何使用 cron 表达式
                </a>
            </div>
            <div className='py-2 px-8'>
                <div className='py-2 text-sm leading-[20px] font-medium text-tgai-text-1'>任务</div>
                {arrangementList && <ArrangementSelector onSelect={handleArrangementSelect} arrangementList={arrangementList} selectedArrangement={submitData.workflow_id} />}
            </div>
            <div className='px-8 py-6 flex justify-end'>
                <Button className='mr-2' onClick={handleCloseModal}>取消</Button>
                <Button disabled={!canCreateClick || creating} variant="primary" loading={creating} onClick={onCreateTaskClick}>创建</Button>
            </div>
            <div className='absolute right-6 top-6 p-2 cursor-pointer z-20' onClick={handleCloseModal}>
                <RiCloseLine className='w-4 h-4 text-tgai-text-3' />
            </div>
        </Modal>
    )
})

CreatePeriodicalTaskModal.displayName = "CreatePeriodicalTaskModal"

export default CreatePeriodicalTaskModal