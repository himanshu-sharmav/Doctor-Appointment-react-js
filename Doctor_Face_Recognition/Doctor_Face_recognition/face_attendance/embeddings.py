"""
Face embedding generation and management using face-recognition library
"""

import os
import json
import numpy as np
import face_recognition
from tqdm import tqdm
import cv2
from config import Config

class EmbeddingManager:
    """Manages face embeddings for the dataset"""
    
    def __init__(self):
        self.config = Config()
        self.embeddings = {}
        self.metadata = {}
        
    def extract_doctor_info(self, folder_name):
        """Extract doctor information from folder name"""
        # Format: D101_Dr_Saksham_Cardiologist
        parts = folder_name.split('_')
        if len(parts) >= 4:
            doctor_id = parts[0]
            name = '_'.join(parts[1:3])  # Dr_Saksham
            doctor_type = '_'.join(parts[3:])  # Cardiologist
            return doctor_id, name, doctor_type
        return None, None, None
    
    def load_image(self, image_path):
        """Load and preprocess image"""
        try:
            # Load image using face_recognition (RGB format)
            image = face_recognition.load_image_file(image_path)
            if image is None:
                return None
            return image
        except Exception as e:
            print(f"Error loading image {image_path}: {e}")
            return None
    
    def generate_embeddings(self, data_dir=None):
        """Generate embeddings for all images in the dataset"""
        if data_dir is None:
            data_dir = self.config.DATA_DIR
            
        print(f"Generating embeddings from: {data_dir}")
        
        # Clear existing data
        self.embeddings = {}
        self.metadata = {}
        
        # Process each doctor folder
        for folder_name in os.listdir(data_dir):
            folder_path = os.path.join(data_dir, folder_name)
            if not os.path.isdir(folder_path):
                continue
                
            doctor_id, name, doctor_type = self.extract_doctor_info(folder_name)
            if not doctor_id:
                print(f"Skipping invalid folder: {folder_name}")
                continue
                
            print(f"Processing {folder_name}...")
            
            # Process images in the folder
            image_files = [f for f in os.listdir(folder_path) 
                          if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            
            folder_embeddings = []
            
            for img_file in tqdm(image_files, desc=f"Processing {folder_name}"):
                img_path = os.path.join(folder_path, img_file)
                img = self.load_image(img_path)
                
                if img is None:
                    continue
                    
                try:
                    # Generate embedding using face_recognition
                    face_encodings = face_recognition.face_encodings(img)
                    
                    if face_encodings:
                        # Use the first face found
                        folder_embeddings.append(face_encodings[0])
                        
                except Exception as e:
                    print(f"Error generating embedding for {img_path}: {e}")
                    continue
            
            if folder_embeddings:
                # Store average embedding for the doctor
                avg_embedding = np.mean(folder_embeddings, axis=0)
                self.embeddings[doctor_id] = avg_embedding
                
                self.metadata[doctor_id] = {
                    'name': name,
                    'type': doctor_type,
                    'folder': folder_name,
                    'image_count': len(folder_embeddings)
                }
                
                print(f"Generated embedding for {doctor_id}: {name} ({doctor_type})")
        
        return len(self.embeddings)
    
    def save_embeddings(self):
        """Save embeddings and metadata to files"""
        if not self.embeddings:
            print("No embeddings to save")
            return False
            
        try:
            # Save embeddings as numpy array
            embedding_matrix = np.array(list(self.embeddings.values()))
            np.savez_compressed(
                self.config.EMB_PATH,
                embeddings=embedding_matrix,
                doctor_ids=list(self.embeddings.keys())
            )
            
            # Save metadata as JSON
            with open(self.config.META_PATH, 'w') as f:
                json.dump(self.metadata, f, indent=2)
                
            print(f"Saved {len(self.embeddings)} embeddings to {self.config.EMB_PATH}")
            print(f"Saved metadata to {self.config.META_PATH}")
            return True
            
        except Exception as e:
            print(f"Error saving embeddings: {e}")
            return False
    
    def load_embeddings(self):
        """Load embeddings and metadata from files"""
        try:
            if not os.path.exists(self.config.EMB_PATH):
                print("Embeddings file not found")
                return False
                
            # Load embeddings
            data = np.load(self.config.EMB_PATH)
            embedding_matrix = data['embeddings']
            doctor_ids = data['doctor_ids']
            
            # Reconstruct embeddings dictionary
            self.embeddings = {doctor_id: embedding_matrix[i] 
                              for i, doctor_id in enumerate(doctor_ids)}
            
            # Load metadata
            if os.path.exists(self.config.META_PATH):
                with open(self.config.META_PATH, 'r') as f:
                    self.metadata = json.load(f)
                    
            print(f"Loaded {len(self.embeddings)} embeddings")
            return True
            
        except Exception as e:
            print(f"Error loading embeddings: {e}")
            return False
    
    def get_embedding(self, doctor_id):
        """Get embedding for a specific doctor"""
        return self.embeddings.get(doctor_id)
    
    def get_metadata(self, doctor_id):
        """Get metadata for a specific doctor"""
        return self.metadata.get(doctor_id)
    
    def list_doctors(self):
        """List all available doctors"""
        return list(self.embeddings.keys())
