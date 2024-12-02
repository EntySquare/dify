import json
from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_RETRIEVE_DOC_PATH = "knowledge/retrieve"


class XAIUpdateDocWithText(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        dataset_id = tool_parameters.get("dataset_id", "")
        query = tool_parameters.get("query", "")
        json_string = tool_parameters.get("retrieval_model")

        if dataset_id is None or dataset_id == "":
            raise Exception("个体ID不能为空！")
        
        if query is None or query == "":
            raise Exception("查询内容不能为空！")
        
        if json_string is None or json_string == "":
            raise Exception("检索参数不能为空！")
        
        try:
            retrieval_model = json.loads(json_string)

            if isinstance(retrieval_model, dict) is not True:
                raise Exception('检索参数 json 解析失败！')

            if 'search_method' not in retrieval_model or retrieval_model['search_method'] is None or isinstance(retrieval_model['search_method'], str) is not True or retrieval_model['search_method'] == '':
                raise Exception('检索参数中搜索方法search_method为必填项！')
            
            if 'top_k' not in retrieval_model or retrieval_model['top_k'] is None or isinstance(retrieval_model['top_k'], int) is not True:
                raise Exception('检索参数中top_k为必填项！')

        except Exception as e:
            raise e
        
        data = {
            "dataset_id": dataset_id,
            "query": query,
            "retrieval_model": retrieval_model
        }
        
        url = URL(api_url) / "api" / XAI_RETRIEVE_DOC_PATH if 'api' not in api_url else URL(api_url) / XAI_RETRIEVE_DOC_PATH

        try:
            response = post(str(url), json=data)

        except:

            raise Exception(f'Failed to retrieve doc with {query} and config: {json_string}')
        
        try:
            json_response = response.json()

            data = json_response['data']

            if response.status_code == 200:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(f'Failed to retrieve doc with {query} and config: {json_string}')

                return self.create_json_message(data)
            
            else:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(f'Failed to retrieve doc with {query} and config: {json_string}')
                message = data['message']
                message_zh = data['message_zh']
                if message_zh is not None and isinstance(message_zh, str) and message_zh != "":
                    raise Exception(message_zh)
                elif message is not None and isinstance(message, str) and message != '':
                    raise Exception(message)
                else:
                    raise Exception(f'Failed to retrieve doc with {query} and config: {json_string}')

        except Exception as e: 
            raise e



       
