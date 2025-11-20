# Complete Doctor Appointment Management System

## 🏥 System Overview

This is a comprehensive, AI-powered hospital management system that integrates:

1. **Face Recognition Attendance System** (Python/OpenCV)
2. **Backend API** (Node.js/Express/TypeScript)
3. **Hospital AI Scheduler** (Python/FastAPI/ML)
4. **Frontend Application** (React.js)

## 🎯 Key Features

### ✅ Face Recognition Attendance
- Real-time doctor face detection and recognition
- Automatic entry/exit tracking
- Photo capture for each event
- Integration with backend API

### ✅ AI-Powered Scheduling
- ML-based no-show prediction
- Risk assessment (Low/Medium/High)
- Smart queue optimization
- Intelligent slot allocation
- Waitlist management

### ✅ Complete Hospital Management
- Patient registration and profiles
- Doctor management
- Appointment booking and tracking
- Prescription management
- Medical records
- Reviews and ratings
- Queue management

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+
- PostgreSQL
- Webcam (for face recognition)
- macOS/Linux (Windows with WSL)

### One-Command Startup

```bash
./start-all-services.sh
```

This will start:
- ✅ Backend API on http://localhost:5050
- ✅ ML Service on http://localhost:8000
- ✅ Frontend on http://localhost:3000

### Start Face Recognition (Optional)

In a new terminal:
```bash
cd Doctor_Face_Recognition
source ../Hospital_Scheduling_With_AI/venv/bin/activate
python run.py
```

### Stop All Services

```bash
./stop-all-services.sh
```

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACES                               │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (React) - Port 3000                                   │
│  - Patient Portal                                                │
│  - Doctor Dashboard                                              │
│  - Admin Panel                                                   │
│  - Attendance Monitor                                            │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST API
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Node.js/Express/TypeScript - Port 5050                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Auth Module  │  │ Appointment  │  │ Queue Module │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Attendance   │  │ Prescription │  │ Doctor/Patient│         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└────────────┬────────────────────────────────┬──────────────────┘
             │                                 │
             │ PostgreSQL                      │ HTTP
             ▼                                 ▼
┌─────────────────────┐         ┌─────────────────────────────────┐
│   DATABASE          │         │   ML SERVICE LAYER              │
├─────────────────────┤         ├─────────────────────────────────┤
│  PostgreSQL         │         │  Python/FastAPI - Port 8000     │
│  - Users/Auth       │         │  ┌────────────────────────────┐ │
│  - Doctors          │         │  │ No-Show Prediction Model   │ │
│  - Patients         │         │  └────────────────────────────┘ │
│  - Appointments     │         │  ┌────────────────────────────┐ │
│  - DoctorLog        │         │  │ Risk Assessment Engine     │ │
│  - PatientQueue     │         │  └────────────────────────────┘ │
│  - Prescriptions    │         │  ┌────────────────────────────┐ │
└─────────────────────┘         │  │ Queue Optimization         │ │
                                │  └────────────────────────────┘ │
                                └─────────────────────────────────┘
                                             ▲
                                             │ HTTP
┌─────────────────────────────────────────────┘
│   FACE RECOGNITION SYSTEM
├─────────────────────────────────────────────┐
│  Python/OpenCV/face_recognition              │
│  - Real-time face detection                  │
│  - Doctor recognition                        │
│  - Entry/Exit tracking                       │
│  - Photo capture                             │
└──────────────────────────────────────────────┘
```

## 🔄 Complete Integration Flow

### Scenario: Doctor Arrives → Patient Books → AI Optimizes

```
1. DOCTOR ARRIVES
   ├─ Face Recognition detects Dr. Saksham
   ├─ POST /api/v1/attendance/entry
   ├─ Backend creates DoctorLog (status: PRESENT)
   ├─ Backend calls POST /api/queue/doctor/enter
   ├─ Queue service gets waiting patients
   ├─ POST http://localhost:8000/allocate
   ├─ ML Service optimizes queue with priorities
   └─ Frontend shows: "Dr. Saksham: PRESENT" + Optimized Queue

