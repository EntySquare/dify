from typing import Any, Union

from httpx import get
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

ENTY_TTS_GENERATE_RESULT_PATH = "get_task_result"
TEST_PING_PATH = "health"


class EntyTTSGetGenerateResult(BuiltinTool):

    def validate_credentials(self, credentials: dict[str, Any], tool_parameters: dict[str, Any]) -> None:
        api_url = credentials.get('enty_tts_api_url')

        if not api_url or api_url == "":
            raise Exception("enty tts api url is required!")
        
        url = URL(api_url) / TEST_PING_PATH

        response = get(str(url))

        if response.status_code != 200:
            raise Exception("connect to enty tts api failed")
        
        try:
            data = response.json()

            if isinstance(data, dict) is not True:
                raise Exception("Failed to parse json")


            if 'status' not in data or data['status'] != "ojbk":
                raise Exception("Not the api server we need!")


        except:
            raise Exception("connect to enty tts api failed")

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('enty_tts_api_url', None)
        task_id = tool_parameters.get("task_id", "")
        
        if task_id is None or task_id == "":
            raise Exception("任务 ID 不能为空")
        
        url = URL(api_url) / ENTY_TTS_GENERATE_RESULT_PATH / task_id

        try:
            response = get(str(url))

            if response.status_code == 404:
                raise Exception("Failed to get task result - Task with id:{task_id} not found")

            data = response.json()

            if data is None or isinstance(data, dict) is not True:
                raise Exception("Failed to get task result - JSON parse failed")
            
            return [self.create_text_message(task_id), self.create_json_message(data)]
            
        except Exception as e:
            raise e
       
