from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Check if jose and passlib are available
try:
    from jose import jwt
    from passlib.context import CryptContext
    AUTH_AVAILABLE = True
except ImportError:
    AUTH_AVAILABLE = False
    print("Authentication libraries not available")

load_dotenv()

# Initialize FastAPI
app = FastAPI(title="SESGRG API", version="1.0.0")

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "sesgrg-secret-key-2024-super-secure")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

if AUTH_AVAILABLE:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_role: str

def create_access_token(data: dict, expires_delta=None):
    if not AUTH_AVAILABLE:
        return "mock-token"
    
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# API Endpoints
@app.get("/")
async def root():
    return {"message": "SESG Research API", "status": "online"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "SESG Research API is working"}

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    # Simple authentication
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "@dminsesg705")
    
    print(f"Login attempt for username: {request.username}")
    print(f"Expected username: {admin_username}")
    
    if request.username == admin_username and request.password == admin_password:
        if AUTH_AVAILABLE:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": request.username, "role": "admin"}, 
                expires_delta=access_token_expires
            )
        else:
            access_token = "mock-token-for-admin"
        
        print(f"Login successful for {request.username}")
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_role": "admin"
        }
    else:
        print(f"Login failed for {request.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)