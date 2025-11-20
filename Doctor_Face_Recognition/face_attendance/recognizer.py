"""
Face recognition and similarity matching using face-recognition library
"""

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import face_recognition
import cv2
from config import Config

class FaceRecognizer:
    """Handles face recognition and similarity matching"""
    
    def __init__(self, embedding_manager):
        self.config = Config()
        self.embedding_manager = embedding_manager
        
    def detect_faces(self, image):
        """Detect faces in the image using face_recognition"""
        try:
            # Convert BGR to RGB if needed
            if len(image.shape) == 3 and image.shape[2] == 3:
                rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            else:
                rgb_image = image
                
            # Detect faces
            face_locations = face_recognition.face_locations(rgb_image)
            
            # Convert to the format expected by the rest of the system
            faces = []
            for face_location in face_locations:
                top, right, bottom, left = face_location
                faces.append({
                    'facial_area': [left, top, right - left, bottom - top]
                })
            
            return faces
            
        except Exception as e:
            print(f"Error detecting faces: {e}")
            return []
    
    def get_face_embedding(self, image, face_region):
        """Extract embedding for a specific face region"""
        try:
            # Extract face region
            x, y, w, h = face_region['facial_area']
            face_img = image[y:y+h, x:x+w]
            
            # Convert to RGB for face_recognition
            if len(face_img.shape) == 3 and face_img.shape[2] == 3:
                face_img_rgb = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
            else:
                face_img_rgb = face_img
            
            # Generate embedding
            face_encodings = face_recognition.face_encodings(face_img_rgb)
            
            if face_encodings:
                return face_encodings[0]
            return None
            
        except Exception as e:
            print(f"Error extracting face embedding: {e}")
            return None
    
    def find_best_match(self, query_embedding):
        """Find the best matching doctor for a given embedding"""
        if not self.embedding_manager.embeddings:
            return None, 0.0
            
        best_match = None
        best_similarity = 0.0
        
        for doctor_id, stored_embedding in self.embedding_manager.embeddings.items():
            # Calculate cosine similarity
            similarity = cosine_similarity(
                [query_embedding], 
                [stored_embedding]
            )[0][0]
            
            if similarity > best_similarity:
                best_similarity = similarity
                best_match = doctor_id
        
        return best_match, best_similarity
    
    def recognize_face(self, image):
        """Recognize faces in the image and return matches"""
        # Detect faces
        faces = self.detect_faces(image)
        if not faces:
            return []
        
        results = []
        
        for face in faces:
            # Get face embedding
            embedding = self.get_face_embedding(image, face)
            if embedding is None:
                continue
                
            # Find best match
            doctor_id, similarity = self.find_best_match(embedding)
            
            if doctor_id and similarity >= self.config.THRESHOLD:
                metadata = self.embedding_manager.get_metadata(doctor_id)
                results.append({
                    'doctor_id': doctor_id,
                    'name': metadata['name'] if metadata else 'Unknown',
                    'type': metadata['type'] if metadata else 'Unknown',
                    'similarity': similarity,
                    'face_region': face['facial_area']
                })
        
        return results
    
    def verify_single_face(self, image_path):
        """Verify a single face image against the database"""
        try:
            # Load image using face_recognition
            image = face_recognition.load_image_file(image_path)
            if image is None:
                return None, "Could not load image"
            
            # Detect faces
            face_locations = face_recognition.face_locations(image)
            if not face_locations:
                return None, "No faces detected"
            
            if len(face_locations) > 1:
                return None, "Multiple faces detected, please use a single face image"
            
            # Get face embedding
            face_encodings = face_recognition.face_encodings(image, [face_locations[0]])
            if not face_encodings:
                return None, "Could not extract face features"
            
            embedding = face_encodings[0]
            
            # Find best match
            doctor_id, similarity = self.find_best_match(embedding)
            
            if doctor_id and similarity >= self.config.THRESHOLD:
                metadata = self.embedding_manager.get_metadata(doctor_id)
                return {
                    'doctor_id': doctor_id,
                    'name': metadata['name'] if metadata else 'Unknown',
                    'type': metadata['type'] if metadata else 'Unknown',
                    'similarity': similarity,
                    'confidence': 'High' if similarity > 0.8 else 'Medium' if similarity > 0.6 else 'Low'
                }, None
            else:
                return None, f"No match found (best similarity: {similarity:.3f})"
                
        except Exception as e:
            return None, f"Error during verification: {e}"