2. PATIENT BOOKS APPOINTMENT
   ├─ Patient submits booking via Frontend
   ├─ POST /api/v1/appointments
   ├─ Backend checks doctor availability (DoctorLog)
   ├─ POST http://localhost:8000/api/v1/ai/assess-risk
   ├─ ML Service predicts no-show risk
   │  ├─ LOW RISK (≤30%): Confirm appointment
   │  ├─ MEDIUM RISK (31-60%): Add buffer + confirmation
   │  └─ HIGH RISK (>60%): Waitlist + intensive follow-up
   ├─ Backend creates appointment based on risk
   ├─ POST /api/queue/add-to-queue
   ├─ POST http://localhost:8000/allocate (re-optimize)
   └─ Frontend shows confirmation + wait time

3. DOCTOR LEAVES
   ├─ Face Recognition detects exit
   ├─ POST /api/v1/attendance/exit
   ├─ Backend updates DoctorLog (exitTime, duration)
   ├─ POST /api/queue/doctor/exit
   ├─ Queue service gets remaining patients
   ├─ POST http://localhost:8000/allocate (reassign)
   ├─ ML Service redistributes to available doctors
   └─ Frontend updates: "Dr. Saksham: ABSENT" + Reassignments
```

## 📡 API Endpoints

### Attendance API
```
POST   /api/v1/attendance/entry          # Mark doctor entry
POST   /api/v1/attendance/exit           # Mark doctor exit
GET    /api/v1/attendance/today          # Today's attendance
GET    /api/v1/attendance/status/:id     # Doctor status
GET    /api/v1/attendance/history/:id    # Attendance history
```

### Queue API
```
POST   /api/v1/queue/doctor/enter        # Doctor enters
POST   /api/v1/queue/doctor/exit         # Doctor exits
GET    /api/v1/queue/doctor/:id/next-patients  # Get queue
POST   /api/v1/queue/add-to-queue        # Add patient
POST   /api/v1/queue/remove-from-queue   # Remove patient
POST   /api/v1/queue/appointments/book-queue   # Book from queue
```

### ML Service API
```
POST   http://localhost:8000/allocate              # Queue optimization
POST   http://localhost:8000/api/v1/ai/assess-risk # Risk assessment
POST   http://localhost:8000/api/v1/appointments/schedule  # Smart scheduling
GET    http://localhost:8000/health                # Health check
GET    http://localhost:8000/docs                  # API documentation
```

## 🔐 Default Credentials

### Admin
- Email: `admin@example.com`
- Password: `admin123`

### Doctors
- Email: `sarah.johnson@example.com`
- Password: `doctor123`

### Patients
- Email: `john.smith@example.com`
- Password: `patient123`

## 🎥 Face Recognition Setup

### Recognized Doctors

| ID | Name | Specialization |
|----|------|----------------|
| D101 | Dr. Saksham | Cardiologist |
| D102 | Dr. Himanshu | Dermatologist |
| D103 | Dr. Gungun | Surgeon |
| D104 | Dr. Sakshi | Pediatrician |

### Adding New Doctors

1. Create folder: `Doctor_Face_Recognition/Dataset_image/D105_Dr_Name_Specialty/`
2. Add 2-3 clear face photos
3. Regenerate embeddings:
   ```bash
   cd Doctor_Face_Recognition
   source ../Hospital_Scheduling_With_AI/venv/bin/activate
   python embed.py
   ```

### Keyboard Controls

- **Q**: Quit system
- **E**: Force EXIT mode
- **I**: Force ENTRY mode

## 🗄️ Database Schema

### Key Tables

```sql
-- Doctor attendance tracking
DoctorLog {
  id: UUID
  doctorId: UUID
  entryTime: DateTime
  exitTime: DateTime?
}

-- Patient queue management
PatientQueue {
  id: UUID
  patientId: UUID
  doctorId: UUID
  status: WAITING | SERVED
  createdAt: DateTime
}

