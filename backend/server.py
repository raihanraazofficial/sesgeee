from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os

app = FastAPI()

class LoginRequest(BaseModel):
    username: str
    password: str

@app.get("/")
async def root():
    return {"message": "SESG Research API", "status": "online"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "SESG Research API is working"}

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "@dminsesg705")
    
    print(f"Login attempt - Username: {request.username}, Expected: {admin_username}")
    
    if request.username == admin_username and request.password == admin_password:
        print("Login successful!")
        return {
            "access_token": "mock-token-success",
            "token_type": "bearer", 
            "user_role": "admin"
        }
    else:
        print("Login failed!")
        raise HTTPException(status_code=401, detail="Incorrect username or password")