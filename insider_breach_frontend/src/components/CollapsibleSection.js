import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const CollapsibleSection = ({ title, children, defaultExpanded = false }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="collapsible">
      <div 
        className={`collapsible-header ${isExpanded ? 'expanded' : ''}`}
        onClick={toggleExpanded}
      >
        <h3 className="card-title">{title}</h3>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </div>
      <div className={`collapsible-content ${!isExpanded ? 'collapsed' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default CollapsibleSection; 