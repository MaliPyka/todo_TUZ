import aiosqlite
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import String, Integer, ForeignKey, select, BigInteger, func, DateTime
from datetime import datetime

DB_PATH = 'database.db'

engine = create_async_engine(f"sqlite+aiosqlite:///{DB_PATH}")

async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession, # Явно указываем класс
    expire_on_commit=False
)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with async_session() as session:
        yield session


class Task(Base):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(primary_key=True, auto_increment=True)
    text: Mapped[str] = mapped_column(String, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())