from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_UPDATE_DOC_TEXT_PATH = "knowledge/updateDocText"


class XAIUpdateDocWithText(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        dataset_id = tool_parameters.get("dataset_id", "")
        document_id = tool_parameters.get("document_id", "")
        name = tool_parameters.get("name")
        text = tool_parameters.get("text")

        if dataset_id is None or dataset_id == "":
            raise Exception("个体ID不能为空！")
        
        if document_id is None or document_id == "":
            raise Exception("料 ID不能为空！")
        
        data = {
            "dataset_id": dataset_id,
            "document_id": document_id,
        }
        
        if name is not None and name != "":
            data['name'] = name

        if text is not None and text != "":
            data['text'] = text
        
        url = URL(api_url) / "api" / XAI_UPDATE_DOC_TEXT_PATH if 'api' not in api_url else URL(api_url) / XAI_UPDATE_DOC_TEXT_PATH

        try:
            response = post(str(url), json=data)

        except:

            raise Exception(f'Failed to update doc {document_id} of personality {dataset_id} to name: {name}, text: {text}')
        
        try:
            json_response = response.json()

            data = json_response['data']

            if response.status_code == 200:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(f'Failed to update doc {document_id} of personality {dataset_id} to name: {name}, text: {text}')

                # response_data = json.loads(data)

                # if not isinstance(response_data, dict):
                #     raise Exception('返回值 json 解析失败！')

                return self.create_json_message(data)
            
            else:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(f'Failed to update doc {document_id} of personality {dataset_id} to name: {name}, text: {text}')
                message = data['message']
                message_zh = data['message_zh']
                if message_zh is not None and isinstance(message_zh, str) and message_zh != "":
                    raise Exception(message_zh)
                elif message is not None and isinstance(message, str) and message != '':
                    raise Exception(message)
                else:
                    raise Exception(f'Failed to update doc {document_id} of personality {dataset_id} to name: {name}, text: {text}')

        except Exception as e: 
            raise e



       
