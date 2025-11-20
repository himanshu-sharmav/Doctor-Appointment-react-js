#!/bin/bash

# Stop all services script

echo "🛑 Stopping all services..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Read PIDs from file if it exists
if [ -f logs/pids.txt ]; then
    echo "📋 Reading process IDs from logs/pids.txt..."
    PIDS=$(cat logs/pids.txt)
    
    for PID in $PIDS; do
        if kill -0 $PID 2>/dev/null; then
            echo -e "${YELLOW}Stopping process $PID...${NC}"
            kill $PID
            sleep 1
            # Force kill if still running
            if kill -0 $PID 2>/dev/null; then
                echo -e "${RED}Force killing process $PID...${NC}"
                kill -9 $PID
            fi
            echo -e "${GREEN}✅ Process $PID stopped${NC}"
        else
            echo -e "${YELLOW}⚠️  Process $PID not running${NC}"
        fi
    done
    
    rm logs/pids.txt
else
    echo "⚠️  No PID file found. Searching for processes..."
fi

# Kill any remaining node processes on ports
echo ""
echo "🔍 Checking for processes on ports..."

# Port 3000 (Frontend)
PORT_3000_PID=$(lsof -ti:3000)
if [ ! -z "$PORT_3000_PID" ]; then
    echo -e "${YELLOW}Killing process on port 3000 (PID: $PORT_3000_PID)${NC}"
    kill -9 $PORT_3000_PID
fi

# Port 5050 (Backend)
PORT_5050_PID=$(lsof -ti:5050)
if [ ! -z "$PORT_5050_PID" ]; then
    echo -e "${YELLOW}Killing process on port 5050 (PID: $PORT_5050_PID)${NC}"
    kill -9 $PORT_5050_PID
fi

# Port 8000 (ML Service)
PORT_8000_PID=$(lsof -ti:8000)
if [ ! -z "$PORT_8000_PID" ]; then
    echo -e "${YELLOW}Killing process on port 8000 (PID: $PORT_8000_PID)${NC}"
    kill -9 $PORT_8000_PID
fi

echo ""
echo -e "${GREEN}✅ All services stopped${NC}"
echo ""
echo "📋 Logs are preserved in logs/ directory"
echo "   To view: tail -f logs/backend.log"
echo ""
