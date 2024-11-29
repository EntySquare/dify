from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_FOLLOW_USER_PATH = "adminApi/followTwitterUser"


class XAIFollowUser(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        accountToFollow = tool_parameters.get("tweets_user_name_one", "")
        accountToBeFollowed = tool_parameters.get("tweets_user_name", "")
        
        if tool_parameters.get("sync", False):
            sync = "true"
        else:
            sync = "false"

        if accountToFollow is None or accountToFollow == "":
            raise Exception("执行关注操作的账号不能为空！")
        
        if accountToBeFollowed is None or accountToBeFollowed == "":
            raise Exception("被关注的账号不能为空！")
        
        if sync is None:
            raise Exception("阻塞传递未设置或参数错误！")
        
        url = URL(api_url) / "api" / XAI_FOLLOW_USER_PATH if 'api' not in api_url else URL(api_url) / XAI_FOLLOW_USER_PATH

        data = {
            "tweets_user_name_one": accountToFollow,
            "tweets_user_name": accountToBeFollowed,
            "sync": sync,
            "is_workflow": True
        }

        try:
            response = post(str(url), json=data)
            if response.status_code == 500:
                raise Exception(f'Failed to distribute task: make user {accountToFollow} follow user: {accountToBeFollowed}')
        except:
            raise Exception(f'Failed to distribute task: make user {accountToFollow} follow user: {accountToBeFollowed}')
        
        if response.status_code == 200 and isinstance(response.text, str):
            return self.create_text_message(f'Task: user {accountToFollow} follow user {accountToFollow} distribute successfully!')
        else:
            raise Exception(f'Failed to distribute task: make user {accountToFollow} follow user: {accountToBeFollowed}')
       
