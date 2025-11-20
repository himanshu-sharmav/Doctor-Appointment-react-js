import express from 'express';
import { auth } from '../../middlewares/auth';
import { 
    markDoctorEntry, 
    markDoctorExit, 
    getDoctorAttendanceStatus,
    getTodayAttendance,
    getDoctorAttendanceHistory
} from '../../controllers/doctorAttendance.controller';

const router = express.Router();

// Mark doctor entry (from face recognition)
router.post('/entry', markDoctorEntry);

// Mark doctor exit (from face recognition)
router.post('/exit', markDoctorExit);

// Get current attendance status for a doctor
router.get('/status/:doctorId', getDoctorAttendanceStatus);

// Get today's attendance for all doctors
router.get('/today', getTodayAttendance);

// Get attendance history for a doctor
router.get('/history/:doctorId', auth, getDoctorAttendanceHistory);

export default router;
