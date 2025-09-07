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
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000", 
        "https://*.vercel.app",
        "https://*.emergentagent.com",
        "https://site-overhaul-1.preview.emergentagent.com",
        "*"  # Allow all origins for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase
try:
    if not firebase_admin._apps:
        # Initialize Firebase with default project configuration
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {
            'projectId': 'sesgrg-website'
        })
        print("Firebase initialized successfully")
    db = firestore.client()
except Exception as e:
    print(f"Firebase initialization error: {e}")
    # Use environment-based initialization as fallback
    try:
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
        
        # Only initialize if we have credentials
        if os.getenv("FIREBASE_PRIVATE_KEY"):
            cred = credentials.Certificate(firebase_config)
            firebase_admin.initialize_app(cred)
            db = firestore.client()
            print("Firebase initialized with service account")
        else:
            print("No Firebase credentials found, using mock data")
            db = None
    except Exception as e2:
        print(f"Fallback Firebase initialization failed: {e2}")
        db = None

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "fallback-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Helper functions for Firebase operations
def get_collection_data(collection_name, filters=None, order_by=None, limit=None):
    """Get data from Firestore collection with optional filtering"""
    try:
        if db is None:
            return get_mock_data(collection_name)
        
        ref = db.collection(collection_name)
        
        # Apply filters
        if filters:
            for field, operator, value in filters:
                ref = ref.where(field, operator, value)
        
        # Apply ordering
        if order_by:
            field, direction = order_by
            ref = ref.order_by(field, direction=direction)
        
        # Apply limit
        if limit:
            ref = ref.limit(limit)
        
        docs = ref.stream()
        data = []
        for doc in docs:
            doc_data = doc.to_dict()
            doc_data['id'] = doc.id
            # Convert datetime objects to ISO strings
            for key, value in doc_data.items():
                if hasattr(value, 'isoformat'):
                    doc_data[key] = value.isoformat()
            data.append(doc_data)
        
        return data
    except Exception as e:
        print(f"Error getting collection data: {e}")
        return get_mock_data(collection_name)

