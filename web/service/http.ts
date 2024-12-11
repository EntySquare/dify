import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { TGAI_API_PREFIX } from '@/config'

export type FetchResponse<T> = {
  code: number
  data: T
}

const reqAddTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage?.getItem('tgai_token')

  if (token && token !== 'undefined')
    config.headers.token = token

  return config
}

export const TGAIHttp = axios.create({
  baseURL: TGAI_API_PREFIX,
  timeout: 30000,
})

TGAIHttp.interceptors.request.use(reqAddTokenInterceptor)

export const TGAIGet = <T>(url: string, config?: AxiosRequestConfig) => TGAIHttp.get<FetchResponse<T>>(url, config).then(res => res.data)

export const TGAIPost = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => TGAIHttp.post<FetchResponse<T>>(url, data, config).then(res => res.data)

export const TGAIDelete = <T>(url: string, config?: AxiosRequestConfig) => TGAIHttp.delete<FetchResponse<T>>(url, config).then(res => res.data)
