"""
Attendance tracking and state management
"""

import time
from datetime import datetime
from config import Config

class AttendanceTracker:
    """Tracks attendance state and prevents duplicate entries"""
    
    def __init__(self):
        self.config = Config()
        self.last_seen = {}  # doctor_id -> timestamp
        self.current_status = {}  # doctor_id -> 'entry' or 'exit'
        
    def can_record_event(self, doctor_id, event_type):
        """Check if we can record an event for a doctor"""
        current_time = time.time()
        
        # Check cooldown
        if doctor_id in self.last_seen:
            time_since_last = current_time - self.last_seen[doctor_id]
            if time_since_last < self.config.COOLDOWN_TIME:
                return False, f"Cooldown active ({self.config.COOLDOWN_TIME - time_since_last:.1f}s remaining)"
        
        # Check if event makes sense
        if doctor_id in self.current_status:
            current_status = self.current_status[doctor_id]
            if event_type == current_status:
                return False, f"Doctor already marked as {event_type}"
        
        return True, "OK"
    
    def record_event(self, doctor_id, event_type):
        """Record an attendance event"""
        current_time = time.time()
        
        # Update tracking
        self.last_seen[doctor_id] = current_time
        self.current_status[doctor_id] = event_type
        
        return True
    
    def get_current_status(self, doctor_id):
        """Get current status of a doctor"""
        return self.current_status.get(doctor_id, 'unknown')
    
    def reset_status(self, doctor_id):
        """Reset status for a doctor (for manual override)"""
        if doctor_id in self.current_status:
            del self.current_status[doctor_id]
        if doctor_id in self.last_seen:
            del self.last_seen[doctor_id]
    
    def get_all_statuses(self):
        """Get status of all tracked doctors"""
        return self.current_status.copy()
    
    def clear_all(self):
        """Clear all tracking data"""
        self.last_seen.clear()
        self.current_status.clear()
