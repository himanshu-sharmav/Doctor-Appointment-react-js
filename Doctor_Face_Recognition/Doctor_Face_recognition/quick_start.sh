#!/bin/bash

echo "========================================"
echo "Doctor Attendance System - Quick Start"
echo "========================================"
echo

echo "Step 1: Setting up virtual environment..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

echo
echo "Step 2: Activating virtual environment..."
source .venv/bin/activate

echo
echo "Step 3: Installing dependencies..."
pip install -r requirements.txt

echo
echo "Step 4: Creating .env file..."
if [ ! -f ".env" ]; then
    cp config.env .env
    echo ".env file created from config.env"
else
    echo ".env file already exists"
fi

echo
echo "Step 5: Generating face embeddings..."
python embed.py

echo
echo "Step 6: Starting attendance system..."
echo "Press Enter to start the webcam attendance system..."
read
python run.py
