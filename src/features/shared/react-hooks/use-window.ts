import { useEffect, useState } from 'react';

// Access the window object client-side without hydration errors or "undefined" errors.
export const useWindow = () => {
  const [win, setWin] = useState<Window>();
  useEffect(() => setWin(window), []);
  return win;
};
