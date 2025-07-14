import React from 'react';

const StatusIndicator = ({ breachEvents, tamperingResults, isLoadingBreachEvents, isCheckingTampering }) => {
  const getStatusColor = (isLoading, hasData) => {
    if (isLoading) return '#f59e0b'; // Yellow for loading
    if (hasData) return '#10b981'; // Green for success
    return '#6b7280'; // Gray for no data
  };

  const getStatusText = (isLoading, hasData, dataType) => {
    if (isLoading) return `Loading ${dataType}...`;
    if (hasData) return `${dataType} Loaded`;
    return `No ${dataType} Available`;
  };

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      borderRadius: '12px',
      marginBottom: '1rem',
      flexWrap: 'wrap'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(isLoadingBreachEvents, Array.isArray(breachEvents) && breachEvents.length > 0),
          animation: isLoadingBreachEvents ? 'pulse 1.5s infinite' : 'none'
        }}></div>
        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
          {getStatusText(isLoadingBreachEvents, Array.isArray(breachEvents) && breachEvents.length > 0, 'Breach Events')}
        </span>
        {Array.isArray(breachEvents) && breachEvents.length > 0 && (
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            ({breachEvents.length} events)
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: getStatusColor(isCheckingTampering, Array.isArray(tamperingResults) && tamperingResults.length > 0),
          animation: isCheckingTampering ? 'pulse 1.5s infinite' : 'none'
        }}></div>
        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
          {getStatusText(isCheckingTampering, Array.isArray(tamperingResults) && tamperingResults.length > 0, 'Tampering Results')}
        </span>
        {Array.isArray(tamperingResults) && tamperingResults.length > 0 && (
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            ({tamperingResults.length} files)
          </span>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StatusIndicator; 