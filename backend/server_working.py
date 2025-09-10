from fastapi import FastAPI

# Initialize FastAPI
app = FastAPI(title="SESGRG API", version="1.0.0")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "SESG Research API is working"}

@app.get("/")
async def root():
    return {"message": "SESG Research API", "status": "online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)