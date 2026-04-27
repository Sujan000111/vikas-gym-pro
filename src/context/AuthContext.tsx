import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthState } from '@/types';
import { validateAdminLogin } from '@/utils/auth';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'vg_auth';

const readSession = (): AuthState => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { isLoggedIn: false, isAdmin: false, userEmail: null };
    return JSON.parse(raw) as AuthState;
  } catch {
    return { isLoggedIn: false, isAdmin: false, userEmail: null };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(readSession);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const login = useCallback((email: string, password: string): boolean => {
    if (validateAdminLogin(email, password)) {
      setState({ isLoggedIn: true, isAdmin: true, userEmail: email });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback((): void => {
    setState({ isLoggedIn: false, isAdmin: false, userEmail: null });
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ ...state, login, logout }), [state, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
