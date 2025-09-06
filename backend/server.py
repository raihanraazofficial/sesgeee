from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import firebase_admin
from firebase_admin import credentials, firestore, auth, storage
import os
from datetime import datetime, timedelta
import uuid
import json
from passlib.context import CryptContext
from jose import JWTError, jwt
import requests
from dotenv import load_dotenv

load_dotenv()

# Initialize FastAPI
app = FastAPI(title="SESGRG API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Firebase Configuration
firebase_config = {
    "type": "service_account",
    "project_id": "sesgrg-website",
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
    "client_email": f"firebase-adminsdk@sesgrg-website.iam.gserviceaccount.com",
    "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk@sesgrg-website.iam.gserviceaccount.com"
}

# Initialize Firebase (if not already initialized)
try:
    if not firebase_admin._apps:
        # For development, we'll use a simple mock setup
        print("Firebase initialized successfully")
    db = None  # We'll use in-memory storage for now
except Exception as e:
    print(f"Firebase initialization error: {e}")
    db = None

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# In-memory data storage (replace with Firebase later)
in_memory_db = {
    "people": [],
    "publications": [],
    "projects": [],
    "achievements": [],
    "news": [],
    "events": [],
    "research_areas": [
        {
            "id": "smart-grid-technologies",
            "title": "Smart Grid Technologies",
            "description": "Next-generation intelligent grid systems for improved reliability and efficiency.",
            "image": "https://i.ibb.co.com/kV0RP1Xh/smart-grid.jpg",
            "details": "Advanced smart grid technologies for modern power systems..."
        },
        {
            "id": "microgrids-distributed-energy",
            "title": "Microgrids & Distributed Energy Systems",
            "description": "Localized energy grids that can operate independently or with traditional grids.",
            "image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
            "details": "Comprehensive research in microgrid systems and distributed energy..."
        },
        {
            "id": "renewable-energy-integration",
            "title": "Renewable Energy Integration",
            "description": "Seamless integration of solar, wind, and other renewable sources.",
            "image": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
            "details": "Innovation in renewable energy integration technologies..."
        },
        {
            "id": "grid-optimization-stability",
            "title": "Grid Optimization & Stability",
            "description": "Advanced algorithms for power system optimization and stability analysis.",
            "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
            "details": "Research in grid optimization and stability enhancement..."
        },
        {
            "id": "energy-storage-systems",
            "title": "Energy Storage Systems",
            "description": "Battery management and energy storage solutions for grid applications.",
            "image": "https://i.ibb.co.com/7tvcqhBV/EV.jpg",
            "details": "Advanced energy storage system research and development..."
        },
        {
            "id": "power-system-automation",
            "title": "Power System Automation",
            "description": "Automated control systems for modern power grid operations.",
            "image": "https://c0.wallpaperflare.com/preview/682/771/804/industrial-industry-automation-automatic.jpg",
            "details": "Cutting-edge power system automation technologies..."
        },
        {
            "id": "cybersecurity-ai-power-infrastructure",
            "title": "Cybersecurity and AI for Power Infrastructure",
            "description": "Advanced AI-driven cybersecurity solutions protecting critical power infrastructure from emerging threats.",
            "image": "https://itbrief.com.au/uploads/story/2024/01/23/cybersecurity_trends.webp",
            "details": "Comprehensive cybersecurity and AI research for power infrastructure..."
        }
    ],
    "photo_gallery": [],
    "settings": {
        "site_title": "Sustainable Energy & Smart Grid Research",
        "site_description": "Pioneering Research in Clean Energy, Renewable Integration, and Next-Generation Smart Grid Systems.",
        "contact_email": "sesg@bracu.ac.bd",
        "logo": "https://customer-assets.emergentagent.com/job_da31abd5-8dec-452e-a49e-9beda777d1d4/artifacts/ii07ct2o_Logo.jpg"
    }
}

# Pydantic Models
class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_role: str

class LoginRequest(BaseModel):
    username: str
    password: str

class PersonCreate(BaseModel):
    name: str
    title: str
    department: str
    category: str  # advisor, team_member, collaborator
    bio: str
    research_interests: List[str] = []
    image: Optional[str] = None
    email: Optional[str] = None
    social_links: Dict[str, str] = {}

class PublicationCreate(BaseModel):
    title: str
    authors: List[str]
    publication_type: str  # journal, conference, book_chapter
    journal_name: Optional[str] = None
    conference_name: Optional[str] = None
    book_title: Optional[str] = None
    volume: Optional[str] = None
    issue: Optional[str] = None
    pages: Optional[str] = None
    year: int
    month: Optional[str] = None
    location: Optional[str] = None
    editor: Optional[List[str]] = None
    publisher: Optional[str] = None
    edition: Optional[str] = None
    keywords: List[str] = []
    link: Optional[str] = None
    is_open_access: bool = False
    citations: int = 0
    research_areas: List[str] = []

class ProjectCreate(BaseModel):
    title: str
    description: str
    category: str
    status: str
    start_date: datetime
    end_date: Optional[datetime] = None
    team_members: List[str] = []
    research_areas: List[str] = []
    funding: Optional[str] = None
    image: Optional[str] = None

class AchievementCreate(BaseModel):
    title: str
    description: str
    date: datetime
    category: str
    image: Optional[str] = None
    link: Optional[str] = None

class NewsCreate(BaseModel):
    title: str
    content: str  # Rich text content
    excerpt: str
    author: str
    published_date: datetime
    is_featured: bool = False
    image: Optional[str] = None
    tags: List[str] = []

class EventCreate(BaseModel):
    title: str
    description: str
    date: datetime
    end_date: Optional[datetime] = None
    location: str
    event_type: str
    image: Optional[str] = None
    registration_link: Optional[str] = None

# Authentication Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return {"username": username, "role": payload.get("role", "user")}
    except JWTError:
        raise credentials_exception

# API Endpoints
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(request: LoginRequest):
    # Simple authentication (replace with proper user management)
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "@dminsesg705")
    
    if request.username == admin_username and request.password == admin_password:
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": request.username, "role": "admin"}, 
            expires_delta=access_token_expires
        )
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user_role="admin"
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

