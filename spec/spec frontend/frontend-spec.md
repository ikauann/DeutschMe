web application/stitch/projects/15887532488041276220/screens/77f272cad5b8419f9bd0df67578a4cc0
# Especificação Técnica de Front-end: DeutschMe

O **DeutschMe** é uma aplicação web progressiva (PWA) focada na prática de conversação em alemão para profissionais técnicos, utilizando IA para fornecer feedback em tempo real e integração com ferramentas de repetição espaçada (Anki).

## 1. Visão Geral do Design
- **Estilo:** Moderno, limpo, inspirado no Material Design 3.
- **Design System:** "Struktur UI" (Foco em precisão e clareza).
- **Abordagem:** Mobile-First, com layout adaptável para desktop (max-width de 800px para o conteúdo principal).

## 2. Fundações Visuais (Design Tokens)
- **Cores Principais:**
  - Primária: `#1976D2` (Azul Profissional) - Usado para botões de ação e estados ativos.
  - Fundo: `#F8FAFC` (Slate 50) - Tons neutros para evitar fadiga visual.
  - Texto IA: `#0F172A` (Slate 900) para o alemão, `#64748B` (Slate 500) para traduções.
- **Tipografia:** 
  - Fonte: **Inter** (Sans-serif).
  - Hierarquia: Alemão sempre em negrito/maior peso que a tradução em português.
- **Formas:** Bordas arredondadas (Radius: 8px a 12px) para cards e inputs.

## 3. Arquitetura de Telas e Fluxos

### A. Chat de Prática (Main)
- **Header:** Título à esquerda; Seletor de Nível (Dropdown) e Perfil à direita.
- **Context Selector:** Scroll horizontal de chips com cenários (ex: "Data Engineering").
- **Mensagens IA:**
  - Texto em Alemão (Destaque).
  - Ícone de áudio lateral (Trigger para TTS).
  - Divisor sutil.
  - Feedback/Tradução em cinza suave.
- **Dicas Inteligentes:** Botão de lâmpada no input. Ao ativar, exibe sugestões de frases baseadas no histórico de mensagens.
- **Input:** Área expansível com botões de voz (Microfone) e envio.

### B. Dicas de Estudo
- **Cards de Gramática:** Explicações visuais (ex: Akkusativ vs Dativ) com exemplos comparativos.
- **Vocabulário Contextual:** Listas de palavras categorizadas por área de atuação.

### C. Exportação para Anki
- **Seleção:** Lista de termos aprendidos recentemente no chat.
- **Contexto (CRÍTICO):** Cada card deve salvar a frase original onde a palavra foi usada no chat como "cloze" ou "back" do card.
- **Formato:** Geração de arquivo `.apkg` ou integração via API.

## 4. Componentes Compartilhados
- **TopAppBar:** Fixo no topo, transparente/blur ao rolar.
- **BottomNavBar:** Navegação principal (Lernen, Chat, Fortschritt, Profil).
- **ActionCards:** Cards brancos com sombra leve (`shadow-sm`) para vocabulário.

## 5. Regras de Interação & UX
- **Feedback de Áudio:** O ícone de alto-falante deve pulsar visualmente enquanto o áudio é reproduzido.
- **Input Ergonômico:** No mobile, o input ocupa 95% da largura. No desktop, centralizado a 800px.
- **Dicas Opcionais:** O usuário controla a visibilidade das dicas para não prejudicar o desafio do aprendizado.

## 6. Stack Sugerida
- **Framework:** React ou Next.js.
- **Estilização:** Tailwind CSS (pela agilidade nos tokens de design).
- **Ícones:** Lucide React ou Material Symbols.
