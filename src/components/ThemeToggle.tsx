import { useState } from 'react';
import { Button } from 'flowbite-react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    setIsDark(html.classList.contains('dark'));
  };

  return (
    <Button color="gray" size="xs" onClick={toggleTheme}>
      {isDark ? 'Light' : 'Dark'}
    </Button>
  );
};

export default ThemeToggle;
