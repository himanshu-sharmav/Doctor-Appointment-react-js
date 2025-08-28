#!/usr/bin/env python3
"""
Test script for the /allocate endpoint
This tests the ML service integration with the Node.js backend
"""

import requests
import json
from datetime import datetime

def test_allocate_endpoint():
    """Test the /allocate endpoint with sample queue data."""
    
    # Sample queue data that the Node.js backend would send
    test_queue_data = {
        "queue": [
            {
                "patientId": "P001",
                "patientName": "John Doe",
                "queuePosition": "2024-01-15T10:00:00Z",
                "doctorId": "D001"
            },
            {
                "patientId": "P002", 
                "patientName": "Jane Smith",
                "queuePosition": "2024-01-15T10:15:00Z",
                "doctorId": "D001"
            },
            {
                "patientId": "P003",
                "patientName": "Bob Johnson", 
                "queuePosition": "2024-01-15T10:30:00Z",
                "doctorId": "D001"
            }
        ]
    }
    
    try:
        print("🧪 Testing /allocate endpoint...")
        print(f"📤 Sending queue data: {json.dumps(test_queue_data, indent=2)}")
        
        # Make request to the ML service
        response = requests.post(
            "http://localhost:8000/allocate",
            json=test_queue_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"📥 Response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Success! ML service response:")
            print(json.dumps(result, indent=2))
            
            # Verify the response structure
            if "allocations" in result:
                print(f"🎯 Generated {len(result['allocations'])} allocations")
                for i, allocation in enumerate(result['allocations']):
                    print(f"  {i+1}. Patient {allocation['patientId']}: "
                          f"Priority {allocation['priority']}, "
                          f"Wait time {allocation['estimatedWaitTime']} min")
            else:
                print("❌ Missing 'allocations' in response")
                
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection failed - Make sure the ML service is running on port 8000")
        print("💡 Start the service with: ./start_ml_service.sh")
    except Exception as e:
        print(f"❌ Test failed: {e}")

if __name__ == "__main__":
    test_allocate_endpoint()
