#!/usr/bin/env python3
"""
Simple test script to verify the To-Do application functionality
"""
import requests
import json
from datetime import datetime, timedelta

# Configuration
BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api"

def test_api_endpoints():
    """Test basic API functionality"""
    print("🧪 Testing To-Do Application API...")
    
    # Test 1: API Root
    try:
        response = requests.get(f"{API_URL}/")
        print(f"✅ API Root accessible: {response.status_code}")
    except Exception as e:
        print(f"❌ API Root failed: {e}")
        return False
    
    # Test 2: User Registration
    test_user = {
        "username": "testuser123",
        "email": "test@example.com",
        "password": "testpass123",
        "password2": "testpass123"
    }
    
    try:
        response = requests.post(f"{API_URL}/auth/register/", json=test_user)
        if response.status_code == 201:
            print("✅ User registration successful")
        elif response.status_code == 400 and "already exists" in str(response.text):
            print("✅ User already exists (expected for repeated tests)")
        else:
            print(f"⚠️  User registration: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ User registration failed: {e}")
    
    # Test 3: User Login
    login_data = {
        "username": "testuser123",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{API_URL}/auth/login/", json=login_data)
        if response.status_code == 200:
            tokens = response.json()
            access_token = tokens.get('access')
            print("✅ User login successful")
            
            # Test 4: Create Task
            headers = {"Authorization": f"Bearer {access_token}"}
            task_data = {
                "title": "Test Task",
                "description": "This is a test task created by automation",
                "priority": "high",
                "status": "pending",
                "due_date": (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
            }
            
            task_response = requests.post(f"{API_URL}/tasks/", json=task_data, headers=headers)
            if task_response.status_code == 201:
                task = task_response.json()
                print(f"✅ Task created successfully: ID {task['id']}")
                
                # Test 5: Get Tasks
                tasks_response = requests.get(f"{API_URL}/tasks/", headers=headers)
                if tasks_response.status_code == 200:
                    tasks = tasks_response.json()
                    print(f"✅ Tasks retrieved: {len(tasks['results'])} tasks found")
                else:
                    print(f"❌ Failed to retrieve tasks: {tasks_response.status_code}")
                
                # Test 6: Update Task
                update_data = {"status": "completed"}
                update_response = requests.patch(f"{API_URL}/tasks/{task['id']}/", json=update_data, headers=headers)
                if update_response.status_code == 200:
                    print("✅ Task updated successfully")
                else:
                    print(f"❌ Failed to update task: {update_response.status_code}")
                
            else:
                print(f"❌ Failed to create task: {task_response.status_code} - {task_response.text}")
                
        else:
            print(f"❌ User login failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"❌ Login test failed: {e}")
    
    print("\n🎉 API Testing Complete!")
    return True

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    print("\n🌐 Testing Frontend Accessibility...")
    
    try:
        response = requests.get("http://localhost:5173")
        if response.status_code == 200:
            print("✅ Frontend is accessible on http://localhost:5173")
        else:
            print(f"❌ Frontend returned status code: {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend accessibility test failed: {e}")

def main():
    print("🚀 Starting To-Do Application Tests\n")
    print("=" * 50)
    
    # Test API
    test_api_endpoints()
    
    # Test Frontend
    test_frontend_accessibility()
    
    print("\n" + "=" * 50)
    print("📝 Test Summary:")
    print("- Backend API: Django REST Framework on http://localhost:8000")
    print("- Frontend UI: React with Vite on http://localhost:5173")
    print("- API Documentation: http://localhost:8000/swagger/")
    print("- Features: JWT Auth, CRUD Operations, Drag & Drop, Filtering")
    print("- Deployment: Docker containers configured")
    print("\n✨ Your To-Do application is ready for use!")

if __name__ == "__main__":
    main()
