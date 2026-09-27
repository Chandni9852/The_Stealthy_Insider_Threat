import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  Clock,
  Activity,
  Target,
  Zap,
  Info
} from 'lucide-react';

const AnalyticsCharts = ({ breachEvents, tamperingResults }) => {
  // Debug logging
  console.log('AnalyticsCharts render:', { 
    breachEvents: breachEvents?.length || 0, 
    tamperingResults: tamperingResults?.length || 0,
    breachEventsData: breachEvents,
    tamperingResultsData: tamperingResults
  });

  try {
    // Process data for charts
    const processChartData = () => {
      // Ensure we have valid data
      const events = Array.isArray(breachEvents) ? breachEvents : [];
      const tampering = Array.isArray(tamperingResults) ? tamperingResults : [];
      
      console.log('Processing chart data:', { events: events.length, tampering: tampering.length });
      
      // Check if we have real data from uploaded files
      // Demo mode only when we have NO real data at all
      const hasRealData = events.length > 0 || tampering.length > 0;
      const isDemoMode = !hasRealData;
      
      console.log('Demo mode:', isDemoMode, 'Has real data:', hasRealData);
      
      if (isDemoMode) {
        // Generate demo data for demonstration
        const demoEvents = Array.from({ length: 15 }, (_, i) => ({
          username: ['alice', 'bob', 'charlie', 'david', 'eve'][i % 5],
          ip: `192.168.1.${100 + i}`,
          hour: new Date(Date.now() - (i * 3600000)).toISOString(),
          is_anomalous: i % 4 === 0, // 25% anomalies for demo
          event_type: 'login_attempt'
        }));

        const demoTampering = [
          { file_path: '/etc/passwd', status: 'tampered', original_hash: 'abc123', current_hash: 'def456' },
          { file_path: '/var/log/auth.log', status: 'secure', original_hash: 'ghi789', current_hash: 'ghi789' },
          { file_path: '/home/user/config.txt', status: 'tampered', original_hash: 'jkl012', current_hash: 'mno345' }
        ];

        console.log('Using demo data:', { demoEvents: demoEvents.length, demoTampering: demoTampering.length });
        return generateChartData(demoEvents, demoTampering, true);
      }

      console.log('Using real data from uploaded files');
      return generateChartData(events, tampering, false);
    };

    const generateChartData = (events, tampering, isDemo) => {
      // Timeline data for area chart - show actual events over time
      const timelineData = events.slice(0, 20).map((event, index) => {
        const timestamp = event.hour || event.timestamp || event.created_at || new Date().toISOString();
        const time = new Date(timestamp);
        return {
          time: index + 1,
          logins: 1,
          anomalies: event.is_anomalous ? 1 : 0,
          timestamp: time.toLocaleTimeString(),
          date: time.toLocaleDateString()
        };
      });

      // If no events, create a basic timeline
      if (timelineData.length === 0) {
        timelineData.push({
          time: 1,
          logins: 0,
          anomalies: 0,
          timestamp: 'No data',
          date: 'No data'
        });
      }

      // Anomaly detection data - based on actual events
      const normalEvents = events.filter(e => !e.is_anomalous).length;
      const anomalousEvents = events.filter(e => e.is_anomalous).length;
      const anomalyData = [
        { name: 'Normal', value: normalEvents, color: '#10b981' },
        { name: 'Anomalous', value: anomalousEvents, color: '#ef4444' }
      ].filter(item => item.value > 0);

      // If no anomaly data, show a placeholder
      if (anomalyData.length === 0) {
        anomalyData.push({ name: 'No Data', value: 1, color: '#6b7280' });
      }

      // User activity analysis - group by username
      const userActivity = {};
      events.forEach(event => {
        const username = event.username || event.user || 'Unknown';
        if (!userActivity[username]) {
          userActivity[username] = { normal: 0, anomalous: 0 };
        }
        if (event.is_anomalous) {
          userActivity[username].anomalous++;
        } else {
          userActivity[username].normal++;
        }
      });

      const userActivityData = Object.entries(userActivity).map(([username, data]) => ({
        username,
        normal: data.normal,
        anomalous: data.anomalous,
        total: data.normal + data.anomalous
      })).sort((a, b) => b.total - a.total).slice(0, 10);

      // Threat level radar chart data - based on actual metrics
      const threatLevelData = [
        { 
          subject: 'Login Anomalies', 
          A: anomalousEvents, 
          fullMark: Math.max(events.length, 1),
          description: `${anomalousEvents} out of ${events.length} events`
        },
        { 
          subject: 'File Tampering', 
          A: tampering.filter(f => f.status === 'tampered').length, 
          fullMark: Math.max(tampering.length, 1),
          description: `${tampering.filter(f => f.status === 'tampered').length} tampered files`
        },
        { 
          subject: 'Unique Users', 
          A: Object.keys(userActivity).length, 
          fullMark: Math.max(Object.keys(userActivity).length, 1),
          description: `${Object.keys(userActivity).length} unique users`
        },
        { 
          subject: 'Suspicious IPs', 
          A: new Set(events.map(e => e.ip)).size, 
          fullMark: Math.max(new Set(events.map(e => e.ip)).size, 1),
          description: `${new Set(events.map(e => e.ip)).size} unique IP addresses`
        },
        { 
          subject: 'Data Access', 
          A: events.length, 
          fullMark: Math.max(events.length, 1),
          description: `${events.length} total events`
        }
      ];

      // File status data - based on actual tampering results
      const secureFiles = tampering.filter(f => f.status !== 'tampered').length;
      const tamperedFiles = tampering.filter(f => f.status === 'tampered').length;
      const fileStatusData = [
        { name: 'Secure', value: secureFiles, color: '#10b981' },
        { name: 'Tampered', value: tamperedFiles, color: '#ef4444' }
      ].filter(item => item.value > 0);

      // If no file data, show a placeholder
      if (fileStatusData.length === 0) {
        fileStatusData.push({ name: 'No Files Monitored', value: 1, color: '#6b7280' });
      }

      return {
        timelineData,
        anomalyData,
        userActivityData,
        threatLevelData,
        fileStatusData,
        isDemo,
        summary: {
          totalEvents: events.length,
          anomalousEvents,
          normalEvents,
          uniqueUsers: Object.keys(userActivity).length,
          uniqueIPs: new Set(events.map(e => e.ip)).size,
          totalFiles: tampering.length,
          tamperedFiles,
          secureFiles
        }
      };
    };

      const chartData = processChartData();

  // Show loading state if data is being processed
  if (!chartData) {
    return (
      <div className="analytics-charts">
        <div className="chart-card" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '200px'
        }}>
          <div className="loading" style={{ 
            width: '2rem', 
            height: '2rem',
            border: '3px solid rgba(102, 126, 234, 0.2)',
            borderTopColor: 'var(--color-primary)'
          }}></div>
          <span style={{ marginLeft: '1rem', color: '#6b7280' }}>Loading analytics...</span>
        </div>
      </div>
    );
  }



    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div style={{
            backgroundColor: 'var(--color-surface)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-text)' }}>{`Time: ${label}`}</p>
            {payload.map((entry, index) => (
              <p key={index} style={{ 
                margin: '4px 0 0 0', 
                color: entry.color,
                fontWeight: '500'
              }}>
                {`${entry.name}: ${entry.value}`}
              </p>
            ))}
          </div>
        );
      }
      return null;
    };

    const CustomPieTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <div style={{
            backgroundColor: 'var(--color-surface)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ margin: 0, fontWeight: '600', color: 'var(--color-text)' }}>{payload[0].name}</p>
            <p style={{ margin: '4px 0 0 0', color: payload[0].payload.color, fontWeight: '500' }}>
              {`Count: ${payload[0].value}`}
            </p>
          </div>
        );
      }
      return null;
    };

    // Show loading state if data is being processed
    if (!chartData) {
      return (
        <div className="analytics-charts">
          <div className="chart-card" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '200px'
          }}>
            <div className="loading" style={{ 
              width: '2rem', 
              height: '2rem',
              border: '3px solid rgba(102, 126, 234, 0.2)',
              borderTopColor: 'var(--color-primary)'
            }}></div>
            <span style={{ marginLeft: '1rem', color: '#6b7280' }}>Loading analytics...</span>
          </div>
        </div>
      );
    }

      return (
    <div className="analytics-charts">

      
            {/* Demo Mode Indicator */}
      {chartData.isDemo && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Info size={20} color="#3b82f6" />
            <span style={{ fontWeight: '600', color: '#3b82f6' }}>Demo Mode Active</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Showing sample data. Upload log files and run detection to see real analytics from your data.
          </p>
        </div>
      )}

      {/* Real Data Indicator */}
      {!chartData.isDemo && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <Shield size={20} color="#10b981" />
            <span style={{ fontWeight: '600', color: '#10b981' }}>Real Data Mode</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Showing analytics based on your uploaded log files and detection results.
          </p>
        </div>
      )}

        {/* Real-time Activity Timeline */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <Activity size={20} style={{ color: 'var(--color-primary)' }} />
              <h3>Real-time Activity Timeline</h3>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: 'var(--color-primary)' }}></div>
                <span>Logins</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                <span>Anomalies</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.timelineData}>
              <defs>
                <linearGradient id="loginGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="anomalyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="logins" 
                stroke="var(--color-primary)" 
                fill="url(#loginGradient)"
                strokeWidth={2}
              />
              <Area 
                type="monotone" 
                dataKey="anomalies" 
                stroke="#ef4444" 
                fill="url(#anomalyGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Anomaly Detection Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <AlertTriangle size={20} style={{ color: '#ef4444' }} />
              <h3>Anomaly Detection Distribution</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.anomalyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.anomalyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity Analysis */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <Users size={20} style={{ color: '#10b981' }} />
              <h3>User Activity Analysis</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.userActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(102, 126, 234, 0.1)" />
              <XAxis 
                dataKey="username" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="normal" 
                fill="url(#loginGradient)"
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="anomalous" 
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Level Radar */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <Target size={20} style={{ color: '#f59e0b' }} />
              <h3>Threat Level Assessment</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={chartData.threatLevelData}>
              <PolarGrid stroke="rgba(102, 126, 234, 0.2)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 'dataMax']} 
                tick={{ fill: '#6b7280', fontSize: 10 }}
              />
              <Radar
                name="Threat Level"
                dataKey="A"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* File Integrity Status */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">
              <Shield size={20} style={{ color: '#10b981' }} />
              <h3>File Integrity Status</h3>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.fileStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.fileStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Security Metrics Dashboard */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
              <Zap size={24} />
            </div>
            <div className="metric-content">
              <h4>Total Events</h4>
              <p className="metric-value">{chartData.summary?.totalEvents || 0}</p>
              <p className="metric-change positive">Real-time</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Shield size={24} />
            </div>
            <div className="metric-content">
              <h4>Security Score</h4>
              <p className="metric-value">
                {chartData.summary?.totalEvents > 0 
                  ? Math.round(((chartData.summary.totalEvents - chartData.summary.anomalousEvents) / chartData.summary.totalEvents) * 100)
                  : 100}%
              </p>
              <p className="metric-change positive">Based on data</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <Clock size={24} />
            </div>
            <div className="metric-content">
              <h4>Unique Users</h4>
              <p className="metric-value">{chartData.summary?.uniqueUsers || 0}</p>
              <p className="metric-change positive">Active</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <AlertTriangle size={24} />
            </div>
            <div className="metric-content">
              <h4>Anomalies</h4>
              <p className="metric-value">{chartData.summary?.anomalousEvents || 0}</p>
              <p className="metric-change negative">Detected</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering AnalyticsCharts:', error);
    return (
      <div className="analytics-charts">
        <div className="chart-card" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '200px'
        }}>
          <div className="error-message" style={{ 
            color: '#dc2626',
            fontSize: '1rem',
            textAlign: 'center'
          }}>
            Failed to load analytics data. Please ensure log files are uploaded and detection is run.
          </div>
        </div>
      </div>
    );
  }
};

export default AnalyticsCharts; 