# Doctor-Appointment-Backend

## ML-Integrated Queue Management System

This backend now includes an ML-based flow for doctor availability, patient queueing, and auto slot allocation.

### New Queue Routes

#### Doctor Management
- `POST /api/queue/doctor/enter` - Log doctor entry and set as available
- `POST /api/queue/doctor/exit` - Log doctor exit and set as unavailable
- `GET /api/queue/doctor/:id/next-patients` - Get queued patients with estimated wait times
- `POST /api/queue/appointments/book-queue` - Automatically book appointments for queued patients

#### Patient Queue Management
- `POST /api/queue/add-to-queue` - Add patient to doctor's queue
- `POST /api/queue/remove-from-queue` - Remove patient from queue

### ML Service Integration

The system integrates with a Python ML service running at `http://localhost:5000/`:
- `POST /allocate` - Receives patient queue data and returns optimized allocation
- ML service provides priority ordering, estimated wait times, and recommended slots

### Database Schema Updates

New models added:
- `DoctorLog` - Tracks doctor entry/exit times
- `PatientQueue` - Manages patient queue status
- `AppointmentSlot` - Handles appointment slot allocation

### Authentication

All queue routes are protected with role-based authentication:
- Doctor routes require `doctor` role
- Patient routes require `patient` role
