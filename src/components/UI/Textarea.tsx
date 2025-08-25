import { Textarea as FlowbiteTextarea, Label, type TextareaProps } from 'flowbite-react';

interface Props extends TextareaProps {
  label?: string;
  error?: string;
}

const Textarea = ({ label, error, id, ...props }: Props) => (
  <div className="space-y-1">
    {label && <Label htmlFor={id}>{label}</Label>}
    <FlowbiteTextarea id={id} color={error ? 'failure' : undefined} {...props} />
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
);

export default Textarea;
