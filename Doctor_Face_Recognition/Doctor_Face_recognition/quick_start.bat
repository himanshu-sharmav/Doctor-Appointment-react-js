@echo off
echo ========================================
echo Doctor Attendance System - Quick Start
echo ========================================
echo.

echo Step 1: Setting up virtual environment...
if not exist ".venv" (
    python -m venv .venv
    echo Virtual environment created.
) else (
    echo Virtual environment already exists.
)

echo.
echo Step 2: Activating virtual environment...
call .venv\Scripts\activate

echo.
echo Step 3: Installing dependencies...
pip install -r requirements.txt

echo.
echo Step 4: Creating .env file...
if not exist ".env" (
    copy config.env .env
    echo .env file created from config.env
) else (
    echo .env file already exists
)

echo.
echo Step 5: Generating face embeddings...
python embed.py

echo.
echo Step 6: Starting attendance system...
echo Press any key to start the webcam attendance system...
pause >nul
python run.py

pause
