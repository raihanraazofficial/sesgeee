#!/usr/bin/env python3

import requests
import json
import sys

def test_backend_api():
    """Test backend API to ensure it's working"""
    base_url = "http://localhost:8001"
    
    print("🔍 Testing Backend API for News...")
    
    try:
        # Test health endpoint
        response = requests.get(f"{base_url}/api/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend health check: PASS")
        else:
            print(f"❌ Backend health check: FAIL (Status: {response.status_code})")
            return False
            
        # Test news endpoint
        response = requests.get(f"{base_url}/api/news", timeout=10)
        if response.status_code == 200:
            news_data = response.json()
            print(f"✅ News API: PASS (Found {len(news_data)} items)")
            
            # If no news, let's create some test data
            if len(news_data) == 0:
                print("⚠️  No news found, this is expected with mock data")
                
            return True
        else:
            print(f"❌ News API: FAIL (Status: {response.status_code})")
            return False
            
    except Exception as e:
        print(f"❌ Backend API test failed: {e}")
        return False

def create_test_news_via_api():
    """Create test news via backend API"""
    base_url = "http://localhost:8001"
    
    print("🔍 Creating test news via API...")
    
    try:
        # First login to get token
        login_response = requests.post(f"{base_url}/api/auth/login", json={
            "username": "admin",
            "password": "@dminsesg705"
        }, timeout=10)
        
        if login_response.status_code != 200:
            print(f"❌ Login failed: {login_response.status_code}")
            return False
            
        token = login_response.json().get('access_token')
        if not token:
            print("❌ No token received")
            return False
            
        print("✅ Login successful, got token")
        
        # Create test news
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        test_news = {
            "title": "Test News Article for Hero Section Testing",
            "content": "<p>This is a test news article created for testing the hero section and share button functionality.</p><p>The article contains sample content to verify that the News page displays correctly and the NewsDetail page functions properly.</p>",
            "excerpt": "Test news article for verifying News page hero section and NewsDetail share button functionality.",
            "author": "Test Author",
            "published_date": "2025-01-09T12:00:00",
            "category": "news",
            "is_featured": True,
            "tags": ["test", "hero-section", "share-button"],
            "status": "published"
        }
        
        create_response = requests.post(f"{base_url}/api/news", json=test_news, headers=headers, timeout=10)
        
        if create_response.status_code == 200:
            created_news = create_response.json()
            print(f"✅ Test news created successfully: ID {created_news.get('id')}")
            return created_news.get('id')
        else:
            print(f"❌ Failed to create test news: {create_response.status_code}")
            print(f"Response: {create_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error creating test news: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing News Frontend Setup")
    print("=" * 50)
    
    # Test backend API
    if not test_backend_api():
        print("❌ Backend API test failed")
        sys.exit(1)
    
    # Create test news
    news_id = create_test_news_via_api()
    if news_id:
        print(f"✅ Test news created with ID: {news_id}")
        print(f"📝 You can now test the NewsDetail page with URL: /news/test-news-article-for-hero-section-testing-{news_id}")
    else:
        print("⚠️  Could not create test news, but backend is working")
    
    print("\n✅ Backend setup complete - ready for frontend testing")