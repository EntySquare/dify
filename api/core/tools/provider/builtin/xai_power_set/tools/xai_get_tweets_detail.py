from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_GET_TWEETS_DETAIL_PATH = "adminApi/selectTwitterUrl"


class XAIGetDeivceList(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        tweets_url = tool_parameters.get('url', "")
        
        if tool_parameters.get("sync", False):
            sync = "true"
        else:
            sync = "false"

        if tweets_url is None or tweets_url == "":
            raise Exception("推文链接不能为空！")
        
        if sync is None:
            raise Exception("阻塞传递未设置或参数错误！")
        
        url = URL(api_url) / "api" / XAI_GET_TWEETS_DETAIL_PATH if 'api' not in api_url else URL(api_url) / XAI_GET_TWEETS_DETAIL_PATH

        data = {
            "url": tweets_url,
            "sync": sync,
            "is_workflow": True
        }

        try:
            response = post(str(url), json=data)
            if response.status_code == 500:
                raise Exception(f'Failed to get tweets Detail of {tweets_url}')
        except:
            raise Exception(f'Failed to get tweets Detail of {tweets_url}')
        
        if response.status_code == 200:
            try:
                response = response.json()
                data = response['data']

                if data is not None:
                    return self.create_json_message(data)
                else: 
                    raise Exception(f'Failed to get tweets Detail of {tweets_url}: data not found in response!')

            except:
                raise Exception(f'Failed to get tweets Detail of {tweets_url}: parsing json failed!')

        else:
            raise Exception(f'Failed to get tweets Detail of {tweets_url}')
       
