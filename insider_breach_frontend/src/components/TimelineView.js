import React from 'react';
import { AlertTriangle, User, Shield } from 'lucide-react';

const TimelineView = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading" style={{ margin: '0 auto 1rem' }}></div>
        <p style={{ color: '#6b7280' }}>Loading breach events...</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
        <Shield size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
        <p>No breach events found</p>
      </div>
    );
  }

  // Sort events by timestamp (most recent first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.timestamp || a.hour || a.created_at);
    const dateB = new Date(b.timestamp || b.hour || b.created_at);
    return dateB - dateA;
  });

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getEventType = (event) => {
    if (typeof event.event_type === 'string') return event.event_type;
    if (typeof event.type === 'string') return event.type;
    return 'Unknown';
  };

  const getUsername = (event) => {
    if (typeof event.username === 'string') return event.username;
    if (typeof event.user === 'string') return event.user;
    return 'Unknown';
  };

  const getIPAddress = (event) => {
    if (typeof event.ip === 'string') return event.ip;
    if (typeof event.ip_address === 'string') return event.ip_address;
    return 'N/A';
  };

  const isAnomalous = (event) => {
    if (typeof event.is_anomalous === 'boolean') return event.is_anomalous;
    if (typeof event.anomalous === 'boolean') return event.anomalous;
    return false;
  };

  return (
    <div className="timeline-container">
      {sortedEvents.map((event, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-marker">
            {isAnomalous(event) ? (
              <div className="timeline-marker-anomalous">
                <AlertTriangle size={18} />
              </div>
            ) : (
              <div className="timeline-marker-normal">
                <User size={18} />
              </div>
            )}
          </div>
          
          <div className="timeline-content">
            <div className="timeline-card">
              <div className="timeline-header">
                <div className="timeline-user">
                  <User size={18} />
                  <span style={{ fontWeight: '600' }}>{getUsername(event)}</span>
                </div>
                <div className="timeline-status">
                  {isAnomalous(event) ? (
                    <span className="badge badge-danger">Anomalous</span>
                  ) : (
                    <span className="badge badge-success">Normal</span>
                  )}
                </div>
              </div>
              
              <div className="timeline-details">
                <div className="timeline-detail-item">
                  <span style={{ fontWeight: '500', color: '#374151' }}>Event Type:</span>
                  <span>{getEventType(event)}</span>
                </div>
                
                <div className="timeline-detail-item">
                  <span style={{ fontWeight: '500', color: '#374151' }}>IP Address:</span>
                  <span>{getIPAddress(event)}</span>
                </div>
                
                <div className="timeline-detail-item">
                  <span style={{ fontWeight: '500', color: '#374151' }}>Time:</span>
                  <span>{formatTimestamp(event.timestamp || event.hour || event.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView; 