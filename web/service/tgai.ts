import { TGAIGet, TGAIPost } from './http'
import type { TGAIAccount, TGAITokenConfig, TGAccountRes } from '@/models/tgai-user'
import type { TGAIGroupStrategy, TGAIKeywordStrategy, TGAIReplyTypeEnum, TGAISingleStrategy, TGAISingleStrategyFlag, TGAIStrategyTakeEffectEnum } from '@/models/tgai-strategy'
import type { TGAIAccountInChannelRes, TGAIAllChannelList, TGAIAllChannelListRes, TGAIChannelDetail, TGAIChannelSet, TGAIEngineSearchChannel, TGAIGroupList, TGAIGroupTypeEnum, TGAIJoinedChannelList } from '@/models/tgai-channel'
import type { GroupTemplate, ReqChatterRole, SingleTemplate } from '@/models/tgai-template'
import type { TGAIWorkflow } from '@/models/tgai-workflow'
import { HeatChatRank, HeatOverviewData } from '@/models/tgai-heat'
import { PeriodicalTaskRes, PeriodicalTaskStateEnum } from '@/models/tgai-periodical-task'

// 用户 API
/*
*   获取指定用户联系人列表
*   POST
*/
export const getTGAIUserContancts = (phone: string) => TGAIPost<{ contact_res_list: TGAccountRes[] }>('/contact/list', {
    phone,
    pageNum: 1,
    pageSize: 10,
})

/*
*   获取所有已登录账号
*   POST
*/
export const getTGAILoggedAccount = () => TGAIPost<TGAIAccount[]>('/account/hasLogged')

/*
*   获取所有账号
*   POST
*/
export const getTGAIAllAccount = () => TGAIPost<TGAIAccount[]>('/account/all')

/*
*   向联系人发送消息
*   POST
*/
export type SendTGAIContactMsgReq = {
    domain: string
    input: string
    link: string
    phone: string
    sender: string
}
export const sendTGAIContactMsg = (data: SendTGAIContactMsgReq) => TGAIPost<string>('/message/send', data)

/*
*   添加账户
*   POST
*/
export const addTGAIAccount = (data: string) => TGAIPost<string>('/account/add', {
    phone: data,
})

/*
*   发送账户登录验证码
*   POST
*/
export const sendTGAIAccountLoginCode = (phone: string) => TGAIPost<{ code_hash: string }>('/user/sendCode', {
    phone
})

/*
*   使用验证码登录 TG 账号
*   POST
*/
type SigninTGAccountReq = {
    code: string
    code_hash: string
    phone: string
}
export const signinTGAccountWithCode = (data: SigninTGAccountReq) => TGAIPost<any>('/user/signIn', data)

/*
*   删除 TGAI 账户
*   POST
*/
export const deleteTGAIAccount = (phone: string) => TGAIPost<string>('/account/delete', {
    phone
})

/*
*   获取 TGAI Token 配置
*   POST
*/
export const getTGAITokenConfig = () => TGAIPost<TGAITokenConfig>('/config/all')

/*
*   配置 TGAI 密钥
*   POST
*/
type SetTGAITokenConfigReq = {
    appHash: string
    appId: string
    phone: string
}
export const setTGAITokenConfig = (data: SetTGAITokenConfigReq) => TGAIPost<string>('/config/login', data)


// 群组 API
/*
*   获取用户所在群聊列表
*   POST
*/
export const getTGAIGroupList = (phone: string) => TGAIPost<TGAIGroupList[]>('/group/list', { phone })

/*
*   获取用户所在 Channel 列表
*   POST
*/
export const getTGAIJoinedChannelList = (phone: string) => TGAIPost<TGAIJoinedChannelList[]>('/channel/list', { phone })

/*
*   获取所有 Channel 列表
*   POST
*/
type GetTGAIAllChannelListReq = {
    current_page: number
    page_size: number
}
export const getTGAIAllChannelList = (data: GetTGAIAllChannelListReq) => TGAIPost<TGAIAllChannelListRes>('/channel/all', data)

/*
*   获取单个 Channel 详情
*   POST
*/
export const getTGAIChannelDetail = (channel_id: number) => TGAIPost<TGAIChannelDetail>('/channel/detail', {
    channel_id,
})

/*
*   查询群组集合
*   POST
*/
export type GetTGAIChannelSetsRes = {
    channel_sets: TGAIChannelSet[]
    total: number
}

