from pydantic import BaseModel

class TaskSchema(BaseModel):
    text: str

class LoginSchema(BaseModel):
    login: str
    password: str

class Token(BaseModel):
    access_token: str

class TagSchema(BaseModel):
    tag_name: str
    task_id: int