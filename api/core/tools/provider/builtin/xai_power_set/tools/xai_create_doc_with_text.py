from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_CREATE_DOC_TEXT_PATH = "knowledge/createDocText"


class XAICreateDocWithText(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        dataset_id = tool_parameters.get("dataset_id", "")
        name = tool_parameters.get("name", "")
        text = tool_parameters.get("text", "")
        indexing_technique = tool_parameters.get("indexing_technique", "")
        mode = tool_parameters.get('mode', "")

        if dataset_id is None or dataset_id == "":
            raise Exception("个体ID不能为空！")
        
        if name is None or name == "":
            raise Exception("料名不能为空！")

        if text is None or text == "":
            raise Exception("料的内容不能为空！")

        if indexing_technique is None or indexing_technique == "":
            raise Exception("请设置索引模式！")
        
        if mode is None or mode == "":
            raise Exception("请设置处理模式！")
        
        url = URL(api_url) / "api" / XAI_CREATE_DOC_TEXT_PATH if 'api' not in api_url else URL(api_url) / XAI_CREATE_DOC_TEXT_PATH

        data = {
            "dataset_id": dataset_id,
            "name": name,
            "text": text,
            "indexing_technique": indexing_technique,
            "process_rule": {
                "mode": mode
            },
        }

        try:
            response = post(str(url), json=data)

        except:

            raise Exception(f'Failed to create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} ')
        
        try:
            json_response = response.json()

            data = json_response['data']

            if response.status_code == 200:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(f'Failed to create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} ')

                # response_data = json.loads(data)

                # if not isinstance(response_data, dict):
                #     raise Exception('返回值 json 解析失败！')

                return self.create_json_message(data)
            
            else:
                if data is None or isinstance(data, dict) is not True:
                    raise Exception(f'Failed to create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} ')
                message = data['message']
                message_zh = data['message_zh']
                if message_zh is not None and isinstance(message_zh, str) and message_zh != "":
                    raise Exception(message_zh)
                elif message is not None and isinstance(message, str) and message != '':
                    raise Exception(message)
                else:
                    raise Exception(f'Failed to create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} ')

        except Exception as e: 
            raise e

        # if response.status_code == 200:

        #     logging.info(response.content)
                
        #     return self.create_text_message(f'Create doc name: {name}, indexing_technique: {indexing_technique}, text: {text}, mode: {mode} into personality: {dataset_id} successfully!')
            
        # else:
        #     try: 
        #         json_response = response.json()

        #         data = json_response['data']

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

        #     except Exception as e:
        #         raise e


       
