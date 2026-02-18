from fastapi import APIRouter
from database.request import create_task, get_task, delete_task, update_task_status, registration, get_hashed_password, get_all_logins
from Schemas import TaskSchema, LoginSchema

from authentication_utils.auth_cmd import set_hashed_password, verify_hashed_password
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

@api_router.patch("/tasks/{task_id}/status")
async def cmd_update_task(task_id: int, status: bool):
    await update_task_status(task_id, status)
    return {"status": "updated", "new_state": status}

@api_router.post("/users/registration")
async def cmd_registration(data: LoginSchema):
    hashed_password = await set_hashed_password(data.password)
    await registration(data.login, hashed_password)
    return {"message": "User Created"}

@api_router.post("/users/login")
async def cmd_login(data: LoginSchema):
    logins = await get_all_logins()
    if data.login not in logins:
        return {"status": "failed", "Message": "Login not found"}
    hashed_password = await get_hashed_password(data.login)
    if verify_hashed_password(data.password, hashed_password):
        return {"status": "ok", "message": "Welcome"}
    else:
        return {"status": "failed", "Message": "Wrong password"}






