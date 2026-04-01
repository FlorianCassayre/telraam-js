import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { CssBaseline } from '@mui/material';
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <main>
    <CssBaseline />
    {children}
  </main>
);
