from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_SEND_TWEETS_PATH = "adminApi/sendTwitter"


class XAISendTweets(BuiltinTool):
    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        accountUsername = tool_parameters.get("tweets_user_name_one", "")
        img_url = tool_parameters.get("img_url", "")
        content = tool_parameters.get("content", "")
        
        if tool_parameters.get("sync", True):
            sync = "true"
        else:
            sync = "false"

        if accountUsername is None or accountUsername == "":
            raise Exception("账号不能为空！")
        
        if content is None or content == "":
            raise Exception("推文内容不能为空！")
        
        if sync is None:
            raise Exception("阻塞传递未设置或参数错误！")

        url = URL(api_url) / "api" / XAI_SEND_TWEETS_PATH if 'api' not in api_url else URL(api_url) / XAI_SEND_TWEETS_PATH

        data = {
            "content": content,
            "tweets_user_name_one": accountUsername,
            "img_url": img_url,
            "sync": sync,
            "is_workflow": True
        }

        try:
            response = post(str(url), json=data)
            if response.status_code == 500:
                 raise Exception(f'Failed to distribute task: user {accountUsername} send tweets with content: {content}{f" and image: {img_url}" if img_url != "" else ""} !')
            
        except Exception:
             raise Exception(f'Failed to distribute task: user {accountUsername} send tweets with content: {content}{f" and image: {img_url}" if img_url != "" else ""} !')
        
        if response.status_code == 200 and isinstance(response.text, str):
            return self.create_text_message(f'Task: User {accountUsername} send tweets {content}{f" with image {img_url}" if img_url != "" else ""} distribute successfully!')
        else:
            raise Exception(f'Failed to distribute task: user {accountUsername} send tweets with content: {content}{f" and image: {img_url}" if img_url != "" else ""} !')
       
