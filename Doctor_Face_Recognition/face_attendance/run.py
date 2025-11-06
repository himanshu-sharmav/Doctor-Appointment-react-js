"""
Main attendance system runner
"""

import sys
import os
import time
import cv2
from datetime import datetime

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config import Config
from embeddings import EmbeddingManager
from recognizer import FaceRecognizer
from tracker import AttendanceTracker
from attendance import AttendanceManager
from api_client import APIClient
from camera import CameraManager

class AttendanceSystem:
    """Main attendance system class"""
    
    def __init__(self):
        self.config = Config()
        self.config.validate()
        
        # Initialize components
        self.embedding_manager = EmbeddingManager()
        self.recognizer = FaceRecognizer(self.embedding_manager)
        self.tracker = AttendanceTracker()
        self.attendance_manager = AttendanceManager()
        self.api_client = APIClient()
        self.camera_manager = CameraManager()
        
        # State variables
        self.running = False
        self.last_recognition_time = {}
        
    def initialize(self):
        """Initialize the system"""
        print("Initializing Doctor Attendance System...")
        
        # Load embeddings
        if not self.embedding_manager.load_embeddings():
            print("No embeddings found. Please run 'python embed.py' first.")
            return False
        
        print(f"Loaded {len(self.embedding_manager.embeddings)} doctor embeddings")
        
        # Test camera
        if not self.camera_manager.open_camera():
            print("Failed to open camera")
            return False
        
        # Test API connection if configured
        if self.api_client.is_configured():
            success, message = self.api_client.test_connection()
            print(f"API connection: {message}")
        
        print("System initialized successfully!")
        return True
    
    def process_frame(self, frame):
        """Process a single frame for face recognition"""
        # Recognize faces
        face_results = self.recognizer.recognize_face(frame)
        
        if not face_results:
            return frame
        
        # Process each recognized face
        for result in face_results:
            doctor_id = result['doctor_id']
            current_time = time.time()
            
            # Check cooldown
            if doctor_id in self.last_recognition_time:
                time_since_last = current_time - self.last_recognition_time[doctor_id]
                if time_since_last < self.config.COOLDOWN_TIME:
                    continue
            
            # Determine event type based on current status
            current_status = self.tracker.get_current_status(doctor_id)
            if current_status == 'unknown' or current_status == 'exit':
                event_type = 'entry'
            else:
                event_type = 'exit'
            
            # Check if we can record this event
            can_record, message = self.tracker.can_record_event(doctor_id, event_type)
            if not can_record:
                continue
            
            # Record attendance
            record = self.attendance_manager.record_attendance(
                doctor_id=doctor_id,
                name=result['name'],
                doctor_type=result['type'],
                event_type=event_type,
                similarity=result['similarity'],
                image=frame
            )
            
            # Update tracker
            self.tracker.record_event(doctor_id, event_type)
            self.last_recognition_time[doctor_id] = current_time
            
            # Send to API if configured
            if self.api_client.is_configured():
                success, api_message = self.api_client.send_attendance_event(record)
                if not success:
                    print(f"API error: {api_message}")
            
            # Print attendance record
            print(f"\n{'='*50}")
            print(f"ATTENDANCE RECORDED: {event_type.upper()}")
            print(f"Doctor: {result['name']} ({doctor_id})")
            print(f"Type: {result['type']}")
            print(f"Time: {record['timestamp']}")
            print(f"Similarity: {result['similarity']:.3f}")
            print(f"Photo: {record['photo_path']}")
            print(f"{'='*50}\n")
        
        return frame
    
    def handle_keyboard_input(self, key):
        """Handle keyboard input for manual controls"""
        if key == ord('q') or key == ord('Q'):
            return 'quit'
        elif key == ord('e') or key == ord('E'):
            return 'force_exit'
        elif key == ord('i') or key == ord('I'):
            return 'force_entry'
        return None
    
    def run(self):
        """Main run loop"""
        if not self.initialize():
            return
        
        self.running = True
        print("\nStarting attendance system...")
        print("Press 'Q' to quit, 'E' for EXIT, 'I' for ENTRY")
        print("=" * 50)
        
        try:
            while self.running:
                # Read frame
                frame = self.camera_manager.read_frame()
                if frame is None:
                    continue
                
                # Process frame
                processed_frame = self.process_frame(frame)
                
                # Draw face boxes and status
                if processed_frame is not None:
                    # Get current status info
                    statuses = self.tracker.get_all_statuses()
                    status_text = f"Active: {len(statuses)} doctors | Time: {datetime.now().strftime('%H:%M:%S')}"
                    
                    # Draw on frame
                    self.camera_manager.draw_face_boxes(processed_frame, [])
                    self.camera_manager.draw_status_info(processed_frame, status_text)
                    self.camera_manager.draw_instructions(processed_frame)
                    
                    # Show frame
                    cv2.imshow('Doctor Attendance System', processed_frame)
                
                # Handle keyboard input
                key = cv2.waitKey(1) & 0xFF
                if key != 255:
                    action = self.handle_keyboard_input(key)
                    if action == 'quit':
                        break
                    elif action == 'force_exit':
                        print("Manual EXIT mode activated")
                    elif action == 'force_entry':
                        print("Manual ENTRY mode activated")
                
                # Small delay
                time.sleep(0.03)
                
        except KeyboardInterrupt:
            print("\nInterrupted by user")
        except Exception as e:
            print(f"Error in main loop: {e}")
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Clean up resources"""
        print("\nCleaning up...")
        self.running = False
        self.camera_manager.close_camera()
        print("System shutdown complete")

def main():
    """Main entry point"""
    system = AttendanceSystem()
    system.run()

if __name__ == "__main__":
    main()
