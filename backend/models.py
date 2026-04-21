import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from database import Base

class UserHistory(Base):
    __tablename__ = "user_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String, index=True) # Assuming string ID for simple usage, or UUID
    scenario = Column(String)
    german_msg = Column(Text)
    portuguese_msg = Column(Text)
    role = Column(String) # 'AI' or 'User'
    timestamp = Column(DateTime, default=datetime.utcnow)

class Vocabulary(Base):
    __tablename__ = "vocabulary"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    term = Column(String, index=True) # Term in German
    translation = Column(String) # Translation in Portuguese
    context_sentence = Column(Text) # The original phrase from the chat
    level = Column(String) # A1, B1, etc.
