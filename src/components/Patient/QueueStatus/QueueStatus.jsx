import React, { useState, useEffect } from 'react';
import { FaClock, FaUserInjured, FaHospital } from 'react-icons/fa';
import { getNextPatients } from '../../../api/queueApi';
import useAuthCheck from '../../../redux/hooks/useAuthCheck';
import './QueueStatus.css';

const QueueStatus = () => {
  const { user } = useAuthCheck();
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadQueueStatus();
    }
  }, [user]);

  const loadQueueStatus = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError('');
      
      // For patients, we need to check if they're in any doctor's queue
      // This is a simplified version - in a real app, you'd have a patient-specific endpoint
      const response = await getNextPatients(user.id);
      setQueueData(response.data);
    } catch (error) {
      setError('Unable to load queue status');
      console.error('Error loading queue status:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = () => {
    loadQueueStatus();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="queue-status-container">
      <div className="card">
        <div className="card-header">
          <h6 className="card-title mb-0">
            <FaHospital className="me-2" />
            Queue Status
          </h6>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-warning" role="alert">
              {error}
              <button
                type="button"
                className="btn btn-sm btn-outline-warning ms-2"
                onClick={refreshStatus}
              >
                Retry
              </button>
            </div>
          ) : queueData && queueData.data && queueData.data.length > 0 ? (
            <div className="queue-info">
              <div className="row">
                <div className="col-md-12">
                  <div className="alert alert-info">
                    <FaUserInjured className="me-2" />
                    You are currently in the queue
                  </div>
                </div>
              </div>
              
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Doctor</th>
                      <th>Estimated Wait</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {queueData.data.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <span className="badge bg-primary">{item.position}</span>
                        </td>
                        <td>Dr. {item.doctor?.firstName} {item.doctor?.lastName}</td>
                        <td>
                          <FaClock className="me-1" />
                          {item.estimatedWaitTime} minutes
                        </td>
                        <td>
                          <span className="badge bg-warning">Waiting</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-center mt-3">
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={refreshStatus}
                >
                  Refresh Status
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted">
              <FaHospital className="mb-2" style={{ fontSize: '2rem' }} />
              <p>You are not currently in any queue</p>
              <small>Queue status will appear here when you join a doctor's queue</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueStatus;
