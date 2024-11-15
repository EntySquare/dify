export type HeatChatRank = {
    rank_time: string
    sender: string
    sender_id: number
    sender_phone: string
    receiver_phone: string
    chat_count: number
    template_id: number
    template_name: string
}

export type HeatChannelChat = {
    start_time: string
    end_time: string
    start_timestamp: number
    end_timestamp: number
    chat_num: number
}

export type HeatOverviewData = {
    acc_total: number
    acc_signed: number
    channel_listen: number
    crawler_channel: number
    plan_exe_count: number
    keyword_hit: number
    at_reply: number
    valid_chat: number
    set_id: number
    set_name: string
    channel_chats: HeatChannelChat[]
}