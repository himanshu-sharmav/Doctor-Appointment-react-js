#!/bin/bash

# Start ML Service for Hospital Queue Management
echo "🏥 Starting Hospital AI ML Service..."

# Activate virtual environment
source venv/bin/activate

# Set environment variables for OpenMP (required for LightGBM on macOS)
export LDFLAGS="-L/opt/homebrew/opt/libomp/lib"
export CPPFLAGS="-I/opt/homebrew/opt/libomp/include"
export PYTHONPATH="${PYTHONPATH}:$(pwd)"

# Start the FastAPI server
echo "🚀 Starting FastAPI server on http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "🔌 Queue endpoint: http://localhost:8000/allocate"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""

# Run the server
python api_services/main.py
