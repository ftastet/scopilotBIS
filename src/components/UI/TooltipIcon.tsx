import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipIconProps {
  content: string;
  className?: string;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        className="ml-2 text-text/40 dark:text-background/40 hover:text-text dark:hover:text-background transition-colors duration-200"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      
      {isVisible && (
        <div className="absolute left-0 top-6 z-50 w-144 p-3 bg-text dark:bg-background text-white text-xs rounded-lg shadow-lg">
          <div className="absolute -top-1 left-2 w-2 h-2 bg-text dark:bg-background transform rotate-45"></div>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      )}
    </div>
  );
};

export default TooltipIcon;