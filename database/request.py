from aiogram.types import Update
from sqlalchemy import Insert, select, delete, update
from sqlalchemy.exc import IntegrityError


from database.models import async_session, Task


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





