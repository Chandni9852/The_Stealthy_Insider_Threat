import React from 'react';

// Security-themed SVG illustrations
export const SecurityShield = ({ size = 100, color = '#667eea' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
        <stop offset="100%" stopColor={color} stopOpacity="0.4"/>
      </linearGradient>
    </defs>
    <path 
      d="M50 10L85 25V45C85 65 70 80 50 90C30 80 15 65 15 45V25L50 10Z" 
      fill="url(#shieldGradient)"
      stroke={color}
      strokeWidth="2"
    />
    <path 
      d="M35 45L45 55L65 35" 
      stroke="white" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export const NetworkNodes = ({ size = 200, color = '#667eea' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <defs>
      <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.6"/>
        <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
      </linearGradient>
    </defs>
    {/* Connection lines */}
    <line x1="50" y1="50" x2="150" y2="50" stroke={color} strokeWidth="2" opacity="0.3"/>
    <line x1="50" y1="50" x2="100" y2="100" stroke={color} strokeWidth="2" opacity="0.3"/>
    <line x1="150" y1="50" x2="100" y2="100" stroke={color} strokeWidth="2" opacity="0.3"/>
    <line x1="100" y1="100" x2="100" y2="150" stroke={color} strokeWidth="2" opacity="0.3"/>
    
    {/* Nodes */}
    <circle cx="50" cy="50" r="8" fill="url(#nodeGradient)" stroke={color} strokeWidth="2"/>
    <circle cx="150" cy="50" r="8" fill="url(#nodeGradient)" stroke={color} strokeWidth="2"/>
    <circle cx="100" cy="100" r="8" fill="url(#nodeGradient)" stroke={color} strokeWidth="2"/>
    <circle cx="100" cy="150" r="8" fill="url(#nodeGradient)" stroke={color} strokeWidth="2"/>
    
    {/* Animated pulse */}
    <circle cx="100" cy="100" r="15" stroke={color} strokeWidth="1" opacity="0.3">
      <animate attributeName="r" values="15;25;15" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const DataFlow = ({ size = 150, color = '#10b981' }) => (
  <svg width={size} height={size} viewBox="0 0 150 150" fill="none">
    <defs>
      <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
        <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
      </linearGradient>
    </defs>
    
    {/* Data flow arrows */}
    <path 
      d="M20 75L130 75" 
      stroke={color} 
      strokeWidth="3" 
      strokeDasharray="5,5"
      opacity="0.6"
    >
      <animate attributeName="stroke-dashoffset" values="0;-10" dur="1s" repeatCount="indefinite"/>
    </path>
    
    <path 
      d="M120 70L130 75L120 80" 
      stroke={color} 
      strokeWidth="3" 
      fill="none"
      opacity="0.8"
    />
    
    {/* Data packets */}
    <rect x="30" y="65" width="20" height="20" fill="url(#dataGradient)" rx="3">
      <animate attributeName="x" values="30;110" dur="2s" repeatCount="indefinite"/>
    </rect>
    <rect x="60" y="65" width="20" height="20" fill="url(#dataGradient)" rx="3">
      <animate attributeName="x" values="60;110" dur="2s" repeatCount="indefinite" begin="0.5s"/>
    </rect>
    <rect x="90" y="65" width="20" height="20" fill="url(#dataGradient)" rx="3">
      <animate attributeName="x" values="90;110" dur="2s" repeatCount="indefinite" begin="1s"/>
    </rect>
  </svg>
);

export const ThreatRadar = ({ size = 120, color = '#ef4444' }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
    <defs>
      <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
        <stop offset="100%" stopColor={color} stopOpacity="0.1"/>
      </linearGradient>
    </defs>
    
    {/* Radar circles */}
    <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="1" opacity="0.3"/>
    <circle cx="60" cy="60" r="35" stroke={color} strokeWidth="1" opacity="0.3"/>
    <circle cx="60" cy="60" r="20" stroke={color} strokeWidth="1" opacity="0.3"/>
    
    {/* Radar sweep */}
    <path 
      d="M60 60L60 10" 
      stroke={color} 
      strokeWidth="2" 
      opacity="0.8"
      transformOrigin="60 60"
    >
      <animateTransform 
        attributeName="transform" 
        type="rotate" 
        values="0;360" 
        dur="3s" 
        repeatCount="indefinite"
      />
    </path>
    
    {/* Threat dots */}
    <circle cx="80" cy="40" r="3" fill={color} opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="45" cy="75" r="3" fill={color} opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" begin="0.5s"/>
    </circle>
    <circle cx="70" cy="80" r="3" fill={color} opacity="0.8">
      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" begin="1s"/>
    </circle>
  </svg>
);

export const LockIcon = ({ size = 80, color = '#667eea', isLocked = true }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <defs>
      <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8"/>
        <stop offset="100%" stopColor={color} stopOpacity="0.4"/>
      </linearGradient>
    </defs>
    
    {/* Lock body */}
    <rect x="25" y="35" width="30" height="25" rx="3" fill="url(#lockGradient)" stroke={color} strokeWidth="2"/>
    
    {/* Lock shackle */}
    <path 
      d="M30 35V25C30 20 35 15 40 15C45 15 50 20 50 25V35" 
      stroke={color} 
      strokeWidth="2" 
      fill="none"
    />
    
    {/* Keyhole */}
    <circle cx="40" cy="45" r="3" fill={color} opacity="0.6"/>
    <rect x="38" y="45" width="4" height="8" fill={color} opacity="0.6"/>
    
    {/* Lock/unlock indicator */}
    {!isLocked && (
      <path 
        d="M20 20L60 60M60 20L20 60" 
        stroke="#ef4444" 
        strokeWidth="3" 
        opacity="0.8"
      />
    )}
  </svg>
);

export const SecurityDashboard = ({ size = 200, color = '#667eea' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
    <defs>
      <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.6"/>
        <stop offset="100%" stopColor={color} stopOpacity="0.2"/>
      </linearGradient>
    </defs>
    
    {/* Dashboard frame */}
    <rect x="20" y="20" width="160" height="120" rx="10" fill="url(#dashboardGradient)" stroke={color} strokeWidth="2"/>
    
    {/* Screen content */}
    <rect x="30" y="30" width="140" height="100" rx="5" fill="rgba(255,255,255,0.1)"/>
    
    {/* Status bars */}
    <rect x="40" y="45" width="120" height="8" rx="4" fill={color} opacity="0.8"/>
    <rect x="40" y="60" width="100" height="8" rx="4" fill={color} opacity="0.6"/>
    <rect x="40" y="75" width="80" height="8" rx="4" fill={color} opacity="0.4"/>
    
    {/* Activity dots */}
    <circle cx="50" cy="100" r="3" fill="#10b981">
      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="70" cy="100" r="3" fill="#f59e0b">
      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
    </circle>
    <circle cx="90" cy="100" r="3" fill="#ef4444">
      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" begin="1s"/>
    </circle>
    
    {/* Connection lines */}
    <line x1="160" y1="40" x2="180" y2="40" stroke={color} strokeWidth="2" opacity="0.6"/>
    <line x1="160" y1="60" x2="180" y2="60" stroke={color} strokeWidth="2" opacity="0.6"/>
    <line x1="160" y1="80" x2="180" y2="80" stroke={color} strokeWidth="2" opacity="0.6"/>
  </svg>
);

// Main illustration component
export const SecurityIllustration = ({ type = 'shield', size = 100, color = '#667eea', className = '' }) => {
  const illustrations = {
    shield: SecurityShield,
    network: NetworkNodes,
    dataflow: DataFlow,
    radar: ThreatRadar,
    lock: LockIcon,
    dashboard: SecurityDashboard
  };

  const IllustrationComponent = illustrations[type] || SecurityShield;

  return (
    <div className={className} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease'
    }}>
      <IllustrationComponent size={size} color={color} />
    </div>
  );
};

export default SecurityIllustration; 