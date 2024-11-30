import { XAIGet, XAIPost } from "./x-http";
import type { TGAccountRes } from "@/models/tgai-user";

// 用户 API
/*
 *   获取指定用户联系人列表
 *   POST
 */
export const getTGAIUserContancts = (phone: string) =>
  XAIPost<{ contact_res_list: TGAccountRes[] }>("/contact/list", {
    phone,
    pageNum: 1,
    pageSize: 10,
  });

/*
 *   获取所有已登录账号
 *   POST
 */
export const getXAIDeviceList = () => XAIPost<any>("/adminApi/deviceList");

export type TweetsUserNameListRes = { tweets_user_name_list: string[] };
// 查询当前推特账号列表
export const tweetsUserNameList = () =>
  XAIPost<TweetsUserNameListRes>("/adminApi/tweetsUserNameList");

// 关注用户
export const followTwitterUser = (userNameList: [], tweetsUserName: string) =>
  XAIPost<any>("/adminApi/followTwitterUser", {
    tweets_user_name_list: userNameList,
    tweets_user_name: tweetsUserName,
  });

// 点赞推文
export const supportTwitter = (userNameList: [], twitterUrl: string) =>
  XAIPost<any>("/adminApi/supportTwitter", {
    tweets_user_name_list: userNameList,
    twitter_url: twitterUrl,
  });

// 转发
export const forwardTwitter = (userNameList: [], twitterUrl: string) =>
  XAIPost<any>("/adminApi/forwardTwitter", {
    tweets_user_name_list: userNameList,
    twitter_url: twitterUrl,
  });

// 转发并引用
export const forwardAndQuoteTwitter = (
  forwardAndQuoteContent: string,
  userNameList: [],
  twitterUrl: string
) =>
  XAIPost<any>("/adminApi/forwardAndQuoteTwitter", {
    content: forwardAndQuoteContent,
    tweets_user_name_list: userNameList,
    twitter_url: twitterUrl,
  });

// 评论推文
export const commentTwitter = (
  commentContent: string,
  userNameList: [],
  twitterUrl: string
) =>
  XAIPost<any>("/adminApi/commentTwitter", {
    content: commentContent,
    tweets_user_name_list: userNameList,
    twitter_url: twitterUrl,
  });

// 发布推文
export const sendTwitter = (
  releaseContent: string,
  userNameList: [],
  imgUrl: string
) =>
  XAIPost<any>("/adminApi/sendTwitter", {
    content: releaseContent,
    tweets_user_name_list: userNameList,
    img_url: imgUrl,
  });

// 根据链接查看推文信息
export const selectTwitterUrl = (twitterUrl: any) =>
  XAIPost<any>("/adminApi/selectTwitterUrl", { url: twitterUrl });

/*
 *   获取知识库列表
 *   GET
 */
export type KnowLedge = {
  id: string;
  name: string;
  description: string;
  permission: string;
  data_source_type: string;
  indexing_technique: string;
  app_count: number;
  document_count: number;
  word_count: number;
  created_by: string;
  created_at: number;
  updated_by: string;
  updated_at: number;
};

export type GetKnowledgeListResponse = {
  data: KnowLedge[];
  has_more: boolean;
  limit: number;
  page: number;
  total: number;
};

type GetKnowledgeReqParams = {
  page: number;
  limit: number;
};

export const getKnowledgeList = (params: GetKnowledgeReqParams) =>
  XAIGet<GetKnowledgeListResponse>(
    `/knowledge/list?page=${params.page}&limit=${params.limit}`,
    {
      headers: {
        Authorization: "Bearer dataset-4jnh8BQuVWjJFpm6ahYkTF7j",
      },
    }
  );

/*
 *   conversation_id "" if not exist
 *   knowledge use knowledge.id
 *   parent_message_id: message_id of last answer
 */
export type SendAIChatMsgReq = {
  conversation_id: string;
  knowledge: string;
  message: string;
  parent_message_id: string;
  tweets_user_name_list: string[];
};

/*
 *  outputs: try convert to json as task response instead of text response
 */
type SendAIChatMsgRes = {
  conversation_id: string;
  message_id: string;
  outputs: string;
};

/*
 *   发送 AI 聊天消息
 *   POST
 */
export const sendAIChatMsg = (params: SendAIChatMsgReq) =>
  XAIPost<SendAIChatMsgRes>("/adminApi/chat/sendMessage", params);

// 获取知识库文档列表
export const getKnowledgeDoclist = (
  page: number,
  limit: number,
  dataset_id: string
) =>
  XAIGet<any>(
    `/knowledge/docList?page=${page}&limit=${limit}&dataset_id=${dataset_id}`
  );
// 创建知识库
export const createIndividual = (data: any) =>
  XAIPost<any>("/knowledge/create", data);

// 通过文件上传创建文档
export const createDocFile = (data: any) =>
  XAIPost<any>("/knowledge/createDocFile", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
