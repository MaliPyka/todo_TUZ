from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse

from ApiRouter import api_router
from database.models import engine, Base
from fastapi.responses import FileResponse
from authentication_utils.auth import get_current_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root(request: Request):
    token = request.cookies.get("access_token")

    if not token:
        return RedirectResponse(url="/login")

    try:
        await get_current_user(request)
        return RedirectResponse(url="/tasksss")
    except Exception:
        # Если токен битый или истек — на логин
        return RedirectResponse(url="/login")

@app.get("/register", response_class=HTMLResponse)
async def get_register_page(request: Request):
    return FileResponse("static/register.html")

@app.get("/login", response_class=HTMLResponse)
async def get_login_page(request: Request):
    return FileResponse("static/login.html")


@app.get("/tasksss")
async def get_tasks_page(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        return RedirectResponse(url="/login")

    return FileResponse("static/index.html")

app.include_router(api_router)





if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)