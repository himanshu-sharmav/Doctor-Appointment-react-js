import axios from 'axios';
import { getToken } from '../utils/jwt';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

// Create axios instance with default config
const queueApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
queueApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TEMPORARY: Test function without authentication
export const testDoctorEnter = async (doctorId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/queue/test/doctor/enter`, { doctorId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Doctor enters hospital
export const doctorEnter = async () => {
  try {
    const response = await queueApi.post('/v1/queue/doctor/enter');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Doctor exits hospital
export const doctorExit = async () => {
  try {
    const response = await queueApi.post('/v1/queue/doctor/exit');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get next patients in queue for a doctor
export const getNextPatients = async (doctorId) => {
  try {
    const response = await queueApi.get(`/v1/queue/doctor/${doctorId}/next-patients`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Book appointments for queued patients
export const bookQueueAppointments = async () => {
  try {
    const response = await queueApi.post('/v1/queue/appointments/book-queue');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add patient to queue
export const addToQueue = async (patientId, doctorId) => {
  try {
    const response = await queueApi.post('/v1/queue/add-to-queue', { patientId, doctorId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Remove patient from queue
export const removeFromQueue = async (patientId, doctorId) => {
  try {
    const response = await queueApi.post('/v1/queue/remove-from-queue', { patientId, doctorId });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export default queueApi;

