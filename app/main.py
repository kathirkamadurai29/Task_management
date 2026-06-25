from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as auth_router
import uvicorn
from app.routers.tasks import router as task_router
from app.database.database import engine,Base
from app.models.task import Task
from app.models.user import User
from app.routers.dashboard import router as dashboard_router
from app.routers.users import router as users_router



Base.metadata.create_all(bind=engine)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(users_router)
app.include_router(auth_router)
app.include_router(task_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"message": "Task Management API Running"}

