#!/usr/bin/env python3

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
from datetime import datetime, timedelta

# Initialize the Firebase Admin SDK
try:
    firebase_admin.get_app()
except ValueError:
    # App doesn't exist yet, so initialize it
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": "sesgrg-website",
        "private_key_id": "dummy_key_id",
        "private_key": "-----BEGIN PRIVATE KEY-----\ndummy_private_key\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-dummy@sesgrg-website.iam.gserviceaccount.com",
        "client_id": "dummy_client_id",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dummy%40sesgrg-website.iam.gserviceaccount.com"
    })
    firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()

# Sample projects with simplified structure (removed unwanted fields)
sample_projects = [
    {
        "name": "Smart Grid Implementation for Rural Bangladesh",
        "description": "A comprehensive project to implement smart grid technology in rural areas of Bangladesh, focusing on renewable energy integration and grid stability. This project aims to bring reliable electricity to remote communities while promoting sustainable energy practices and reducing dependency on traditional fossil fuels.",
        "status": "ongoing",
        "start_date": datetime(2024, 1, 15),
        "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMHByb2plY3RzfGVufDB8fHx8MTc1NjY1NDE0OXww&ixlib=rb-4.1.0&q=85",
        "project_link": "https://example.com/smart-grid-project",
        "research_area": "Smart Grid Technologies"
    },
    {
        "name": "Renewable Energy Integration System",
        "description": "Advanced system for integrating solar and wind power into the national grid while maintaining stability and efficiency. The project involves developing sophisticated control algorithms and real-time monitoring systems to optimize renewable energy utilization and reduce grid losses.",
        "status": "completed",
        "start_date": datetime(2023, 3, 10),
        "image": "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
        "project_link": "https://example.com/renewable-integration",
        "research_area": "Renewable Energy Integration"
    },
    {
        "name": "Microgrid Development for Campus Energy Management",
        "description": "Design and implementation of a microgrid system for university campuses to achieve energy independence and reduce carbon footprint. The project includes energy storage systems, renewable energy sources, and intelligent load management capabilities for optimal energy utilization.",
        "status": "ongoing",
        "start_date": datetime(2024, 6, 20),
        "image": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
        "research_area": "Microgrids & Distributed Energy Systems"
    },
    {
        "name": "AI-Powered Grid Optimization Algorithm",
        "description": "Development of artificial intelligence algorithms for real-time power grid optimization, focusing on load balancing, fault detection, and predictive maintenance. This project leverages machine learning techniques to enhance grid reliability and reduce operational costs through intelligent automation.",
        "status": "completed",
        "start_date": datetime(2022, 8, 5),
        "image": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw2fHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fHwxNjk3MDI3MDAwfDA&ixlib=rb-4.1.0&q=85",
        "project_link": "https://example.com/ai-grid-optimization",
        "research_area": "Grid Optimization & Stability"
    }
]

def add_sample_projects():
    try:
        print("Adding sample projects to Firestore...")
        
        # Reference to the projects collection
        projects_ref = db.collection('projects')
        
        # Add each sample project
        for project in sample_projects:
            # Add timestamps
            project['created_at'] = datetime.now()
            project['updated_at'] = datetime.now()
            
            # Add the project to Firestore
            doc_ref = projects_ref.add(project)
            print(f"Added project: {project['name']} with ID: {doc_ref[1].id}")
        
        print("Successfully added all sample projects!")
        
    except Exception as e:
        print(f"Error adding sample projects: {e}")

if __name__ == "__main__":
    add_sample_projects()