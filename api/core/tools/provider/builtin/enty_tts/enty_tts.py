from typing import Any

from core.tools.errors import ToolProviderCredentialValidationError
from core.tools.provider.builtin.enty_tts.tools.get_generate_tts_result import EntyTTSGetGenerateResult
from core.tools.provider.builtin_tool_provider import BuiltinToolProviderController


class EntyTTSPoerSetProvider(BuiltinToolProviderController):
    def _validate_credentials(self, credentials: dict[str, Any]) -> None:
        try:
            EntyTTSGetGenerateResult().fork_tool_runtime(
                runtime={
                    "credentials": credentials,
                }
            ).validate_credentials(
                credentials=credentials,
                tool_parameters={}
            )

        except Exception as e:
            # raise ToolProviderCredentialValidationError(str(e))
            raise ToolProviderCredentialValidationError("无法连接到 Enty TTS 服务，请检查 API 地址是否正确！")
            
    