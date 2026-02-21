from dns.update import Update
from sqlalchemy import Insert, select, delete, update
from database.models import async_session, Task, User, Tag


async def create_task(text: str, user_id: int):
    async with async_session() as session:
        new_task = Task(text=text, user_id=user_id)
        session.add(new_task)
        await session.commit()
        await session.refresh(new_task)
        return new_task

async def get_task(user_id: int):
    async with async_session() as session:
        query = await session.execute(select(Task).where(Task.user_id == user_id))
        tasks = query.scalars().all()
        return tasks

async def delete_task(task_id: int, user_id: int):
    async with async_session() as session:
        await session.execute(
            delete(Task).where(Task.id == task_id, Task.user_id == user_id)
        )
        await session.commit()

async def update_task_status(task_id: int, status: bool, user_id: int):
    async with async_session() as session:
        await session.execute(
            update(Task)
            .where(Task.id == task_id, Task.user_id == user_id)
            .values(is_completed=status)
        )
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

async def get_user_by_login(login: str):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.user_login == login))
        return result.scalars().first()


async def create_tag(tag_name: str, user_id: int):
    async with async_session() as session:
        new_tag = Tag(tag_name=tag_name, user_id=user_id)
        session.add(new_tag)
        await session.commit()
        await session.refresh(new_tag)
        return new_tag

async def get_all_users_tags(user_id: int):
    async with async_session() as session:
        query = await session.execute(select(Tag).where(Tag.user_id == user_id))
        return query.scalars().all()

async def update_task_tag(tag_name: str, task_id: int, user_id: int):
    async with async_session() as session:
        await session.execute(update(Task).where(Task.id == task_id, Task.user_id == user_id).values(tag=tag_name))
        await session.commit()








