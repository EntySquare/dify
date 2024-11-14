export enum TGAIGroupTypeEnum {
  CHANNEL = 1,
  GROUP_CHAT,
}

export enum TGAIAccountJoinedChannelFlag {
    JOINED = "1",
    NOT_JOINED = "0"
}

export type TGAIAccountInChannelRes = {
    phone: string,
    create_time: string
    channel_id: number
    channel_title: string
    channel_name: string
    channel_link: string
    access_hash: number
    participants_count: number
    join_flag: TGAIAccountJoinedChannelFlag
}

export type TGAIJoinedChannelList = {
  access_hash: number
  channel_id: number
  channel_link: string
  channel_name: string
  channel_title: string
  create_time: string
  number: number
  participants_count: number
}

export type TGAIAllChannelList = {
  id: number
  name: string
  channel_id: number
  link: string
  domain: string
  listen_flag: string
  participants_count: number
  channel_sets: number[]
}

export type TGAIChannelDetail = {
  name: string
  channel_id: number
  link: string
  domain: string
  participants_count: number
  active_count: number
  admin_count: number
  bot_count: number
}

export type TGAIAllChannelListRes = {
  channels: TGAIAllChannelList[]
  total: number
}

export type ThirdEngineSearchResItem = {
  title: string
  domain: string
  link: string
  description: string
  members: string
  keyword: string
}

export type ThirdEngineSearchRes = {
  search_res_list: ThirdEngineSearchResItem[]
}

export type TGAIGroupList = {
  access_hash: number
  channel_link: string
  channel_name: string
  create_time: string
  group_id: number
  group_title: string
  group_types: TGAIGroupTypeEnum
  number: number
  participants_count: number
}

export type TGAIChannelSet = {
  id: number
  set_name: string
  channels: TGAIAllChannelList[]
}

export type TGAIEngineSearchChannel = {
  title: string
  domain: string
  link: string
  description: string
  members: string
  keyword: string
}