export const getTGAIChannelSets = () => TGAIPost<GetTGAIChannelSetsRes>('/channel/getAllSet')

/*
*   创建群组
*   POST
*/
type CreateTGAIChannelSetRes = {
    set_id: number,
    set_name: string
    channels: TGAIAllChannelList[]
}
export const createTGAIChannelSet = (set_name: string, channel_ids: number[]) => TGAIPost<CreateTGAIChannelSetRes>('/channel/createSet', {
    set_name,
    channel_ids
})

/*
*   删除群组
*   POST
*/
export const deleteTGAIChannelSet = (set_id: number) => TGAIPost<string>('/channel/deleteSet', {
    set_id
})

/*
*   删除群组内的 Channel
*   POST
*/
export const deleteTGAIChannelSetItem = (set_id: number, channel_ids: number[]) => TGAIPost<string>('/channel/deleteSetItem', {
    set_id,
    channel_ids
})

/*
*   更改群组内的 Channel
*   POST
*/
export const updateTGAIChannelSetItem = (set_id: number, channel_ids: number[]) => TGAIPost<string>('/channel/addSetItem', {
    set_id,
    channel_ids
})


/*
*   爬虫搜索群列表
*   POST
*/
type GetTGAIEngineSearchChannelRes = {
    search_res_list: TGAIEngineSearchChannel[]
}
export const getTGAIEngineSearchChannel = (keyword: string, phone: string) => TGAIPost<GetTGAIEngineSearchChannelRes>('/engine/third', {
    keyword, phone,
})

/*
*   检查用户是否在群组中
*   POST
*/
export const checkAccountInChannel = (channel_name: string, phone: string) => TGAIPost<TGAIAccountInChannelRes>('/channel/searchOne', {
    channel_name,
    phone,
})

/*
*   操作指定账号加入指定群组
*   POST
*/
export const letAccountJoinChannel = (channel_link: string, phone: string) => TGAIPost<string>('/channel/join', {
    channel_link,
    phone,
})

/*
*   操作指定账号退出指定群组
*   POST
*/
export const letAccountLeaveChannel = (channel_link: string, phone: string) => TGAIPost<string>('/channel/leave', {
    channel_link,
    phone,
})

// 模版 API
/*
*   获取生效单聊模版
*   POST
*/
export const getActiveSingleTemplateList = () => TGAIPost<{ single_template_list: SingleTemplate[] }>('/singleTemplate/getActiveSingleTemplateList')

/*
*   复制单聊模版
*   POST
*/
export const copySingleTemplate = (id: number) => TGAIPost<string>('/singleTemplate/copySingleTemplate', { id })

/*
*   删除单聊模版
*   POST
*/
export const deleteSingleTemplate = (id: number) => TGAIPost<string>('/singleTemplate/deleteSingleTemplate', { id })


/*
*   更新单聊模版
*   POST
*/
export const updateTGAISingleTemplate = (data: Partial<SingleTemplate>) => TGAIPost<{ id: number }>('/singleTemplate/updateSingleTemplate', data)

/*
*   创建单聊模版
*   POST
*/
export const createTGAISingleTemplate = (data: Partial<SingleTemplate>) => TGAIPost<{ id: number }>('/singleTemplate/createSingleTemplate', data)

/*
*   测试单聊模版
*   POST
*/
export const testTGAISingleTemplate = (data: Partial<SingleTemplate> & { message_list: string[] }) => TGAIPost<{ message: string }>('/singleTemplate/testSingleTemplate', data)


/*
*   获取生效群聊模版
*   POST
*/
export const getActiveGroupTemplateList = () => TGAIPost<{ template_list: GroupTemplate[] }>('/template/getActiveTemplateList')

/*
*   复制群聊模版
*   POST
*/
export const copyGroupTemplate = (id: number) => TGAIPost<string>('/template/copyTemplate', { id })

/*
*   删除群聊模版
*   POST
*/
export const deleteGroupTemplate = (id: number) => TGAIPost<string>('/template/deleteTemplate', { id })

/*
*   修改群聊模版
*   POST
*/
export const updateTGAIGroupTemplate = (data: Partial<GroupTemplate>) => TGAIPost<{ id: number }>('/template/updateTemplate', data)

/*
*   创建群聊模版
*   POST
*/
export const createTGAIGroupTemplate = (data: Partial<GroupTemplate>) => TGAIPost<{ id: number }>('/template/createTemplate', data)

