import { Request, Response } from 'express';
import prisma from '../../../shared/prisma';
import httpStatus from 'http-status';

// Mapping between Face Recognition IDs and Database Doctor IDs
const FACE_RECOGNITION_MAPPING: { [key: string]: string } = {
    'D101': 'sarah.johnson@example.com',      // Dr. Saksham -> Dr. Sarah Johnson (Cardiologist)
    'D102': 'michael.chen@example.com',       // Dr. Himanshu -> Dr. Michael Chen (Dermatologist)
    'D103': 'emily.rodriguez@example.com',    // Dr. Gungun -> Dr. Emily Rodriguez (Surgeon)
    'D104': 'lisa.thompson@example.com',      // Dr. Sakshi -> Dr. Lisa Thompson (Pediatrician)
};

// Mark doctor entry
export const markDoctorEntry = async (req: Request, res: Response) => {
    try {
        const { doctor_id, name, type, similarity, photo_path, timestamp } = req.body;

        console.log('Received entry request:', { doctor_id, name, type, similarity });

        // Extract doctor ID from the format (e.g., "D101" from "D101_Dr_Saksham_Cardiologist")
        const doctorIdMatch = doctor_id.match(/^D\d+/);
        if (!doctorIdMatch) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Invalid doctor ID format'
            });
        }

        const extractedDoctorId = doctorIdMatch[0];

        // Get mapped email from face recognition ID
        const mappedEmail = FACE_RECOGNITION_MAPPING[extractedDoctorId];
        
        if (!mappedEmail) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: `No mapping found for Face Recognition ID: ${extractedDoctorId}. Please add mapping in attendance controller.`
            });
        }

        // Find doctor by mapped email
        const doctor = await prisma.doctor.findUnique({
            where: { email: mappedEmail }
        });

        if (!doctor) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: `Doctor not found in database for email: ${mappedEmail}. Face Recognition ID: ${extractedDoctorId}`
            });
        }

        // Check if there's already an active entry
        const existingEntry = await prisma.doctorLog.findFirst({
            where: {
                doctorId: doctor.id,
                exitTime: null
            },
            orderBy: {
                entryTime: 'desc'
            }
        });

        if (existingEntry) {
            return res.status(httpStatus.OK).json({
                success: true,
                message: 'Doctor already marked as present',
                data: existingEntry
            });
        }

        // Create new entry log
        const entryLog = await prisma.doctorLog.create({
            data: {
                doctorId: doctor.id,
                entryTime: timestamp ? new Date(timestamp) : new Date()
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        specialization: true,
                        img: true
                    }
                }
            }
        });

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Doctor entry marked successfully',
            data: {
                ...entryLog,
                faceRecognition: {
                    similarity,
                    photo_path,
                    recognized_as: name,
                    type
                }
            }
        });

    } catch (error: any) {
        console.error('Error marking doctor entry:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to mark doctor entry',
            error: error.message
        });
    }
};

// Mark doctor exit
export const markDoctorExit = async (req: Request, res: Response) => {
    try {
        const { doctor_id, name, type, similarity, photo_path, timestamp } = req.body;

        console.log('Received exit request:', { doctor_id, name, type, similarity });

        // Extract doctor ID
        const doctorIdMatch = doctor_id.match(/^D\d+/);
        if (!doctorIdMatch) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'Invalid doctor ID format'
            });
        }

        const extractedDoctorId = doctorIdMatch[0];

        // Get mapped email from face recognition ID
        const mappedEmail = FACE_RECOGNITION_MAPPING[extractedDoctorId];
        
        if (!mappedEmail) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: `No mapping found for Face Recognition ID: ${extractedDoctorId}`
            });
        }

        // Find doctor by mapped email
        const doctor = await prisma.doctor.findUnique({
            where: { email: mappedEmail }
        });

        if (!doctor) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: `Doctor not found in database for email: ${mappedEmail}`
            });
        }

        // Find the active entry log
        const activeEntry = await prisma.doctorLog.findFirst({
            where: {
                doctorId: doctor.id,
                exitTime: null
            },
            orderBy: {
                entryTime: 'desc'
            }
        });

        if (!activeEntry) {
            return res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'No active entry found for this doctor'
            });
        }

        // Update with exit time
        const exitLog = await prisma.doctorLog.update({
            where: {
                id: activeEntry.id
            },
            data: {
                exitTime: timestamp ? new Date(timestamp) : new Date()
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        specialization: true,
                        img: true
                    }
                }
            }
        });

        // Calculate duration
        const duration = exitLog.exitTime && exitLog.entryTime 
            ? Math.floor((exitLog.exitTime.getTime() - exitLog.entryTime.getTime()) / 1000 / 60) // minutes
            : 0;

        res.status(httpStatus.OK).json({
            success: true,
            message: 'Doctor exit marked successfully',
            data: {
                ...exitLog,
                duration: `${duration} minutes`,
                faceRecognition: {
                    similarity,
                    photo_path,
                    recognized_as: name,
                    type
                }
            }
        });

    } catch (error: any) {
        console.error('Error marking doctor exit:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to mark doctor exit',
            error: error.message
        });
    }
};

