# System Flow Diagrams

## Complete Integration Flow

### 1. Doctor Arrival & Queue Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DOCTOR ARRIVAL FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    👨‍⚕️ Doctor Arrives
         │
         ▼
    📷 Webcam
         │
         ▼
┌────────────────────┐
│ Face Recognition   │
│ System (Python)    │
│                    │
│ 1. Detect face     │
│ 2. Match embedding │
│ 3. Identify doctor │
│ 4. Determine event │
└─────────┬──────────┘
          │
          │ POST /api/v1/attendance/entry
          │ {
          │   "doctor_id": "D101_Dr_Saksham_Cardiologist",
          │   "name": "Dr_Saksham",
          │   "type": "Cardiologist",
          │   "similarity": "0.95",

         │   "timestamp": "2024-11-06 09:00:00"
          │ }
          ▼
┌────────────────────────────────────────────────────────────┐
│ Backend API (Node.js)                                      │
│                                                            │
│ Attendance Controller:                                     │
│ 1. ✅ Validate doctor_id format                           │
│ 2. 🔍 Find doctor in database                             │
│ 3. 📝 Create DoctorLog entry                              │
│    - entryTime: now                                        │
│    - exitTime: null                                        │
│ 4. ✅ Mark doctor as PRESENT                              │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ Trigger Queue Management
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Queue Service                                              │
│                                                            │
│ 1. 📋 Get waiting patients for this doctor                │
│    SELECT * FROM PatientQueue                              │
│    WHERE doctorId = 'doc-123'                              │
│    AND status = 'WAITING'                                  │
│                                                            │
│ 2. 📊 Prepare queue data                                  │
│    [                                                       │
│      { patientId: 'P001', name: 'John Doe' },            │
│      { patientId: 'P002', name: 'Jane Smith' },          │
│      { patientId: 'P003', name: 'Bob Johnson' }          │
│    ]                                                       │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ POST http://localhost:8000/allocate
                      │ {
                      │   "queue": [
                      │     { "patientId": "P001", "patientName": "John Doe" },
                      │     { "patientId": "P002", "patientName": "Jane Smith" },
                      │     { "patientId": "P003", "patientName": "Bob Johnson" }
                      │   ]
                      │ }
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Hospital AI Scheduler (Python/ML)                         │
│                                                            │
│ For each patient:                                          │
│                                                            │
│ 1. 🤖 Load ML Model (LightGBM)                            │
│                                                            │
│ 2. 📊 Predict No-Show Probability                         │
│    Patient P001:                                           │
│    - Features: age, history, urgency, etc.                 │
│    - Prediction: 0.25 (25% no-show risk)                  │
│    - Classification: LOW RISK                              │
│                                                            │
│ 3. 🎯 Calculate Priority                                  │
│    - Base priority: Queue position                         │
│    - Risk adjustment: Lower risk = higher priority         │
│    - Urgency factor: Medical urgency score                 │
│    - Final priority: 10 (highest)                          │
│                                                            │
│ 4. ⏱️ Estimate Wait Time                                  │
│    - Position in optimized queue: 1                        │
│    - Average consultation: 15 min                          │
│    - Buffer time: 0 min (low risk)                         │
│    - Estimated wait: 15 minutes                            │
│                                                            │
│ 5. 📅 Recommend Slot                                      │
│    - Current time: 09:00                                   │
│    - Add wait time: 09:15                                  │
│    - Recommended slot: 09:15-09:45                         │
│                                                            │
│ 6. 💡 Suggest Interventions                               │
│    - LOW RISK: ["sms_reminder"]                           │
│    - MEDIUM RISK: ["sms_reminder", "confirmation_call"]   │
│    - HIGH RISK: ["intensive_follow_up", "waitlist"]       │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ Response:
                      │ {
                      │   "allocations": [
                      │     {
                      │       "patientId": "P001",
                      │       "priority": 10,
                      │       "estimatedWaitTime": 15,
                      │       "recommendedSlot": "2024-11-06T09:15:00",
                      │       "riskScore": 0.25,
                      │       "mlOptimization": {
                      │         "riskLevel": "low",
                      │         "noShowProbability": 0.25,
                      │         "recommendedInterventions": ["sms_reminder"]
                      │       }
                      │     },
                      │     { ... patient P002 ... },
                      │     { ... patient P003 ... }
                      │   ],
                      │   "totalPatients": 3,
                      │   "mlModelUsed": "Hospital_AI_System"
                      │ }
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Backend API - Process ML Response                         │
│                                                            │
│ 1. 📝 Create AppointmentSlots                             │
│    INSERT INTO AppointmentSlot                             │
│    (doctorId, startTime, endTime, isBooked)                │
│    VALUES ('doc-123', '09:15', '09:45', true)             │
│                                                            │
│ 2. 🔄 Update PatientQueue priorities                      │
│    UPDATE PatientQueue                                     │
│    SET priority = 10, estimatedWait = 15                   │
│    WHERE patientId = 'P001'                                │
│                                                            │
│ 3. 📧 Send Notifications                                  │
│    - SMS to patients with wait times                       │
│    - Email confirmations                                   │
│    - Push notifications (if app)                           │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ WebSocket/Polling
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Frontend (React)                                           │
│                                                            │
│ Doctor Dashboard:                                          │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ 👨‍⚕️ Dr. Saksham - Status: 🟢 PRESENT                 │  │
│ │ Entry Time: 09:00 AM                                  │  │
│ │                                                       │  │
│ │ 📋 Patient Queue (3 waiting)                         │  │
│ │ ┌─────────────────────────────────────────────────┐ │  │
│ │ │ 1. John Doe - Wait: 15 min - Risk: 🟢 LOW      │ │  │
│ │ │ 2. Jane Smith - Wait: 30 min - Risk: 🟡 MEDIUM │ │  │
│ │ │ 3. Bob Johnson - Wait: 50 min - Risk: 🔴 HIGH  │ │  │
│ │ └─────────────────────────────────────────────────┘ │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ Patient View:                                              │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Your Appointment                                      │  │
│ │ Doctor: Dr. Saksham (Cardiologist)                   │  │
│ │ Status: ✅ Confirmed                                 │  │
│ │ Estimated Wait: 15 minutes                           │  │
│ │ Your Position: #1 in queue                           │  │
│ │ Slot: 09:15 - 09:45 AM                              │  │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 2. Patient Booking with ML Risk Assessment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PATIENT BOOKING FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

    👤 Patient
         │
         ▼
    🌐 Frontend
         │
         │ 1. Select doctor
         │ 2. Choose date/time
         │ 3. Submit booking
         ▼
