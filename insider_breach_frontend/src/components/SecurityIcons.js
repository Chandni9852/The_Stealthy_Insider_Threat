import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  Fingerprint, 
  Database, 
  Network,
  Server,
  Monitor,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Target,
  Users,
  FileText,
  HardDrive,
  Wifi,
  WifiOff,
  Globe,
  Home,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  UserCheck,
  UserX,
  Settings,
  Bell,
  BellOff,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Camera,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Headphones,
  Speaker,
  Battery,
  BatteryCharging,
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  Info
} from 'lucide-react';

const SecurityIcons = ({ type, size = 24, color = '#667eea', className = '' }) => {
  const iconMap = {
    // Security Icons
    shield: Shield,
    lock: Lock,
    unlock: Lock,
    eye: Eye,
    eyeOff: EyeOff,
    key: Key,
    fingerprint: Fingerprint,
    database: Database,
    network: Network,
    server: Server,
    monitor: Monitor,
    
    // Status Icons
    alert: AlertCircle,
    check: CheckCircle,
    error: XCircle,
    info: Info,
    clock: Clock,
    zap: Zap,
    target: Target,
    
    // User Icons
    users: Users,
    user: User,
    userCheck: UserCheck,
    userX: UserX,
    
    // File Icons
    file: FileText,
    hardDrive: HardDrive,
    
    // Network Icons
    wifi: Wifi,
    wifiOff: WifiOff,
    globe: Globe,
    signal: Signal,
    signalHigh: SignalHigh,
    signalMedium: SignalMedium,
    signalLow: SignalLow,
    signalZero: SignalZero,
    
    // Location Icons
    home: Home,
    building: Building,
    mapPin: MapPin,
    
    // Communication Icons
    phone: Phone,
    mail: Mail,
    
    // Control Icons
    settings: Settings,
    bell: Bell,
    bellOff: BellOff,
    search: Search,
    filter: Filter,
    download: Download,
    upload: Upload,
    refresh: RefreshCw,
    
    // Media Control Icons
    play: Play,
    pause: Pause,
    skipBack: SkipBack,
    skipForward: SkipForward,
    volume: Volume2,
    volumeOff: VolumeX,
    camera: Camera,
    video: Video,
    videoOff: VideoOff,
    mic: Mic,
    micOff: MicOff,
    headphones: Headphones,
    speaker: Speaker,
    
    // System Icons
    battery: Battery,
    batteryCharging: BatteryCharging
  };

  const IconComponent = iconMap[type] || Shield;

  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={className}
    />
  );
};

// Security Status Indicator Component
export const SecurityStatusIndicator = ({ status, size = 'medium' }) => {
  const statusConfig = {
    secure: {
      icon: 'shield',
      color: '#10b981',
      text: 'Secure',
      bgColor: 'rgba(16, 185, 129, 0.1)',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    },
    warning: {
      icon: 'alert',
      color: '#f59e0b',
      text: 'Warning',
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    },
    danger: {
      icon: 'error',
      color: '#ef4444',
      text: 'Danger',
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    info: {
      icon: 'info',
      color: '#3b82f6',
      text: 'Info',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgba(59, 130, 246, 0.3)'
    }
  };

  const config = statusConfig[status] || statusConfig.info;
  const sizeMap = {
    small: 18,
    medium: 20,
    large: 24
  };

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 0.75rem',
      background: config.bgColor,
      border: `1px solid ${config.borderColor}`,
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: config.color,
      transition: 'all 0.3s ease'
    }}>
      <SecurityIcons type={config.icon} size={sizeMap[size]} color={config.color} />
      <span>{config.text}</span>
    </div>
  );
};

// Network Status Component
export const NetworkStatusIndicator = ({ status, strength = 'high' }) => {
  const getSignalIcon = (strength) => {
    switch (strength) {
      case 'high': return 'signalHigh';
      case 'medium': return 'signalMedium';
      case 'low': return 'signalLow';
      case 'none': return 'signalZero';
      default: return 'signal';
    }
  };

  const statusColor = status === 'connected' ? '#10b981' : '#ef4444';
  const signalColor = status === 'connected' ? '#10b981' : '#6b7280';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      background: 'rgba(255, 255, 255, 0.9)',
      border: `1px solid rgba(102, 126, 234, 0.2)`,
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <SecurityIcons 
        type={status === 'connected' ? 'wifi' : 'wifiOff'} 
        size={20} 
        color={statusColor} 
      />
      <SecurityIcons 
        type={getSignalIcon(strength)} 
        size={16} 
        color={signalColor} 
      />
      <span style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: statusColor
      }}>
        {status === 'connected' ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
};

// System Health Indicator
export const SystemHealthIndicator = ({ health, uptime, lastCheck }) => {
  const getHealthColor = (health) => {
    if (health >= 90) return '#10b981';
    if (health >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthIcon = (health) => {
    if (health >= 90) return 'check';
    if (health >= 70) return 'alert';
    return 'error';
  };

  const healthColor = getHealthColor(health);
  const healthIcon = getHealthIcon(health);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
      border: `1px solid rgba(102, 126, 234, 0.2)`,
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
      minWidth: '200px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <SecurityIcons type={healthIcon} size={20} color={healthColor} />
          <span style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: '#1e293b'
          }}>
            System Health
          </span>
        </div>
        <span style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: healthColor
        }}>
          {health}%
        </span>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Uptime:</span>
          <span style={{ fontWeight: '600' }}>{uptime}</span>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span>Last Check:</span>
          <span style={{ fontWeight: '600' }}>{lastCheck}</span>
        </div>
      </div>
    </div>
  );
};

// Activity Indicator
export const ActivityIndicator = ({ isActive, type = 'network', size = 'medium' }) => {
  const typeIcons = {
    network: 'wifi',
    database: 'database',
    server: 'server',
    monitor: 'monitor',
    user: 'user'
  };

  const sizeMap = {
    small: 18,
    medium: 20,
    large: 24
  };

  const color = isActive ? '#10b981' : '#6b7280';
  const icon = typeIcons[type] || 'monitor';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 0.75rem',
      background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(107, 114, 128, 0.1)',
      border: `1px solid ${isActive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(107, 114, 128, 0.3)'}`,
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        position: 'relative'
      }}>
        <SecurityIcons type={icon} size={sizeMap[size]} color={color} />
        {isActive && (
          <div style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            background: '#10b981',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
        )}
      </div>
      <span style={{
        fontSize: '0.875rem',
        fontWeight: '600',
        color: color
      }}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};

export default SecurityIcons; 