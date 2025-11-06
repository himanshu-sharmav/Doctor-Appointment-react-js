#!/usr/bin/env python3
"""
Setup script for Doctor Attendance System
"""

import os
import shutil
import subprocess
import sys

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e}")
        if e.stdout:
            print(f"STDOUT: {e.stdout}")
        if e.stderr:
            print(f"STDERR: {e.stderr}")
        return False

def create_env_file():
    """Create .env file from config.env"""
    if not os.path.exists('.env') and os.path.exists('config.env'):
        print("📝 Creating .env file from config.env...")
        shutil.copy('config.env', '.env')
        print("✅ .env file created successfully")
        print("💡 You can now edit .env file to customize settings")
    elif os.path.exists('.env'):
        print("✅ .env file already exists")
    else:
        print("⚠️  config.env not found, please create .env file manually")

def main():
    """Main setup function"""
    print("🚀 Doctor Attendance System Setup")
    print("=" * 50)
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        return 1
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    
    # Create virtual environment
    if not os.path.exists('.venv'):
        if not run_command("python -m venv .venv", "Creating virtual environment"):
            return 1
    else:
        print("✅ Virtual environment already exists")
    
    # Activate virtual environment and install requirements
    if os.name == 'nt':  # Windows
        activate_cmd = ".venv\\Scripts\\activate"
        pip_cmd = ".venv\\Scripts\\pip"
    else:  # Linux/Mac
        activate_cmd = "source .venv/bin/activate"
        pip_cmd = ".venv/bin/pip"
    
    # Install requirements
    if os.path.exists('requirements.txt'):
        if not run_command(f"{pip_cmd} install -r requirements.txt", "Installing dependencies"):
            return 1
    else:
        print("⚠️  requirements.txt not found")
    
    # Create .env file
    create_env_file()
    
    # Create storage directories
    print("📁 Creating storage directories...")
    os.makedirs('storage/photos', exist_ok=True)
    print("✅ Storage directories created")
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Activate virtual environment:")
    if os.name == 'nt':
        print("   .venv\\Scripts\\activate")
    else:
        print("   source .venv/bin/activate")
    print("2. Generate embeddings: python embed.py")
    print("3. Run attendance system: python run.py")
    
    return 0

if __name__ == "__main__":
    exit(main())
