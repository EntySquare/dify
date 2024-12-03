import logging
from typing import Any, Union

from yarl import URL

from core.file.enums import FileType
from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_CREATE_DOC_File_PATH = "knowledge/createDocFile"


class XAICreateDocWithFile(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        dataset_id = tool_parameters.get("dataset_id", "")
        data = tool_parameters.get("data", "")
        file = tool_parameters.get('file')

        if dataset_id is None or dataset_id == "":
            raise Exception("个体ID不能为空！")
        
        logging.info(dataset_id)

        logging.info(file)
        
        if file.type != FileType.IMAGE:
            raise Exception("上传的文件不是合法的文档格式！")

        if data is None or data == "":
            raise Exception("参数配置不能为空！")
        
        logging.info(data)

        url = URL(api_url) / "api" / XAI_CREATE_DOC_File_PATH if 'api' not in api_url else URL(api_url) / XAI_CREATE_DOC_File_PATH

        logging.info(url)

        return [self.create_text_message("test file!")]

        # data = {
        #     "dataset_id": dataset_id,
        #     "name": name,
        #     "text": text,
        #     "indexing_technique": indexing_technique,
        #     "process_rule": {
        #         "mode": mode
        #     },
        # }

        # try:
        #     response = post(str(url), json=data)

        # except:

        #     raise Exception(f'Failed to create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} ')
        
        # try:
        #     json_response = response.json()

        #     data = json_response['data']

        #     if response.status_code == 200:
        #         if data is None or isinstance(data, dict) is not True:
        #             raise Exception(f'Failed to create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} ')

        #         # response_data = json.loads(data)

        #         # if not isinstance(response_data, dict):
        #         #     raise Exception('返回值 json 解析失败！')

        #         return self.create_json_message(data)
            
        #     else:
        #         if data is None or isinstance(data, dict) is not True:
        #             raise Exception(f'Failed to create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} ')
        #         message = data['message']
        #         message_zh = data['message_zh']
        #         if message_zh is not None and isinstance(message_zh, str) and message_zh != "":
        #             raise Exception(message_zh)
        #         elif message is not None and isinstance(message, str) and message != '':
        #             raise Exception(message)
        #         else:
        #             raise Exception(f'Failed to create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} ')

        # except Exception as e: 
        #     raise e

       
