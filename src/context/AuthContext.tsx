import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { buildApiUrl } from '@/config/api';

const STORAGE_KEY = 'ieee_admin_authenticated';

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (username?: string, password?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredAuthState = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(STORAGE_KEY) === 'true';
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(readStoredAuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(readStoredAuthState());
    setLoading(false);
  }, []);

  const login = useCallback(async (email?: string, password?: string) => {
    const payload = { email: email ?? '', password: password ?? '' };

    if (!payload.email || !payload.password) {
      throw new Error('Email and password are required.');
    }

    const response = await fetch(buildApiUrl('/api/v1/auth/login'), {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw new Error(data.message ?? data.msg ?? 'Unable to sign in.');
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('ieee_admin_token', data.token ?? '');
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }

    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'false');
    }
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      loading,
      login,
      logout,
    }),
    [isAuthenticated, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* eslint-disable react-refresh/only-export-components */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
