from pydantic import BaseModel
from datetime import datetime
from typing import Optional
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    assigned_to: Optional[int] = None
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    creator_id: int
    assigned_to: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True