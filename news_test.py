#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

def test_news_endpoints():
    """Test news endpoints specifically for the review request"""
    base_url = "http://localhost:8001"
    
    print("🚀 Testing News & Events API Endpoints")
    print("=" * 50)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{base_url}/api/health", timeout=10)
        if response.status_code == 200:
            print("✅ Backend health check: PASS")
        else:
            print(f"❌ Backend health check: FAIL (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ Backend health check: FAIL (Error: {e})")
        return False
    
    # Test 2: Get all news
    try:
        response = requests.get(f"{base_url}/api/news", timeout=10)
        if response.status_code == 200:
            news_data = response.json()
            print(f"✅ Get all news: PASS (Found {len(news_data)} items)")
            
            # Check if we have any news items
            if len(news_data) == 0:
                print("⚠️  No news items found - this is expected for mock data")
            else:
                # Show first news item structure
                first_item = news_data[0]
                print(f"   Sample news item keys: {list(first_item.keys())}")
                
        else:
            print(f"❌ Get all news: FAIL (Status: {response.status_code})")
            return False
    except Exception as e:
        print(f"❌ Get all news: FAIL (Error: {e})")
        return False
    
    # Test 3: Get news with filters
    try:
        response = requests.get(f"{base_url}/api/news?category=news&status=published", timeout=10)
        if response.status_code == 200:
            filtered_news = response.json()
            print(f"✅ Get filtered news: PASS (Found {len(filtered_news)} items)")
        else:
            print(f"❌ Get filtered news: FAIL (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Get filtered news: FAIL (Error: {e})")
    
    # Test 4: Test settings endpoint (for calendar integration)
    try:
        response = requests.get(f"{base_url}/api/settings", timeout=10)
        if response.status_code == 200:
            settings = response.json()
            print(f"✅ Get settings: PASS")
            print(f"   Settings keys: {list(settings.keys())}")
        else:
            print(f"❌ Get settings: FAIL (Status: {response.status_code})")
    except Exception as e:
        print(f"❌ Get settings: FAIL (Error: {e})")
    
    print("\n📊 Backend API tests completed")
    return True

if __name__ == "__main__":
    success = test_news_endpoints()
    sys.exit(0 if success else 1)