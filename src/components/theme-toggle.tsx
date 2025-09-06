'use client';

import { useTheme } from 'next-themes';
import { Button } from './ui/button';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button variant="link" onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}>
      switch theme
    </Button>
  );
}
