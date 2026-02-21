from fastapi import APIRouter, Response, HTTPException, Depends
from database.request import create_task, get_task, delete_task, update_task_tag, update_task_status, registration, create_tag, get_all_users_tags, get_user_by_login
from Schemas import TaskSchema, LoginSchema, TagSchema

from authentication_utils.auth import create_access_token, get_current_user
from authentication_utils.auth_cmd import set_hashed_password, verify_hashed_password
api_router = APIRouter(
    tags=["User Management"],
)



@api_router.post("/tasks")
async def route_create_task(data: TaskSchema, user_id: int = Depends(get_current_user)):
    new_task = await create_task(text=data.text, user_id=user_id)
    return new_task


@api_router.get("/tasks")
async def get_tasks(user_id: int = Depends(get_current_user)):
    tasks = await get_task(user_id)
    return tasks

@api_router.delete("/tasks/{task_id}")
async def cmd_delete_task(task_id: int, user_id: int = Depends(get_current_user)):
    await delete_task(task_id=task_id, user_id=user_id)
    return {"message": "Task Deleted"}

@api_router.patch("/tasks/{task_id}/status")
async def cmd_update_task(task_id: int, status: bool, user_id: int = Depends(get_current_user)):
    await update_task_status(task_id, status, user_id)
    return {"status": "updated", "new_state": status}

@api_router.post("/users/registration")
async def cmd_registration(data: LoginSchema):
    hashed_password = await set_hashed_password(data.password)
    await registration(data.login, hashed_password)
    return {"message": "User Created"}


@api_router.post("/users/login")
async def cmd_login(data: LoginSchema, response: Response):
    user = await get_user_by_login(data.login)
    if user is None:
        return {"message": f"Пользователь {data.login} не найден!"}

    if user and await verify_hashed_password(data.password, user.hashed_password):
        token = create_access_token(user.user_id)

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True
        )
        return {"status": "ok"}
    else:
        return {"message": "Неверный пароль!"}


@api_router.post("/tasks/tags/create")
async def create_tag_cmd(data: TagSchema, user_id: int = Depends(get_current_user)):
    await create_tag(data.tag_name, user_id)
    return {"message": "Tag Created"}


@api_router.get("/tasks/tags")
async def get_tag_cmd(user_id: int = Depends(get_current_user)):
    tasks = await get_all_users_tags(user_id)
    return tasks


@api_router.patch("/tasks/tags/update")
async def cmd_update_task(data: TagSchema, user_id: int = Depends(get_current_user)):
    try:
        await update_task_tag(data.tag_name, data.task_id, user_id)
        return {"message": "Tag Updated"}
    except Exception as e:
        return {"message": str(e)}

