import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from '@/router';
import { AuthProvider } from '@/context/AuthContext';
import '@/styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>,
);
