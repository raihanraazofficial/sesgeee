#!/usr/bin/env python3

import requests
import sys

def test_backend():
    """Simple test to check if backend is accessible"""
    try:
        print("Testing backend health endpoint...")
        response = requests.get("http://localhost:8001/api/health", timeout=5)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = test_backend()
    sys.exit(0 if success else 1)