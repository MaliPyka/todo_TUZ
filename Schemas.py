from pydantic import BaseModel, Field
from typing import List

class TaskSchema(BaseModel):
    text: str

class LoginSchema(BaseModel):
    login: str
    password: str

class Token(BaseModel):
    access_token: str

class TagSchema(BaseModel):
    tag_name: str = Field(max_length=12)
    task_id: int

class TasksId(BaseModel):
    id: List[int]