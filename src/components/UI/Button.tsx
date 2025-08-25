import { Button as FlowbiteButton, type ButtonProps } from 'flowbite-react';
import { LucideIcon } from 'lucide-react';

interface Props extends ButtonProps {
  icon?: LucideIcon;
}

const Button = ({ icon: Icon, children, color = 'blue', size = 'sm', ...props }: Props) => {
  return (
    <FlowbiteButton color={color} size={size} {...props}>
      {Icon && <Icon className={children ? 'mr-2 h-4 w-4' : 'h-4 w-4'} />}
      {children}
    </FlowbiteButton>
  );
};

export default Button;
