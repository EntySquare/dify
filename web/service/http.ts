
import { TGAI_API_PREFIX, TGAI_WS_PREFIX } from '@/config'
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

export interface FetchResponse<T> {
    code: number;
    data: T
}


const reqAddTokenInterceptor = (config: InternalAxiosRequestConfig) => {
    const token = localStorage?.getItem('tgai_token')

    if (token && token !== 'undefined') config.headers.token = token

    return config
}


export const TGAIHttp = axios.create({
    baseURL: TGAI_API_PREFIX,
    timeout: 30000
})


TGAIHttp.interceptors.request.use(reqAddTokenInterceptor)



export const TGAIGet = <T>(url: string, config?: AxiosRequestConfig) => TGAIHttp.get<FetchResponse<T>>(url, config).then(res => res.data)

export const TGAIPost = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => TGAIHttp.post<FetchResponse<T>>(url, data, config).then(res => res.data)
