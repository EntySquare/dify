import { TGAIPost } from './http'

// API
/*
*   手机群控列表接口
*   POST
*/
export const getMobileControlList = () => TGAIPost('/control/list', {
    pageNum: 1,
    pageSize: 10,
})

export const getTypesInfoList = () => TGAIPost('/control/getTypesInfoList', {
    pageNum: 1,
    pageSize: 10,
})

export const controlPushTask = (data:any) => TGAIPost('/control/pushTask',data)
export const getWorkflowAll = () => TGAIPost('/workflow/all',)
export const getBindingWorkflowView = () => TGAIPost('/control/bindingWorkflowView',)
export const postBindingWorkflowUpdate = (data:any) => TGAIPost('/control/bindingWorkflowUpdate',data)