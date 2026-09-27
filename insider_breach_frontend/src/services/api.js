import axios from 'axios';

// Configure axios with base URL
// Uses REACT_APP_API_URL when deployed (set this in Vercel/Netlify env settings),
// falls back to localhost for local development.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper function to validate and normalize data
const normalizeBreachEvents = (data) => {
  if (!Array.isArray(data)) {
    console.warn('Breach events data is not an array:', data);
    return [];
  }
  
  return data.map(event => ({
    username: event.username || event.user || 'Unknown',
    ip: event.ip || event.ip_address || 'N/A',
    hour: event.hour || event.timestamp || event.created_at || new Date().toISOString(),
    is_anomalous: typeof event.is_anomalous === 'boolean' ? event.is_anomalous : 
                  typeof event.anomalous === 'boolean' ? event.anomalous : false,
    event_type: event.event_type || event.type || 'login_attempt'
  }));
};

const normalizeTamperingResults = (data) => {
  if (!Array.isArray(data)) {
    console.warn('Tampering results data is not an array:', data);
    return [];
  }
  
  return data.map(file => ({
    file_path: file.file_path || file.path || 'Unknown',
    original_hash: file.original_hash || 'N/A',
    current_hash: file.current_hash || 'N/A',
    status: file.status || 'unknown'
  }));
};

// API functions with enhanced error handling and data validation
export const uploadLogs = async (loginLogsFile, fileAccessLogsFile) => {
  try {
    if (!loginLogsFile || !fileAccessLogsFile) {
      throw new Error('Both login logs and file access logs files are required');
    }

    const formData = new FormData();
    formData.append('login_file', loginLogsFile);
    formData.append('filelog_file', fileAccessLogsFile);
    
    const response = await api.post('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    if (error.response?.status === 422) {
      throw new Error('Invalid file format. Please ensure both files are valid CSV files.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Upload timeout. Please check your connection and try again.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error during upload. Please try again later.');
    } else {
      throw new Error(`Upload failed: ${error.response?.data?.detail || error.message}`);
    }
  }
};

export const runDetectionPipeline = async () => {
  try {
    const response = await api.post('/process/');
    console.log('Detection pipeline response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Detection pipeline error:', error);
    if (error.response?.status === 400) {
      throw new Error('No data available for processing. Please upload log files first.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Processing timeout. The operation may still be running.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error during processing. Please try again later.');
    } else {
      throw new Error(`Detection failed: ${error.response?.data?.detail || error.message}`);
    }
  }
};

export const getBreachEvents = async () => {
  try {
    const response = await api.get('/breach-events/');
    const normalizedData = normalizeBreachEvents(response.data);
    console.log('Breach events loaded:', normalizedData.length, 'events');
    return normalizedData;
  } catch (error) {
    console.error('Error fetching breach events:', error);
    if (error.response?.status === 404) {
      throw new Error('No breach events found. Run detection pipeline first.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(`Failed to fetch breach events: ${error.response?.data?.detail || error.message}`);
    }
  }
};

export const registerFileForMonitoring = async (filePath) => {
  try {
    if (!filePath || !filePath.trim()) {
      throw new Error('File path is required');
    }

    const response = await api.post('/register-file/', {
      file_path: filePath.trim()
    });
    
    console.log('File registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering file:', error);
    if (error.response?.status === 400) {
      throw new Error('Invalid file path or file not found.');
    } else if (error.response?.status === 409) {
      throw new Error('File is already registered for monitoring.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else {
      throw new Error(`Failed to register file: ${error.response?.data?.detail || error.message}`);
    }
  }
};

export const checkFileTampering = async () => {
  try {
    const response = await api.get('/tamper-check/');
    const normalizedData = normalizeTamperingResults(response.data);
    console.log('Tampering check completed:', normalizedData.length, 'files checked');
    return normalizedData;
  } catch (error) {
    console.error('Error checking file tampering:', error);
    if (error.response?.status === 404) {
      throw new Error('No files registered for monitoring. Register files first.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error during tampering check. Please try again later.');
    } else {
      throw new Error(`Failed to check tampering: ${error.response?.data?.detail || error.message}`);
    }
  }
};

// Download functions with enhanced error handling
export const downloadBreachEventsCSV = async () => {
  try {
    // First check if there are breach events to download
    const events = await getBreachEvents();
    if (!events || events.length === 0) {
      throw new Error('No breach events available for download. Run detection first.');
    }
    
    // Use window.open for direct download
    const downloadUrl = `${API_BASE_URL}/download/breach-events`;
    window.open(downloadUrl, '_blank');
    
    console.log('Breach events download initiated');
    return { success: true, count: events.length };
  } catch (error) {
    console.error('Error downloading breach events:', error);
    if (error.message.includes('No breach events')) {
      throw error; // Re-throw specific error
    } else {
      throw new Error(`Download failed: ${error.message}`);
    }
  }
};

export const downloadTamperedFilesCSV = async () => {
  try {
    // First check if there are tampered files to download
    const files = await checkFileTampering();
    if (!files || files.length === 0) {
      throw new Error('No tampered files found. Check for tampering first.');
    }
    
    // Use window.open for direct download
    const downloadUrl = `${API_BASE_URL}/download/tampered`;
    window.open(downloadUrl, '_blank');
    
    console.log('Tampered files download initiated');
    return { success: true, count: files.length };
  } catch (error) {
    console.error('Error downloading tampered files:', error);
    if (error.message.includes('No tampered files')) {
      throw error; // Re-throw specific error
    } else {
      throw new Error(`Download failed: ${error.message}`);
    }
  }
};

// Health check function with detailed status
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/');
    console.log('Backend health check successful');
    return {
      status: 'healthy',
      uptime: response.data?.uptime || 'unknown',
      version: response.data?.version || 'unknown',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Backend health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

// Additional utility function for getting system status
export const getSystemStatus = async () => {
  try {
    const [health, breachEvents, tamperingResults] = await Promise.allSettled([
      checkBackendHealth(),
      getBreachEvents(),
      checkFileTampering()
    ]);

    return {
      backend: health.status === 'fulfilled' ? health.value : { status: 'error', error: health.reason?.message },
      breachEvents: breachEvents.status === 'fulfilled' ? breachEvents.value : [],
      tamperingResults: tamperingResults.status === 'fulfilled' ? tamperingResults.value : [],
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting system status:', error);
    return {
      backend: { status: 'error', error: error.message },
      breachEvents: [],
      tamperingResults: [],
      lastUpdated: new Date().toISOString()
    };
  }
};

export default api; 
