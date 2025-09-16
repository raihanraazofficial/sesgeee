from fastapi import FastAPI
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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
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
    
    if request.username == admin_username and request.password == admin_password:
        return {
            "access_token": "valid-admin-token-12345",
            "token_type": "bearer", 
            "user_role": "admin"
        }
    else:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Incorrect username or password")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)