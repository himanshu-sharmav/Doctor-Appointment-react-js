"""
Attendance data storage and management
"""

import os
import json
import csv
import uuid
from datetime import datetime
import cv2
from config import Config

class AttendanceManager:
    """Manages attendance data storage and retrieval"""
    
    def __init__(self):
        self.config = Config()
        self.ensure_storage_dirs()
        
    def ensure_storage_dirs(self):
        """Ensure storage directories exist"""
        os.makedirs(self.config.PHOTO_DIR, exist_ok=True)
        os.makedirs(os.path.dirname(self.config.ATT_CSV), exist_ok=True)
        os.makedirs(os.path.dirname(self.config.ATT_JSONL), exist_ok=True)
        
        # Initialize CSV file if it doesn't exist
        if not os.path.exists(self.config.ATT_CSV):
            self._init_csv()
    
    def _init_csv(self):
        """Initialize CSV file with headers"""
        headers = [
            'timestamp', 'doctor_id', 'name', 'type', 'event', 
            'similarity', 'photo_path'
        ]
        
        with open(self.config.ATT_CSV, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
    
    def save_photo(self, image, doctor_id, event_type):
        """Save attendance photo"""
        try:
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            photo_id = str(uuid.uuid4())[:8]
            filename = f"{doctor_id}_{event_type}_{timestamp}_{photo_id}.jpg"
            photo_path = os.path.join(self.config.PHOTO_DIR, filename)
            
            # Save image
            cv2.imwrite(photo_path, image)
            
            return photo_path
            
        except Exception as e:
            print(f"Error saving photo: {e}")
            return None
    
    def record_attendance(self, doctor_id, name, doctor_type, event_type, 
                         similarity, image=None):
        """Record an attendance event"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Save photo if provided
        photo_path = ""
        if image is not None:
            photo_path = self.save_photo(image, doctor_id, event_type) or ""
        
        # Prepare attendance record
        record = {
            'timestamp': timestamp,
            'doctor_id': doctor_id,
            'name': name,
            'type': doctor_type,
            'event': event_type,
            'similarity': f"{similarity:.3f}",
            'photo_path': photo_path
        }
        
        # Save to CSV
        self._save_to_csv(record)
        
        # Save to JSONL
        self._save_to_jsonl(record)
        
        return record
    
    def _save_to_csv(self, record):
        """Save record to CSV file"""
        try:
            with open(self.config.ATT_CSV, 'a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([
                    record['timestamp'],
                    record['doctor_id'],
                    record['name'],
                    record['type'],
                    record['event'],
                    record['similarity'],
                    record['photo_path']
                ])
        except Exception as e:
            print(f"Error saving to CSV: {e}")
    
    def _save_to_jsonl(self, record):
        """Save record to JSONL file"""
        try:
            with open(self.config.ATT_JSONL, 'a', encoding='utf-8') as f:
                f.write(json.dumps(record, ensure_ascii=False) + '\n')
        except Exception as e:
            print(f"Error saving to JSONL: {e}")
    
    def get_attendance_summary(self, date=None):
        """Get attendance summary for a specific date"""
        if date is None:
            date = datetime.now().strftime("%Y-%m-%d")
        
        summary = {}
        
        try:
            with open(self.config.ATT_CSV, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row['timestamp'].startswith(date):
                        doctor_id = row['doctor_id']
                        if doctor_id not in summary:
                            summary[doctor_id] = {
                                'name': row['name'],
                                'type': row['type'],
                                'entry_time': None,
                                'exit_time': None,
                                'total_time': None
                            }
                        
                        if row['event'] == 'entry':
                            summary[doctor_id]['entry_time'] = row['timestamp']
                        elif row['event'] == 'exit':
                            summary[doctor_id]['exit_time'] = row['timestamp']
            
            # Calculate total time for each doctor
            for doctor_data in summary.values():
                if doctor_data['entry_time'] and doctor_data['exit_time']:
                    entry_dt = datetime.strptime(doctor_data['entry_time'], "%Y-%m-%d %H:%M:%S")
                    exit_dt = datetime.strptime(doctor_data['exit_time'], "%Y-%m-%d %H:%M:%S")
                    duration = exit_dt - entry_dt
                    doctor_data['total_time'] = str(duration)
            
            return summary
            
        except Exception as e:
            print(f"Error reading attendance summary: {e}")
            return {}
    
    def get_recent_attendance(self, limit=10):
        """Get recent attendance records"""
        records = []
        
        try:
            with open(self.config.ATT_JSONL, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                for line in lines[-limit:]:
                    try:
                        record = json.loads(line.strip())
                        records.append(record)
                    except json.JSONDecodeError:
                        continue
        except Exception as e:
            print(f"Error reading recent attendance: {e}")
        
        return records
    
    def export_attendance(self, start_date=None, end_date=None, output_file=None):
        """Export attendance data to a file"""
        if output_file is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            output_file = f"attendance_export_{timestamp}.csv"
        
        try:
            with open(self.config.ATT_CSV, 'r', encoding='utf-8') as source:
                with open(output_file, 'w', newline='', encoding='utf-8') as target:
                    target.write(source.read())
            
            print(f"Attendance exported to {output_file}")
            return output_file
            
        except Exception as e:
            print(f"Error exporting attendance: {e}")
            return None
