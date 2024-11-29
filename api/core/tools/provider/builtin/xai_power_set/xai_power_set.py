from typing import Any

from core.tools.errors import ToolProviderCredentialValidationError
from core.tools.provider.builtin.xai_power_set.tools.xai_like_tweets import XAILikeTweets
from core.tools.provider.builtin_tool_provider import BuiltinToolProviderController


class XAIPowerSetProvider(BuiltinToolProviderController):
    def _validate_credentials(self, credentials: dict[str, Any]) -> None:
        try:
            XAILikeTweets().fork_tool_runtime(
                runtime={
                    "credentials": credentials,
                }
            ).validate_credentials(
                credentials=credentials,
                tool_parameters={}
            )

        except Exception as e:
            # raise ToolProviderCredentialValidationError(str(e))
            logging.info(e)
            raise ToolProviderCredentialValidationError("无法连接到 XAI 服务，请检查 API 地址是否正确！")
            
    