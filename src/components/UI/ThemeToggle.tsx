import { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="toggle"
        checked={theme === 'dark'}
        onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      />
      <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
    </label>
  );
};

export default ThemeToggle;
