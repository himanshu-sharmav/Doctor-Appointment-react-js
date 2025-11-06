"""
Generate face embeddings from dataset
"""

import sys
import os
import argparse

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from embeddings import EmbeddingManager

def main():
    """Main function for embedding generation"""
    parser = argparse.ArgumentParser(description='Generate face embeddings from dataset')
    parser.add_argument('--data-dir', type=str, default=None,
                       help='Path to dataset directory (default: from config)')
    parser.add_argument('--force', action='store_true',
                       help='Force regeneration of embeddings')
    
    args = parser.parse_args()
    
    print("Doctor Face Recognition - Embedding Generator")
    print("=" * 50)
    
    # Initialize embedding manager
    embedding_manager = EmbeddingManager()
    
    # Check if embeddings already exist
    if os.path.exists(embedding_manager.config.EMB_PATH) and not args.force:
        print("Embeddings already exist!")
        print(f"Path: {embedding_manager.config.EMB_PATH}")
        
        response = input("Do you want to regenerate? (y/N): ").strip().lower()
        if response != 'y':
            print("Keeping existing embeddings.")
            return
    
    # Generate embeddings
    print(f"Generating embeddings from: {args.data_dir or embedding_manager.config.DATA_DIR}")
    
    try:
        count = embedding_manager.generate_embeddings(args.data_dir)
        
        if count > 0:
            # Save embeddings
            if embedding_manager.save_embeddings():
                print(f"\n✅ Successfully generated {count} doctor embeddings!")
                print(f"Embeddings saved to: {embedding_manager.config.EMB_PATH}")
                print(f"Metadata saved to: {embedding_manager.config.META_PATH}")
                
                # Show summary
                print("\nGenerated embeddings for:")
                for doctor_id, metadata in embedding_manager.metadata.items():
                    print(f"  {doctor_id}: {metadata['name']} ({metadata['type']})")
            else:
                print("❌ Failed to save embeddings!")
                return 1
        else:
            print("❌ No embeddings generated!")
            return 1
            
    except Exception as e:
        print(f"❌ Error during embedding generation: {e}")
        return 1
    
    print("\n🎉 Embedding generation complete!")
    print("You can now run the attendance system with: python run.py")
    
    return 0

if __name__ == "__main__":
    exit(main())
