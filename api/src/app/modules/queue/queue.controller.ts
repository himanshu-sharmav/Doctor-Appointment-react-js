import { Request, Response, NextFunction } from 'express';
import { QueueService } from './queue.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const queueService = new QueueService();

export class QueueController {
  // TEMPORARY: Test route without authentication
  doctorEnterTest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { doctorId } = req.body;
    
    if (!doctorId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Doctor ID is required',
        data: null,
      });
    }

    try {
      // For testing, just return success without database operations
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Test: Doctor entered successfully (no DB operations)',
        data: { doctorId, timestamp: new Date().toISOString() },
      });
    } catch (error) {
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Test failed',
        data: null,
      });
    }
  });

  // Doctor enters hospital
  doctorEnter = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get doctor ID from authenticated user
    const doctorId = (req as any).user?.userId;
    
    if (!doctorId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Doctor ID not found in authentication',
        data: null,
      });
    }

    const result = await queueService.doctorEnter(doctorId);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  });

  // Doctor exits hospital
  doctorExit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get doctor ID from authenticated user
    const doctorId = (req as any).user?.userId;
    
    if (!doctorId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Doctor ID not found in authentication',
        data: null,
      });
    }

    const result = await queueService.doctorExit(doctorId);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  });

  // Get next patients in queue
  getNextPatients = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id: doctorId } = req.params;
    
    if (!doctorId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Doctor ID is required',
        data: null,
      });
    }

    const result = await queueService.getNextPatients(doctorId);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Queue data retrieved successfully',
      data: result,
    });
  });

  // Book appointments for queued patients
  bookQueueAppointments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // Get doctor ID from authenticated user
    const doctorId = (req as any).user?.userId;
    
    if (!doctorId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Doctor ID not found in authentication',
        data: null,
      });
    }

    const result = await queueService.bookQueueAppointments(doctorId);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: result,
    });
  });

  // Add patient to queue
  addToQueue = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { patientId, doctorId } = req.body;
    
    if (!patientId || !doctorId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Patient ID and Doctor ID are required',
        data: null,
      });
    }

    const result = await queueService.addToQueue(patientId, doctorId);
    
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: result.message,
      data: result.data,
    });
  });

  // Remove patient from queue
  removeFromQueue = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { patientId, doctorId } = req.body;
    
    if (!patientId || !doctorId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Patient ID and Doctor ID are required',
        data: null,
      });
    }

    const result = await queueService.removeFromQueue(patientId, doctorId);
    
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  });
}
