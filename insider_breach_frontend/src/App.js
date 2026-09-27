import React, { useState, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  Upload, 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle,
  Loader,
  Download,
  Clock
} from 'lucide-react';

import CollapsibleSection from './components/CollapsibleSection';
import StatusArea from './components/StatusArea';
import DataTable from './components/DataTable';
import TimelineView from './components/TimelineView';
import DashboardSummary from './components/DashboardSummary';
import BackendStatus from './components/BackendStatus';
import AnalyticsCharts from './components/AnalyticsCharts';
import { SecurityStatusIndicator, ActivityIndicator } from './components/SecurityIcons';
import { SecurityIllustration } from './components/SecurityIllustrations';
import ErrorBoundary from './components/ErrorBoundary';
import TestAPI from './components/TestAPI';
import StatusIndicator from './components/StatusIndicator';
import { 
  getBreachEvents, 
  registerFileForMonitoring, 
  checkFileTampering,
  downloadBreachEventsCSV,
  downloadTamperedFilesCSV,
  uploadLogs,
  runDetectionPipeline
} from './services/api';

function App() {
  // Dark mode
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light';
    } catch {
      return 'light';
    }
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore storage errors (e.g. private browsing)
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // State management
  const [loginLogsFile, setLoginLogsFile] = useState(null);
  const [fileAccessLogsFile, setFileAccessLogsFile] = useState(null);
  const [filePath, setFilePath] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingBreachEvents, setIsLoadingBreachEvents] = useState(false);
  const [isRegisteringFile, setIsRegisteringFile] = useState(false);
  const [isCheckingTampering, setIsCheckingTampering] = useState(false);
  const [isDownloadingBreachEvents, setIsDownloadingBreachEvents] = useState(false);
  const [isDownloadingTamperedFiles, setIsDownloadingTamperedFiles] = useState(false);
  const [breachEvents, setBreachEvents] = useState([]);
  const [tamperingResults, setTamperingResults] = useState([]);
  const [statusLogs, setStatusLogs] = useState([]);

  // File input refs
  const loginLogsInputRef = useRef();
  const fileAccessLogsInputRef = useRef();

  // Add status log helper
  const addStatusLog = (type, title, message) => {
    const newLog = {
      type,
      title,
      message,
      timestamp: new Date().toISOString()
    };
    setStatusLogs(prev => [newLog, ...prev.slice(0, 9)]); // Keep last 10 logs
  };

  // File upload handlers
  const handleFileSelect = (file, setFile, fileType) => {
    if (file && file.type === 'text/csv') {
      setFile(file);
      addStatusLog('info', `${fileType} Selected`, `File: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);
    } else {
      toast.error('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    // Check if both files are selected
    if (!loginLogsFile || !fileAccessLogsFile) {
      toast.error('Please select both login logs and file access logs files');
      return;
    }

    setIsUploading(true);
    
    try {
      // Use the API service function
      await uploadLogs(loginLogsFile, fileAccessLogsFile);
      addStatusLog('success', 'Upload Complete', 'Files uploaded successfully');
      toast.success('✅ Upload complete');
      
    } catch (error) {
      // Handle API errors
      let errorMessage = 'Upload failed';
      
      if (error.response?.data?.detail) {
        // Handle FastAPI validation errors
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map(err => err.msg || err.message).join(', ');
        } else if (detail.msg) {
          errorMessage = detail.msg;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - check if backend is running';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addStatusLog('error', 'Upload Failed', errorMessage);
      toast.error(`❌ Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Detection pipeline handler
  const handleRunDetection = async () => {
    setIsProcessing(true);
    try {
      await runDetectionPipeline();
      addStatusLog('success', 'Detection Complete', 'Breach detection pipeline completed successfully');
      toast.success("✅ Breach detection complete!");
    } catch (error) {
      console.error("❌ Detection error:", error);
      let errorMessage = "Could not reach backend";
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map(err => err.msg || err.message).join(', ');
        } else if (detail.msg) {
          errorMessage = detail.msg;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - check if backend is running';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addStatusLog('error', 'Detection Failed', errorMessage);
      toast.error(`❌ Detection failed: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };
  

  // Breach events handler
  const handleViewBreachEvents = async () => {
    setIsLoadingBreachEvents(true);
    try {
      console.log('Fetching breach events...');
      const data = await getBreachEvents();
      console.log('Breach events response:', data);
      setBreachEvents(data || []);
      addStatusLog('info', 'Breach Events Loaded', `Found ${(data || []).length} breach events`);
      toast.success(`Loaded ${(data || []).length} breach events`);
    } catch (error) {
      console.error('Error loading breach events:', error);
      let errorMessage = 'Failed to load breach events';
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map(err => err.msg || err.message).join(', ');
        } else if (detail.msg) {
          errorMessage = detail.msg;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - check if backend is running';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addStatusLog('error', 'Load Failed', errorMessage);
      toast.error(`Failed to load breach events: ${errorMessage}`);
      setBreachEvents([]);
    } finally {
      setIsLoadingBreachEvents(false);
    }
  };

  // File registration handler
  const handleRegisterFile = async () => {
    if (!filePath.trim()) {
      toast.error('Please enter a file path');
      return;
    }

    setIsRegisteringFile(true);
    try {
      await registerFileForMonitoring(filePath);
      addStatusLog('success', 'File Registered', `File ${filePath} registered for monitoring`);
      toast.success('File registered for monitoring!');
      setFilePath('');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message || 'Registration failed';
      addStatusLog('error', 'Registration Failed', errorMessage);
      toast.error(`Registration failed: ${errorMessage}`);
    } finally {
      setIsRegisteringFile(false);
    }
  };

  // File tampering check handler
  const handleCheckTampering = async () => {
    setIsCheckingTampering(true);
    try {
      console.log('Checking file tampering...');
      const data = await checkFileTampering();
      console.log('Tampering check response:', data);
      setTamperingResults(data || []);
      addStatusLog('info', 'Tampering Check Complete', `Checked ${(data || []).length} files for tampering`);
      toast.success(`Tampering check completed for ${(data || []).length} files`);
    } catch (error) {
      console.error('Error checking tampering:', error);
      let errorMessage = 'Tampering check failed';
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map(err => err.msg || err.message).join(', ');
        } else if (detail.msg) {
          errorMessage = detail.msg;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout - check if backend is running';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addStatusLog('error', 'Tampering Check Failed', errorMessage);
      toast.error(`Tampering check failed: ${errorMessage}`);
      setTamperingResults([]);
    } finally {
      setIsCheckingTampering(false);
    }
  };

  // Download handlers
  const handleDownloadBreachEvents = async () => {
    setIsDownloadingBreachEvents(true);
    try {
      await downloadBreachEventsCSV();
      addStatusLog('success', 'Download Complete', 'Breach events CSV download initiated');
      toast.success('Breach events CSV download started!');
    } catch (error) {
      const errorMessage = error.message || 'Download failed';
      addStatusLog('error', 'Download Failed', errorMessage);
      toast.error(`Download failed: ${errorMessage}`);
    } finally {
      setIsDownloadingBreachEvents(false);
    }
  };

  const handleDownloadTamperedFiles = async () => {
    setIsDownloadingTamperedFiles(true);
    try {
      await downloadTamperedFilesCSV();
      addStatusLog('success', 'Download Complete', 'Tampered files CSV download initiated');
      toast.success('Tampered files CSV download started!');
    } catch (error) {
      const errorMessage = error.message || 'Download failed';
      addStatusLog('error', 'Download Failed', errorMessage);
      toast.error(`Download failed: ${errorMessage}`);
    } finally {
      setIsDownloadingTamperedFiles(false);
    }
  };

  // Table column definitions
  const breachEventsColumns = [
    { 
      key: 'username', 
      label: 'Username',
      render: (value, row) => {
        if (typeof value === 'string') return value;
        if (typeof row.user === 'string') return row.user;
        if (typeof row.username === 'string') return row.username;
        return 'Unknown';
      }
    },
    { 
      key: 'ip', 
      label: 'IP Address',
      render: (value, row) => {
        if (typeof value === 'string') return value;
        if (typeof row.ip_address === 'string') return row.ip_address;
        if (typeof row.ip === 'string') return row.ip;
        return 'N/A';
      }
    },
    { 
      key: 'hour', 
      label: 'Timestamp',
      render: (value, row) => {
        const timestamp = value || row.timestamp || row.created_at || row.hour;
        if (!timestamp) return 'N/A';
        try {
          return new Date(timestamp).toLocaleString();
        } catch (error) {
          return 'Invalid date';
        }
      }
    },
    { 
      key: 'is_anomalous', 
      label: 'Anomalous',
      render: (value, row) => {
        const isAnomalous = typeof value === 'boolean' ? value : 
                           typeof row.anomalous === 'boolean' ? row.anomalous : 
                           typeof row.is_anomalous === 'boolean' ? row.is_anomalous : false;
        return (
          <span className={`badge ${isAnomalous ? 'badge-danger' : 'badge-success'}`}>
            {isAnomalous ? 'Yes' : 'No'}
          </span>
        );
      }
    },
    { 
      key: 'event_type', 
      label: 'Event Type',
      render: (value, row) => {
        if (typeof value === 'string') return value;
        if (typeof row.type === 'string') return row.type;
        if (typeof row.event_type === 'string') return row.event_type;
        return 'Unknown';
      }
    }
  ];

  const tamperingColumns = [
    { 
      key: 'file_path', 
      label: 'File Path',
      render: (value, row) => {
        if (typeof value === 'string') return value;
        if (typeof row.path === 'string') return row.path;
        return 'N/A';
      }
    },
    { 
      key: 'original_hash', 
      label: 'Original Hash',
      render: (value, row) => {
        if (typeof value === 'string') return value;
        if (typeof row.original_hash === 'string') return row.original_hash;
        return 'N/A';
      }
    },
    { 
      key: 'current_hash', 
      label: 'Current Hash',
      render: (value, row) => {
        if (typeof value === 'string') return value;
        if (typeof row.current_hash === 'string') return row.current_hash;
        return 'N/A';
      }
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value, row) => {
        const status = value || row.status || 'unknown';
        return (
          <span className={`badge ${status === 'tampered' ? 'badge-danger' : 'badge-success'}`}>
            {status === 'tampered' ? 'Tampered' : 'OK'}
          </span>
        );
      }
    }
  ];

  return (
    <ErrorBoundary>
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <ToastContainer position="top-right" autoClose={5000} />
      
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 1000,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '999px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: 'var(--color-text)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
          }}
        >
          {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
        </button>

        {/* Header with integrated status */}
        <div className="header-layout">
          {/* Main header content */}
          <div className="card" style={{ 
            textAlign: 'center', 
            flex: 1,
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-primary-dark), var(--color-primary-light))',
              backgroundSize: '200% 100%',
              animation: 'gradientShift 3s ease infinite'
            }}></div>
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              🔒 The Stealthy Insider Threat
            </h1>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '1.2rem',
              fontWeight: '500',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Monitor and detect security breaches using advanced anomaly detection and file integrity monitoring
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <SecurityStatusIndicator status="secure" size="small" />
              <ActivityIndicator isActive={true} type="monitor" size="small" />
              <ActivityIndicator isActive={true} type="database" size="small" />
              <ActivityIndicator isActive={true} type="network" size="small" />
            </div>
          </div>

          {/* Backend Status - positioned to the right of header */}
          <div style={{ flexShrink: 0 }}>
            <BackendStatus />
          </div>
        </div>

      {/* Status Indicator */}
      <StatusIndicator 
        breachEvents={breachEvents}
        tamperingResults={tamperingResults}
        isLoadingBreachEvents={isLoadingBreachEvents}
        isCheckingTampering={isCheckingTampering}
      />

      {/* Dashboard Summary */}
      <DashboardSummary 
        breachEvents={breachEvents}
        tamperingResults={tamperingResults}
        isLoading={isLoadingBreachEvents || isCheckingTampering}
      />

      {/* API Testing Section */}
      <CollapsibleSection title="🔧 API Testing & Debug" defaultExpanded={true}>
        <TestAPI />
      </CollapsibleSection>

      {/* Analytics Charts */}
      <CollapsibleSection title="📊 Analytics & Insights" defaultExpanded={true}>
        <AnalyticsCharts 
          breachEvents={breachEvents}
          tamperingResults={tamperingResults}
        />
      </CollapsibleSection>

      <div className="grid grid-cols-2">
        {/* Left Column */}
        <div>
          {/* Log Upload & Detection Section */}
          <CollapsibleSection title="📁 Log Upload & Detection" defaultExpanded={true}>
            <div className="card">
              <div className="card-header">
                <h4>Upload Log Files</h4>
              </div>
              
              <div className="upload-area" style={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '2px dashed rgba(102, 126, 234, 0.3)',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                marginBottom: '1rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  opacity: '0.1',
                  pointerEvents: 'none'
                }}>
                  <SecurityIllustration type="lock" size={120} color="var(--color-primary)" />
                </div>
                
                {/* Security Status Header */}
                <div className="security-status-header" style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <SecurityStatusIndicator status="secure" size="small" />
                  <ActivityIndicator isActive={true} type="monitor" size="small" />
                  <ActivityIndicator isActive={true} type="database" size="small" />
                </div>
                <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                  <label className="file-input-label" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    fontSize: '1rem'
                  }}>
                    <Upload size={18} style={{ color: 'var(--color-primary)' }} />
                    Select Login Logs (login_logs.csv)
                    <input
                      ref={loginLogsInputRef}
                      type="file"
                      accept=".csv"
                      className="file-input"
                      onChange={(e) => handleFileSelect(e.target.files[0], setLoginLogsFile, 'Login Logs')}
                    />
                  </label>
                  {loginLogsFile && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      fontSize: '0.875rem', 
                      color: '#10b981',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      <CheckCircle size={18} />
                      {loginLogsFile.name} ({(loginLogsFile.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                  <label className="file-input-label" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem 1.5rem',
                    background: 'linear-gradient(135deg, var(--color-surface) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    border: '2px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontWeight: '600',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                    fontSize: '1rem'
                  }}>
                    <Upload size={18} style={{ color: 'var(--color-primary)' }} />
                    Select File Access Logs (file_access_logs.csv)
                    <input
                      ref={fileAccessLogsInputRef}
                      type="file"
                      accept=".csv"
                      className="file-input"
                      onChange={(e) => handleFileSelect(e.target.files[0], setFileAccessLogsFile, 'File Access Logs')}
                    />
                  </label>
                  {fileAccessLogsFile && (
                    <div style={{ 
                      marginTop: '0.75rem', 
                      fontSize: '0.875rem', 
                      color: '#10b981',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}>
                      <CheckCircle size={18} />
                      {fileAccessLogsFile.name} ({(fileAccessLogsFile.size / 1024).toFixed(2)} KB)
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={!loginLogsFile || !fileAccessLogsFile || isUploading}
                  style={{
                    background: !loginLogsFile || !fileAccessLogsFile ? 
                      'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' : 
                      'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
                    transform: 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {isUploading ? <Loader className="loading" /> : <Upload size={18} />}
                  {isUploading ? 'Uploading...' : 'Upload Logs'}
                </button>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  className="btn btn-success"
                  onClick={handleRunDetection}
                  disabled={isProcessing}
                  style={{
                    transform: 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {isProcessing ? <Loader className="loading" /> : <Shield size={18} />}
                  {isProcessing ? 'Processing...' : 'Run Breach Detection'}
                </button>
              </div>
            </div>
          </CollapsibleSection>

          {/* File Integrity Monitoring Section */}
          <CollapsibleSection title="🔍 File Integrity Monitoring">
            <div className="card">
              <div className="card-header">
                <h4>Register File for Monitoring</h4>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter file path (e.g., /path/to/file.txt)"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                />
              </div>
              
              <button
                className="btn btn-primary"
                onClick={handleRegisterFile}
                disabled={!filePath.trim() || isRegisteringFile}
              >
                {isRegisteringFile ? <Loader className="loading" /> : <FileText size={18} />}
                {isRegisteringFile ? 'Registering...' : 'Register File for Monitoring'}
              </button>

              <div style={{ marginTop: '1.5rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={handleCheckTampering}
                  disabled={isCheckingTampering}
                >
                  {isCheckingTampering ? <Loader className="loading" /> : <AlertTriangle size={18} />}
                  {isCheckingTampering ? 'Checking...' : 'Check File Tampering'}
                </button>
              </div>
            </div>
          </CollapsibleSection>

          {/* Tampered Files Section */}
          <CollapsibleSection title="🚨 Tampered Files">
            <div className="card">
              <div className="card-header">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <h4>Detected Tampered Files</h4>
                  <SecurityStatusIndicator 
                    status={tamperingResults.filter(f => f.status === 'tampered').length > 0 ? 'danger' : 'secure'} 
                    size="small" 
                  />
                  <ActivityIndicator 
                    isActive={tamperingResults.length > 0} 
                    type="database" 
                    size="small" 
                  />
                </div>
                <button
                  className="btn btn-download"
                  onClick={handleDownloadTamperedFiles}
                  disabled={isDownloadingTamperedFiles}
                >
                                      {isDownloadingTamperedFiles ? <Loader className="loading" /> : <Download size={18} />}
                  {isDownloadingTamperedFiles ? 'Downloading...' : 'Download Tampered Files CSV'}
                </button>
              </div>
              
              <DataTable
                data={tamperingResults}
                columns={tamperingColumns}
                emptyMessage={
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6b7280'
                  }}>
                    <SecurityIllustration type="shield" size={80} color="#10b981" />
                    <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
                      No tampered files found. Check for file tampering first.
                    </p>
                  </div>
                }
              />
            </div>
          </CollapsibleSection>
        </div>

        {/* Right Column */}
        <div>
          {/* Breach Events Timeline Section */}
          <CollapsibleSection title="⏰ Breach Events Timeline" defaultExpanded={true}>
            <div className="card">
              <div className="card-header">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <h4>Event Timeline</h4>
                  <SecurityStatusIndicator 
                    status={breachEvents.length > 0 ? 'warning' : 'secure'} 
                    size="small" 
                  />
                  <ActivityIndicator 
                    isActive={breachEvents.length > 0} 
                    type="monitor" 
                    size="small" 
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleViewBreachEvents}
                    disabled={isLoadingBreachEvents}
                  >
                    {isLoadingBreachEvents ? <Loader className="loading" /> : <Clock size={18} />}
                    {isLoadingBreachEvents ? 'Loading...' : 'Refresh Events'}
                  </button>
                  <button
                    className="btn btn-download"
                    onClick={handleDownloadBreachEvents}
                    disabled={isDownloadingBreachEvents}
                  >
                    {isDownloadingBreachEvents ? <Loader className="loading" /> : <Download size={18} />}
                    {isDownloadingBreachEvents ? 'Downloading...' : 'Download CSV'}
                  </button>
                </div>
              </div>
              
              <TimelineView 
                events={breachEvents}
                isLoading={isLoadingBreachEvents}
              />
            </div>
          </CollapsibleSection>

          {/* Breach Events Table Section */}
          <CollapsibleSection title="📊 Breach Events Table">
            <div className="card">
              <div className="card-header">
                <h4>Detailed Events Table</h4>
              </div>
              
              <DataTable
                data={breachEvents}
                columns={breachEventsColumns}
                emptyMessage={
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#6b7280'
                  }}>
                    <SecurityIllustration type="dashboard" size={80} color="var(--color-primary)" />
                    <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
                      No breach events found. Run detection first or click 'Refresh Events' to load data.
                    </p>
                  </div>
                }
              />
            </div>
          </CollapsibleSection>

          {/* Status Area */}
          <StatusArea statusLogs={statusLogs} />
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default App; 