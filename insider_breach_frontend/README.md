# 🔒 Insider Breach Detection Dashboard

A modern React frontend for monitoring and detecting insider security breaches using anomaly detection and SHA256 file tampering verification.

## 🚀 Features

### 📁 Log Upload & Detection
- **Upload Log Files**: Drag-and-drop or click-to-upload CSV files
  - `login_logs.csv` - User login activity logs
  - `file_access_logs.csv` - File access activity logs
- **Run Breach Detection**: Execute the anomaly detection pipeline
- **Real-time Status**: Live feedback with toast notifications

### 🚨 Breach Events Monitoring
- **View Detected Events**: Display all detected breach events in a responsive table
- **Anomaly Detection**: Shows anomalous vs normal user behavior
- **Event Details**: Username, IP address, timestamp, and event classification

### 🔍 File Integrity Monitoring
- **Register Files**: Add files to the monitoring system for hash tracking
- **Tampering Detection**: Check for unauthorized file modifications
- **Hash Comparison**: Compare original vs current SHA256 hashes

### 📊 Status & Logging
- **Action History**: Track all performed actions with timestamps
- **Status Indicators**: Visual feedback for success, error, warning, and info states
- **Real-time Updates**: Live status updates during operations

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **Styling**: Custom CSS with Tailwind-like utilities
- **HTTP Client**: Axios for API communication
- **Icons**: Lucide React for modern iconography
- **Notifications**: React Toastify for user feedback
- **API Base URL**: `http://127.0.0.1:8000`

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd insider_breach_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 API Endpoints

The frontend communicates with a FastAPI backend at `http://127.0.0.1:8000`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload/` | POST | Upload login and file access logs |
| `/process/` | POST | Run breach detection pipeline |
| `/breach-events/` | GET | Retrieve detected breach events |
| `/register-file/` | POST | Register file for monitoring |
| `/tamper-check/` | GET | Check for file tampering |

## 🎯 Usage Guide

### 1. Upload Log Files
1. Click "Select Login Logs" and choose your `login_logs.csv` file
2. Click "Select File Access Logs" and choose your `file_access_logs.csv` file
3. Click "Upload Logs" to send files to the backend
4. Wait for the success notification

### 2. Run Detection
1. After successful upload, click "Run Breach Detection"
2. The system will process the logs and detect anomalies
3. Monitor the status area for progress updates

### 3. View Results
1. Click "View Breach Events" to load detected events
2. Review the table showing username, IP, hour, anomaly status, and event type
3. Anomalous events are highlighted in red

### 4. Monitor File Integrity
1. Enter a file path in the "Register File for Monitoring" section
2. Click "Register File for Monitoring" to add it to the system
3. Click "Check File Tampering" to verify file integrity
4. Review results showing original vs current hashes

## 🎨 UI Components

### Collapsible Sections
- **Log Upload & Detection**: File upload and pipeline execution
- **Breach Events**: View and manage detected security events
- **File Integrity Monitoring**: File registration and tampering checks

### Interactive Elements
- **File Upload Areas**: Drag-and-drop with visual feedback
- **Action Buttons**: Loading states and disabled states
- **Data Tables**: Responsive tables with sorting and filtering
- **Status Indicators**: Color-coded badges for different states

### Responsive Design
- **Mobile-friendly**: Optimized for tablets and mobile devices
- **Grid Layout**: Two-column layout that adapts to screen size
- **Touch-friendly**: Large touch targets for mobile interaction

## 🔒 Security Features

- **File Type Validation**: Only accepts CSV files for upload
- **Error Handling**: Comprehensive error messages and user feedback
- **Loading States**: Prevents multiple simultaneous requests
- **Status Logging**: Audit trail of all user actions

## 🚀 Development

### Project Structure
```
src/
├── components/
│   ├── CollapsibleSection.js    # Reusable collapsible component
│   ├── DataTable.js             # Reusable table component
│   └── StatusArea.js            # Status logging component
├── services/
│   └── api.js                   # API service layer
├── App.js                       # Main application component
├── index.js                     # Application entry point
└── index.css                    # Global styles
```

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the status area for detailed error messages
- Review the browser console for technical details
- Ensure the FastAPI backend is running on `http://127.0.0.1:8000`

---

**Built with ❤️ for cybersecurity professionals** 