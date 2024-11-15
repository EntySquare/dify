export enum TemplateValidFlagEnum {
  VALID = 1,
  INVALID,
}

type CommonTemplate = {
  flag: TemplateValidFlagEnum
  scene: string
  extra: string
  name: string
  id: number
  user_id: number

}

export type ChatterRole = {
  id: number
  keyword: string
  personality: string
  purpose: string
  role: string
}

export type ReqChatterRole = {
  id: number
  keyword?: string
  personality?: string
  purpose: string
  role: string
}

export type SingleTemplate = {
  chat_times: number
  end_word: string
  personality: string
  role: string
} & CommonTemplate

// export type GroupTemplate = {
//   min_length: number
//   max_length: number
//   role_count: number
//   roles: ChatterRole[]
// } & CommonTemplate

export type GroupTemplate = {
  min_length: number
  max_length: number
  role_count: number
  roles: ReqChatterRole[]
} & CommonTemplate
