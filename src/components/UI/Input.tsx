import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-text">
          {label}
        </label>
      )}
      <input
        className={`
          block w-full rounded-md border border-border bg-surface px-3 py-2 shadow-sm
          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
          ${className}
          dark:bg-surface-dark dark:border-border-dark
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;