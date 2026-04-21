from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import models
from database import engine, get_db
from ai_agent import agent
from audio_service import audio_service
import anki_exporter
import os
from fastapi.responses import FileResponse

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DeutschMe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "DeutschMe API is running!"}

@app.get("/scenarios")
def get_scenarios():
    return {
        "scenarios": [
            {"id": "data_engineering", "title": "Data Engineering", "icon": "terminal"},
            {"id": "daily_life", "title": "Daily Life", "icon": "shopping_basket"},
            {"id": "valorant", "title": "Calls de Valorant", "icon": "sports_esports"}
        ]
    }

class ChatMessage(BaseModel):
    user_input: str
    scenario: str
    level: str = "B1"

@app.post("/chat/message")
def chat_message(message: ChatMessage, db: Session = Depends(get_db)):
    # Save user message
    user_history = models.UserHistory(
        user_id="default_user",
        scenario=message.scenario,
        german_msg=message.user_input,
        role="User"
    )
    db.add(user_history)
    db.commit()

    # Consultar histórico
    past_interactions = db.query(models.UserHistory).filter(models.UserHistory.scenario == message.scenario, models.UserHistory.user_id == "default_user").order_by(models.UserHistory.timestamp.desc()).limit(6).all()
    past_interactions.reverse()
    
    formatted_history = []
    for interaction in past_interactions:
        # Pula a mensagem atual recém salva para não duplicar no Langchain
        if interaction.id == user_history.id:
            continue
        role = "human" if interaction.role == "User" else "ai"
        formatted_history.append((role, interaction.german_msg))

    ai_response = agent.get_response(message.user_input, message.scenario, message.level, history=formatted_history)
    
    # Save AI response
    ai_history = models.UserHistory(
        user_id="default_user",
        scenario=message.scenario,
        german_msg=ai_response.get("german_reply"),
        portuguese_msg=ai_response.get("portuguese_translation"),
        role="AI"
    )
    db.add(ai_history)
    db.commit()

    # Gen audio and return URL/base64
    audio_b64 = audio_service.text_to_speech(ai_response.get("german_reply", ""))
    ai_response["audio_base64"] = audio_b64
    
    return ai_response

@app.get("/chat/suggestions")
def get_chat_suggestions(scenario: str, level: str = "B1"):
    suggestions = agent.get_suggestions(scenario, level)
    return {"suggestions": suggestions}

class ExportRequest(BaseModel):
    vocab_ids: list[str]

@app.post("/anki/export")
def export_anki(req: ExportRequest, db: Session = Depends(get_db)):
    mock_vocab = [
        {"term": "der Bahnhof", "translation": "a estação de trem", "context_sentence": "Ich fahre zum Bahnhof.", "level": "A1"},
        {"term": "die Herausforderung", "translation": "o desafio", "context_sentence": "Das ist eine große Herausforderung.", "level": "B2"}
    ]
    filepath = anki_exporter.export_deck(mock_vocab, "deutschme_deck.apkg")
    return FileResponse(path=filepath, filename="deutschme_deck.apkg", media_type="application/octet-stream")

@app.get("/tips")
def get_tips(level: str = "B1"):
    tip = agent.get_tip(level)
    return {"tip": tip}

@app.get("/profile/stats")
def get_profile_stats(db: Session = Depends(get_db)):
    # Calcular ofesiva / dias de estudo / mensagens trocadas
    total_messages = db.query(models.UserHistory).filter(models.UserHistory.role == "User").count()
    total_vocab = db.query(models.Vocabulary).count()
    
    # Mocking advanced stats computation for visual representation
    return {
        "streak_days": 4, # dias seguidos
        "total_messages": total_messages,
        "total_vocabulary": total_vocab if total_vocab > 0 else 120,
        "level_progress": 68, # percentage
        "week_activity": [
            {"day": "Seg", "active": True},
            {"day": "Ter", "active": True},
            {"day": "Qua", "active": False},
            {"day": "Qui", "active": True},
            {"day": "Sex", "active": True},
            {"day": "Sáb", "active": False},
            {"day": "Dom", "active": False},
        ]
    }
