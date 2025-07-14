import React, { useState, useEffect } from 'react';
import { 
  NetworkStatusIndicator, 
  SystemHealthIndicator, 
  ActivityIndicator
} from './SecurityIcons';
import { RefreshCw, Server } from 'lucide-react';
import { checkBackendHealth } from '../services/api';

const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [systemHealth, setSystemHealth] = useState(95);
  const [responseTime, setResponseTime] = useState(0);
  const [lastCheck, setLastCheck] = useState('');

  const checkBackendStatus = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      const healthData = await checkBackendHealth();
      const endTime = Date.now();
      const responseTimeMs = endTime - startTime;
      setResponseTime(responseTimeMs);
      
      const isHealthy = healthData.status === 'healthy';
      setIsOnline(isHealthy);
      
      // Calculate system health based on response time and backend status
      if (isHealthy) {
        const health = Math.max(50, 100 - (responseTimeMs / 50));
        setSystemHealth(Math.round(health));
      } else {
        setSystemHealth(30);
      }
      
      setLastCheck(new Date().toLocaleTimeString());
    } catch (error) {
      console.log('Backend status check failed:', error);
      setIsOnline(false);
      setSystemHealth(0);
      setResponseTime(0);
      setLastCheck(new Date().toLocaleTimeString());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getUptime = () => {
    if (!isOnline) return '0%';
    return `${Math.max(90, systemHealth)}%`;
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      maxWidth: '280px'
    }}>
      {/* Main Status Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isOnline ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        borderRadius: '12px',
        padding: '1rem',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Server size={20} color={isOnline ? '#10b981' : '#ef4444'} />
            <span style={{
              fontSize: '1rem',
              fontWeight: '700',
              color: '#1e293b'
            }}>
              Backend Status
            </span>
          </div>
          <button
            onClick={checkBackendStatus}
            disabled={isChecking}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          >
            <RefreshCw 
              size={18} 
              className={isChecking ? 'loading' : ''} 
            />
          </button>
        </div>

        {/* Status Indicators */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <NetworkStatusIndicator 
            status={isOnline ? 'connected' : 'disconnected'}
            strength={isOnline ? 'high' : 'none'}
          />
          
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <ActivityIndicator 
              isActive={isOnline} 
              type="server" 
              size="small" 
            />
            <ActivityIndicator 
              isActive={isOnline} 
              type="database" 
              size="small" 
            />
            <ActivityIndicator 
              isActive={isOnline} 
              type="monitor" 
              size="small" 
            />
          </div>

          {/* Quick Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            color: '#6b7280',
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <div>
              <div style={{ fontWeight: '600' }}>Response Time</div>
              <div style={{ color: responseTime < 1000 ? '#10b981' : '#ef4444' }}>
                {responseTime}ms
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Health</div>
              <div style={{ color: systemHealth > 70 ? '#10b981' : '#ef4444' }}>
                {systemHealth}%
              </div>
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>Last Check</div>
              <div>{lastCheck}</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Card */}
      {isOnline && (
        <SystemHealthIndicator 
          health={systemHealth}
          uptime={getUptime()}
          lastCheck={lastCheck}
        />
      )}
    </div>
  );
};

export default BackendStatus; 