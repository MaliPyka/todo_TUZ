from fastapi import APIRouter, HTTPException
from fastapi import Response, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.models import get_db, Task
from database.request import create_task, get_task, delete_task
from Schemas import TaskSchema

api_router = APIRouter(
    tags=["User Management"],
)



@api_router.post("/tasks")
async def cmd_create_task(text: TaskSchema):
    try:
        new_task = await create_task(text.text)
        return {"id": new_task.id, "text": new_task.text}
    except Exception as e:
        return {"Status": "failed", "Message": str(e)}


@api_router.get("/tasks")
async def get_tasks():
    tasks = await get_task()
    return tasks

@api_router.delete("/tasks/{task_id}")
async def cmd_delete_task(task_id: int):
    await delete_task(task_id)
    return {"message": "Task Deleted"}