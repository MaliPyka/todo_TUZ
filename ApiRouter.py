from fastapi import APIRouter, HTTPException
from fastapi import Response, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import get_db, Task
from database.request import create_task, get_task
from Schemas import TaskSchema

api_router = APIRouter(
    tags=["User Management"],
)



@api_router.post("/tasks")
async def cmd_create_task(payload: TaskSchema, db: AsyncSession = Depends(get_db)):
    try:
        new_task = Task(text=payload.text)
        db.add(new_task)
        await db.commit()
        return {"message": "Task Created"}
    except Exception as e:
        return {"Status": "failed", "Message": str(e)}

@api_router.get("/tasks")
async def get_tasks():
    tasks = await get_task()
    return tasks