┌────────────────────┐
│ POST /api/v1/      │
│ appointments       │
│                    │
│ {                  │
│   patientId: "P1", │
│   doctorId: "D1",  │
│   date: "2024-...",│
│   time: "afternoon"│
│ }                  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────────────────────────────────────────────┐
│ Backend - Appointment Controller                          │
│                                                            │
│ 1. ✅ Validate request                                    │
│ 2. 🔍 Check doctor availability                           │
│    - Query DoctorLog for current status                    │
│    - If exitTime = null → Doctor PRESENT                   │
│    - If exitTime != null → Doctor ABSENT                   │
│                                                            │
│ 3. 📊 Prepare patient data for ML                         │
│    {                                                       │
│      patient_id: "P1",                                     │
│      age: 45,                                              │
│      gender: 1,                                            │
│      no_shows_history: 0,                                  │
│      sms_received: 1,                                      │
│      medical_urgency: 2,                                   │
│      ... (98 features total)                               │
│    }                                                       │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ POST http://localhost:8000/api/v1/ai/assess-risk
                      ▼
┌────────────────────────────────────────────────────────────┐
│ ML Service - Risk Assessment                              │
│                                                            │
│ 1. 🤖 Load Patient Features                               │
│    - Extract 98 features from patient data                 │
│    - Normalize/scale features                              │
│                                                            │
│ 2. 🧠 ML Model Prediction                                 │
│    Model: LightGBM Classifier                              │
│    Input: 98-dimensional feature vector                    │
│    Output:                                                 │
│    - Prediction: "Show" or "No-show"                       │
│    - No-show probability: 0.25 (25%)                       │
│    - Show probability: 0.75 (75%)                          │
│                                                            │
│ 3. 🎯 Risk Classification                                 │
│    if no_show_prob <= 0.30:                                │
│        risk_level = "LOW"                                  │
│    elif no_show_prob <= 0.60:                              │
│        risk_level = "MEDIUM"                               │
│    else:                                                   │
│        risk_level = "HIGH"                                 │
│                                                            │
│    Result: LOW RISK (25%)                                  │
│                                                            │
│ 4. 📋 Scheduling Strategy                                 │
│    LOW RISK:                                               │
│    - Action: "confirm"                                     │
│    - Buffer time: 0 minutes                                │
│    - Interventions: ["sms_reminder"]                       │
│    - Priority: Standard                                    │
│                                                            │
│    MEDIUM RISK:                                            │
│    - Action: "confirm_with_buffer"                         │
│    - Buffer time: 10 minutes                               │
│    - Interventions: ["sms_reminder",                       │
│                      "confirmation_call"]                  │
│    - Priority: High                                        │
│                                                            │
│    HIGH RISK:                                              │
│    - Action: "waitlist"                                    │
│    - Buffer time: 15 minutes                               │
│    - Interventions: ["intensive_follow_up",                │
│                      "multiple_reminders",                 │
│                      "deposit_required"]                   │
│    - Priority: Waitlist                                    │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ Response:
                      │ {
                      │   "risk_assessment": {
                      │     "risk_level": "LOW",
                      │     "no_show_probability": 0.25,
                      │     "show_probability": 0.75
                      │   },
                      │   "scheduling_strategy": {
                      │     "action": "confirm",
                      │     "buffer_time": 0,
                      │     "interventions": ["sms_reminder"]
                      │   },
                      │   "recommendations": [
                      │     "Send SMS reminder 24h before",
                      │     "Standard scheduling process"
                      │   ]
                      │ }
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Backend - Process Risk Assessment                         │
│                                                            │
│ Decision Tree:                                             │
│                                                            │
│ if risk_level == "LOW":                                    │
│     ✅ Create appointment immediately                      │
│     📅 Allocate time slot                                 │
│     📧 Send confirmation email                            │
│     📱 Schedule SMS reminder                              │
│     ✅ Return success to frontend                         │
│                                                            │
│ elif risk_level == "MEDIUM":                               │
│     ✅ Create appointment with buffer                      │
│     📅 Add 10-minute buffer to slot                       │
│     📧 Send confirmation email                            │
│     📞 Schedule confirmation call                         │
│     📱 Schedule multiple SMS reminders                    │
│     ✅ Return success to frontend                         │
│                                                            │
│ else: # HIGH RISK                                          │
│     ⏸️ Add to waitlist                                    │
│     📋 Create PatientQueue entry                          │
│     📧 Send waitlist notification                         │
│     📞 Schedule intensive follow-up                       │
│     💰 Request deposit (optional)                         │
│     ⏰ Monitor for slot availability                      │
│     ⚠️ Return waitlist status to frontend                │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Frontend - Display Result                                 │
│                                                            │
│ LOW RISK - Confirmed:                                      │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ✅ Appointment Confirmed!                            │  │
│ │                                                       │  │
│ │ Doctor: Dr. Saksham (Cardiologist)                   │  │
│ │ Date: November 6, 2024                               │  │
│ │ Time: 2:00 PM - 2:30 PM                             │  │
│ │ Location: Room 301                                    │  │
│ │                                                       │  │
│ │ 📱 You will receive an SMS reminder 24h before       │  │
│ │ 📧 Confirmation email sent                           │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ HIGH RISK - Waitlist:                                      │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ⏸️ Added to Waitlist                                 │  │
│ │                                                       │  │
│ │ Doctor: Dr. Saksham (Cardiologist)                   │  │
│ │ Preferred Date: November 6, 2024                     │  │
│ │ Position: #3 in waitlist                             │  │
│ │                                                       │  │
│ │ 📞 Our team will call you to confirm availability    │  │
│ │ 📧 You'll be notified when a slot opens              │  │
│ │ 💰 Deposit may be required to secure appointment     │  │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### 3. Doctor Departure & Patient Reassignment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DOCTOR DEPARTURE FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

    👨‍⚕️ Doctor Leaves
         │
         ▼
    📷 Face Recognition
         │
         │ Detects same doctor again
         │ Current status: PRESENT (has active entry)
         │ Decision: This is an EXIT event
         ▼
    POST /api/v1/attendance/exit
         │
         ▼
