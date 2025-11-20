#!/usr/bin/env python3
"""
Doctor Attendance System - Main Runner
"""

import sys
import os

# Add face_attendance to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'face_attendance'))

from run import main

if __name__ == "__main__":
    main()
