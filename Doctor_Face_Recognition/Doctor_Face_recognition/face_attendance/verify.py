"""
Verify single face image against database
"""

import sys
import os
import argparse

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from embeddings import EmbeddingManager
from recognizer import FaceRecognizer

def main():
    """Main function for single image verification"""
    parser = argparse.ArgumentParser(description='Verify single face image against database')
    parser.add_argument('--image', type=str, required=True,
                       help='Path to image file to verify')
    parser.add_argument('--threshold', type=float, default=None,
                       help='Similarity threshold (default: from config)')
    
    args = parser.parse_args()
    
    # Check if image exists
    if not os.path.exists(args.image):
        print(f"❌ Image file not found: {args.image}")
        return 1
    
    print("Doctor Face Recognition - Single Image Verification")
    print("=" * 50)
    
    # Initialize components
    embedding_manager = EmbeddingManager()
    recognizer = FaceRecognizer(embedding_manager)
    
    # Load embeddings
    if not embedding_manager.load_embeddings():
        print("❌ No embeddings found. Please run 'python embed.py' first.")
        return 1
    
    print(f"✅ Loaded {len(embedding_manager.embeddings)} doctor embeddings")
    print(f"🔍 Verifying image: {args.image}")
    
    # Override threshold if specified
    if args.threshold is not None:
        recognizer.config.THRESHOLD = args.threshold
        print(f"📊 Using custom threshold: {args.threshold}")
    else:
        print(f"📊 Using default threshold: {recognizer.config.THRESHOLD}")
    
    # Verify image
    try:
        result, error = recognizer.verify_single_face(args.image)
        
        if result:
            print(f"\n✅ VERIFICATION SUCCESSFUL!")
            print(f"Doctor ID: {result['doctor_id']}")
            print(f"Name: {result['name']}")
            print(f"Type: {result['type']}")
            print(f"Similarity: {result['similarity']:.3f}")
            print(f"Confidence: {result['confidence']}")
            
            # Show threshold comparison
            threshold = recognizer.config.THRESHOLD
            if result['similarity'] >= threshold:
                print(f"✅ Above threshold ({threshold})")
            else:
                print(f"⚠️  Below threshold ({threshold})")
                
        else:
            print(f"\n❌ VERIFICATION FAILED!")
            print(f"Error: {error}")
            
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
