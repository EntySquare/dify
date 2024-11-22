from typing import Any

from httpx import post
from yarl import URL

from core.tools.errors import ToolProviderCredentialValidationError
from core.tools.provider.builtin_tool_provider import BuiltinToolProviderController

TEST_PING_PATH = "test/ping"

class TGAIPowerSetProvider(BuiltinToolProviderController):
    def _validate_credentials(self, credentials: dict[str, Any]) -> None:
        try:
            # TGAIKvPost().fork_tool_runtime(
            #     runtime={
            #         "credentials": credentials,
            #     }
            # ).invoke(
            #     user_id='',
            #     tool_parameters={
            #         "kv_key": "tgai_kvdb_test_key",
            #         "kv_value": "tgai_kvdb_test_value"
            #     },
            # )

            api_url = credentials.get('xai_api_url', None)

            if api_url is None or api_url == "":
                raise Exception
            
            url = URL(api_url) / "api" / TEST_PING_PATH if 'api' not in api_url else URL(api_url) / TEST_PING_PATH

            response = post(str(url))


        except Exception as e:
            # raise ToolProviderCredentialValidationError(str(e))
            raise ToolProviderCredentialValidationError("无法连接到 XAI 服务，请检查 API 地址是否正确！")
            
    