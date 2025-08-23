import React from 'react';
import { Moon, Sun } from 'lucide-react';
import Button from './Button';
import { useThemeStore } from '../../store/useThemeStore';

const ThemeToggle: React.FC = () => {
  const { theme, toggle } = useThemeStore();
  return (
    <Button
      variant="secondary"
      size="sm"
      icon={theme === 'dark' ? Sun : Moon}
      onClick={toggle}
      aria-label="Changer de thème"
    >
      {theme === 'dark' ? 'Clair' : 'Sombre'}
    </Button>
  );
};

export default ThemeToggle;
