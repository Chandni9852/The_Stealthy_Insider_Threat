import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          margin: '1rem'
        }}>
          <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h3 style={{
            color: '#1e293b',
            marginBottom: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            Something went wrong
          </h3>
          <p style={{
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '1.5rem',
            maxWidth: '400px'
          }}>
            An unexpected error occurred. This might be due to a network issue or backend connectivity problem.
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <RefreshCw size={18} />
            Try Again
          </button>
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}>
              <summary style={{ cursor: 'pointer', color: '#ef4444', fontWeight: '600' }}>
                Error Details (Development)
              </summary>
              <pre style={{
                marginTop: '0.5rem',
                color: '#6b7280',
                fontSize: '0.75rem',
                overflow: 'auto',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 