/*
*   测试群聊模版
*   POST
*/
export const testTGAIGroupTemplate = (data: Partial<GroupTemplate> & { phone?: string, channel_id?: number, chat_count?: number }) => TGAIPost<{ talk_text_list: string[] }>('/template/testTemplate', data)


// 策略 API

/*
*   获取关键词策略列表
*   POST
*/
type GetTGAIKeywordStrategyListReq = {
    keyword?: string
    phone?: string
}
export const getTGAIKeywordStrategyList = (data: GetTGAIKeywordStrategyListReq = {}) => TGAIPost<TGAIKeywordStrategy[]>('/groupTrigger/list', data)

/*
*   获取关键词策略设置 - 所有群频率
*   POST
*/

type GetTGAIKwStrategyAllIntervalRes = {
    group_trigger_interval_minute: number
}
export const getTGAIKwStrategyAllInterval = () => TGAIPost<GetTGAIKwStrategyAllIntervalRes>('/keyValues/get')

/*
*   关键词策略设置 - 更新所有群频率
*   POST
*/
type SetTGAIKwStrategyAllIntervalRes = {
    key: 'group_trigger_interval_minute'
    value: number
}

export const setTGAIKwStrategyAllInterval = (interval: number) => TGAIPost<SetTGAIKwStrategyAllIntervalRes>('/keyValues/update', {
    key: 'group_trigger_interval_minute',
    value: interval,
})

/*
*   关键词策略 - 设置是否生效
*   POST
*/
export const setTGAIKwStrategyFlag = (id: number, flag: number) => TGAIPost<string>('/groupTrigger/updateFlag', {
    flag,
    id,
})

/*
*   关键词策略 - 删除关键词策略
*   POST
*/
export const deleteTGAIKwStrategy = (id: number) => TGAIPost<string>('/groupTrigger/delete', {
    id,
})

/*
*   关键词策略 - 新增关键词策略
*   POST
*/
type CreateTGAIKwStrategyReq = {
    group_id: number
    group_name: string
    group_types: TGAIGroupTypeEnum
    keyword?: string
    phone: string
    // reply: string
    reply_type: TGAIReplyTypeEnum
    flow_id: string
}
export const createTGAIKwStrategy = (data: CreateTGAIKwStrategyReq) => TGAIPost<string>('/groupTrigger/create', data)

/*
*   关键词策略 - 修改关键词策略
*   POST
*/
type EditTGAIKwStrategyReq = CreateTGAIKwStrategyReq & { id: number }
export const editTGAIKwStrategy = (data: EditTGAIKwStrategyReq) => TGAIPost<string>('/groupTrigger/update', data)

/*
*   单聊策略 - 获取所有单聊策略
*   POST
*/
export const getTGAISingleStrategies = () => TGAIPost<TGAISingleStrategy[]>('/message/allListen')

/*
*   单聊策略 - 更新单聊策略
*   POST
*/
type UpdateTGAISingleStrategyReq = {
    counter: number
    listen_state: '0' | '1'
    phone: string
    flag: TGAISingleStrategyFlag
    smart_id: number
    smart_name: string
    workflow_id: string
    workflow_name: string
}
export const updateTGAISingleStrategy = (data: UpdateTGAISingleStrategyReq) => TGAIPost<null>('/message/updateListen', data)

/*
*   群聊策略 - 获取所有群聊策略
*   POST
*/
export const getTGAIGroupStrategies = () => TGAIPost<{ plan_list: TGAIGroupStrategy[] }>('/plan/getActivePlan')

/*
*   群聊策略 - 更改策略自动删除消息状态
*   POST
*/
export const updateTGAIGroupStrategyAutoDeleteStatus = (id: number) => TGAIPost<string>('/plan/changeAutoDelete', { id })

/*
*   群聊策略 - 删除群聊策略
*   POST
*/
export const deleteTGAIGroupStrategy = (id: number) => TGAIPost<string>('/plan/deletePlan', { id })

/*
*   群聊策略 - 启动群聊策略
*   POST
*/
export const runTGAIGroupStrategy = (id: number) => TGAIPost<string>('/plan/runPlanSmart', { id })

/*
*   群聊策略 - 停止群聊策略
*   POST
*/
export const stopTGAIGroupStrategy = (id: number) => TGAIPost<string>('/plan/stopPlan', { id })

