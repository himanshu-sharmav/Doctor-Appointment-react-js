import express from 'express';
import { auth } from '../../../middlewares/auth';
import { 
    markDoctorEntry, 
    markDoctorExit, 
    getDoctorAttendanceStatus,
    getTodayAttendance,
    getDoctorAttendanceHistory
} from './attendance.controller';

const router = express.Router();

// Mark doctor entry (from face recognition) - no auth required for face recognition system
router.post('/entry', markDoctorEntry);

// Mark doctor exit (from face recognition) - no auth required for face recognition system
router.post('/exit', markDoctorExit);

// Get current attendance status for a doctor
router.get('/status/:doctorId', getDoctorAttendanceStatus);

// Get today's attendance for all doctors
router.get('/today', getTodayAttendance);

// Get attendance history for a doctor
router.get('/history/:doctorId', getDoctorAttendanceHistory);

export const AttendanceRouter = router;
