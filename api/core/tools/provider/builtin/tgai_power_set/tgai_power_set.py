from typing import Any

from core.tools.errors import ToolProviderCredentialValidationError
from core.tools.provider.builtin.tgai_power_set.tools.tgai_kv_post import TGAIKvPost
from core.tools.provider.builtin_tool_provider import BuiltinToolProviderController


class TGAIPowerSetProvider(BuiltinToolProviderController):
    def _validate_credentials(self, credentials: dict[str, Any]) -> None:
        try:
            TGAIKvPost().fork_tool_runtime(
                runtime={
                    "credentials": credentials,
                }
            ).invoke(
                user_id='',
                tool_parameters={
                    "kv_key": "tgai_kvdb_test_key",
                    "kv_value": "tgai_kvdb_test_value"
                },
            )
        except Exception as e:
            # raise ToolProviderCredentialValidationError(str(e))
            raise ToolProviderCredentialValidationError("无法连接到 kv 数据库，请检查 API 地址是否正确！")
            
    