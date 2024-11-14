export enum TGAIAccountIsStartEnum {
  IS_STARTED = '1',
  IS_SIGNINED = '2',
  WHAT = '3',
}

export type TGAIAccount = {
  phone: string
  name: string
  role: string
  user_id: number
  is_start: TGAIAccountIsStartEnum
  access_hash: number
}

export type TGAccountRes = {
  number: number
  id: number
  access_hash: number
  username: string
  first_name: string
  last_name: string
  phone: string
  contact: boolean
  mutual_contact: boolean
  bot: boolean
  link: string
}

export type TGAITokenConfig = {
    appHash: string
    appId: string
    code: string
    name: string
    phone: string
}