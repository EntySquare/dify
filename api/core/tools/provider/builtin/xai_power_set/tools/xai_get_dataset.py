from typing import Any, Union

from httpx import get
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_API_PATH = "knowledge/getKnowDataset"


class XAIGetDataset(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:

        api_url = self.runtime.credentials.get('xai_api_url', None)
        dataset_name = tool_parameters.get("dataset_name", "")
        # indexing_technique = tool_parameters.get("indexing_technique", "")
        # permission = tool_parameters.get('permission', "")

        if dataset_name is None or dataset_name == "":
            raise Exception("个体名称不能为空！")

        # if indexing_technique is None or indexing_technique == "":
        #     raise Exception("请设置索引模式！")
        #
        # if permission is None or permission == "":
        #     raise Exception("请设置个体权限！")

        url = URL(api_url) / "api" / XAI_API_PATH if 'api' not in api_url else URL(api_url) / XAI_API_PATH

        params = {
            "dataset_name": dataset_name,
        }

        try:
            response = get(str(url), params=params)

            

        except:

            raise Exception(
                f'Failed to create peronality name: {dataset_name}')
        
        try:
            json_response = response.json()

            data = json_response['data']

            if response.status_code == 200:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(
                        f'Failed to create peronality name: {dataset_name}')

                # response_data = json.loads(data)

                # if not isinstance(response_data, dict):
                #     raise Exception('返回值 json 解析失败！')

                return self.create_json_message(data)

            else:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(
                        f'Failed to create peronality name: {dataset_name} ')
                message = data['message']
                message_zh = data['message_zh']
                if message_zh is not None and isinstance(message_zh, str) and message_zh != "":
                    raise Exception(message_zh)
                elif message is not None and isinstance(message, str) and message != '':
                    raise Exception(message)
                else:
                    raise Exception(
                        f'Failed to create peronality name: {dataset_name}')

        except Exception as e:
            raise e



