"""
API client for backend communication (optional)
"""

import requests
import json
from config import Config

class APIClient:
    """Handles communication with backend API"""
    
    def __init__(self):
        self.config = Config()
        self.api_url = self.config.API_URL
        self.api_token = self.config.API_TOKEN
        
    def is_configured(self):
        """Check if API is configured"""
        return bool(self.api_url and self.api_url.strip())
    
    def send_attendance_event(self, attendance_record):
        """Send attendance event to backend API"""
        if not self.is_configured():
            return False, "API not configured"
        
        try:
            # Prepare headers
            headers = {
                'Content-Type': 'application/json'
            }
            
            if self.api_token:
                headers['Authorization'] = f'Bearer {self.api_token}'
            
            # Send POST request
            response = requests.post(
                self.api_url,
                json=attendance_record,
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return True, "Event sent successfully"
            else:
                return False, f"API error: {response.status_code} - {response.text}"
                
        except requests.exceptions.RequestException as e:
            return False, f"Network error: {e}"
        except Exception as e:
            return False, f"Unexpected error: {e}"
    
    def test_connection(self):
        """Test API connection"""
        if not self.is_configured():
            return False, "API not configured"
        
        try:
            response = requests.get(
                self.api_url,
                timeout=5
            )
            return True, f"Connection successful: {response.status_code}"
        except Exception as e:
            return False, f"Connection failed: {e}"
    
    def get_doctors_list(self):
        """Get list of doctors from API (if supported)"""
        if not self.is_configured():
            return None, "API not configured"
        
        try:
            headers = {}
            if self.api_token:
                headers['Authorization'] = f'Bearer {self.api_token}'
            
            response = requests.get(
                f"{self.api_url}/doctors",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json(), None
            else:
                return None, f"API error: {response.status_code}"
                
        except Exception as e:
            return None, f"Error fetching doctors: {e}"
