from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

TGAI_KV_POST_PATH = "kv"


class TGAIKvPost(BuiltinTool):

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

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('tgai_api_url', None)
        key = tool_parameters.get("kv_key", "")
        value = tool_parameters.get("kv_value", "")

        if key is None or key == "":
            raise Exception("Key 不能为空！")
        
        if value is None or value == "":
            raise Exception("Value 不能为空！")

        url = URL(api_url) / "api" / TGAI_KV_POST_PATH if 'api' not in api_url else URL(api_url) / TGAI_KV_POST_PATH

        data = {
            "key": key,
            "value": value
        }

        try:
            response = post(str(url), json=data)
            if response.status_code == 400:
                raise Exception(f"Failed update/insert to kv store with key: {key}, value: {value}")
        except:
            raise Exception(f"Failed update/insert to kv store with key: {key}, value: {value}")
        
        if response.status_code == 200 and isinstance(response.text, str):
            return self.create_text_message(response.text)
        else:
            raise Exception(f"Failed update/insert to kv store with key: {key}, value: {value}")
       
