from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.task import Task

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def dashboard(
    db: Session = Depends(get_db)
):
    total_tasks = db.query(Task).count()

    completed_tasks = db.query(Task).filter(
        Task.status == "completed"
    ).count()

    pending_tasks = db.query(Task).filter(
        Task.status == "pending"
    ).count()

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks
    }