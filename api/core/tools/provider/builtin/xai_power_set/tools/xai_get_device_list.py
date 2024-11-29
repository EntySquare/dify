from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_DEVICE_LIST_PATH = "adminApi/deviceList"


class XAIGetDeivceList(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        
        if tool_parameters.get("sync", False):
            sync = "true"
        else:
            sync = "false"
        
        if sync is None:
            raise Exception("阻塞传递未设置或参数错误！")
        
        url = URL(api_url) / "api" / XAI_DEVICE_LIST_PATH if 'api' not in api_url else URL(api_url) / XAI_DEVICE_LIST_PATH

        data = {
            "sync": sync,
            "is_workflow": True
        }

        try:
            response = post(str(url), json=data)
            if response.status_code == 500:
                raise Exception('Failed to get device list')
        except:
            raise Exception('Failed to get device list')
        
        if response.status_code == 200:
            try:
                response = response.json()
                data = response['data']

                if data is not None:
                    return self.create_json_message(data)
                else: 
                    raise Exception('Failed to get device list: data not found in response!')

            except:
                raise Exception('Failed to get device list: parsing json failed!')

        else:
            raise Exception('Failed to get device list')
       
