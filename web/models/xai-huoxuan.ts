export type HuoXuanListItem = {
  ID: number
  tweet_url: string
  content: string
  workflow_id: string
  types_str: HuoXuanListItemType
  cron_spec: string
  entry_id: number
  state: HuoXuanListItemState
  run_num: number
  last_run_time_unix: number
}

export enum HuoXuanListItemType {
  XUAN = 'xuan',
  HUO = 'huo',
}

export enum HuoXuanListItemState {
  ACTIVATE = 1,
  DEACTIVATE = 0,
  DELETE = -1,
}
