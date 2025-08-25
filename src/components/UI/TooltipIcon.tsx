import { Tooltip } from 'flowbite-react';
import { HelpCircle } from 'lucide-react';

interface TooltipIconProps {
  content: string;
  className?: string;
}

const TooltipIcon = ({ content, className = '' }: TooltipIconProps) => (
  <Tooltip content={content} style="dark">
    <HelpCircle className={`h-4 w-4 cursor-help ${className}`} />
  </Tooltip>
);

export default TooltipIcon;
