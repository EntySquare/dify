from typing import Any, Union

from httpx import get
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_GET_PERSONALITY_LIST_PATH = "knowledge/list"


class XAIGetPersonalityList(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        page = tool_parameters.get("page", 1)
        limit = tool_parameters.get('limit', 20)
        
        url = URL(api_url) / "api" / XAI_GET_PERSONALITY_LIST_PATH if 'api' not in api_url else URL(api_url) / XAI_GET_PERSONALITY_LIST_PATH

        params = {
            "page": str(page),
            "limit": str(limit),
        }

        try:
            response = get(str(url), params=params)

        except:

            raise Exception('Failed to get personality list!')
        
        try:

            json_response = response.json()

            data = json_response['data']

            if response.status_code == 200:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception('Failed to get peronality list!')

                # response_data = json.loads(data)

                # if not isinstance(response_data, dict):
                #     raise Exception('返回值 json 解析失败！')

                return self.create_json_message(data)
            
            else:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception('Failed to get personality list!')
                message = data['message']
                message_zh = data['message_zh']
                if message_zh is not None and isinstance(message_zh, str) and message_zh != "":
                    raise Exception(message_zh)
                elif message is not None and isinstance(message, str) and message != '':
                    raise Exception(message)
                else:
                    raise Exception('Failed to get personality list!')

        except Exception as e: 
            raise e


       
