from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, RedirectResponse

from ApiRouter import api_router
from database.models import engine, Base
from fastapi.responses import FileResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_index():
    return RedirectResponse(url="/login")

@app.get("/register", response_class=HTMLResponse)
async def get_register_page(request: Request):
    return FileResponse("static/register.html")

@app.get("/login", response_class=HTMLResponse)
async def get_login_page(request: Request):
    return FileResponse("static/login.html")

app.include_router(api_router)





if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)