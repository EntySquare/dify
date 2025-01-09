import { XAIDelete, XAIGet, XAIPost } from './x-http'
import type { PeriodicalTaskRes, PeriodicalTaskStateEnum } from '@/models/tgai-periodical-task'
import type { TGAIWorkflow } from '@/models/tgai-workflow'
import type { TGAccountRes } from '@/models/tgai-user'
import type { HuoXuanListItem, HuoXuanListItemState, HuoXuanListItemType } from '@/models/xai-huoxuan'

export const headersAuthorization = 'Bearer dataset-4jnh8BQuVWjJFpm6ahYkTF7j'

// 用户 API
/*
 *   获取指定用户联系人列表
 *   POST
 */
export const getTGAIUserContancts = (phone: string) =>
  XAIPost<{ contact_res_list: TGAccountRes[] }>('/contact/list', {
    phone,
    pageNum: 1,
    pageSize: 10,
  })

/*
 *   获取所有已登录账号
 *   POST
 */

export type DeviceData = {
  device_id: string
  ping_time: number
  status_ready: boolean
  tweet_account_list: {
    tweet_account: string
    control_status: number
    data_time: string
    control_cmd: string
  }[]
}
export const getXAIDeviceList = () => XAIPost<{ device_list: DeviceData[] }>('/adminApi/deviceList')

export type TweetsUserNameListRes = { tweets_user_name_list: string[] }
// 查询当前推特账号列表
export const tweetsUserNameList = () =>
  XAIPost<TweetsUserNameListRes>('/adminApi/tweetsUserNameList')

// 关注用户
export const followTwitterUser = (userNameList: [], tweetsUserName: string) =>
  XAIPost<any>('/adminApi/followTwitterUser', {
    tweets_user_name_list: userNameList,
    tweets_user_name: tweetsUserName,
  })

// 点赞推文
export const supportTwitter = (userNameList: [], twitterUrl: string) =>
  XAIPost<any>('/adminApi/supportTwitter', {
    tweets_user_name_list: userNameList,
    twitter_url: twitterUrl,
  })

// 转发
export const forwardTwitter = (userNameList: [], twitterUrl: string) =>
  XAIPost<any>('/adminApi/forwardTwitter', {
    tweets_user_name_list: userNameList,
    twitter_url: twitterUrl,
  })

// 转发并引用
export const forwardAndQuoteTwitter = (
  forwardAndQuoteContent: string,
  userNameList: [],
  twitterUrl: string,
) =>
  XAIPost<any>('/adminApi/forwardAndQuoteTwitter', {
    content: forwardAndQuoteContent,
    tweets_user_name_list: userNameList,
    twitter_url: twitterUrl,
  })

// 评论推文
export const commentTwitter = (
  commentContent: string,
  userNameList: [],
  twitterUrl: string,
) =>
  XAIPost<any>('/adminApi/commentTwitter', {
    content: commentContent,
    tweets_user_name_list: userNameList,
    twitter_url: twitterUrl,
  })

// 发布推文
export const sendTwitter = (
  releaseContent: string,
  userNameList: [],
  imgUrl: string,
) =>
  XAIPost<any>('/adminApi/sendTwitter', {
    content: releaseContent,
    tweets_user_name_list: userNameList,
    img_url: imgUrl,
  })

type SelectTwitterUrlRes = {
  'tweet_account': string
  'content': string
  'url': string
  'file_url_list': string[]
}

// 根据链接查看推文信息
export const selectTwitterUrl = (twitterUrl: string) =>
  XAIPost<SelectTwitterUrlRes>('/adminApi/selectTwitterUrl', { url: twitterUrl })

/*
 *   获取知识库列表
 *   GET
 */
export type KnowLedge = {
  id: string
  name: string
  description: string
  permission: string
  data_source_type: string
  indexing_technique: string
  app_count: number
  document_count: number
  word_count: number
  created_by: string
  created_at: number
  updated_by: string
  updated_at: number
  binding_tweet_account: string
  binding_document_id: string
  role: string
  character: string
  tweet_account: string
}

export type GetKnowledgeListResponse = {
  data: KnowLedge[]
  has_more: boolean
  limit: number
  page: number
  total: number
}

type GetKnowledgeReqParams = {
  page: number
  limit: number
}

export const getKnowledgeList = (params: GetKnowledgeReqParams) =>
  XAIGet<GetKnowledgeListResponse>(
    `/knowledge/list?page=${params.page}&limit=${params.limit}`,
    // {
    //   headers: {
    //     Authorization: headersAuthorization,
    //   },
    // }
  )

/*
 *   conversation_id "" if not exist
 *   knowledge use knowledge.id
 *   parent_message_id: message_id of last answer
 */
export type SendAIChatMsgReq = {
  conversation_id: string
  knowledge: string
  message: string
  parent_message_id: string
  tweets_user_name_list: string[]
}

/*
 *  outputs: try convert to json as task response instead of text response
 */
type SendAIChatMsgRes = {
  conversation_id: string
  message_id: string
  outputs: string
}

/*
 *   发送 AI 聊天消息
 *   POST
 */
