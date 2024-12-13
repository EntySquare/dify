from typing import Any, Union

from httpx import post
from yarl import URL

from core.file import FileType
from core.file.file_manager import download
from core.tools.entities.tool_entities import ToolInvokeMessage
from core.tools.tool.builtin_tool import BuiltinTool

ENTY_TTS_ACCENT_GENERATION_PATH = "generate_accent"


class EntyTTSStartAccentGeneration(BuiltinTool):

    def _invoke(self,
                user_id: str,
                tool_parameters: dict[str, Any],
                ) -> Union[ToolInvokeMessage, list[ToolInvokeMessage]]:
        
        api_url = self.runtime.credentials.get('enty_tts_api_url', None)
        audio_files = tool_parameters.get("audio_files", None)
        accent_name = tool_parameters.get("accent_name", "")
        timeout = tool_parameters.get("timeout", "30")

        if accent_name is None or accent_name == "":
            raise Exception("音色名不能为空")
        
        if audio_files is None or len(audio_files) == 0:
            raise Exception("必须提供音频文件！")
        
        if timeout is None or timeout == "":
            raise Exception("请设置请求超时时间！")
        
        timeout = float(timeout)

        url = URL(api_url) / ENTY_TTS_ACCENT_GENERATION_PATH / accent_name

        files = []

        headers = {
            "accept": "application/json",
        }

        for audio in audio_files:

            if 'type' in audio and isinstance(audio.type, FileType) is not True:
                raise Exception("Internal file type error!")

            if 'type' in audio and audio.type != FileType.AUDIO:
                raise Exception("只支持音频文件！")
            
            
            filename = audio.filename
            mime_type = audio.mime_type
            file = download(audio)
            files.append(
            ('files', (filename, file, mime_type)))

        try:

            response = post(str(url), files=files, headers=headers, timeout=timeout)

            if response.status_code != 200: 
                raise Exception("Failed to generate accent", )

            data = response.json()

            if data is None or isinstance(data, dict) is not True or 'vc_uid' not in data:
                raise Exception(f"Failed to generate accent - JSON parse failed / vc_uid not found in response content - {response.content}")
            
            return [self.create_text_message(data['vc_uid']), self.create_json_message(data)]

            
        except Exception as e:
            raise e
       
