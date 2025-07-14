import React from 'react';

const StatusArea = ({ statusLogs }) => {

  const getStatusClass = (type) => {
    switch (type) {
      case 'success':
        return 'status-icon success';
      case 'error':
        return 'status-icon error';
      case 'warning':
        return 'status-icon warning';
      case 'info':
        return 'status-icon info';
      default:
        return 'status-icon info';
    }
  };

  return (
    <div className="status-area">
      <h4 className="card-title" style={{ marginBottom: '1rem' }}>Status & Logs</h4>
      {statusLogs.length === 0 ? (
        <p className="text-gray-500">No actions performed yet. Start by uploading logs or running detection.</p>
      ) : (
        statusLogs.map((log, index) => (
          <div key={index} className="status-item">
            <div className={getStatusClass(log.type)}></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>
                {log.title}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {log.message}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                {new Date(log.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StatusArea; 