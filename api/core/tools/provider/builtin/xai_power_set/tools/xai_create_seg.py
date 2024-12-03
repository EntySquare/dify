import json
from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_CREATE_SEG_PATH = "knowledge/createSeg"


class XAICreateSeg(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        dataset_id = tool_parameters.get("dataset_id", "")
        document_id = tool_parameters.get("document_id", "")
        segments_string = tool_parameters.get("segments", "")

        if dataset_id is None or dataset_id == "":
            raise Exception("个体ID不能为空！")
        
        if document_id is None or document_id == "":
            raise Exception("料 ID不能为空！")
        
        if segments_string is None or segments_string == "":
            raise Exception("分段内容不能为空!")
        
        try:
            segments = json.loads(segments_string)

            if isinstance(segments, dict) is not True or 'segments' not in segments:
                raise Exception("请按正确格式填写分段内容！")

        except Exception as e:
            raise e
        
        data = {
            "dataset_id": dataset_id,
            "document_id": document_id,
            'segments': segments['segments']
        }
        
        url = URL(api_url) / "api" / XAI_CREATE_SEG_PATH if 'api' not in api_url else URL(api_url) / XAI_CREATE_SEG_PATH

        try:
            response = post(str(url), json=data)

        except:

            raise Exception(f'Failed to create seg {segments_string} into {document_id} of {dataset_id}')
        
        try:
            json_response = response.json()

            if 'data' not in json_response:
                raise Exception(f'未在响应中找到 data！响应内容:{json.dumps(json_response)}')

            data = json_response['data']

            if response.status_code == 200:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(f'Failed to create seg {segments_string} into {document_id} of {dataset_id}')

                # response_data = json.loads(data)

                # if not isinstance(response_data, dict):
                #     raise Exception('返回值 json 解析失败！')

                return self.create_json_message(data)
            
            else:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(f'Failed to create seg {segments_string} into {document_id} of {dataset_id}')
                message = data['message']
                message_zh = data['message_zh']
                if message_zh is not None and isinstance(message_zh, str) and message_zh != "":
                    raise Exception(message_zh)
                elif message is not None and isinstance(message, str) and message != '':
                    raise Exception(message)
                else:
                    raise Exception(f'Failed to create seg {segments_string} into {document_id} of {dataset_id}')

        except Exception as e: 
            raise e



       
