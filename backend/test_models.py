import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

try:
    print("Testando Chave API e buscando modelos disponíveis...")
    available = []
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            available.append(m.name)
    print("Modelos que suportam geração de texto:")
    for model in available:
        print(model)
except Exception as e:
    print("Erro grave ao conectar:", e)