┌────────────────────────────────────────────────────────────┐
│ Backend - Attendance Controller                           │
│                                                            │
│ 1. 🔍 Find active DoctorLog entry                         │
│    WHERE doctorId = 'doc-123'                              │
│    AND exitTime IS NULL                                    │
│                                                            │
│ 2. ⏱️ Update with exit time                               │
│    UPDATE DoctorLog                                        │
│    SET exitTime = NOW()                                    │
│                                                            │
│ 3. 📊 Calculate duration                                  │
│    duration = exitTime - entryTime                         │
│    = 18:00 - 09:00 = 9 hours                              │
│                                                            │
│ 4. ✅ Mark doctor as ABSENT                               │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ Trigger Queue Reassignment
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Queue Service - Handle Doctor Exit                        │
│                                                            │
│ 1. 📋 Get remaining patients                              │
│    SELECT * FROM PatientQueue                              │
│    WHERE doctorId = 'doc-123'                              │
│    AND status = 'WAITING'                                  │
│                                                            │
│    Result: 5 patients still waiting                        │
│                                                            │
│ 2. 🔍 Find available doctors                              │
│    SELECT d.* FROM Doctor d                                │
│    JOIN DoctorLog dl ON d.id = dl.doctorId                │
│    WHERE dl.exitTime IS NULL                               │
│    AND d.specialization = 'Cardiologist'                   │
│                                                            │
│    Result: Dr. Emily (Cardiologist) is available          │
│                                                            │
│ 3. 📊 Prepare reassignment data                           │
│    {                                                       │
│      "departing_doctor": "doc-123",                        │
│      "available_doctors": ["doc-456"],                     │
│      "waiting_patients": [                                 │
│        { "patientId": "P004", "urgency": 3 },            │
│        { "patientId": "P005", "urgency": 2 },            │
│        { "patientId": "P006", "urgency": 1 }             │
│      ]                                                     │
│    }                                                       │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ POST http://localhost:8000/allocate
                      │ (with updated doctor availability)
                      ▼
