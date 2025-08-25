import { TextInput, Label, type TextInputProps } from 'flowbite-react';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
}

const Input = ({ label, error, id, ...props }: Props) => (
  <div className="space-y-1">
    {label && <Label htmlFor={id}>{label}</Label>}
    <TextInput id={id} color={error ? 'failure' : undefined} {...props} />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

export default Input;
