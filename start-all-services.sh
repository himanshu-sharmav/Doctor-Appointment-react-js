#!/bin/bash

# Complete Doctor Appointment System Startup Script
# This script starts all four components of the system

echo "🏥 =========================================="
echo "🏥  Doctor Appointment Management System"
echo "🏥  Complete System Startup"
echo "🏥 =========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "${YELLOW}⚠️  Port $1 is already in use${NC}"
        return 1
    else
        return 0
    fi
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=0
    
    echo -e "${BLUE}⏳ Waiting for $name to be ready...${NC}"
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name is ready!${NC}"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    echo -e "${RED}❌ $name failed to start${NC}"
    return 1
}

echo "📋 Pre-flight checks..."
echo ""

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Starting...${NC}"
    brew services start postgresql@17
    sleep 3
fi

# Check ports
echo "🔍 Checking ports..."
check_port 3000 || echo "   Frontend port 3000"
check_port 5050 || echo "   Backend port 5050"
check_port 8000 || echo "   ML Service port 8000"
echo ""

# Create log directory
mkdir -p logs

echo "🚀 Starting services..."
echo ""

# 1. Start Backend API
echo -e "${BLUE}1️⃣  Starting Backend API (Node.js)...${NC}"
cd api
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "   PID: $BACKEND_PID"
echo "   Logs: logs/backend.log"
cd ..
sleep 3

# 2. Start ML Service
echo -e "${BLUE}2️⃣  Starting Hospital AI Scheduler (Python)...${NC}"
cd Hospital_Scheduling_With_AI/Hospital_AI_System_Production
source ../venv/bin/activate
python start_system.py > ../../logs/ml-service.log 2>&1 &
ML_PID=$!
echo "   PID: $ML_PID"
echo "   Logs: logs/ml-service.log"
cd ../..
sleep 5

# 3. Start Frontend
echo -e "${BLUE}3️⃣  Starting Frontend (React)...${NC}"
BROWSER=none npm start > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   PID: $FRONTEND_PID"
echo "   Logs: logs/frontend.log"
sleep 5

# 4. Start Face Recognition
echo -e "${BLUE}4️⃣  Starting Face Recognition System (Python)...${NC}"
cd Doctor_Face_Recognition
source ../Hospital_Scheduling_With_AI/venv/bin/activate
python run.py > ../logs/face-recognition.log 2>&1 &
FACE_PID=$!
echo "   PID: $FACE_PID"
echo "   Logs: logs/face-recognition.log"
cd ..
sleep 3

echo ""
echo "⏳ Waiting for services to be ready..."
echo ""

# Wait for services
wait_for_service "http://localhost:5050" "Backend API"
wait_for_service "http://localhost:8000/health" "ML Service"
wait_for_service "http://localhost:3000" "Frontend"

echo ""
echo "🎉 =========================================="
echo "🎉  All 4 Services Started Successfully!"
echo "🎉 =========================================="
echo ""
echo "📊 Service Status:"
echo ""
echo -e "${GREEN}✅ Backend API${NC}"
echo "   URL: http://localhost:5050"
echo "   API Docs: http://localhost:5050/api/v1"
echo "   PID: $BACKEND_PID"
echo ""
echo -e "${GREEN}✅ Hospital AI Scheduler${NC}"
echo "   URL: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Health: http://localhost:8000/health"
echo "   PID: $ML_PID"
echo ""
echo -e "${GREEN}✅ Frontend${NC}"
echo "   URL: http://localhost:3000"
echo "   PID: $FRONTEND_PID"
echo ""
echo -e "${GREEN}✅ Face Recognition System${NC}"
echo "   Status: Monitoring webcam"
echo "   Controls: Q=Quit, E=Exit mode, I=Entry mode"
echo "   PID: $FACE_PID"
echo ""
echo "📝 Default Login Credentials:"
echo ""
echo "   Admin:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "   Doctor:"
echo "   Email: sarah.johnson@example.com"
echo "   Password: doctor123"
echo ""
echo "   Patient:"
echo "   Email: john.smith@example.com"
echo "   Password: patient123"
echo ""
echo "🎥 Face Recognition Doctors:"
echo "   D101: Dr. Saksham (Cardiologist)"
echo "   D102: Dr. Himanshu (Dermatologist)"
echo "   D103: Dr. Gungun (Surgeon)"
echo "   D104: Dr. Sakshi (Pediatrician)"
echo ""
echo "📋 Process IDs saved to: logs/pids.txt"
echo "$BACKEND_PID" > logs/pids.txt
echo "$ML_PID" >> logs/pids.txt
echo "$FRONTEND_PID" >> logs/pids.txt
echo "$FACE_PID" >> logs/pids.txt
echo ""
echo "🛑 To stop all services, run: ./stop-all-services.sh"
echo ""
echo "📊 View logs:"
echo "   Backend: tail -f logs/backend.log"
echo "   ML Service: tail -f logs/ml-service.log"
echo "   Frontend: tail -f logs/frontend.log"
echo "   Face Recognition: tail -f logs/face-recognition.log"
echo ""
echo "🌐 Opening browser..."
sleep 2
open http://localhost:3000

echo ""
echo "✨ All 4 services are ready! Press Ctrl+C to stop monitoring..."
echo ""

# Monitor processes
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend API stopped unexpectedly${NC}"
        break
    fi
    if ! kill -0 $ML_PID 2>/dev/null; then
        echo -e "${RED}❌ ML Service stopped unexpectedly${NC}"
        break
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend stopped unexpectedly${NC}"
        break
    fi
    if ! kill -0 $FACE_PID 2>/dev/null; then
        echo -e "${RED}❌ Face Recognition stopped unexpectedly${NC}"
        break
    fi
    sleep 5
done

echo ""
echo "⚠️  A service has stopped. Check logs for details."
echo "   Run ./stop-all-services.sh to clean up remaining processes"
