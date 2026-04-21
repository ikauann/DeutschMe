# DeutschMe 🇩🇪

Bem-vindo ao **DeutschMe**, a sua PWA moderna de imersão e aprendizado inteligente em alemão!

![Status](https://img.shields.io/badge/Status-Stable%20V5-blue)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Postgres-purple)

## 📌 O Que É o Projeto
O DeutschMe foi desenvolvido com a missão de substituir tutores convencionais por Inteligência Artificial em situações realistas e focadas na prática. Diferente de aplicativos estáticos baseados em adivinhação de palavras, no **DeutschMe** você conduz conversas complexas em cenários como Entrevistas de TI, Viagens ou situações mecânicas, com o auxílio do **Gemini LLM**.

## ✨ Principais Funcionalidades

- **Voz e Legendas Aéreas (Live Mode):** Converse naturalmente usando seu microfone. Uma interface Orbe capturará seu sotaque e transcreverá na tela. Quando pausar, a Inteligência Artificial formulará uma resposta complexa, traduzirá para o seu idioma e responderá **em Áudio Fluente**, tudo de forma contínua e sem cliques de botões extras.
- **Dicas Mágicas (Tips):** A qualquer momento na conversa ou via Menu Principal, consiga dicas gramaticais personalizadas ou de vocabulário orientadas à situação que você está treinando e para o seu nível (A1 ao C1).
- **Exportação para Anki Autêntica:** Selecionou vocabulários difíceis no app? Com um único clique, o FastAPI converterá os objetos selecionados num arquivo real `.apkg`. Faça o download e rode diretamente no seu Software Anki original!
- **Histórico e Feedback Subliminar:** Você constrói seu dashboard visual de performance enquanto joga. A IA também registra seu histórico inteiro na sessão ativa - e memoriza tudo, de forma que você não precisa repetir sua identidade na metade de uma "Call do Valorant".

## 🛠️ Tecnologias Utilizadas

#### Frontend
- **Framework:** React com Vite
- **Design System:** Tailwind V4 (Configuração Customizada M3 Glassmorphism)
- **Features Especiais:** `Recharts` (Gráficos), `Web Speech API` (Transcrição local gratuita).

#### Backend
- **Core:** Python com FastAPI
- **Banco de Dados:** PostgreSQL & Redis em containers via Docker Compose.
- **Inteligência Artificial:** `LangChain` com `ChatGoogleGenerativeAI` 
- **Voice e Exportação:** `gTTS` (Tradução e Som na nuvem) e `genanki`.

## 🚀 Como Executar Localmente

### 1. Iniciar os Bancos de Dados
Certifique-se que o Docker está rodando.
```powershell
docker-compose up -d
```

### 2. Iniciar a API (Python)
Abra seu terminal na pasta `/backend` e crie/ative o seu ambiente.
```powershell
.\venv\Scripts\activate
# Tenha seu arquivo .env populado com seu GOOGLE_API_KEY
uvicorn main:app --reload
```

### 3. Rodar o App (React Vite)
Abra um terminal paralelo na pasta HTML-React.
```powershell
cd frontend
npm install
npm run dev
```

E acesse pelo endereço `http://localhost:5173`. Aproveite seus estudos!
