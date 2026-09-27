import React from 'react';
import { Users, AlertTriangle, FileText } from 'lucide-react';

const DashboardSummary = ({ breachEvents, tamperingResults, isLoading }) => {
  console.log('DashboardSummary props:', { breachEvents, tamperingResults, isLoading });
  
  const calculateStats = () => {
    const totalLogins = Array.isArray(breachEvents) ? breachEvents.length : 0;
    const totalAnomalies = Array.isArray(breachEvents) ? breachEvents.filter(event => event.is_anomalous).length : 0;
    const totalTampered = Array.isArray(tamperingResults) ? tamperingResults.filter(file => file.status === 'tampered').length : 0;
    
    const stats = { totalLogins, totalAnomalies, totalTampered };
    console.log('DashboardSummary stats:', stats);
    return stats;
  };

  const stats = calculateStats();

  const summaryCards = [
    {
      title: 'Total Logins Processed',
      value: stats.totalLogins,
      icon: Users,
      gradient: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
      borderColor: 'rgba(102, 126, 234, 0.3)',
      iconColor: 'var(--color-primary)'
    },
    {
      title: 'Anomalies Detected',
      value: stats.totalAnomalies,
      icon: AlertTriangle,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      iconColor: '#ef4444'
    },
    {
      title: 'Tampered Files',
      value: stats.totalTampered,
      icon: FileText,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      iconColor: '#f59e0b'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="summary-card" style={{ 
            minHeight: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div className="loading" style={{ 
              width: '2rem', 
              height: '2rem',
              border: '3px solid rgba(102, 126, 234, 0.2)',
              borderTopColor: 'var(--color-primary)'
            }}></div>
            <p style={{ 
              textAlign: 'center', 
              color: '#6b7280',
              fontWeight: '500',
              fontSize: '0.875rem'
            }}>Loading...</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {summaryCards.map((card, index) => (
        <div key={index} className="summary-card" style={{
          background: card.bgGradient,
          border: `1px solid ${card.borderColor}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: card.gradient,
            backgroundSize: '200% 100%',
            animation: 'gradientShift 3s ease infinite'
          }}></div>
          <div className="summary-card-content">
            <div className="summary-icon" style={{
              background: card.gradient,
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'white',
              boxShadow: `0 4px 15px ${card.iconColor}40`,
              animation: 'float 3s ease-in-out infinite'
            }}>
              <card.icon size={24} />
            </div>
            <div className="summary-text">
              <h3 className="summary-title" style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.5rem'
              }}>{card.title}</h3>
              <p className="summary-value" style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: card.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                margin: 0,
                lineHeight: 1
              }}>{card.value.toLocaleString()}</p>
            </div>
          </div>
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '-20px',
            transform: 'translateY(-50%)',
            fontSize: '3rem',
            opacity: '0.05',
            color: card.iconColor,
            pointerEvents: 'none'
          }}>
            <card.icon size={48} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary; 