"""
Camera handling and video processing
"""

import cv2
import numpy as np
from config import Config

class CameraManager:
    """Manages camera operations and video processing"""
    
    def __init__(self):
        self.config = Config()
        self.cap = None
        self.is_open = False
        
    def open_camera(self, camera_index=None):
        """Open camera"""
        if camera_index is None:
            camera_index = self.config.CAM_INDEX
            
        try:
            self.cap = cv2.VideoCapture(camera_index)
            if not self.cap.isOpened():
                raise Exception(f"Could not open camera {camera_index}")
                
            self.is_open = True
            print(f"Camera opened successfully (index: {camera_index})")
            return True
            
        except Exception as e:
            print(f"Error opening camera: {e}")
            return False
    
    def close_camera(self):
        """Close camera"""
        if self.cap:
            self.cap.release()
        self.is_open = False
        cv2.destroyAllWindows()
    
    def read_frame(self):
        """Read a frame from camera"""
        if not self.is_open or not self.cap:
            return None
            
        ret, frame = self.cap.read()
        if not ret:
            return None
            
        return frame
    
    def get_frame_size(self):
        """Get current frame dimensions"""
        if not self.is_open or not self.cap:
            return None
            
        width = int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        return width, height
    
    def set_frame_size(self, width, height):
        """Set frame dimensions"""
        if not self.is_open or not self.cap:
            return False
            
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)
        return True
    
    def draw_face_boxes(self, frame, face_results):
        """Draw bounding boxes around detected faces"""
        if not face_results:
            return frame
            
        for result in face_results:
            x, y, w, h = result['face_region']
            
            # Draw rectangle
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Draw label
            label = f"{result['name']} ({result['similarity']:.2f})"
            cv2.putText(frame, label, (x, y - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        
        return frame
    
    def draw_status_info(self, frame, status_text, color=(255, 255, 255)):
        """Draw status information on frame"""
        cv2.putText(frame, status_text, (10, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
    
    def draw_instructions(self, frame):
        """Draw keyboard instructions on frame"""
        instructions = [
            "Press 'E' for EXIT",
            "Press 'I' for ENTRY", 
            "Press 'Q' to quit"
        ]
        
        y_offset = frame.shape[0] - 100
        for i, instruction in enumerate(instructions):
            y = y_offset + (i * 25)
            cv2.putText(frame, instruction, (10, y), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    def capture_snapshot(self):
        """Capture a single snapshot"""
        if not self.is_open or not self.cap:
            return None
            
        ret, frame = self.cap.read()
        if not ret:
            return None
            
        return frame.copy()
    
    def is_camera_available(self, camera_index=None):
        """Check if camera is available"""
        if camera_index is None:
            camera_index = self.config.CAM_INDEX
            
        cap = cv2.VideoCapture(camera_index)
        if cap.isOpened():
            cap.release()
            return True
        return False
    
    def list_available_cameras(self, max_cameras=5):
        """List available camera indices"""
        available_cameras = []
        
        for i in range(max_cameras):
            cap = cv2.VideoCapture(i)
            if cap.isOpened():
                available_cameras.append(i)
                cap.release()
        
        return available_cameras
