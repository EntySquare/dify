'use client'

import React, { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
import { DatePicker } from '@arco-design/web-react'
import dayjs from 'dayjs'
import Button from '@/app/components/base/button'
import WorkflowSelector from '@/app/components/enty/workflow-selector'
import { getXAIAllWorkflows } from '@/service/xai'
import Toast from '@/app/components/base/toast'
import { ChatResponseTypes } from '@/app/components/enty-chat/types'
import TabSliderNew from '@/app/components/base/tab-slider-new'

type ScheduledTaskOperationProps = {
  onSubmit?: (execute_datetime: string, workflow_id: string, execute_type?: ExecuteType) => Promise<void>
  replyType: ChatResponseTypes
}

export enum ExecuteType {
  EXECUTE_1 = 'execute_1',
  EXECUTE_2 = 'execute_2',
  EXECUTE_3 = 'execute_3',
}

const ScheduledTaskOperation = React.memo<ScheduledTaskOperationProps>(({ onSubmit, replyType }) => {
  const { data: workflowList } = useSWR(['/workflow/all'], getXAIAllWorkflows)

  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)
  const [selectedDateTime, setSelectedDateTime] = useState<string>()
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [executeType, setExecuteType] = useState<ExecuteType>(ExecuteType.EXECUTE_1)

  const onWorkflowSelectHandler = useCallback((workflow_id: string) => {
    setSelectedWorkflow(workflow_id)
  }, [])

  const executeTypeOptions = useMemo(() => {
    if (replyType !== ChatResponseTypes.COMMENTS_GENERATION)
      return null
    return [
      {
        value: ExecuteType.EXECUTE_1,
        text: '评论',
      },
      {
        value: ExecuteType.EXECUTE_2,
        text: '引用',
      },
    ]
  }, [replyType])

  const onSubmitHandler = async () => {
    if (isSubmiting || !onSubmit)
      return

    if (!selectedWorkflow) {
      Toast.notify({ type: 'warning', message: '请选择执行延时任务的工作流!' })
      return
    }
    if (!selectedDateTime) {
      Toast.notify({ type: 'warning', message: '请选择延时任务执行时间!' })
      return
    }

    try {
      setIsSubmiting(true)
      await onSubmit(
        selectedDateTime,
        selectedWorkflow,
        replyType === ChatResponseTypes.COMMENTS_GENERATION ? executeType : undefined,
      )
    }
    catch (err) {

    }
    finally {
      setIsSubmiting(false)
    }
  }

  return <>
    {replyType === ChatResponseTypes.COMMENTS_GENERATION && executeTypeOptions && <div className='py-2 px-4'>
      <div className='py-2 text-sm leading-[20px] font-medium text-tgai-text-1'>任务类型</div>
      <TabSliderNew
        value={executeType}
        options={executeTypeOptions}
        onChange={value => setExecuteType(value as ExecuteType)}
      />
    </div>
    }
    <div className='py-2 px-4'>
      <div className='py-2 text-sm leading-[20px] font-medium text-tgai-text-1'>执行时间</div>
      <DatePicker
        className={'!w-full !rounded-lg'}
        value={selectedDateTime}
        showTime
        disabledDate={current => current.isBefore(dayjs().startOf('day'))}
        onChange={(dateString, date) => {
          if (date && date.isBefore(dayjs())) {
            Toast.notify({
              type: 'error',
              message: '计划执行时间不能早于当前时间！',
            })
            return
          }
          setSelectedDateTime(dateString)
        }}
      />
    </div>
    <div className='py-2 px-4'>
      <div className='py-2 text-sm leading-[20px] font-medium text-tgai-text-1'>执行工作流</div>
      {workflowList && <WorkflowSelector
        selectedWorkflow={selectedWorkflow}
        workflowList={workflowList.data.workflow_array}
        onSelect={onWorkflowSelectHandler}
      />}
    </div>
    <div className='px-4 pt-2 pb-3 flex justify-center'>
      <Button variant="primary" type='button' onClick={onSubmitHandler} loading={isSubmiting}>提交任务</Button>
    </div>
  </>
})

ScheduledTaskOperation.displayName = 'ScheduledTaskOperation'

export default ScheduledTaskOperation
