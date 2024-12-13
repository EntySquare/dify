from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

ENTY_TTS_TTS_GENERATION_PATH = "generate_tts"


class EntyTTSStartTTSGeneration(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('enty_tts_api_url', None)
        tts_text = tool_parameters.get("tts_text", "")
        vc_uid = tool_parameters.get("vc_uid", "")

        if tts_text is None or tts_text == "":
            raise Exception("待转换的文本不能为空")
        
        if vc_uid is None or vc_uid == "":
            raise Exception("音色 ID 不能为空")
        
        url = URL(api_url) / ENTY_TTS_TTS_GENERATION_PATH

        data = {
            "tts_text": tts_text,
            "vc_uid": vc_uid
        }

        try:
            response = post(str(url), json=data, timeout=60.0)

            data = response.json()

            if data is None or isinstance(data, dict) is not True or 'task_id' not in data:
                raise Exception("Failed to get task result - JSON parse failed")
            
            return [self.create_text_message(tts_text), self.create_json_message(data)]
            
        except Exception as e:
            raise e
       
