import requests
import sys
from datetime import datetime

class SESGRGAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {str(response_data)[:100]}...")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                self.failed_tests.append(f"{name}: Expected {expected_status}, got {response.status_code}")

            return success, response.json() if success and response.text else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        return success

    def test_login(self):
        """Test admin login"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "api/auth/login",
            200,
            data={"username": "admin", "password": "@dminsesg705"}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_research_areas(self):
        """Test research areas endpoints"""
        # Get all research areas
        success1, response = self.run_test(
            "Get Research Areas",
            "GET",
            "api/research-areas",
            200
        )
        
        # Test specific research area if we got data
        success2 = True
        if success1 and response and len(response) > 0:
            area_id = response[0].get('id')
            if area_id:
                success2, _ = self.run_test(
                    "Get Specific Research Area",
                    "GET",
                    f"api/research-areas/{area_id}",
                    200
                )
        
        return success1 and success2

    def test_people_endpoints(self):
        """Test people endpoints"""
        # Get all people
        success1, _ = self.run_test(
            "Get All People",
            "GET",
            "api/people",
            200
        )
        
        # Get people by category
        success2, _ = self.run_test(
            "Get People by Category",
            "GET",
            "api/people?category=advisor",
            200
        )
        
        # Test creating a person (requires auth)
        success3 = True
        if self.token:
            success3, _ = self.run_test(
                "Create Person",
                "POST",
                "api/people",
                200,
                data={
                    "name": "Test Person",
                    "title": "Test Title",
                    "department": "Test Department",
                    "category": "team_member",
                    "bio": "Test bio",
                    "research_interests": ["AI", "ML"]
                }
            )
        
        return success1 and success2 and success3

    def test_publications_endpoints(self):
        """Test publications endpoints"""
        # Get all publications
        success1, _ = self.run_test(
            "Get All Publications",
            "GET",
            "api/publications",
            200
        )
        
        # Get publications with filters
        success2, _ = self.run_test(
            "Get Publications with Filters",
            "GET",
            "api/publications?publication_type=journal&year=2024",
            200
        )
        
        # Test creating a publication (requires auth)
        success3 = True
        if self.token:
            success3, _ = self.run_test(
                "Create Publication",
                "POST",
                "api/publications",
                200,
                data={
                    "title": "Test Publication",
                    "authors": ["Test Author"],
                    "publication_type": "journal",
                    "year": 2024,
                    "keywords": ["test"]
                }
            )
        
        return success1 and success2 and success3

    def test_projects_endpoints(self):
        """Test projects endpoints"""
        success1, _ = self.run_test(
            "Get All Projects",
            "GET",
            "api/projects",
            200
        )
        
        success2, _ = self.run_test(
            "Get Projects by Status",
            "GET",
            "api/projects?status=active",
            200
        )
        
        return success1 and success2

    def test_achievements_endpoint(self):
        """Test achievements endpoint"""
        success, _ = self.run_test(
            "Get Achievements",
            "GET",
            "api/achievements",
            200
        )
        return success

    def test_news_endpoints(self):
        """Test news endpoints"""
        success1, _ = self.run_test(
            "Get All News",
            "GET",
            "api/news",
            200
        )
        
        success2, _ = self.run_test(
            "Get Featured News",
            "GET",
            "api/news?featured=true&limit=5",
            200
        )
        
        return success1 and success2

    def test_events_endpoint(self):
        """Test events endpoint"""
        success1, _ = self.run_test(
            "Get All Events",
            "GET",
            "api/events",
            200
        )
        
        success2, _ = self.run_test(
            "Get Upcoming Events",
            "GET",
            "api/events?upcoming=true",
            200
        )
        
        return success1 and success2

    def test_photo_gallery_endpoint(self):
        """Test photo gallery endpoint"""
        success, _ = self.run_test(
            "Get Photo Gallery",
            "GET",
            "api/photo-gallery",
            200
        )
        return success

    def test_settings_endpoint(self):
        """Test settings endpoint"""
        success, _ = self.run_test(
            "Get Settings",
            "GET",
            "api/settings",
            200
        )
        return success

    def test_dashboard_stats(self):
        """Test dashboard stats (requires auth)"""
        if not self.token:
            print("⚠️  Skipping dashboard stats test - no auth token")
            return True
            
        success, _ = self.run_test(
            "Get Dashboard Stats",
            "GET",
            "api/dashboard/stats",
            200
        )
        return success

def main():
    print("🚀 Starting SESGRG API Tests")
    print("=" * 50)
    
    # Setup
    tester = SESGRGAPITester("http://localhost:8001")
    
    # Run tests in order
    test_results = []
    
    # Basic connectivity
    test_results.append(("Health Check", tester.test_health_check()))
    
    # Authentication
    test_results.append(("Login", tester.test_login()))
    
    # Public endpoints
    test_results.append(("Research Areas", tester.test_research_areas()))
    test_results.append(("People Endpoints", tester.test_people_endpoints()))
    test_results.append(("Publications", tester.test_publications_endpoints()))
    test_results.append(("Projects", tester.test_projects_endpoints()))
    test_results.append(("Achievements", tester.test_achievements_endpoint()))
    test_results.append(("News", tester.test_news_endpoints()))
    test_results.append(("Events", tester.test_events_endpoint()))
    test_results.append(("Photo Gallery", tester.test_photo_gallery_endpoint()))
    test_results.append(("Settings", tester.test_settings_endpoint()))
    
    # Protected endpoints
    test_results.append(("Dashboard Stats", tester.test_dashboard_stats()))
    
    # Print results
    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<25} {status}")
    
    print(f"\n📈 Overall: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for failure in tester.failed_tests:
            print(f"   - {failure}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())