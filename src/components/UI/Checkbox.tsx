import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({ 
  label, 
  description,
  className = '', 
  checked,
  disabled = false,
  ...props 
}) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="relative flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          disabled={disabled}
          {...props}
        />
        <div
          className={`
            w-5 h-5 border-2 rounded cursor-pointer transition-colors duration-200
            ${checked
              ? 'bg-green-600 border-green-600'
              : 'bg-background dark:bg-text border-secondary dark:border-background hover:border-text dark:hover:border-background'
            }
            ${disabled
              ? 'cursor-not-allowed opacity-50'
              : 'cursor-pointer'
            }
            ${className}
          `}
          onClick={() => !disabled && props.onChange?.({ target: { checked: !checked } } as any)}
        >
          {checked && (
            <Check className="w-3 h-3 text-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label
              className={`block text-sm font-medium cursor-pointer ${
                disabled
                  ? 'text-text/40 dark:text-background/40 cursor-not-allowed'
                  : 'text-text dark:text-background'
              }`}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={`text-sm ${
                disabled
                  ? 'text-text/40 dark:text-background/40'
                  : 'text-text/60 dark:text-background/60'
              }`}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;