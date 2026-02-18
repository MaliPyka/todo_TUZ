from sqlalchemy import Insert, select, delete, update
from database.models import async_session, Task, User


async def create_task(text: str):
    async with async_session() as session:
        new_task = Task(text=text)
        session.add(new_task)
        await session.commit()
        await session.refresh(new_task)
        return new_task

async def get_task():
    async with async_session() as session:
        query = await session.execute(select(Task))
        tasks = query.scalars().all()
        return tasks


async def delete_task(task_id: int):
    async with async_session() as session:
        await session.execute(delete(Task).where(Task.id == task_id))
        await session.commit()


async def update_task_status(task_id: int, status: bool):
    async with async_session() as session:
        await session.execute(update(Task).values(is_completed=status).where(Task.id == task_id))
        await session.commit()


async def registration(new_login: str, password: str):
    async with async_session() as session:
        new_user = User(user_login=new_login, hashed_password=password)
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

async def get_all_logins():
    async with async_session() as session:
        query = await session.execute(select(User.user_login))
        return query.scalars().all()


async def get_hashed_password(login: str):
    async with async_session() as session:
        request = await session.execute(select(User.hashed_password).where(User.user_login==login))
        return request.scalar()







