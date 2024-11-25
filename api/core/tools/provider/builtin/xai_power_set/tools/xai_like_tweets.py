from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_LIKE_TWEETS_PATH = "adminApi/supportTwitter"
TEST_PING_PATH = "test/ping"

class XAILikeTweets(BuiltinTool):

    def validate_credentials(self, credentials: dict[str, Any], tool_parameters: dict[str, Any]) -> None:
        api_url = credentials.get('xai_api_url')

        if not api_url or api_url == "":
            raise Exception("xai api url is required!")
        
        url = URL(api_url) / "api" / TEST_PING_PATH if 'api' not in api_url else URL(api_url) / TEST_PING_PATH

        response = post(str(url))

        if response.status_code != 200:
            raise Exception("connect to xai api failed")

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        accountUsername = tool_parameters.get("tweets_user_name", "")
        tweetsUrl = tool_parameters.get("twitter_url", "")
        
        if tool_parameters.get("sync", False):
            sync = "true"
        else:
            sync = "false"

        if accountUsername is None or accountUsername == "":
            raise Exception("账号不能为空！")
        
        if tweetsUrl is None or tweetsUrl == "":
            raise Exception("推文链接不能为空！")
        
        if sync is None:
            raise Exception("阻塞传递未设置或参数错误！")

        url = URL(api_url) / "api" / XAI_LIKE_TWEETS_PATH if 'api' not in api_url else URL(api_url) / XAI_LIKE_TWEETS_PATH

        data = {
            "tweets_user_name": accountUsername,
            "twitter_url": tweetsUrl,
            "sync": sync
        }

        try:
            response = post(str(url), json=data)
            if response.status_code == 400:
                raise Exception(f'Failed to distribute task: like tweets: {tweetsUrl} with user: {accountUsername}')
        except:
            raise Exception(f'Failed to distribute task: like tweets: {tweetsUrl} with user: {accountUsername}')
        
        if response.status_code == 200 and isinstance(response.text, str):
            return self.create_text_message(f'Task: User {accountUsername} like tweets {tweetsUrl} distribute successfully!')
        else:
            raise Exception(f'Failed to distribute task: like tweets: {tweetsUrl} with user: {accountUsername}')
       
