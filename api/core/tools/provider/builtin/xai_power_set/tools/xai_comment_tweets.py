from typing import Any, Union

from httpx import post
from yarl import URL

from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

XAI_COMMENT_TWEETS_PATH = "adminApi/commentTwitter"


class XAICommentTweets(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('xai_api_url', None)
        accountUsername = tool_parameters.get("tweets_user_name_one", "")
        tweetsUrl = tool_parameters.get("twitter_url", "")
        content = tool_parameters.get('content', "")
        
        if tool_parameters.get("sync", False):
            sync = "true"
        else:
            sync = "false"

        if content is None or content == "":
            raise Exception("评论内容不能为空！")

        if accountUsername is None or accountUsername == "":
            raise Exception("账号不能为空！")
        
        if tweetsUrl is None or tweetsUrl == "":
            raise Exception("推文链接不能为空！")
        
        if sync is None:
            raise Exception("阻塞传递未设置或参数错误！")
        
        url = URL(api_url) / "api" / XAI_COMMENT_TWEETS_PATH if 'api' not in api_url else URL(api_url) / XAI_COMMENT_TWEETS_PATH

        data = {
            "tweets_user_name_one": accountUsername,
            "twitter_url": tweetsUrl,
            "content": content,
            "sync": sync,
            "is_workflow": True
        }

        try:
            response = post(str(url), json=data)
            if response.status_code == 500:
                raise Exception(f'Failed to distribute task: comment tweets: {tweetsUrl} with user: {accountUsername} and content: {content}')
        except:
            raise Exception(f'Failed to distribute task: comment tweets: {tweetsUrl} with user: {accountUsername} and content: {content}')
        
        if response.status_code == 200 and isinstance(response.text, str):
            return self.create_text_message(f'Task: User {accountUsername} comment tweets {tweetsUrl} with content {content} distribute successfully!')
        else:
            raise Exception(f'Failed to distribute task: comment tweets: {tweetsUrl} with user: {accountUsername} and content: {content}')
       
