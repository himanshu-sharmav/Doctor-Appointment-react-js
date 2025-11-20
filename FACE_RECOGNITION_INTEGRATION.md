# Face Recognition Integration Guide

## Overview

The Doctor Face Recognition system has been successfully integrated with the Doctor Appointment Management System. This integration enables automatic attendance tracking for doctors using facial recognition technology.

## System Architecture

```
┌─────────────────────┐
│  Face Recognition   │
│   (Python/OpenCV)   │
└──────────┬──────────┘
           │ HTTP POST
           ▼
┌─────────────────────┐
│   Backend API       │
│  (Node.js/Express)  │
└──────────┬──────────┘
           │ Database
           ▼
┌─────────────────────┐
│   PostgreSQL DB     │
│   (DoctorLog)       │
└──────────┬──────────┘
           │ Query
           ▼
┌─────────────────────┐
│   Frontend          │
│   (React.js)        │
└─────────────────────┘
```

## Features

✅ **Real-time Face Recognition**: Detects and recognizes doctors using webcam
✅ **Automatic Entry/Exit Tracking**: Marks doctor presence automatically
✅ **Backend Integration**: Sends attendance data to Node.js API
✅ **Database Storage**: Stores attendance logs in PostgreSQL
✅ **Photo Capture**: Saves photos for each attendance event
✅ **Cooldown Protection**: Prevents duplicate entries
✅ **Manual Override**: Keyboard controls for manual entry/exit

## API Endpoints

### 1. Mark Doctor Entry
```http
POST /api/v1/attendance/entry
Content-Type: application/json

{
  "doctor_id": "D101_Dr_Saksham_Cardiologist",
  "name": "Dr_Saksham",
  "type": "Cardiologist",
  "similarity": "0.95",
  "photo_path": "storage/photos/D101_entry_20241106_123000.jpg",
  "timestamp": "2024-11-06 12:30:00"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Doctor entry marked successfully",
  "data": {
    "id": "log-uuid",
    "doctorId": "doctor-uuid",
    "entryTime": "2024-11-06T12:30:00.000Z",
    "exitTime": null,
    "doctor": {
      "id": "doctor-uuid",
      "firstName": "Sarah",
      "lastName": "Johnson",
      "email": "sarah.johnson@example.com",
      "specialization": "Cardiologist"
    },
    "faceRecognition": {
      "similarity": "0.95",
      "photo_path": "storage/photos/D101_entry_20241106_123000.jpg",
      "recognized_as": "Dr_Saksham",
      "type": "Cardiologist"
    }
  }
}
```

### 2. Mark Doctor Exit
```http
POST /api/v1/attendance/exit
Content-Type: application/json

{
  "doctor_id": "D101_Dr_Saksham_Cardiologist",
  "name": "Dr_Saksham",
  "type": "Cardiologist",
  "similarity": "0.93",
  "photo_path": "storage/photos/D101_exit_20241106_180000.jpg",
  "timestamp": "2024-11-06 18:00:00"
}
```

### 3. Get Doctor Attendance Status
```http
GET /api/v1/attendance/status/:doctorId
```

### 4. Get Today's Attendance
```http
GET /api/v1/attendance/today
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 5,
      "present": 3,
      "absent": 2,
      "date": "2024-11-06"
    },
    "doctors": [
      {
        "doctor": {
          "id": "doctor-uuid",
          "firstName": "Sarah",
          "lastName": "Johnson",
          "specialization": "Cardiologist"
        },
        "status": "present",
        "isPresent": true,
        "currentEntry": {
          "entryTime": "2024-11-06T09:00:00.000Z"
        },
        "totalTimeToday": "180 minutes"
      }
    ]
  }
}
```

### 5. Get Doctor Attendance History
```http
GET /api/v1/attendance/history/:doctorId?startDate=2024-11-01&endDate=2024-11-06&limit=30
```

## Running the System

### Prerequisites

1. **Backend Running**: Ensure the Node.js backend is running on port 5050
2. **Database Setup**: PostgreSQL database with DoctorLog table
3. **Python Environment**: Python 3.8+ with required packages installed

### Step 1: Start Backend (Already Running)
```bash
cd api
npm run dev
```
Backend should be running on: http://localhost:5050

### Step 2: Start Face Recognition System
```bash
cd Doctor_Face_Recognition
source ../Hospital_Scheduling_With_AI/venv/bin/activate
python run.py
```

### Step 3: Use the System

**Keyboard Controls:**
- **Q**: Quit the system
- **E**: Force EXIT mode
- **I**: Force ENTRY mode

**Automatic Detection:**
- When a doctor's face is detected, the system automatically:
  1. Recognizes the doctor
  2. Determines if it's an ENTRY or EXIT event
  3. Sends data to the backend API
  4. Saves a photo of the event
  5. Updates the database

## Doctor Dataset

The system recognizes the following doctors:

| Doctor ID | Name | Specialization |
|-----------|------|----------------|
| D101 | Dr. Saksham | Cardiologist |
| D102 | Dr. Himanshu | Dermatologist |
| D103 | Dr. Gungun | Surgeon |
| D104 | Dr. Sakshi | Pediatrician |

### Adding New Doctors

1. Create a folder in `Doctor_Face_Recognition/Dataset_image/`:
   ```
   D105_Dr_NewDoctor_Specialization/
   ```

