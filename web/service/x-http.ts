import { XAI_API_PREFIX, TGAI_API_PREFIX, TGAI_WS_PREFIX } from "@/config";
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

export interface FetchResponse<T> {
  code: number;
  data: T;
}

const reqAddTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage?.getItem("xai_token");

  if (token && token !== "undefined") config.headers.token = token;

  return config;
};

export const XAIHttp = axios.create({
  baseURL: XAI_API_PREFIX,
  timeout: 30000,
});

XAIHttp.interceptors.request.use(reqAddTokenInterceptor);

export const XAIGet = <T>(url: string, config?: AxiosRequestConfig) =>
  XAIHttp.get<FetchResponse<T>>(url, config).then((res) => res.data);

export const XAIPost = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => XAIHttp.post<FetchResponse<T>>(url, data, config).then((res) => res.data);
