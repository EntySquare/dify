import logging
from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_LIKE_TWEETS_PATH = "adminApi/supportTwitter"


class XAILikeTweets(BuiltinTool):
    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        accountUsername = tool_parameters.get("tweets_user_name", "")
        tweetsUrl = tool_parameters.get("twitter_url", "")
        sync = tool_parameters.get("sync", None)

        if accountUsername is None or accountUsername == "":
            raise Exception("账号不能为空！")
        
        if tweetsUrl is None or tweetsUrl == "":
            raise Exception("推文链接不能为空！")
        
        if sync is None:
            raise Exception("阻塞传递未设置或参数错误！")


        url = URL(api_url) / "api" / XAI_LIKE_TWEETS_PATH if 'api' not in api_url else URL(api_url) / XAI_LIKE_TWEETS_PATH

        # data = {
        #     "url": str(url),
        #     "tweets": tweetsUrl,
        #     "username": accountUsername,
        #     "sync": sync
        # }

        # return self.create_json_message(data)

        data = {
            "tweets_user_name": accountUsername,
            "twitter_url": tweetsUrl,
            "sync": sync
        }

        try:
            response = post(str(url), json=data)
            if response.status_code == 400:
                raise Exception(f"Failed to like tweets: {tweetsUrl} with user: {accountUsername}")
        except:
            raise Exception(f"Failed to like tweets: {tweetsUrl} with user: {accountUsername}")
        
        if response.status_code == 200 and isinstance(response.text, str):
            return self.create_text_message(f"User: {accountUsername} like tweets: {tweetsUrl} successfully!")
        else:
            raise Exception(f"Failed to like tweets: {tweetsUrl} with user: {accountUsername}")
       
