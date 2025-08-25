import { Checkbox as FlowbiteCheckbox, Label, type CheckboxProps } from 'flowbite-react';

interface Props extends CheckboxProps {
  label?: string;
  description?: string;
}

const Checkbox = ({ label, description, id, ...props }: Props) => (
  <div className="flex items-start space-x-2">
    <FlowbiteCheckbox id={id} {...props} />
    {(label || description) && (
      <div>
        {label && <Label htmlFor={id}>{label}</Label>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    )}
  </div>
);

export default Checkbox;
