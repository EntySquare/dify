from typing import Any, Union

from httpx import delete
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_DELETE_DATASET_BY_NAME_PATH = "knowledge/delete"


class XAIDeleteDatasetByName(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:

        api_url = self.runtime.credentials.get('xai_api_url', None)
        name = tool_parameters.get("name", "")

        if name is None or name == "":
            raise Exception("要删除的个体名称不能为空！")


        url = URL(api_url) / "api" / XAI_DELETE_DATASET_BY_NAME_PATH if 'api' not in api_url else URL(api_url) / XAI_DELETE_DATASET_BY_NAME_PATH

        params={
            'dataset_name': name
        }

        try:
            response = delete(str(url), params=params)

            if response.status_code == 200:
                return self.create_text_message(f'Delete personality: {name} successfully')

            try:
                json_response = response.json()
                data = json_response['data']

            except:
                raise Exception(f'Failed to delete peronality: {name}')

            if data is None or isinstance(data, dict) is not True:
                raise Exception(f'Failed to delete peronality: {name}')

            error_message = data.get('message_zh') or data.get['message']
            if error_message is not None and isinstance(error_message, str) and error_message != "":
                raise Exception(error_message)
            else:
                raise Exception(f'Failed to delete peronality: {name}')

        except Exception as e:
            raise e