-- AI-optimized appointment slots
AppointmentSlot {
  id: UUID
  doctorId: UUID
  startTime: DateTime
  endTime: DateTime
  isBooked: Boolean
}
```

## 📊 ML Models

### No-Show Prediction Model
- **Type**: LightGBM Classifier
- **Features**: 98 patient attributes
- **Output**: Show/No-show probability
- **Accuracy**: ~85%

### Risk Assessment
- **Low Risk (≤30%)**: Standard scheduling
- **Medium Risk (31-60%)**: Buffer time + confirmation
- **High Risk (>60%)**: Waitlist + intensive follow-up

### Queue Optimization
- Priority-based ordering
- Wait time estimation
- Resource allocation
- Conflict resolution

## 🛠️ Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user@localhost:5432/dbname
PORT=5050
NODE_ENV=development
ML_SERVICE_URL=http://localhost:8000
```

### Face Recognition (.env)
```env
API_URL=http://localhost:5050/api/v1/attendance
THRESHOLD=0.6
CAM_INDEX=0
```

### ML Service (config)
```python
API_HOST=0.0.0.0
API_PORT=8000
BACKEND_URL=http://localhost:5050
```

## 📝 Logs

All services log to `logs/` directory:
```bash
tail -f logs/backend.log      # Backend logs
tail -f logs/ml-service.log   # ML service logs
tail -f logs/frontend.log     # Frontend logs
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :5050
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check PostgreSQL status
pg_isready

# Start PostgreSQL
brew services start postgresql@17

# Verify database exists
psql -l | grep himanshusharma
```

### Face Recognition Not Working
- Ensure good lighting
- Camera at eye level
- Face clearly visible
- Check THRESHOLD in .env (try 0.5-0.7)

### ML Service Not Responding
```bash
# Check if running
curl http://localhost:8000/health

# View logs
tail -f logs/ml-service.log

# Restart
cd Hospital_Scheduling_With_AI/Hospital_AI_System_Production
source ../venv/bin/activate
python start_system.py
```

## 📚 Documentation

- [Face Recognition Integration](./FACE_RECOGNITION_INTEGRATION.md)
- [Complete System Integration](./COMPLETE_SYSTEM_INTEGRATION.md)
- [Backend API README](./api/README.md)
- [ML Service README](./Hospital_Scheduling_With_AI/Hospital_AI_System_Production/README.md)

## 🎯 Use Cases

### 1. Automated Attendance
- Doctor arrives → Face detected → Marked present
- No manual check-in required
- Real-time status updates

### 2. Smart Scheduling
- Patient books → ML assesses risk → Optimal slot assigned
- High-risk patients → Waitlist with follow-up
- Low-risk patients → Immediate confirmation

### 3. Queue Optimization
- Doctor enters → Queue optimized by AI
- Patients sorted by priority and risk
- Accurate wait time estimates

### 4. Dynamic Reassignment
- Doctor leaves → Patients reassigned automatically
- ML redistributes based on availability
- Patients notified of changes

## 🚀 Performance

- **Face Recognition**: <1s per detection
- **ML Prediction**: <100ms per patient
- **Queue Optimization**: <500ms for 50 patients
- **API Response**: <200ms average

## 🔒 Security

- JWT authentication for API
- Role-based access control
- Secure password hashing (bcrypt)
- CORS protection
- SQL injection prevention (Prisma ORM)

## 📈 Future Enhancements

- [ ] Mobile app for patients
- [ ] Real-time WebSocket updates
- [ ] SMS/Email notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-hospital support
- [ ] Telemedicine integration
- [ ] Payment gateway integration
- [ ] Insurance verification

## 🤝 Contributing

This is a college project demonstrating full-stack development with AI integration.

## 📄 License

Educational/Academic Use

---

## 🎉 System Status

✅ **Backend API**: Ready
✅ **ML Service**: Ready
✅ **Frontend**: Ready
✅ **Face Recognition**: Ready
✅ **Database**: Configured
✅ **Integration**: Complete

**All systems operational! Start with `./start-all-services.sh`** 🚀
