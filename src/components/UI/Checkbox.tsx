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
              : 'bg-background border-gray-300 hover:border-gray-400 dark:bg-background-dark dark:border-gray-600 dark:hover:border-gray-500'
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
            <label className={`block text-sm font-medium cursor-pointer ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-text dark:text-text-dark'}`}>
              {label}
            </label>
          )}
          {description && (
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-text/80 dark:text-text-dark/80'}`}>{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;