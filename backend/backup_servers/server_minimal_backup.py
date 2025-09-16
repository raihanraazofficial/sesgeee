#!/usr/bin/env python3

from fastapi import FastAPI
import os

# Create FastAPI app
app = FastAPI(
    title="SESG Research API",
    version="1.0.0",
    description="API for Sustainable Energy and Smart Grid Research website"
)

@app.get("/")
async def root():
    return {"message": "SESG Research API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is working properly"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)