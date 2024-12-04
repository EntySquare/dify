import json
from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_GENERATE_COMMENTS_TEMPLATE_PATH = "adminApi/chat/template/commentArr"


class XAIGenerateCommentsResponseTemplate(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        json_string = tool_parameters.get("json_string", "")
        
        if tool_parameters.get("sync", False):
            sync = "true"
        else:
            sync = "false"

        if json_string is None or json_string == "":
            raise Exception("json 字符串不能为空！")
        
        if sync is None:
            raise Exception("阻塞传递未设置或参数错误！")
        
        try:
            data = json.loads(json_string)

            if not isinstance(data, dict):
                raise Exception('json解析失败')
        except:
            raise Exception("json解析失败！")
        
        url = URL(api_url) / "api" / XAI_GENERATE_COMMENTS_TEMPLATE_PATH if 'api' not in api_url else URL(api_url) / XAI_GENERATE_COMMENTS_TEMPLATE_PATH

        try:
            response = post(str(url), json=data)
            if response.status_code == 500:
                raise Exception(f'Failed to generate response template(generate tweets) with {json_string}')
        except:
            raise Exception(f'Failed to generate response template(generate tweets) with {json_string}')
        
        if response.status_code == 200:

            try:
                response = response.json()
                data = response['data']
                message = data['message']

                if message is None or isinstance(message, str) is not True:
                    raise Exception(f'Failed to generate response template(generate tweets) with {json_string}')
                
                test_message = json.loads(message)

                if not isinstance(test_message, dict):
                    raise Exception('返回值 json 解析失败！')

                return self.create_text_message(message)

            except:
                raise Exception(f'Failed to generate response template(generate tweets) with {json_string}')

        else:
            raise Exception(f'Failed to generate response template(generate tweets) with {json_string}')
       