┌────────────────────────────────────────────────────────────┐
│ ML Service - Reassignment Optimization                    │
│                                                            │
│ 1. 🤖 Analyze remaining patients                          │
│    - Patient P004: Urgency 3, Risk 0.4 (MEDIUM)          │
│    - Patient P005: Urgency 2, Risk 0.2 (LOW)             │
│    - Patient P006: Urgency 1, Risk 0.7 (HIGH)            │
│                                                            │
│ 2. 🎯 Optimize reassignment                               │
│    Priority calculation:                                   │
│    - Urgency weight: 40%                                   │
│    - Risk weight: 30%                                      │
│    - Wait time weight: 30%                                 │
│                                                            │
│    Optimized order:                                        │
│    1. P004 (High urgency, medium risk)                    │
│    2. P005 (Medium urgency, low risk)                     │
│    3. P006 (Low urgency, high risk → waitlist)           │
│                                                            │
│ 3. 📅 Allocate to available doctor                        │
│    Dr. Emily's schedule:                                   │
│    - P004: 18:15 - 18:45 (immediate)                      │
│    - P005: 18:45 - 19:15 (next)                          │
│    - P006: Waitlist (high risk)                           │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      │ Response with reassignments
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Backend - Process Reassignments                           │
│                                                            │
│ 1. 🔄 Update PatientQueue                                 │
│    UPDATE PatientQueue                                     │
│    SET doctorId = 'doc-456'                                │
│    WHERE patientId IN ('P004', 'P005')                     │
│                                                            │
│ 2. 📧 Send notifications                                  │
│    - Email to P004: "Reassigned to Dr. Emily at 18:15"   │
│    - Email to P005: "Reassigned to Dr. Emily at 18:45"   │
│    - Email to P006: "Added to waitlist, will contact"    │
│                                                            │
│ 3. 📱 SMS alerts                                          │
│    - "Your appointment has been reassigned..."            │
│                                                            │
│ 4. 📞 Call high-priority patients                         │
│    - Urgent cases get immediate phone call                 │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────┐
│ Frontend - Real-time Updates                              │
│                                                            │
│ Doctor Dashboard (Dr. Saksham):                            │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ 👨‍⚕️ Dr. Saksham - Status: 🔴 ABSENT                  │  │
│ │ Exit Time: 18:00 PM                                   │  │
│ │ Total Time Today: 9 hours                             │  │
│ │ Patients Seen: 15                                     │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ Doctor Dashboard (Dr. Emily):                              │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ 👩‍⚕️ Dr. Emily - Status: 🟢 PRESENT                   │  │
│ │                                                       │  │
│ │ 📋 Updated Queue (2 new patients)                    │  │
│ │ ┌─────────────────────────────────────────────────┐ │  │
│ │ │ 🆕 P004 - 18:15 - Reassigned from Dr. Saksham  │ │  │
│ │ │ 🆕 P005 - 18:45 - Reassigned from Dr. Saksham  │ │  │
│ │ └─────────────────────────────────────────────────┘ │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                            │
│ Patient View (P004):                                       │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ⚠️ Appointment Updated                                │  │
│ │                                                       │  │
│ │ Your doctor (Dr. Saksham) has left for the day.     │  │
│ │                                                       │  │
│ │ ✅ You've been reassigned to:                        │  │
│ │ Dr. Emily Rodriguez (Cardiologist)                   │  │
│ │ New Time: 18:15 - 18:45 PM                          │  │
│ │ Same Location: Room 301                              │  │
│ │                                                       │  │
│ │ 📧 Confirmation email sent                           │  │
│ │ 📱 SMS notification sent                             │  │
│ └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Data Flow Summary

```
Face Recognition → Backend → ML Service → Backend → Frontend
     (Entry)         (Log)    (Optimize)   (Update)  (Display)
        ↓              ↓          ↓           ↓         ↓
    Detect Face → DoctorLog → Risk Score → Queue → Dashboard
                     ↓                        ↓
                 Available              Appointments
```

## Technology Stack Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Python    │────▶│   Node.js   │────▶│   Python    │────▶│   React     │
│   OpenCV    │ HTTP│  Express    │ HTTP│   FastAPI   │ HTTP│   Redux     │
│ face_recog  │     │  TypeScript │     │   LightGBM  │     │   Ant Design│
└─────────────┘     └──────┬──────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ PostgreSQL  │
                    │   Prisma    │
                    └─────────────┘
```

---

**This complete integration creates an intelligent, automated hospital management system!** 🏥🤖✨