/*
*   群聊策略 - 创建群聊策略
*   POST
*/
export type CreateTGAIGroupStrategyReq = {
    account_phone_list: string[]
    active_time_list?: number[]
    channel_sets_list: number[]
    chat_count?: number
    heat_trigger?: number
    interval: number
    name: string
    template_id: number
}
export const createTGAIGroupStrategy = (data: CreateTGAIGroupStrategyReq) => TGAIPost<null>('/plan/createPlan', data)

/*
*   群聊策略 - 修改群聊策略
*   POST
*/
export type UpdateTGAIGroupStrategyReq = CreateTGAIGroupStrategyReq & { id: number; flag: TGAIStrategyTakeEffectEnum }
export const updateTGAIGroupStrategy = (data: UpdateTGAIGroupStrategyReq) => TGAIPost<null>('/plan/updatePlan', data)

export const runTGAIGroupStrategyOnce = (id: number) => TGAIPost<null>('/plan/runPlanOnce', { id })

// 工作流
/*
*   获取所有工作流
*   POST
*/
export const getTGAIAllWorkflows = () => TGAIPost<{ workflow_array: TGAIWorkflow[] }>('/workflow/all')

// 热度
/*
*   获取单个群聊天热度峰值
*   POST
*/
export type TGAIHeatPeak = {
    peak_time: string
    peak_data: number
}
export const getTGAIChannelHeatPeak = (channel_id: number) => TGAIPost<TGAIHeatPeak[]>('/heat/channelPeak', { channel_id })

/*
*   获取单个群活跃热度
*   POST
*/
export type TGAIActiveHeatRes = {
    data_7_days: number[]
    data_30_days: number[]
    data_yesterday: number[]
}
export const getTGAIChannelActiveHeat = (channel_id: number) => TGAIPost<TGAIActiveHeatRes>('/heat/channelActive', { channel_id })



/*
*   获取 TGAI 私聊记录排行
*   POST
*/

export const getTGAIHeatChatRank = () => TGAIPost<HeatChatRank[]>('/heat/chatRank')

/*
*   获取 TGAI 热度数据
*   POST
*/
export const getTGAIHeatData = (set_id?: number) => TGAIPost<HeatOverviewData>('/heat/view', {
    set_id
})


// 工具 API

/*
*   清除账号聊天记录
*   POST
*/

type ClearTGAIAccountChatHistoryReq = {
    phone: string
    channel_id: number
    days: number
}

export type DeletedMessage = {
    phone: string,
    channel_name: string
    channel_id: number
    message_string: string
    date: string
}

type ClearTGAIAccountChatHistoryRes = {
    deleted_message_list: DeletedMessage[] | null
}

export const clearTGAIAccountChatHistory = (data: ClearTGAIAccountChatHistoryReq) => TGAIPost<ClearTGAIAccountChatHistoryRes>('/message/deleteMessage', data)

/*
*   群列表添加群 案链接添加
*   POST
*/
export const channelAdd = (channel_link: string, phone: string) => TGAIPost<string>('/channel/add', { channel_link, phone })


// 主动任务

/*
*   查看主动任务列表
*   POST
*/

export const getAllPeriodicalTasks = () => TGAIPost<{ cron_list: PeriodicalTaskRes[] }>('/cron/list')

/*
*   添加主动任务
*   POST
*/
export type AddPeriodicalTaskReq = {
    interval: string,
    workflow_id: string,
    task_name: string
}
export const addPeriodicalTask = ({ workflow_id, task_name, interval }: AddPeriodicalTaskReq) => TGAIPost<null>('/cron/add', { cron_spec: interval, workflow_id, name: task_name, })

/*
*   修改主动任务状态
*   POST
*/

export const postPeriodicalTaskState = (id: number, state: PeriodicalTaskStateEnum) => TGAIPost<null>("/cron/switch", { id, state })

/*
*   立即执行一次
*   POST
*/

export const postExecutePeriodicalTaskOnce = (id: number) => TGAIPost<null>("/cron/inRunWorkflow", { id })

// 数据整理

/*
*   查看所有数据文件
*   POST
*/

export const fetchDataCleansingFileList = () => TGAIPost<string[]>("/file/list")

/*
*   获取文件下载链接
*   GET
*   /file/download/{文件名}
*/

export const getDataCleansingFileDownload = (filename: string) => {
    const encodedFilename = encodeURIComponent(filename);
    return TGAIGet<unknown>("/file/download/" + encodedFilename)
}