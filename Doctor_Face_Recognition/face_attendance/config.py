"""
Configuration management for the attendance system
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration class for the attendance system"""
    
    # Face recognition settings (using face_recognition library)
    THRESHOLD = float(os.getenv('THRESHOLD', '0.6'))  # Adjusted for face_recognition
    
    # Camera settings
    CAM_INDEX = int(os.getenv('CAM_INDEX', '0'))
    
    # API settings
    API_URL = os.getenv('API_URL', '')
    API_TOKEN = os.getenv('API_TOKEN', '')
    
    # File paths
    DATA_DIR = os.getenv('DATA_DIR', './Dataset_image')
    EMB_PATH = os.getenv('EMB_PATH', './storage/embeddings.npz')
    META_PATH = os.getenv('META_PATH', './storage/meta.json')
    ATT_CSV = os.getenv('ATT_CSV', './storage/attendance.csv')
    ATT_JSONL = os.getenv('ATT_JSONL', './storage/attendance.jsonl')
    PHOTO_DIR = os.getenv('PHOTO_DIR', './storage/photos')
    
    # Cooldown settings (seconds)
    # For demo/presentation: Set to 300 (5 minutes) or higher
    # For production: Set to 60 (1 minute)
    COOLDOWN_TIME = int(os.getenv('COOLDOWN_TIME', '300'))  # Default: 5 minutes
    
    @classmethod
    def validate(cls):
        """Validate configuration settings"""
        required_dirs = [cls.DATA_DIR, cls.PHOTO_DIR]
        for dir_path in required_dirs:
            if not os.path.exists(dir_path):
                os.makedirs(dir_path, exist_ok=True)
        
        return True
