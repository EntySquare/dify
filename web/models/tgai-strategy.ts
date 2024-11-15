import { TGAIGroupTypeEnum } from "./tgai-channel"

export enum TGAISingleStrategyFlag {
  TEMPLATE = 1,
  WORKFLOW,
}

export enum TGAIStrategyTakeEffectEnum {
  NOT_EFFECT = 0,
  EFFECT,
}

export enum TGAIReplyTypeEnum {
    KEYWORD_TRIGGER = 1,
    QUOTE,
    MENTION
}

export type TGAISingleStrategy = {
  counter: number
  flag: TGAISingleStrategyFlag
  listen_state: '1' | '0'
  phone: string
  smart_id: number
  smart_name: string
  workflow_id: string
  workflow_name: string
}

export type TGAIGroupStrategy = {
  id: number
  name: string
  user_id: number
  channel_sets_list: number[]
  template_id: number
  template_name: string
  account_phone_list: string[]
  active_time_list: number[] | null
  interval: number
  chat_count: number
  heat_trigger: number
  run_times: number
  auto_delete: 0 | 1
  is_running: 0 | 1
  flag: TGAIStrategyTakeEffectEnum
}

export type TGAIKeywordStrategy = {
  id: number
  keyword: string
  reply: string
  reply_count: number
  hit_count: number
  flag: TGAIStrategyTakeEffectEnum
  reply_last_unix: string
  created_time: string
  phone: string
  group_id: number
  group_name: string
  group_types: TGAIGroupTypeEnum
  reply_type: TGAIReplyTypeEnum
  flow_id: string
}