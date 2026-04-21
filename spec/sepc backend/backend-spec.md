web application/stitch/projects/15887532488041276220/screens/53ec5bd162ae4d8ba8028bb9b2e219e8
# Especificação Técnica de Backend & IA: DeutschMe

Esta especificação define a arquitetura do servidor, a lógica de IA e a estrutura de dados necessária para suportar a aplicação DeutschMe.

## 1. Stack Tecnológica Sugerida
- **Linguagem:** Python 3.10+
- **Framework Web:** FastAPI (Alta performance e suporte a conexões assíncronas/WebSockets).
- **Orquestração de IA:** LangChain ou Haystack (Para gerenciar prompts e memória).
- **Modelos de Linguagem (LLM):** GPT-4o (OpenAI) ou Gemini 1.5 Pro (Google) - Foco em precisão gramatical.
- **Banco de Dados:** PostgreSQL (Dados de usuário/histórico) + Redis (Cache de sessão e memória de curto prazo).
- **Processamento de Áudio:** OpenAI Whisper (Speech-to-Text) e Google Cloud TTS ou ElevenLabs (Text-to-Speech).

## 2. Arquitetura de IA (Core)

### A. O Agente de Conversação (IA Tutor)
A IA deve atuar como um tutor de alemão paciente e técnico.
- **System Prompt:** "Você é um tutor de alemão especializado em profissionais de tecnologia. Sua missão é manter uma conversa fluida no cenário escolhido pelo usuário. Sempre forneça feedback gramatical discreto e traduções para o português em cada resposta."
- **Memória de Curto Prazo:** `ConversationBufferWindowMemory` para manter o contexto das últimas 10-15 mensagens.
- **Lógica de Feedback:** A resposta da IA deve ser estruturada (JSON) contendo:
  - `german_text`: A resposta em alemão.
  - `portuguese_translation`: Tradução direta.
  - `grammar_correction`: Feedback se o usuário cometeu erros na mensagem anterior.

### B. Gerador de Dicas Inteligentes
- **Endpoint:** `/get-suggestions`
- **Lógica:** Baseado nas últimas 3 mensagens, a IA gera 3 opções de resposta que o usuário *poderia* usar, ajudando-o a destravar.

### C. Extração para Anki
- **Processo:** Ao final de uma sessão ou sob demanda, a IA analisa o histórico e identifica termos "chave" que o usuário teve dificuldade ou que são novos.
- **Contexto:** O sistema deve capturar a `original_sentence` onde a palavra foi usada para popular o campo "Context" do card do Anki.

## 3. Definição de Endpoints (API)

### Chat & IA
- `POST /chat/message`: Recebe texto ou áudio do usuário. Retorna JSON com resposta da IA e áudio (URL ou Base64).
- `GET /chat/suggestions`: Retorna os "chips" de dicas baseados no contexto.
- `GET /scenarios`: Lista os cenários disponíveis (Data Engineering, etc).

### Estudo & Vocabulário
- `GET /tips`: Retorna o conteúdo da tela de "Dicas de Estudo" (Pode ser estático ou gerado por IA semanalmente).
- `POST /anki/export`: Recebe IDs de palavras e gera um arquivo `.apkg` (usando a lib `genanki`).

## 4. Estrutura de Dados (Schema)

### Tabela: `UserHistory`
- `id`: UUID
- `user_id`: FK
- `scenario`: String
- `german_msg`: Text
- `portuguese_msg`: Text
- `role`: Enum (IA, User)
- `timestamp`: DateTime

### Tabela: `Vocabulary`
- `id`: UUID
- `term`: String (Alemão)
- `translation`: String (Português)
- `context_sentence`: Text (A frase original do chat)
- `level`: String (A1, B1, etc)

## 5. Fluxo de Trabalho (Workflow)
1. **Input:** Usuário envia áudio/texto -> API FastAPI.
2. **Processamento:** Se áudio -> Whisper Transcribe -> Texto.
3. **IA Chain:** Texto -> LangChain (LLM) -> Gera Resposta + Feedback + Tradução.
4. **Output:** Retorna JSON estruturado para o Front-end -> Executa TTS para o áudio da IA.
5. **Persistence:** Salva troca de mensagens no Postgres.

## 6. Prompt Engineering (Exemplo de Template)
```text
Cenário: {scenario}
Nível do Usuário: {level}
Histórico: {history}
Usuário disse: {user_input}

Responda como um colega de trabalho alemão no cenário acima. 
Sua resposta DEVE ser um JSON no formato:
{{
  "german": "...",
  "translation": "...",
  "feedback": "..."
}}
```