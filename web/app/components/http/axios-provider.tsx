'use client'

import { TGAIHttp } from "@/service/http"
import { allTokenRemove } from "@/utils"
import { AxiosError, AxiosResponse } from "axios"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"
import { Message } from "@arco-design/web-react"

interface AxiosProviderProps {
    children: ReactNode
}

export type TGAIRequestError = {
    message: string
}
export const AxiosProvider = ({ children }: AxiosProviderProps) => {

    const router = useRouter()

    const tokenExpirationInterceptors = (res: AxiosResponse) => {
        if (res.data.code === -2 || res.data.code === -1) {
            Message.error(res.data.data.message_zh || res.data.data.message || "请求出错，请稍后重试！")
            if (res.data.code === -2) {
                allTokenRemove()
                router.replace('/signin')
            }
            return Promise.reject({
                message: res.data.data.message_zh || res.data.data.message,
            })
        }
        return Promise.resolve(res)
    }

    const axiosErrorInterceptors = (err: AxiosError<{ code: number, data: { message: string, message_zh: string } }>) => {
        Message.error(err.response?.data.data.message_zh || err.response?.data.data.message || "请求错误！")
    }

    useEffect(() => {
        const tokenInterceptorsId = TGAIHttp.interceptors.response.use(tokenExpirationInterceptors, axiosErrorInterceptors)

        return () => {
            TGAIHttp.interceptors.response.eject(tokenInterceptorsId)
        }
    }, [])


    return <>{children}</>
}