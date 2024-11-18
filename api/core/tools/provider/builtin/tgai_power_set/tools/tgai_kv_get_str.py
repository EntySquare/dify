from typing import Any, Union

from httpx import get
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

TGAI_KV_GET_STRING_PATH = "kvString"


class TGAIKvGetString(BuiltinTool):

    def _parse_response(self, response: dict) -> dict:
        result = {}
        if "knowledge_graph" in response:
            result["title"] = response["knowledge_graph"].get("title", "")
            result["description"] = response["knowledge_graph"].get("description", "")
        if "organic_results" in response:
            result["organic_results"] = [
                {
                    "title": item.get("title", ""),
                    "link": item.get("link", ""),
                    "snippet": item.get("snippet", "")
                }
                for item in response["organic_results"]
            ]
        return result
    
    def _test_parse_vars(self, api_url: str, key: str) -> dict:
        result = {}

        result["key"] = key
        result["api_url"] = api_url

        return result

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        api_url = self.runtime.credentials.get('tgai_api_url', None)
        key = tool_parameters.get("key", "")

        if key is None or key == "":
            raise Exception("Key 不能为空！")

        url = URL(api_url) / "api" / TGAI_KV_GET_STRING_PATH / key if 'api' not in api_url else URL(api_url) / TGAI_KV_GET_STRING_PATH / key 

        try:
            response = get(str(url))
        except:
            raise Exception(f"获取 key: {key}键值时出错")
        
        if response.status_code == 404:
            raise Exception(f"key: {key}键值不存在！")
        
        if response.status_code == 200 and isinstance(response.text, str):
            return self.create_text_message(response.text)
        else:
            raise Exception(f"获取 key: {key}键值时出错")

