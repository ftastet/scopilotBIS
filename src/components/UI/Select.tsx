import { Select as FlowbiteSelect, Label, type SelectProps } from 'flowbite-react';

interface Props extends SelectProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
}

const Select = ({ label, error, id, children, ...props }: Props) => (
  <div className="space-y-1">
    {label && <Label htmlFor={id}>{label}</Label>}
    <FlowbiteSelect id={id} color={error ? 'failure' : undefined} {...props}>
      {children}
    </FlowbiteSelect>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

export default Select;