def add_document(collection_name, data):
    """Add document to Firestore collection"""
    try:
        if db is None:
            # Mock behavior - add to in-memory storage
            data['id'] = str(uuid.uuid4())
            data['created_at'] = datetime.utcnow().isoformat()
            in_memory_db[collection_name].append(data)
            return data
        
        # Add timestamp
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        
        # Convert datetime strings to Firestore timestamps
        for key, value in data.items():
            if isinstance(value, str) and 'T' in value and ':' in value:
                try:
                    data[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except:
                    pass
        
        doc_ref = db.collection(collection_name).add(data)
        doc_id = doc_ref[1].id
        
        # Return the created document
        created_doc = data.copy()
        created_doc['id'] = doc_id
        created_doc['created_at'] = created_doc['created_at'].isoformat()
        created_doc['updated_at'] = created_doc['updated_at'].isoformat()
        
        return created_doc
    except Exception as e:
        print(f"Error adding document: {e}")
        raise HTTPException(status_code=500, detail=f"Error creating document: {str(e)}")

def update_document(collection_name, doc_id, data):
    """Update document in Firestore collection"""
    try:
        if db is None:
            # Mock behavior - update in-memory storage
            for item in in_memory_db[collection_name]:
                if item['id'] == doc_id:
                    item.update(data)
                    item['updated_at'] = datetime.utcnow().isoformat()
                    return item
            raise HTTPException(status_code=404, detail="Document not found")
        
        data['updated_at'] = datetime.utcnow()
        
        # Convert datetime strings to Firestore timestamps
        for key, value in data.items():
            if isinstance(value, str) and 'T' in value and ':' in value:
                try:
                    data[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                except:
                    pass
        
        doc_ref = db.collection(collection_name).document(doc_id)
        if not doc_ref.get().exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc_ref.update(data)
        
        # Return updated document
        updated_doc = doc_ref.get().to_dict()
        updated_doc['id'] = doc_id
        for key, value in updated_doc.items():
            if hasattr(value, 'isoformat'):
                updated_doc[key] = value.isoformat()
        
        return updated_doc
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating document: {e}")
        raise HTTPException(status_code=500, detail=f"Error updating document: {str(e)}")

def delete_document(collection_name, doc_id):
    """Delete document from Firestore collection"""
    try:
        if db is None:
            # Mock behavior - delete from in-memory storage
            in_memory_db[collection_name] = [item for item in in_memory_db[collection_name] if item['id'] != doc_id]
            return {"message": "Document deleted successfully"}
        
        doc_ref = db.collection(collection_name).document(doc_id)
        if not doc_ref.get().exists:
            raise HTTPException(status_code=404, detail="Document not found")
        
        doc_ref.delete()
        return {"message": "Document deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting document: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting document: {str(e)}")

def get_mock_data(collection_name):
    """Get mock data for development"""
    return in_memory_db.get(collection_name, [])
in_memory_db = {
    "people": [],
    "publications": [],
    "projects": [
        {
            "id": "1",
            "name": "Smart Grid Optimization Using Machine Learning",
            "description": "This project focuses on developing advanced machine learning algorithms to optimize power distribution in smart grid networks. We aim to reduce energy losses and improve overall grid efficiency through predictive analytics and real-time optimization.",
            "start_date": "2024-01-15",
            "end_date": "2025-12-31",
            "team_leader": "Dr. Mohammad Rahman",
            "team_members": "Dr. Sarah Ahmed, Eng. Karim Hassan, Ms. Fatima Ali, Mr. Tanvir Islam",
            "funded_by": "Bangladesh Science and Technology Ministry",
            "total_members": 5,
            "status": "ongoing",
            "research_area": "Smart Grid Technology",
            "project_link": "https://example.com/smart-grid-project",
            "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "2",
            "name": "Solar Energy Integration in Urban Areas",
            "description": "Research project aimed at developing innovative solutions for integrating solar photovoltaic systems in dense urban environments. Focus on building-integrated photovoltaics and community solar solutions.",
            "start_date": "2023-06-01",
            "end_date": "2024-05-31",
            "team_leader": "Prof. Nasir Uddin",
            "team_members": "Dr. Rashida Khatun, Eng. Ahmed Bin Rashid, Ms. Nusrat Jahan",
            "funded_by": "BRAC University Research Grant",
            "total_members": 4,
            "status": "completed",
            "research_area": "Renewable Energy",
            "project_link": None,
            "image": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "3",
            "name": "Microgrids for Rural Bangladesh",
            "description": "Development of sustainable microgrid solutions for rural communities in Bangladesh. This project focuses on hybrid renewable energy systems combining solar, wind, and biogas technologies.",
            "start_date": "2025-03-01",
            "end_date": "2027-02-28",
            "team_leader": "Dr. Salma Begum",
            "team_members": "Eng. Rafiqul Islam, Ms. Taslima Akter, Mr. Shahidul Hasan, Dr. Mizanur Rahman, Eng. Habibur Rahman",
            "funded_by": "World Bank Energy Access Project",
            "total_members": 6,
            "status": "planning",
            "research_area": "Sustainable Energy Systems",
            "project_link": "https://example.com/microgrid-rural",
            "image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85"
        },
        {
            "id": "4",
            "name": "Energy Storage System Optimization",
            "description": "Research on advanced battery management systems and grid-scale energy storage solutions. Developing algorithms for optimal charge/discharge cycles and extending battery life in grid applications.",
            "start_date": "2024-09-01",
            "end_date": "2025-08-31",
            "team_leader": "Dr. Aminul Haque",
            "team_members": "Eng. Shafiqul Islam, Ms. Ruma Khatun, Mr. Sajib Ahmed",
            "funded_by": "BSTI Research Fund",
            "total_members": 4,
            "status": "ongoing",
            "research_area": "Energy Storage",
            "project_link": None,
            "image": None
        },
        {
            "id": "5",
            "name": "EV Charging Infrastructure Planning",
            "description": "Strategic planning and optimization of electric vehicle charging infrastructure in Dhaka city. Focus on load balancing, grid impact analysis, and optimal placement of charging stations.",
            "start_date": "2024-04-01",
            "end_date": "2024-12-31",
            "team_leader": "Prof. Jahangir Alam",
            "team_members": "Dr. Farhana Yeasmin, Eng. Golam Mostafa, Ms. Sharmin Sultana, Mr. Abdur Rahim",
            "funded_by": "Dhaka City Corporation",
            "total_members": 5,
            "status": "ongoing",
            "research_area": "Electric Vehicle Integration",
            "project_link": "https://example.com/ev-charging-dhaka",
            "image": "https://images.unsplash.com/photo-1593941707874-ef0b23880c27?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxlbGVjdHJpYyUyMHZlaGljbGV8ZW58MHx8fHwxNzU2NjU0MTY5fDA&ixlib=rb-4.1.0&q=85"
        }
    ],
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
    name: str
    description: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    team_leader: Optional[str] = None
    team_members: Optional[str] = None  # Comma separated string
    funded_by: Optional[str] = None
    total_members: Optional[int] = None
    status: str = "planning"  # planning, ongoing, completed
    research_area: Optional[str] = None
    project_link: Optional[str] = None
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
    category: str = "news"  # news, events, upcoming_events
    is_featured: bool = False
    image: Optional[str] = None
    image_alt: Optional[str] = None
    tags: List[str] = []
    seo_keywords: Optional[str] = None
    status: str = "published"  # published, draft
    google_calendar_link: Optional[str] = None

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
    return get_collection_data("research_areas")

@app.get("/api/research-areas/{area_id}")
async def get_research_area(area_id: str):
    try:
        if db is None:
            area = next((area for area in in_memory_db["research_areas"] if area["id"] == area_id), None)
            if not area:
                raise HTTPException(status_code=404, detail="Research area not found")
            return area
        
        doc_ref = db.collection("research_areas").document(area_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Research area not found")
        
        area_data = doc.to_dict()
        area_data['id'] = doc.id
        return area_data
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching research area: {e}")
        raise HTTPException(status_code=500, detail="Error fetching research area")

@app.get("/api/people")
async def get_people(category: Optional[str] = None):
    filters = [("category", "==", category)] if category else None
    return get_collection_data("people", filters=filters)

@app.post("/api/people")
async def create_person(person: PersonCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    person_data = person.dict()
    return add_document("people", person_data)

@app.put("/api/people/{person_id}")
async def update_person(person_id: str, person: PersonCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    person_data = person.dict()
    return update_document("people", person_id, person_data)

@app.delete("/api/people/{person_id}")
async def delete_person(person_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_document("people", person_id)

@app.get("/api/publications")
async def get_publications(
    publication_type: Optional[str] = None,
    year: Optional[int] = None,
    research_area: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "year",
    sort_order: str = "desc"
):
    filters = []
    if publication_type:
        filters.append(("publication_type", "==", publication_type))
    if year:
        filters.append(("year", "==", year))
    
    # For Firebase, we'll get all data and filter search/research_area in Python
    # since Firestore has limitations on complex queries
    if db:
        order_by = (sort_by, firestore.Query.DESCENDING if sort_order == "desc" else firestore.Query.ASCENDING)
    else:
        order_by = None
    
    publications = get_collection_data("publications", filters=filters, order_by=order_by)
    
    # Apply additional filters
    if research_area:
        publications = [p for p in publications if research_area in p.get("research_areas", [])]
    if search:
        search_lower = search.lower()
        publications = [p for p in publications if 
                       search_lower in p.get("title", "").lower() or
                       any(search_lower in author.lower() for author in p.get("authors", []))]
    
    return publications

@app.post("/api/publications")
async def create_publication(publication: PublicationCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    publication_data = publication.dict()
    return add_document("publications", publication_data)

@app.put("/api/publications/{publication_id}")
async def update_publication(publication_id: str, publication: PublicationCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    publication_data = publication.dict()
    return update_document("publications", publication_id, publication_data)

@app.delete("/api/publications/{publication_id}")
async def delete_publication(publication_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_document("publications", publication_id)

@app.get("/api/projects")
async def get_projects(category: Optional[str] = None, status: Optional[str] = None):
    filters = []
    if category:
        filters.append(("category", "==", category))
    if status:
        filters.append(("status", "==", status))
    
    return get_collection_data("projects", filters=filters)

@app.post("/api/projects")
async def create_project(project: ProjectCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    project_data = project.dict()
    return add_document("projects", project_data)

@app.put("/api/projects/{project_id}")
async def update_project(project_id: str, project: ProjectCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    project_data = project.dict()
    return update_document("projects", project_id, project_data)

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_document("projects", project_id)

@app.get("/api/achievements")
async def get_achievements(category: Optional[str] = None):
    filters = [("category", "==", category)] if category else None
    return get_collection_data("achievements", filters=filters)

@app.post("/api/achievements")
async def create_achievement(achievement: AchievementCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    achievement_data = achievement.dict()
    return add_document("achievements", achievement_data)

@app.put("/api/achievements/{achievement_id}")
async def update_achievement(achievement_id: str, achievement: AchievementCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    achievement_data = achievement.dict()
    return update_document("achievements", achievement_id, achievement_data)

@app.delete("/api/achievements/{achievement_id}")
async def delete_achievement(achievement_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_document("achievements", achievement_id)

@app.get("/api/news")
async def get_news(
    featured: Optional[bool] = None, 
    category: Optional[str] = None,
    status: Optional[str] = None,
    limit: Optional[int] = None
):
    filters = []
    if featured is not None:
        filters.append(("is_featured", "==", featured))
    if category:
        filters.append(("category", "==", category))
    if status:
        filters.append(("status", "==", status))
        
    if db:
        order_by = ("published_date", firestore.Query.DESCENDING)
    else:
        order_by = None
    
    news = get_collection_data("news", filters=filters, order_by=order_by, limit=limit)
    return news

@app.get("/api/news/{news_id}")
async def get_news_item(news_id: str):
    try:
        if db is None:
            # Mock behavior - find from in-memory storage
            news_item = next((item for item in in_memory_db["news"] if item["id"] == news_id), None)
            if not news_item:
                raise HTTPException(status_code=404, detail="News item not found")
            return news_item
        
        doc_ref = db.collection("news").document(news_id)
        doc = doc_ref.get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="News item not found")
        
        news_data = doc.to_dict()
        news_data['id'] = doc.id
        # Convert datetime objects to ISO strings
        for key, value in news_data.items():
            if hasattr(value, 'isoformat'):
                news_data[key] = value.isoformat()
        return news_data
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching news item: {e}")
        raise HTTPException(status_code=500, detail="Error fetching news item")

@app.post("/api/news")
async def create_news(news: NewsCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    news_data = news.dict()
    return add_document("news", news_data)

@app.put("/api/news/{news_id}")
async def update_news(news_id: str, news: NewsCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    news_data = news.dict()
    return update_document("news", news_id, news_data)

@app.delete("/api/news/{news_id}")
async def delete_news(news_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_document("news", news_id)

@app.get("/api/events")
async def get_events(upcoming: Optional[bool] = None):
    if db:
        order_by = ("date", firestore.Query.ASCENDING)
    else:
        order_by = None
    events = get_collection_data("events", order_by=order_by)
    
    if upcoming:
        current_date = datetime.utcnow()
        events = [e for e in events if datetime.fromisoformat(e.get("date", "1970-01-01T00:00:00")) > current_date]
    
    return events

@app.post("/api/events")
async def create_event(event: EventCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    event_data = event.dict()
    return add_document("events", event_data)

@app.put("/api/events/{event_id}")
async def update_event(event_id: str, event: EventCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    event_data = event.dict()
    return update_document("events", event_id, event_data)

@app.delete("/api/events/{event_id}")
async def delete_event(event_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_document("events", event_id)

@app.get("/api/photo-gallery")
async def get_photo_gallery():
    return get_collection_data("photo_gallery")

@app.post("/api/photo-gallery")
async def create_photo(photo_data: dict, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return add_document("photo_gallery", photo_data)

@app.delete("/api/photo-gallery/{photo_id}")
async def delete_photo(photo_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_document("photo_gallery", photo_id)

@app.get("/api/settings")
async def get_settings():
    try:
        if db is None:
            return in_memory_db["settings"]
        
        doc_ref = db.collection("settings").document("site_config")
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            # Return default settings if none exist
            return in_memory_db["settings"]
    except Exception as e:
        print(f"Error fetching settings: {e}")
        return in_memory_db["settings"]

@app.put("/api/settings")
async def update_settings(settings_data: dict, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    try:
        if db is None:
            in_memory_db["settings"].update(settings_data)
            return in_memory_db["settings"]
        
        settings_data['updated_at'] = datetime.utcnow()
        doc_ref = db.collection("settings").document("site_config")
        doc_ref.set(settings_data, merge=True)
        
        # Return updated settings
        updated_doc = doc_ref.get().to_dict()
        for key, value in updated_doc.items():
            if hasattr(value, 'isoformat'):
                updated_doc[key] = value.isoformat()
        return updated_doc
    except Exception as e:
        print(f"Error updating settings: {e}")
        raise HTTPException(status_code=500, detail="Error updating settings")

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    try:
        people = get_collection_data("people")
        publications = get_collection_data("publications")
        projects = get_collection_data("projects")
        achievements = get_collection_data("achievements")
        news = get_collection_data("news")
        events = get_collection_data("events")
        
        stats = {
            "total_publications": len(publications),
            "total_people": len(people),
            "total_projects": len(projects),
            "total_achievements": len(achievements),
            "total_news": len(news),
            "total_events": len(events),
            "total_citations": sum(p.get("citations", 0) for p in publications),
            "latest_year": max([p.get("year", 0) for p in publications], default=2025)
        }
        
        return stats
    except Exception as e:
        print(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail="Error fetching dashboard stats")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)