from aiogram.types import Update
from sqlalchemy import Insert, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy import update


from database.models import async_session, Task


async def create_task(text: str):
    print(f"DEBUG: Вызов async_session: {async_session}")

    # 1. Проверяем, что возвращает вызов фабрики сессий
    session_ctx = async_session()
    print(f"DEBUG: Контекстный менеджер сессии: {session_ctx}, тип: {type(session_ctx)}")

    async with session_ctx as session:
        new_task = Task(text=text)
        session.add(new_task)

        # 2. Проверяем, что возвращает commit() ПЕРЕД тем как сделать await
        commit_coroutine = session.commit()
        print(f"DEBUG: Результат commit(): {commit_coroutine}, тип: {type(commit_coroutine)}")

        if commit_coroutine is None:
            print("ОШИБКА: commit() вернул None! Проверьте настройки SQLAlchemy.")
        else:
            await commit_coroutine

async def get_task():
    async with async_session() as session:
        query = await session.execute(select(Task))
        tasks = query.scalars().all()
        return tasks

