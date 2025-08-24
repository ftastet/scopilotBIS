import React from 'react';

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
    <div className="form-control">
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          className={`checkbox ${className}`}
          checked={checked}
          disabled={disabled}
          {...props}
        />
        {label && <span className="label-text ml-2">{label}</span>}
      </label>
      {description && <span className="label-text-alt ml-8">{description}</span>}
    </div>
  );
};

export default Checkbox;