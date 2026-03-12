from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import hashlib
from typing import Optional

from database.db import get_db
from database.models import (
    create_user, 
    get_user_by_email, 
    get_user_by_id, 
    update_user_progress
)
import json

router = APIRouter()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UpdateProgressRequest(BaseModel):
    user_id: int
    xp_gain: int
    coins_gain: int
    level: int
    completed_topics: list[str]

@router.post("/signup")
def signup(request: SignupRequest):
    db = get_db()
    existing_user = get_user_by_email(db, request.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_pw = hash_password(request.password)
    try:
        user_id = create_user(db, request.username, request.email, hashed_pw)
        user = get_user_by_id(db, user_id)
        return {"message": "Signup successful", "user": user.to_dict(), "token": f"dummy-token-{user_id}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signup failed: {str(e)}")

@router.post("/login")
def login(request: LoginRequest):
    db = get_db()
    user = get_user_by_email(db, request.email)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    if user.password_hash != hash_password(request.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    return {"message": "Login successful", "user": user.to_dict(), "token": f"dummy-token-{user.id}"}

@router.post("/update-progress")
def update_progress(request: UpdateProgressRequest):
    db = get_db()
    user = get_user_by_id(db, request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    topics_json = json.dumps(request.completed_topics)
    update_user_progress(
        db, 
        request.user_id, 
        request.xp_gain, 
        request.coins_gain, 
        request.level,
        topics_json
    )
    
    updated_user = get_user_by_id(db, request.user_id)
    return {"message": "Progress updated", "user": updated_user.to_dict()}

@router.get("/user-progress/{user_id}")
def get_user_progress(user_id: int):
    db = get_db()
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user.to_dict()}
