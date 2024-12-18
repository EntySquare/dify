from typing import Any, Union

from httpx import delete
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_DELETE_DOC_PATH = "knowledge/deleteDoc"


class XAIDeleteDoc(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:

        api_url = self.runtime.credentials.get('xai_api_url', None)
        personality_id = tool_parameters.get("personality_id", "")
        doc_id = tool_parameters.get("doc_id", "")

        if personality_id is None or personality_id == "":
            raise Exception("要删除的料所属的个体的 id 不能为空！")

        if doc_id is None or doc_id == "":
            raise Exception("要删除的料的 id 不能为空！")


        url = URL(api_url) / "api" / XAI_DELETE_DOC_PATH / personality_id / doc_id  if 'api' not in api_url else URL(api_url) / XAI_DELETE_DOC_PATH / personality_id / doc_id

        try:
            response = delete(str(url))

            if response.status_code == 200:
                return self.create_text_message(f'Delete doc: {doc_id} of personality: {personality_id} successfully')

            if response.status_code == 404:
                raise Exception(f'No doc: {doc_id} in personality: {personality_id}')

            if response.status_code == 500:
                raise Exception(f'failed to delete doc: {doc_id} in personality: {personality_id} - internal server error')

            try:
                json_response = response.json()
                data = json_response['data']

            except:
                raise Exception(f'Failed to delete doc: {doc_id} of personality: {personality_id}')

            if data is None or isinstance(data, dict) is not True:
                raise Exception(f'Failed to delete doc: {doc_id} of personality: {personality_id}')

            error_message = data.get('message_zh') or data.get['message']
            if error_message is not None and isinstance(error_message, str) and error_message != "":
                raise Exception(error_message)
            else:
                raise Exception(f'Failed to delete doc: {doc_id} of personality: {personality_id}')

        except Exception as e:
            raise e