export const sendAIChatMsg = (params: SendAIChatMsgReq) =>
  XAIPost<SendAIChatMsgRes>('/adminApi/chat/sendMessage', params)

// 获取知识库文档列表
export const getKnowledgeDoclist = (
  page: number,
  limit: number,
  dataset_id: string,
) =>
  XAIGet<any>(
    `/knowledge/docList?page=${page}&limit=${limit}&dataset_id=${dataset_id}`,
  )

// 获取知识库文档分段列表
export const getKnowledgeDocDetail = (
  dataset_id: string,
  document_id: string,
) =>
  XAIGet<any>(
    `/knowledge/getSeg?dataset_id=${dataset_id}&document_id=${document_id}`,
  )

// 创建知识库
export const createIndividual = (data: any) =>
  XAIPost<any>('/knowledge/create', data)

// 删除知识库
export const deleteIndividual = (id: string) =>
  XAIDelete<any>(
    `/knowledge/delete?dataset_id=${id}`,
    //   {
    //   headers: {
    //     Authorization: headersAuthorization,
    //   },
    // }
  )

// 通过文本创建文档
export const createDocText = (data: any) =>
  XAIPost<any>('/knowledge/createDocText', data)

// 删除知识库文档
export const deleteDoc = (dataset_id: string, document_id: string) =>
  XAIDelete<any>(
    `/knowledge/deleteDoc?dataset_id=${dataset_id}&document_id=${document_id}`,
    // {
    //   headers: {
    //     Authorization: headersAuthorization,
    //   },
    // }
  )

// 创建知识库文档分段
export const createSegText = (data: any) =>
  XAIPost<any>('/knowledge/createSeg', data)

// 删除知识库文档分段
export const deleteSeg = (
  dataset_id: string,
  document_id: string,
  segment_id: string,
) =>
  XAIDelete<any>(
    `/knowledge/delSeg?dataset_id=${dataset_id}&document_id=${document_id}&segment_id=${segment_id}`,
    // {
    //   headers: {
    //     Authorization: headersAuthorization,
    //   },
    // }
  )

// 通过文件上传创建文档
export const createDocFile = (data: any) =>
  XAIPost<any>('/knowledge/createDocFile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      // Authorization: headersAuthorization,
    },
  })

/*
* 绑定个体与账号
* POST
*/
type BindPersonalityAndAccountPayload = {
  knowledge_id: string
  tweet_account: string
  document_id: string
}
export const bindPersonalityAndAccount = (payload: BindPersonalityAndAccountPayload) => XAIPost<string>('/knowledge/bindingGather', payload)

type UpdateIndividualCustomConfigPayload = {
  character: string
  role: string
  tweet_account: string
  id: string
}
export const updateIndividualCustomConfig = (payload: UpdateIndividualCustomConfigPayload) => XAIPost<string>('/knowledge/updateClientKnowledge', payload)

// 工作流
/*
*   获取所有工作流
*   POST
*/
export const getXAIAllWorkflows = () => XAIPost<{ workflow_array: TGAIWorkflow[] }>('/workflow/all')

// 主动任务

/*
*   查看主动任务列表
*   POST
*/

export const getAllPeriodicalTasks = () => XAIPost<{ cron_list: PeriodicalTaskRes[] }>('/cron/list')

/*
*   添加主动任务
*   POST
*/
export type AddPeriodicalTaskReq = {
  interval: string
  workflow_id: string
  task_name: string
}
export const addPeriodicalTask = ({ workflow_id, task_name, interval }: AddPeriodicalTaskReq) => XAIPost<null>('/cron/add', { cron_spec: interval, workflow_id, name: task_name })

/*
*   修改主动任务状态
*   POST
*/

export const postPeriodicalTaskState = (id: number, state: PeriodicalTaskStateEnum) => XAIPost<null>('/cron/switch', { id, state })

/*
*   立即执行一次
*   POST
*/

export const postExecutePeriodicalTaskOnce = (id: number) => XAIPost<null>('/cron/inRunWorkflow', { id })

//   宣推与火推

/*
*    获取宣推/火推列表
*    POST
*/
type GetHuoXuanListRes = {
  huo: HuoXuanListItem[]
  xuan: HuoXuanListItem[]
}
export const getHuoXuanList = () => XAIPost<GetHuoXuanListRes>('/adminApi/huoXuan/list')

/*
* 添加宣推/火推
* POST
*/
export type AddHuoXuanPayload = {
  workflow_id: string
  cron_spec: string
  types_str: HuoXuanListItemType
  tweet_url: string
  content: string
}

export const addHuoXuanTask = (payload: AddHuoXuanPayload) => XAIPost<string>('/adminApi/huoXuan/add', payload)

/*
* 修改宣推/火推任务状态
* POST
*/
type SwitchHuoxuanTaskStatePayload = {
  id: number
  state: HuoXuanListItemState
}
export const switchHuoxuanTaskState = (payload: SwitchHuoxuanTaskStatePayload) => XAIPost<string>('/adminApi/huoXuan/switch', payload)

/*
* 宣推/火推任务执行一次
* POST
*/
export const executeOnceHuoxuanTask = (id: number) => XAIPost<string>('/adminApi/huoXuan/run', { id })
