import os
from dotenv import load_dotenv
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from pydantic import BaseModel, Field

class FeedbackFormat(BaseModel):
    german: str = Field(description="A resposta em alemão")
    translation: str = Field(description="Tradução direta para o português")
    feedback: str = Field(description="Feedback se o usuário cometeu erros na mensagem anterior (em português)")

class SuggestionItem(BaseModel):
    german: str = Field(description="Sugestão de frase curta em alemão")
    portuguese: str = Field(description="Tradução para português da frase")

class SuggestionsFormat(BaseModel):
    suggestions: list[SuggestionItem] = Field(description="Lista com exatamente 3 sugestões curtas de respostas")

class TipFormat(BaseModel):
    title: str = Field(description="Título da dica de gramática (ex: Akkusativ vs Dativ)")
    explanation: str = Field(description="Explicação clara do uso em português")
    german_example: str = Field(description="Exemplo de aplicação em alemão")
    portuguese_example: str = Field(description="Tradução do exemplo prático")
    tip: str = Field(description="Dica rápida no estilo 'Você sabia?' caso exista")

class DeutschTutorAgent:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.7,
        )
        
        self.chat_chain = ChatPromptTemplate.from_messages([
            ("system", "Você é um tutor de alemão paciente e técnico. Sua missão é manter uma conversa fluida no cenário {scenario} com um usuário de nível {level}. Se o nível for baixo (A1/A2), use frases curtas. Se for B1+, adicione vocabulário técnico. Sempre forneça feedback gramatical e traduções."),
            MessagesPlaceholder(variable_name="history", optional=True),
            ("human", "Usuário disse: {user_input}\n\nResponda como um parceiro de conversa neste cenário. Continue a conversa ajudando o usuário e forneça seu feedback em português.")
        ]) | self.llm.with_structured_output(FeedbackFormat)

        self.suggestions_chain = ChatPromptTemplate.from_messages([
            ("system", "Dado o último contexto da conversa no cenário {scenario}, forneça 3 opções curtas em alemão que o usuário poderia dizer em seguida (Nível {level}).")
        ]) | self.llm.with_structured_output(SuggestionsFormat)

        self.tips_chain = ChatPromptTemplate.from_messages([
            ("system", "Gere uma dica de estudo de alemão rápida focada no nível {level} para profissionais de TI ou estudantes. Responda estritamente no esquema.")
        ]) | self.llm.with_structured_output(TipFormat)

    def get_response(self, user_input: str, scenario: str, level: str, history: list = None) -> dict:
        if history is None:
            history = []
        try:
            response = self.chat_chain.invoke({"scenario": scenario, "level": level, "history": history, "user_input": user_input})
            return {"german_reply": response.german, "portuguese_translation": response.translation, "grammar_feedback": response.feedback}
        except Exception as e:
            print(f"Error in LLM response: {e}")
            return {"german_reply": "Entschuldigung, technische Probleme.", "portuguese_translation": "Desculpe, falha técnica.", "grammar_feedback": ""}

    def get_suggestions(self, scenario: str, level: str) -> list[dict]:
        try:
            response = self.suggestions_chain.invoke({"scenario": scenario, "level": level})
            return [s.model_dump() for s in response.suggestions]
        except Exception:
            return [
                {"german": "Genau.", "portuguese": "Exato."},
                {"german": "Ich verstehe.", "portuguese": "Eu entendo."},
                {"german": "Können Sie das wiederholen?", "portuguese": "Pode repetir?"}
            ]

    def get_tip(self, level: str) -> dict:
        try:
            response = self.tips_chain.invoke({"level": level})
            return response.model_dump()
        except Exception:
            return {
                "title": "Akkusativ vs Dativ",
                "explanation": "Use Akkusativ para indicar movimento (Wohin?) e Dativ posição estática (Wo?).",
                "german_example": "Ich hänge das Bild an die Wand.",
                "portuguese_example": "Eu penduro o quadro na parede (movimento).",
                "tip": "Geralmente verbos de posição usam Dativ (liegen, sitzen, stehen)."
            }

agent = DeutschTutorAgent()
