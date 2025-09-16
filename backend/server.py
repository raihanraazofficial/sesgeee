from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize FastAPI
app = FastAPI(title="SESGRG API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

# Endpoints
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
    
    print(f"Login attempt - Username: '{request.username}', Password length: {len(request.password)}")
    print(f"Expected - Username: '{admin_username}', Password: '{admin_password}'")
    
    if request.username == admin_username and request.password == admin_password:
        print("✅ Login successful!")
        return {
            "access_token": "valid-admin-token-12345",
            "token_type": "bearer", 
            "user_role": "admin"
        }
    else:
        print("❌ Login failed!")
        raise HTTPException(status_code=401, detail="Incorrect username or password")