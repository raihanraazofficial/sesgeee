from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Initialize FastAPI
app = FastAPI(title="SESGRG API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data
mock_research_areas = [
    {
        "id": "smart-grid-technologies",
        "title": "Smart Grid Technologies",
        "description": "Next-generation intelligent grid systems for improved reliability and efficiency.",
        "image": "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
        "details": "Advanced smart grid technologies for modern power systems..."
    }
]

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/api/research-areas")
async def get_research_areas():
    return mock_research_areas

@app.get("/api/settings")
async def get_settings():
    return {
        "site_title": "Sustainable Energy & Smart Grid Research",
        "site_description": "Pioneering Research in Clean Energy, Renewable Integration, and Next-Generation Smart Grid Systems.",
        "contact_email": "sesg.eee@bracu.ac.bd",
        "logo": "https://customer-assets.emergentagent.com/job_da31abd5-8dec-452e-a49e-9beda777d1d4/artifacts/ii07ct2o_Logo.jpg"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)