// Get doctor attendance status
export const getDoctorAttendanceStatus = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                specialization: true,
                img: true
            }
        });

        if (!doctor) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Get current active entry
        const activeEntry = await prisma.doctorLog.findFirst({
            where: {
                doctorId: doctorId,
                exitTime: null
            },
            orderBy: {
                entryTime: 'desc'
            }
        });

        const status = activeEntry ? 'present' : 'absent';

        res.status(httpStatus.OK).json({
            success: true,
            data: {
                doctor,
                status,
                currentEntry: activeEntry,
                isPresent: !!activeEntry
            }
        });

    } catch (error: any) {
        console.error('Error getting doctor status:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to get doctor status',
            error: error.message
        });
    }
};

// Get today's attendance for all doctors
export const getTodayAttendance = async (req: Request, res: Response) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Get all doctors
        const doctors = await prisma.doctor.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                specialization: true,
                img: true
            }
        });

        // Get today's logs for all doctors
        const todayLogs = await prisma.doctorLog.findMany({
            where: {
                entryTime: {
                    gte: today,
                    lt: tomorrow
                }
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true,
                        img: true
                    }
                }
            },
            orderBy: {
                entryTime: 'desc'
            }
        });

        // Build attendance summary
        const attendanceSummary = doctors.map(doctor => {
            const doctorLogs = todayLogs.filter(log => log.doctorId === doctor.id);
            const activeEntry = doctorLogs.find(log => log.exitTime === null);
            
            let totalMinutes = 0;
            doctorLogs.forEach(log => {
                if (log.exitTime) {
                    const duration = (log.exitTime.getTime() - log.entryTime.getTime()) / 1000 / 60;
                    totalMinutes += duration;
                }
            });

            return {
                doctor,
                status: activeEntry ? 'present' : 'absent',
                isPresent: !!activeEntry,
                currentEntry: activeEntry || null,
                todayLogs: doctorLogs,
                totalTimeToday: `${Math.floor(totalMinutes)} minutes`,
                entryCount: doctorLogs.length
            };
        });

        const presentCount = attendanceSummary.filter(d => d.isPresent).length;
        const absentCount = attendanceSummary.filter(d => !d.isPresent).length;

        res.status(httpStatus.OK).json({
            success: true,
            data: {
                summary: {
                    total: doctors.length,
                    present: presentCount,
                    absent: absentCount,
                    date: today.toISOString().split('T')[0]
                },
                doctors: attendanceSummary
            }
        });

    } catch (error: any) {
        console.error('Error getting today attendance:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to get today attendance',
            error: error.message
        });
    }
};

// Get doctor attendance history
export const getDoctorAttendanceHistory = async (req: Request, res: Response) => {
    try {
        const { doctorId } = req.params;
        const { startDate, endDate, limit = '30' } = req.query;

        const doctor = await prisma.doctor.findUnique({
            where: { id: doctorId }
        });

        if (!doctor) {
            return res.status(httpStatus.NOT_FOUND).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        const whereClause: any = {
            doctorId: doctorId
        };

        if (startDate || endDate) {
            whereClause.entryTime = {};
            if (startDate) {
                whereClause.entryTime.gte = new Date(startDate as string);
            }
            if (endDate) {
                whereClause.entryTime.lte = new Date(endDate as string);
            }
        }

        const logs = await prisma.doctorLog.findMany({
            where: whereClause,
            orderBy: {
                entryTime: 'desc'
            },
            take: parseInt(limit as string),
            include: {
                doctor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        specialization: true
                    }
                }
            }
        });

        // Calculate statistics
        const stats = {
            totalDays: logs.length,
            totalMinutes: 0,
            averageMinutes: 0
        };

        logs.forEach(log => {
            if (log.exitTime) {
                const duration = (log.exitTime.getTime() - log.entryTime.getTime()) / 1000 / 60;
                stats.totalMinutes += duration;
            }
        });

        stats.averageMinutes = logs.length > 0 ? Math.floor(stats.totalMinutes / logs.length) : 0;

        res.status(httpStatus.OK).json({
            success: true,
            data: {
                doctor,
                logs,
                statistics: {
                    ...stats,
                    totalHours: Math.floor(stats.totalMinutes / 60),
                    averageHours: Math.floor(stats.averageMinutes / 60)
                }
            }
        });

    } catch (error: any) {
        console.error('Error getting attendance history:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: 'Failed to get attendance history',
            error: error.message
        });
    }
};
