import { PrismaClient, Prisma } from '@prisma/client';
import axios from 'axios';
import ApiError from '../../../errors/apiError';
import httpStatus from 'http-status';
import moment from 'moment';

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

interface TimeSlot {
  start: Date;
  end: Date;
}

export class QueueService {
  // Log doctor entry and set as available
  async doctorEnter(doctorId: string, entryTime?: Date) {
    try {
      // Create doctor log entry
      const doctorLog = await prisma.doctorLog.create({
        data: {
          doctorId,
          entryTime: entryTime || new Date(),
        },
      });

      // Note: We removed automatic queue processing on entry as per user request.
      // The doctor will manually click "Process Queue" when ready.

      return {
        success: true,
        message: 'Doctor entered successfully',
        doctorLog,
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to log doctor entry');
    }
  }

  // Log doctor exit and set as unavailable
  async doctorExit(doctorId: string, exitTime?: Date) {
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
          data: { exitTime: exitTime || new Date() },
        });
      }

      // Move any remaining waiting patients to queue (only today's appointments)
      const todayStart = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const todayEnd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

      const activeAppointments = await prisma.appointments.findMany({
        where: {
          doctorId,
          status: 'pending',
          scheduleDate: {
            gte: todayStart,
            lte: todayEnd
          }
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

      // 1. Fetch existing appointments for the doctor today to avoid double booking
      const todayStart = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const todayEnd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

      // Note: Schema stores dates as strings, so we need to be careful with comparison
      // Ideally we should fetch all and filter in memory if the string format is inconsistent
      // But assuming the format 'YYYY-MM-DD HH:mm:ss' is consistent:
      const existingAppointments = await prisma.appointments.findMany({
        where: {
          doctorId,
          scheduleDate: {
            gte: todayStart,
            lte: todayEnd
          },
          status: {
            not: 'cancelled'
          }
        }
      });

      // Convert existing appointments to TimeSlot objects
      const busySlots: TimeSlot[] = existingAppointments.map(app => {
        // Combine date and time strings
        // app.scheduleDate might be "2023-10-27 00:00:00" or just date
        // app.scheduleTime might be "10:00 AM"

        // Let's try to parse robustly using moment
        const dateStr = moment(app.scheduleDate).format('YYYY-MM-DD');
        const timeStr = app.scheduleTime; // e.g. "10:00 AM"
        const dateTimeStr = `${dateStr} ${timeStr}`;

        const start = moment(dateTimeStr, 'YYYY-MM-DD hh:mm A').toDate();
        const end = moment(start).add(30, 'minutes').toDate(); // Assuming 30 min slots for existing apps

        return { start, end };
      });

      // Also fetch existing AppointmentSlots (from previous queue processing)
      const existingSlots = await prisma.appointmentSlot.findMany({
        where: {
          doctorId,
          startTime: {
            gte: new Date()
          },
          isBooked: true
        }
      });

      existingSlots.forEach(slot => {
        busySlots.push({
          start: slot.startTime,
          end: slot.endTime
        });
      });

      // Call ML service for optimal allocation
      const mlResponse = await this.callMLService(waitingPatients);

      // Create appointment slots and book appointments, respecting busy slots
      const appointmentsBooked = await this.allocateAppointments(doctorId, mlResponse, busySlots);

      return {
        success: true,
        message: 'Appointments booked successfully',
        appointmentsBooked,
      };
    } catch (error) {
      console.error('Error booking queue appointments:', error);
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

  // Allocate appointments based on ML response, respecting busy slots
  private async allocateAppointments(
    doctorId: string,
    mlResponse: MLAllocationResponse[],
    busySlots: TimeSlot[] = []
  ): Promise<number> {
    let appointmentsBooked = 0;

    // Sort allocations by recommended slot time
    const sortedAllocations = [...mlResponse].sort((a, b) =>
      new Date(a.recommendedSlot).getTime() - new Date(b.recommendedSlot).getTime()
    );

    for (const allocation of sortedAllocations) {
      try {
        let proposedStart = new Date(allocation.recommendedSlot);
        let proposedEnd = new Date(proposedStart.getTime() + 30 * 60000);

        // Find a valid slot that doesn't overlap with busySlots
        while (this.isOverlapping(proposedStart, proposedEnd, busySlots)) {
          // If overlapping, move to next 30 min slot
          proposedStart = new Date(proposedStart.getTime() + 30 * 60000);
          proposedEnd = new Date(proposedStart.getTime() + 30 * 60000);
        }

        // Fetch patient details
        const patient = await prisma.patient.findUnique({
          where: { id: allocation.patientId }
        });

        if (!patient) {
          console.error(`Patient ${allocation.patientId} not found`);
          continue;
        }

        // Generate tracking ID for queue appointment
        const trackingId = await this.generateQueueTrackingId();

        // 1. Create Appointment record (unified with regular appointments)
        const appointment = await prisma.appointments.create({
          data: {
            patientId: allocation.patientId,
            doctorId,
            firstName: patient.firstName,
            lastName: patient.lastName,
            email: patient.email,
            phone: patient.mobile,
            scheduleDate: moment(proposedStart).format('YYYY-MM-DD HH:mm:ss'),
            scheduleTime: moment(proposedStart).format('hh:mm A'),
            status: 'pending',
            paymentStatus: 'unpaid', // Queue patients pay at reception
            source: 'QUEUE', // Mark as queue-generated
            trackingId: trackingId,
          } as Prisma.AppointmentsUncheckedCreateInput
        });

        // 2. Create AppointmentSlot linked to Appointment
        const slot = await prisma.appointmentSlot.create({
          data: {
            doctorId,
            appointmentId: appointment.id,
            startTime: proposedStart,
            endTime: proposedEnd,
            isBooked: true,
          } as Prisma.AppointmentSlotUncheckedCreateInput,
        });

        // Add this new slot to busySlots so subsequent patients in this batch don't take it
        busySlots.push({ start: proposedStart, end: proposedEnd });

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

        console.log(`Queue appointment created: ${trackingId} for ${patient.firstName} ${patient.lastName} at ${moment(proposedStart).format('hh:mm A')}`);
      } catch (error) {
        console.error(`Failed to allocate appointment for patient ${allocation.patientId}:`, error);
      }
    }

    return appointmentsBooked;
  }

  // Generate tracking ID for queue appointments
  private async generateQueueTrackingId(): Promise<string> {
    const previousAppointment = await prisma.appointments.findFirst({
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    const appointmentLastNumber = (previousAppointment?.trackingId ?? '').slice(-3);
    const lastDigit = (Number(appointmentLastNumber) + 1 || 0).toString().padStart(3, '0');

    const year = moment().year();
    const month = (moment().month() + 1).toString().padStart(2, '0');
    const day = (moment().dayOfYear()).toString().padStart(2, '0');

    return `QUE${year}${month}${day}${lastDigit}`; // QUE prefix for queue appointments
  }

  // Helper to check if a slot overlaps with any busy slot
  private isOverlapping(start: Date, end: Date, busySlots: TimeSlot[]): boolean {
    for (const slot of busySlots) {
      // Check for overlap
      // Overlap exists if (StartA < EndB) and (EndA > StartB)
      if (start < slot.end && end > slot.start) {
        return true;
      }
    }
    return false;
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

      // Check if patient already has an appointment with this doctor today
      const todayStart = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss');
      const todayEnd = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');

      const existingAppointment = await prisma.appointments.findFirst({
        where: {
          patientId,
          doctorId,
          status: { in: ['pending', 'completed'] },
          scheduleDate: {
            gte: todayStart,
            lte: todayEnd
          }
        }
      });

      if (existingAppointment) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'Patient already has an appointment with this doctor today'
        );
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

