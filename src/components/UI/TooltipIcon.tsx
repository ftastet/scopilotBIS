import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';

interface TooltipIconProps {
  content: string;
  className?: string;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ content, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`relative inline-block ${className}`}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        icon={HelpCircle}
        className="ml-2 p-1 border-0 bg-transparent text-muted hover:text-foreground"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      />
      
      {isVisible && (
        <div className="absolute left-0 top-6 z-50 w-144 p-3 bg-foreground text-background text-xs rounded-lg shadow-lg">
          <div className="absolute -top-1 left-2 w-2 h-2 bg-foreground transform rotate-45"></div>
          <div className="whitespace-pre-wrap">{content}</div>
        </div>
      )}
    </div>
  );
};

export default TooltipIcon;