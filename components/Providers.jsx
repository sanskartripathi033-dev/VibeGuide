'use client';

import { ThemeProvider } from 'next-themes';
import { useState, useEffect } from 'react';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
