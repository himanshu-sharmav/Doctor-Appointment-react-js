import React, { useState, useEffect } from 'react';
import { FaHospital, FaSignOutAlt, FaUsers, FaClock, FaCheckCircle, FaUserMd } from 'react-icons/fa';
import { doctorEnter, doctorExit, getNextPatients, bookQueueAppointments, testDoctorEnter } from '../../../api/queueApi';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import './QueueManagement.css';

const QueueManagement = () => {
  const { data: user, role, authChecked } = useAuthCheck();
  const [isAvailable, setIsAvailable] = useState(false);
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if doctor is currently available from localStorage
    if (user?.id) {
      const savedStatus = localStorage.getItem(`doctor_${user.id}_available`);
      if (savedStatus === 'true') {
        setIsAvailable(true);
      }
    }
    // Load queue data if available
    if (isAvailable) {
      loadQueueData();
    }
  }, [isAvailable, user?.id]);

  const loadQueueData = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await getNextPatients(user.id);
      setQueueData(response.data);
    } catch (error) {
      setMessage('Failed to load queue data');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorEnter = async () => {
    if (!user?.id || loading) return;
    
    try {
      setLoading(true);
      const response = await doctorEnter();
      
      setIsAvailable(true);
      setMessage(response.message || 'Successfully entered hospital');
      localStorage.setItem(`doctor_${user.id}_available`, 'true');
      
      await loadQueueData();
    } catch (error) {
      setMessage(`Failed to enter hospital: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestDoctorEnter = async () => {
    if (!user?.id || loading) return;
    
    try {
      setLoading(true);
      const response = await testDoctorEnter(user.id);
      setIsAvailable(true);
      setMessage(`TEST SUCCESS: ${response.message}`);
      localStorage.setItem(`doctor_${user.id}_available`, 'true');
      await loadQueueData();
    } catch (error) {
      setMessage(`TEST FAILED: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorExit = async () => {
    if (!user?.id || loading) return;
    
    try {
      setLoading(true);
      const response = await doctorExit();
      
      setIsAvailable(false);
      setMessage(response.message);
      setQueueData(null);
      localStorage.removeItem(`doctor_${user.id}_available`);
    } catch (error) {
      setMessage('Failed to exit hospital');
    } finally {
      setLoading(false);
    }
  };

  const handleBookQueueAppointments = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const response = await bookQueueAppointments();
      setMessage(response.message);
      await loadQueueData();
    } catch (error) {
      setMessage('Failed to book queue appointments');
    } finally {
      setLoading(false);
    }
  };

  const refreshQueue = () => {
    if (isAvailable) {
      loadQueueData();
    }
  };

  if (!authChecked) {
    return (
      <div className="queue-management-container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Initializing system...</p>
        </div>
      </div>
    );
  }

  if (!user || role !== 'doctor') {
    return (
      <div className="queue-management-container">
        <div className="alert alert-warning">
          <h5><FaUserMd className="me-2" />Access Restricted</h5>
          <p>This feature is exclusively available for authenticated medical practitioners.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="queue-management-container">
      <div className="row">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">
                <FaHospital className="me-2" />
                Intelligent Queue Management System
              </h5>
            </div>
            <div className="card-body">
              {/* Status and Control Panel */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="status-indicator">
                    <span className={`status-badge ${isAvailable ? 'available' : 'unavailable'}`}>
                      <FaUserMd className="me-1" />
                      {isAvailable ? 'Active & Available' : 'Currently Offline'}
                    </span>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  {!isAvailable ? (
                    <>
                      <button
                        className="btn btn-success btn-lg me-2"
                        onClick={handleDoctorEnter}
                        disabled={loading}
                      >
                        <FaHospital className="me-2" />
                        {loading ? 'Activating...' : 'Activate Practice Mode'}
                      </button>
                      <button
                        className="btn btn-warning btn-lg"
                        onClick={handleTestDoctorEnter}
                        disabled={loading}
                      >
                        <FaHospital className="me-2" />
                        Test Enter (No Auth)
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-danger btn-lg"
                      onClick={handleDoctorExit}
                      disabled={loading}
                    >
                      <FaSignOutAlt className="me-2" />
                      {loading ? 'Deactivating...' : 'Deactivate Practice Mode'}
                    </button>
                  )}
                  {isAvailable && (
                    <button
                      className="btn btn-primary btn-lg ms-2"
                      onClick={handleBookQueueAppointments}
                      disabled={loading}
                    >
                      <FaCheckCircle className="me-2" />
                      Process Queue
                    </button>
                  )}
                </div>
              </div>

              {/* Status Messages */}
              {message && (
                <div className="alert alert-info alert-dismissible fade show" role="alert">
                  <FaUserMd className="me-2" />
                  {message}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setMessage('')}
                  ></button>
                </div>
              )}

              {/* Queue Management Interface */}
              {isAvailable && (
                <div className="queue-info">
                  <div className="row mb-3">
                    <div className="col-md-12">
                      <h6 className="text-primary">
                        <FaUsers className="me-2" />
                        Patient Queue Management
                        <button
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={refreshQueue}
                          disabled={loading}
                        >
                          <FaClock className="me-1" />
                          Refresh
                        </button>
                      </h6>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-2 text-muted">Retrieving patient data...</p>
                    </div>
                  ) : queueData && queueData.data && queueData.data.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover table-striped">
                        <thead className="table-dark">
                          <tr>
                            <th>Queue Position</th>
                            <th>Patient Information</th>
                            <th>Contact Details</th>
                            <th>Estimated Wait Time</th>
                            <th>Recommended Slot</th>
                          </tr>
                        </thead>
                        <tbody>
                          {queueData.data.map((item, index) => (
                            <tr key={item.id} className="align-middle">
                              <td>
                                <span className="badge bg-primary fs-6">#{index + 1}</span>
                              </td>
                              <td>
                                <strong>{item.patient?.firstName} {item.patient?.lastName}</strong>
                                <br />
                                <small className="text-muted">Patient ID: {item.patientId}</small>
                              </td>
                              <td>
                                <FaUserMd className="me-1 text-muted" />
                                {item.patient?.email}
                                <br />
                                <small className="text-muted">{item.patient?.phone}</small>
                              </td>
                              <td>
                                <FaClock className="me-1 text-warning" />
                                <span className="fw-bold">{item.estimatedWaitTime || 15} minutes</span>
                              </td>
                              <td>
                                {item.recommendedSlot ? (
                                  <span className="badge bg-success">
                                    {new Date(item.recommendedSlot).toLocaleTimeString()}
                                  </span>
                                ) : (
                                  <span className="text-muted">Pending allocation</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <FaUsers className="mb-3 text-muted" style={{ fontSize: '3rem' }} />
                      <h6 className="text-muted">No patients currently in queue</h6>
                      <p className="text-muted small">The queue is empty. Patients will appear here when they join.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Welcome Message */}
              {!isAvailable && (
                <div className="text-center py-5">
                  <FaHospital className="mb-3 text-primary" style={{ fontSize: '4rem' }} />
                  <h5 className="text-primary mb-3">Welcome to Smart Queue Management</h5>
                  <p className="text-muted mb-4">
                    Activate Practice Mode to begin managing your patient queue efficiently. 
                    Our AI-powered system will help optimize patient flow and reduce wait times.
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <div className="alert alert-info">
                        <h6><FaUserMd className="me-2" />System Features:</h6>
                        <ul className="mb-0 text-start">
                          <li>Real-time patient queue monitoring</li>
                          <li>AI-powered wait time estimation</li>
                          <li>Automated appointment slot allocation</li>
                          <li>Intelligent queue optimization</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueManagement;