2. Add doctor photos (at least 2-3 clear face photos):
   ```
   D105_Dr_NewDoctor_Specialization/
     ├── 1.jpg
     ├── 2.jpg
     └── 3.jpg
   ```

3. Regenerate embeddings:
   ```bash
   cd Doctor_Face_Recognition
   python embed.py
   ```

4. Add the doctor to the database (match the ID pattern)

## Configuration

### Face Recognition Settings (`Doctor_Face_Recognition/.env`)

```env
# Face Recognition Settings
THRESHOLD=0.6                    # Recognition threshold (0.0-1.0)

# Camera Settings
CAM_INDEX=0                      # Camera index (0 for default webcam)

# API Settings
API_URL=http://localhost:5050/api/v1/attendance
API_TOKEN=                       # Optional: Add if using authentication

# File Paths
DATA_DIR=./Dataset_image
EMB_PATH=./storage/embeddings.npz
META_PATH=./storage/meta.json
ATT_CSV=./storage/attendance.csv
ATT_JSONL=./storage/attendance.jsonl
PHOTO_DIR=./storage/photos
```

### Adjusting Recognition Accuracy

- **Lower THRESHOLD (e.g., 0.4)**: More sensitive, may have false positives
- **Higher THRESHOLD (e.g., 0.7)**: More strict, may miss some recognitions
- **Recommended**: 0.5-0.6 for balanced accuracy

## Database Schema

### DoctorLog Table

```prisma
model DoctorLog {
  id        String   @id @default(uuid())
  doctorId  String
  doctor    Doctor   @relation(fields: [doctorId], references: [id])
  entryTime DateTime @default(now())
  exitTime  DateTime?
}
```

## Output Files

The face recognition system generates:

1. **CSV File**: `storage/attendance.csv` - Tabular attendance data
2. **JSONL File**: `storage/attendance.jsonl` - JSON records
3. **Photos**: `storage/photos/` - Captured photos for each event
4. **Embeddings**: `storage/embeddings.npz` - Face embeddings
5. **Metadata**: `storage/meta.json` - Doctor metadata

## Troubleshooting

### Camera Not Working
```bash
# Check available cameras
ls /dev/video*

# Try different camera index in .env
CAM_INDEX=1
```

### No Faces Detected
- Ensure good lighting
- Face should be clearly visible
- Camera should be at eye level
- Remove glasses/masks if possible

### Low Recognition Accuracy
- Add more photos to the dataset (3-5 photos per doctor)
- Ensure photos are clear and well-lit
- Adjust THRESHOLD in .env file
- Regenerate embeddings after adding photos

### API Connection Failed
- Verify backend is running: `curl http://localhost:5050/api/v1/attendance/today`
- Check API_URL in .env file
- Check backend logs for errors

### Doctor Not Found in Database
- Ensure doctor exists in the database
- Check doctor ID mapping in the backend
- The system extracts "D101" from "D101_Dr_Saksham_Cardiologist"
- Update the controller if your doctor IDs follow a different pattern

## Frontend Integration (Next Steps)

To display attendance status in the frontend:

1. **Create Attendance Dashboard Component**
2. **Add Real-time Updates** (WebSocket or polling)
3. **Display Doctor Presence Status**
4. **Show Attendance History**
5. **Add Attendance Reports**

Example API call from frontend:
```javascript
// Get today's attendance
const response = await fetch('http://localhost:5050/api/v1/attendance/today');
const data = await response.json();

// Display present/absent doctors
data.data.doctors.forEach(doctor => {
  console.log(`${doctor.doctor.firstName}: ${doctor.status}`);
});
```

## Security Considerations

1. **API Authentication**: Add JWT token authentication for production
2. **Photo Storage**: Store photos securely, consider cloud storage
3. **Privacy**: Comply with data protection regulations
4. **Access Control**: Restrict attendance endpoints to authorized users
5. **Data Retention**: Implement photo cleanup policy

## Performance Tips

1. **GPU Acceleration**: Use GPU for faster face recognition
2. **Reduce Resolution**: Lower camera resolution for better performance
3. **Cooldown Time**: Adjust cooldown to prevent spam detection
4. **Batch Processing**: Process multiple faces in parallel

## System Status

✅ **Backend API**: Running on port 5050
✅ **ML Service**: Running on port 8000
✅ **Frontend**: Running on port 3000
✅ **Face Recognition**: Ready to start
✅ **Database**: PostgreSQL configured
✅ **Embeddings**: Generated for 4 doctors

## Quick Start Commands

```bash
# Terminal 1: Backend (Already Running)
cd api && npm run dev

# Terminal 2: ML Service (Already Running)
cd Hospital_Scheduling_With_AI/Hospital_AI_System_Production
../venv/bin/python start_system.py

# Terminal 3: Frontend (Already Running)
npm start

# Terminal 4: Face Recognition (NEW)
cd Doctor_Face_Recognition
source ../Hospital_Scheduling_With_AI/venv/bin/activate
python run.py
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs: `api/logs/`
3. Check face recognition logs in terminal
4. Verify database connections

---

**Integration Complete! 🎉**

The face recognition system is now fully integrated with your Doctor Appointment Management System. Doctors can now be automatically tracked when they enter or exit the facility.
