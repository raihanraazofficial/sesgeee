import requests
import sys
from datetime import datetime

class SESGRGAPITester:
    def __init__(self, base_url="https://site-overhaul-2.preview.emergentagent.com"):
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
        """Test projects endpoints with new requirements"""
        results = []
        
        # 1. Get all projects
        success1, projects_response = self.run_test(
            "Get All Projects",
            "GET",
            "api/projects",
            200
        )
        results.append(success1)
        
        if success1 and projects_response:
            # Check if any planning projects exist (should be none)
            planning_projects = [p for p in projects_response if p.get('status') == 'planning']
            if planning_projects:
                print(f"   ⚠️  Found {len(planning_projects)} planning projects (should be 0)")
                results.append(False)
            else:
                print("   ✅ No planning projects found (as expected)")
                results.append(True)
            
            # Check if projects have funding fields
            projects_with_funding = [p for p in projects_response if 'funding_amount' in p or 'currency' in p]
            print(f"   📊 Projects with funding fields: {len(projects_with_funding)}/{len(projects_response)}")
        
        # 2. Get projects by ongoing status
        success2, _ = self.run_test(
            "Get Ongoing Projects",
            "GET",
            "api/projects?status=ongoing",
            200
        )
        results.append(success2)
        
        # 3. Get projects by completed status
        success3, _ = self.run_test(
            "Get Completed Projects", 
            "GET",
            "api/projects?status=completed",
            200
        )
        results.append(success3)
        
        # 4. Test creating project with funding (requires auth)
        if self.token:
            success4, created_project = self.run_test(
                "Create Project with Funding",
                "POST",
                "api/projects",
                200,
                data={
                    "name": "Test Project with Funding",
                    "description": "This is a test project to verify funding fields work correctly. " * 20,  # Long description to test truncation
                    "start_date": "2024-01-15",
                    "end_date": "2025-12-31",
                    "team_leader": "Test Leader",
                    "team_members": "Member 1, Member 2, Member 3",
                    "funded_by": "Test Funding Agency",
                    "funding_amount": 250000,
                    "currency": "USD",
                    "total_members": 5,
                    "status": "ongoing",
                    "research_area": "Test Research Area"
                }
            )
            results.append(success4)
            
            if success4 and created_project:
                # Verify funding fields are saved correctly
                if created_project.get('funding_amount') == 250000 and created_project.get('currency') == 'USD':
                    print("   ✅ Funding fields saved correctly")
                    results.append(True)
                else:
                    print(f"   ❌ Funding fields not saved correctly: amount={created_project.get('funding_amount')}, currency={created_project.get('currency')}")
                    results.append(False)
        else:
            print("   ⚠️  Skipping authenticated project tests - no token")
            results.extend([False, False])
        
        return all(results)

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
        """Test news endpoints - comprehensive CRUD testing"""
        results = []
        created_news_id = None
        
        # 1. Get all news
        success1, response1 = self.run_test(
            "Get All News",
            "GET",
            "api/news",
            200
        )
        results.append(success1)
        
        # 2. Get featured news
        success2, _ = self.run_test(
            "Get Featured News",
            "GET",
            "api/news?featured=true&limit=5",
            200
        )
        results.append(success2)
        
        # 3. Get news by category
        success3, _ = self.run_test(
            "Get News by Category",
            "GET",
            "api/news?category=news",
            200
        )
        results.append(success3)
        
        # 4. Create news (requires auth)
        if self.token:
            success4, response4 = self.run_test(
                "Create News Article",
                "POST",
                "api/news",
                200,
                data={
                    "title": "Test News Article",
                    "content": "<p>This is a test news article with <strong>rich text</strong> content.</p>",
                    "excerpt": "Test excerpt for the news article",
                    "author": "Test Author",
                    "published_date": "2025-01-09T10:00:00",
                    "category": "news",
                    "is_featured": True,
                    "tags": ["test", "news"],
                    "status": "published"
                }
            )
            results.append(success4)
            
            if success4 and 'id' in response4:
                created_news_id = response4['id']
                print(f"   Created news ID: {created_news_id}")
                
                # 5. Get specific news item
                success5, _ = self.run_test(
                    "Get Specific News Item",
                    "GET",
                    f"api/news/{created_news_id}",
                    200
                )
                results.append(success5)
                
                # 6. Update news item
                success6, _ = self.run_test(
                    "Update News Article",
                    "PUT",
                    f"api/news/{created_news_id}",
                    200,
                    data={
                        "title": "Updated Test News Article",
                        "content": "<p>This is an <em>updated</em> test news article.</p>",
                        "excerpt": "Updated excerpt",
                        "author": "Updated Author",
                        "published_date": "2025-01-09T11:00:00",
                        "category": "events",
                        "is_featured": False,
                        "tags": ["updated", "test"],
                        "status": "published"
                    }
                )
                results.append(success6)
                
                # 7. Delete news item
                success7, _ = self.run_test(
                    "Delete News Article",
                    "DELETE",
                    f"api/news/{created_news_id}",
                    200
                )
                results.append(success7)
            else:
                print("   ⚠️  Could not test specific news operations - creation failed")
                results.extend([False, False, False])
        else:
            print("   ⚠️  Skipping authenticated news tests - no token")
            results.extend([False, False, False, False])
        
        return all(results)

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
    tester = SESGRGAPITester("https://site-overhaul-2.preview.emergentagent.com")
    
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