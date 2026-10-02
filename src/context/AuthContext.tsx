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
import {
  getStoredToken,
  storeTokenCookie,
  removeTokenCookie,
  getCookie,
  setCookie,
  deleteCookie,
} from '@/services/adminApi';

const AUTH_COOKIE_FLAG = 'ieee_admin_auth';

type AuthContextValue = {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readStoredAuthState = (): boolean => {
  if (typeof document === 'undefined') {
    return false;
  }

  const token = getStoredToken();
  const hasCookieFlag = getCookie(AUTH_COOKIE_FLAG) === 'true';

  return Boolean(token || hasCookieFlag);
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(readStoredAuthState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(readStoredAuthState());
    setLoading(false);
  }, []);

  const login = useCallback(async (email?: string, password?: string) => {
    const payload = {
      email: email?.trim() ?? '',
      password: password?.trim() ?? '',
    };

    if (!payload.email || !payload.password) {
      throw new Error('Email and password are required.');
    }

    let response: Response;
    try {
      response = await fetch(buildApiUrl('/api/v1/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new Error(
        'Unable to reach backend server. If using Render free tier, the server might be waking up (takes ~30-45s). Please try again in a moment.'
      );
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      throw new Error(data.message ?? data.msg ?? 'Unable to sign in. Please verify your credentials.');
    }

    if (data.token) {
      storeTokenCookie(data.token);
    }
    setCookie(AUTH_COOKIE_FLAG, 'true', 7);

    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(buildApiUrl('/api/v1/auth/logout'), {
        method: 'POST',
      });
    } catch {
      // Allow clean client-side logout even if network fails
    } finally {
      removeTokenCookie();
      deleteCookie(AUTH_COOKIE_FLAG);
      setIsAuthenticated(false);
    }
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
