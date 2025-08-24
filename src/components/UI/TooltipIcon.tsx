import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';

interface TooltipIconProps {
  content: string;
  className?: string;
}

const TooltipIcon: React.FC<TooltipIconProps> = ({ content, className = '' }) => {
  return (
    <div className={`tooltip ${className}`} data-tip={content}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        icon={HelpCircle}
        className="ml-2 btn-circle btn-ghost"
      />
    </div>
  );
};

export default TooltipIcon;