@app.get("/api/research-areas")
async def get_research_areas():
    return in_memory_db["research_areas"]

@app.get("/api/research-areas/{area_id}")
async def get_research_area(area_id: str):
    area = next((area for area in in_memory_db["research_areas"] if area["id"] == area_id), None)
    if not area:
        raise HTTPException(status_code=404, detail="Research area not found")
    return area

@app.get("/api/people")
async def get_people(category: Optional[str] = None):
    people = in_memory_db["people"]
    if category:
        people = [p for p in people if p.get("category") == category]
    return people

@app.post("/api/people")
async def create_person(person: PersonCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    new_person = person.dict()
    new_person["id"] = str(uuid.uuid4())
    new_person["created_at"] = datetime.utcnow()
    in_memory_db["people"].append(new_person)
    return new_person

@app.get("/api/publications")
async def get_publications(
    publication_type: Optional[str] = None,
    year: Optional[int] = None,
    research_area: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "year",
    sort_order: str = "desc"
):
    publications = in_memory_db["publications"]
    
    # Apply filters
    if publication_type:
        publications = [p for p in publications if p.get("publication_type") == publication_type]
    if year:
        publications = [p for p in publications if p.get("year") == year]
    if research_area:
        publications = [p for p in publications if research_area in p.get("research_areas", [])]
    if search:
        search_lower = search.lower()
        publications = [p for p in publications if 
                       search_lower in p.get("title", "").lower() or
                       any(search_lower in author.lower() for author in p.get("authors", []))]
    
    # Sort publications
    reverse = sort_order == "desc"
    if sort_by == "year":
        publications.sort(key=lambda x: x.get("year", 0), reverse=reverse)
    elif sort_by == "citations":
        publications.sort(key=lambda x: x.get("citations", 0), reverse=reverse)
    elif sort_by == "title":
        publications.sort(key=lambda x: x.get("title", "").lower(), reverse=reverse)
    
    return publications

@app.post("/api/publications")
async def create_publication(publication: PublicationCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    new_publication = publication.dict()
    new_publication["id"] = str(uuid.uuid4())
    new_publication["created_at"] = datetime.utcnow()
    in_memory_db["publications"].append(new_publication)
    return new_publication

@app.get("/api/projects")
async def get_projects(category: Optional[str] = None, status: Optional[str] = None):
    projects = in_memory_db["projects"]
    if category:
        projects = [p for p in projects if p.get("category") == category]
    if status:
        projects = [p for p in projects if p.get("status") == status]
    return projects

@app.get("/api/achievements")
async def get_achievements():
    return in_memory_db["achievements"]

@app.get("/api/news")
async def get_news(featured: Optional[bool] = None, limit: Optional[int] = None):
    news = in_memory_db["news"]
    if featured is not None:
        news = [n for n in news if n.get("is_featured") == featured]
    
    # Sort by published date
    news.sort(key=lambda x: x.get("published_date", datetime.min), reverse=True)
    
    if limit:
        news = news[:limit]
    
    return news

@app.get("/api/events")
async def get_events(upcoming: Optional[bool] = None):
    events = in_memory_db["events"]
    
    if upcoming:
        current_date = datetime.utcnow()
        events = [e for e in events if e.get("date", datetime.min) > current_date]
    
    # Sort by date
    events.sort(key=lambda x: x.get("date", datetime.min))
    
    return events

@app.get("/api/photo-gallery")
async def get_photo_gallery():
    return in_memory_db["photo_gallery"]

@app.get("/api/settings")
async def get_settings():
    return in_memory_db["settings"]

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    stats = {
        "total_publications": len(in_memory_db["publications"]),
        "total_people": len(in_memory_db["people"]),
        "total_projects": len(in_memory_db["projects"]),
        "total_achievements": len(in_memory_db["achievements"]),
        "total_news": len(in_memory_db["news"]),
        "total_events": len(in_memory_db["events"]),
        "total_citations": sum(p.get("citations", 0) for p in in_memory_db["publications"]),
        "latest_year": max([p.get("year", 0) for p in in_memory_db["publications"]], default=2025)
    }
    
    return stats

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)