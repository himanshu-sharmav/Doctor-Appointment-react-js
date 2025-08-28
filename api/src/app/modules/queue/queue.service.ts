import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';

const prisma = new PrismaClient();

interface PatientQueueData {
  patientId: string;
  doctorId: string;
  status: 'WAITING' | 'SERVED';
}

interface MLAllocationResponse {
  patientId: string;
  priority: number;
  estimatedWaitTime: number;
  recommendedSlot: string;
}

export class QueueService {
  // Log doctor entry and set as available
  async doctorEnter(doctorId: string) {
    try {
      // Create doctor log entry
      const doctorLog = await prisma.doctorLog.create({
        data: {
          doctorId,
          entryTime: new Date(),
        },
      });

      // Get current queue for this doctor
      const currentQueue = await prisma.patientQueue.findMany({
        where: {
          doctorId,
          status: 'WAITING',
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Call ML service for allocation
      if (currentQueue.length > 0) {
        const mlResponse = await this.callMLService(currentQueue);
        await this.allocateAppointments(doctorId, mlResponse);
      }

      return {
        success: true,
        message: 'Doctor entered successfully',
        doctorLog,
        queueLength: currentQueue.length,
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to log doctor entry');
    }
  }

  // Log doctor exit and set as unavailable
  async doctorExit(doctorId: string) {
    try {
      // Update the latest doctor log with exit time
      const latestLog = await prisma.doctorLog.findFirst({
        where: {
          doctorId,
          exitTime: null,
        },
        orderBy: {
          entryTime: 'desc',
        },
      });

      if (latestLog) {
        await prisma.doctorLog.update({
          where: { id: latestLog.id },
          data: { exitTime: new Date() },
        });
      }

      // Move any remaining waiting patients to queue
      const activeAppointments = await prisma.appointments.findMany({
        where: {
          doctorId,
          status: 'pending',
        },
      });

      // Create queue entries for active appointments
      for (const appointment of activeAppointments) {
        if (appointment.patientId) {
          await prisma.patientQueue.create({
            data: {
              patientId: appointment.patientId,
              doctorId,
              status: 'WAITING',
            },
          });
        }
      }

      return {
        success: true,
        message: 'Doctor exited successfully',
        queueLength: activeAppointments.length,
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to log doctor exit');
    }
  }

  // Get next patients in queue with estimated wait times
  async getNextPatients(doctorId: string) {
    try {
      const queue = await prisma.patientQueue.findMany({
        where: {
          doctorId,
          status: 'WAITING',
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              mobile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Call ML service for wait time estimation
      const mlResponse = await this.callMLService(queue);
      
      const patientsWithWaitTimes = queue.map((queueItem, index) => {
        const mlData = mlResponse.find(item => item.patientId === queueItem.patientId);
        return {
          ...queueItem,
          position: index + 1,
          estimatedWaitTime: mlData?.estimatedWaitTime || (index + 1) * 15, // Default 15 min per patient
          recommendedSlot: mlData?.recommendedSlot || null,
        };
      });

      return {
        success: true,
        data: patientsWithWaitTimes,
        totalWaiting: queue.length,
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get queue data');
    }
  }

  // Book appointments for queued patients
  async bookQueueAppointments(doctorId: string) {
    try {
      const waitingPatients = await prisma.patientQueue.findMany({
        where: {
          doctorId,
          status: 'WAITING',
        },
        include: {
          patient: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (waitingPatients.length === 0) {
        return {
          success: true,
          message: 'No patients waiting in queue',
          appointmentsBooked: 0,
        };
      }

      // Call ML service for optimal allocation
      const mlResponse = await this.callMLService(waitingPatients);
      
      // Create appointment slots and book appointments
      const appointmentsBooked = await this.allocateAppointments(doctorId, mlResponse);

      return {
        success: true,
        message: 'Appointments booked successfully',
        appointmentsBooked,
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to book queue appointments');
    }
  }

  // Call ML service for allocation and wait time estimation
  private async callMLService(queueData: any[]): Promise<MLAllocationResponse[]> {
    try {
      const response = await axios.post('http://localhost:8000/allocate', {
        queue: queueData.map(item => ({
          patientId: item.patientId,
          patientName: `${item.patient?.firstName} ${item.patient?.lastName}`,
          queuePosition: item.createdAt,
          doctorId: item.doctorId,
        })),
      });

      return response.data.allocations || [];
    } catch (error) {
      console.error('ML service call failed:', error);
      // Return default allocation if ML service is unavailable
      return queueData.map((item, index) => ({
        patientId: item.patientId,
        priority: index + 1,
        estimatedWaitTime: (index + 1) * 15,
        recommendedSlot: new Date(Date.now() + (index + 1) * 15 * 60000).toISOString(),
      }));
    }
  }

  // Allocate appointments based on ML response
  private async allocateAppointments(doctorId: string, mlResponse: MLAllocationResponse[]): Promise<number> {
    let appointmentsBooked = 0;

    for (const allocation of mlResponse) {
      try {
        // Create appointment slot
        const slot = await prisma.appointmentSlot.create({
          data: {
            doctorId,
            startTime: new Date(allocation.recommendedSlot),
            endTime: new Date(new Date(allocation.recommendedSlot).getTime() + 30 * 60000), // 30 min slots
            isBooked: true,
          },
        });

        // Update queue status
        await prisma.patientQueue.updateMany({
          where: {
            patientId: allocation.patientId,
            doctorId,
            status: 'WAITING',
          },
          data: {
            status: 'SERVED',
          },
        });

        appointmentsBooked++;
      } catch (error) {
        console.error(`Failed to allocate appointment for patient ${allocation.patientId}:`, error);
      }
    }

    return appointmentsBooked;
  }

  // Add patient to queue
  async addToQueue(patientId: string, doctorId: string) {
    try {
      const existingQueue = await prisma.patientQueue.findFirst({
        where: {
          patientId,
          doctorId,
          status: 'WAITING',
        },
      });

      if (existingQueue) {
        throw new ApiError(httpStatus.CONFLICT, 'Patient already in queue');
      }

      const queueEntry = await prisma.patientQueue.create({
        data: {
          patientId,
          doctorId,
          status: 'WAITING',
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return {
        success: true,
        message: 'Patient added to queue successfully',
        data: queueEntry,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to add patient to queue');
    }
  }

  // Remove patient from queue
  async removeFromQueue(patientId: string, doctorId: string) {
    try {
      const queueEntry = await prisma.patientQueue.findFirst({
        where: {
          patientId,
          doctorId,
          status: 'WAITING',
        },
      });

      if (!queueEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Patient not found in queue');
      }

      await prisma.patientQueue.update({
        where: { id: queueEntry.id },
        data: { status: 'SERVED' },
      });

      return {
        success: true,
        message: 'Patient removed from queue successfully',
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to remove patient from queue');
    }
  }
}
