import React, { useState } from 'react';
import { 
  getBreachEvents, 
  checkFileTampering,
  checkBackendHealth,
  getSystemStatus
} from '../services/api';

const TestAPI = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (name, testFunction) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [name]: { success: true, data: result, timestamp: new Date().toISOString() }
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [name]: { success: false, error: error.message, timestamp: new Date().toISOString() }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const runAllTests = async () => {
    await testEndpoint('Health Check', checkBackendHealth);
    await testEndpoint('System Status', getSystemStatus);
    await testEndpoint('Breach Events', getBreachEvents);
    await testEndpoint('File Tampering', checkFileTampering);
  };

  return (
    <div style={{
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.95)',
      border: '1px solid rgba(102, 126, 234, 0.2)',
      borderRadius: '12px',
      marginBottom: '1rem'
    }}>
      <h3>API Test Results</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={runAllTests}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '0.5rem'
          }}
        >
          Run All Tests
        </button>
        
        <button 
          onClick={() => testEndpoint('Health Check', checkBackendHealth)}
          disabled={loading['Health Check']}
          style={{
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '0.5rem',
            opacity: loading['Health Check'] ? 0.6 : 1
          }}
        >
          {loading['Health Check'] ? 'Testing...' : 'Health Check'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {Object.entries(results).map(([name, result]) => (
          <div key={name} style={{
            padding: '1rem',
            border: `1px solid ${result.success ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            background: result.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
          }}>
            <h4 style={{ 
              margin: '0 0 0.5rem 0',
              color: result.success ? '#10b981' : '#ef4444'
            }}>
              {name} - {result.success ? '✅ Success' : '❌ Failed'}
            </h4>
            
            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              <strong>Timestamp:</strong> {result.timestamp}
            </div>
            
            {result.success ? (
              <div style={{ fontSize: '0.875rem' }}>
                <strong>Data:</strong>
                <pre style={{ 
                  background: 'rgba(0, 0, 0, 0.05)', 
                  padding: '0.5rem', 
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
                <strong>Error:</strong> {result.error}
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(results).length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          padding: '2rem',
          fontStyle: 'italic'
        }}>
          No tests run yet. Click "Run All Tests" to start testing API endpoints.
        </div>
      )}
    </div>
  );
};

export default TestAPI; 