import express from 'express';
import { QueueController } from './queue.controller';
import { auth } from '../../middlewares/auth';
import { UserRole } from '@prisma/client';

const router = express.Router();
const queueController = new QueueController();

// TEMPORARY: Test route without authentication
router.post(
  '/test/doctor/enter',
  queueController.doctorEnterTest
);

// Doctor enters hospital (protected route)
router.post(
  '/doctor/enter',
  auth(UserRole.doctor),
  queueController.doctorEnter
);

// Doctor exits hospital (protected route)
router.post(
  '/doctor/exit',
  auth(UserRole.doctor),
  queueController.doctorExit
);

// Get next patients in queue for a specific doctor (protected route)
router.get(
  '/doctor/:id/next-patients',
  auth(UserRole.doctor),
  queueController.getNextPatients
);

// Book appointments for queued patients (protected route)
router.post(
  '/appointments/book-queue',
  auth(UserRole.doctor),
  queueController.bookQueueAppointments
);

// Add patient to queue (protected route)
router.post(
  '/add-to-queue',
  auth(UserRole.patient),
  queueController.addToQueue
);

// Remove patient from queue (protected route)
router.post(
  '/remove-from-queue',
  auth(UserRole.doctor),
  queueController.removeFromQueue
);

export const QueueRouter = router;
