import base64
from io import BytesIO
from gtts import gTTS

class AudioService:
    def __init__(self):
        pass

    def text_to_speech(self, text: str) -> str:
        try:
            tts = gTTS(text=text, lang='de', slow=False)
            fp = BytesIO()
            tts.write_to_fp(fp)
            fp.seek(0)
            return base64.b64encode(fp.read()).decode('utf-8')
        except Exception as e:
            print(f"Error generating audio: {e}")
            return ""

    def speech_to_text(self, audio_base64: str) -> str:
        # Aqui entra a integração real com google-cloud-speech
        return "Erkannter Text aus Audio" # mock text

audio_service = AudioService()
