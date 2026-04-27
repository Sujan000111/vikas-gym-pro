import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthState } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextValue extends AuthState {
  userId: string | null;
  isLoadingAuth: boolean;
  login: (email: string, password: string, options?: { requireAdmin?: boolean }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const DEFAULT_AUTH_STATE: AuthState = { isLoggedIn: false, isAdmin: false, userEmail: null };

const SESSION_KEY = 'vg_app_auth';
const FIXED_ADMIN_EMAIL = 'vikasap2005@gmail.com';
const FIXED_ADMIN_PASSWORD = 'Vikasap@123';

interface StoredSession {
  userId: string;
  email: string;
  role: 'admin' | 'member';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(DEFAULT_AUTH_STATE);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) {
        setIsLoadingAuth(false);
        return;
      }
      const parsed = JSON.parse(raw) as StoredSession;
      setState({
        isLoggedIn: true,
        isAdmin: parsed.role === 'admin',
        userEmail: parsed.email,
      });
      setUserId(parsed.userId);
    } catch {
      setState(DEFAULT_AUTH_STATE);
      setUserId(null);
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  const login = useCallback(async (
    email: string,
    password: string,
    options?: { requireAdmin?: boolean },
  ): Promise<{ ok: boolean; message?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    // Fixed admin credentials requested by project owner.
    if (
      normalizedEmail === FIXED_ADMIN_EMAIL &&
      password === FIXED_ADMIN_PASSWORD
    ) {
      const next: StoredSession = {
        userId: 'fixed-admin',
        email: FIXED_ADMIN_EMAIL,
        role: 'admin',
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setState({
        isLoggedIn: true,
        isAdmin: true,
        userEmail: next.email,
      });
      setUserId(next.userId);
      return { ok: true };
    }

    const { data, error } = await supabase
      .from('app_users')
      .select('id,email,password,role')
      .eq('email', normalizedEmail)
      .maybeSingle();

    if (error) return { ok: false, message: error.message };
    if (!data) return { ok: false, message: 'Account not found.' };
    if (data.password !== password) return { ok: false, message: 'Incorrect password.' };
    if (options?.requireAdmin && data.role !== 'admin') {
      return { ok: false, message: 'Admin access only. Use an admin account.' };
    }

    const next: StoredSession = {
      userId: data.id as string,
      email: data.email as string,
      role: (data.role as 'admin' | 'member') ?? 'member',
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    setState({
      isLoggedIn: true,
      isAdmin: next.role === 'admin',
      userEmail: next.email,
    });
    setUserId(next.userId);
    return { ok: true };
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // no-op
    }
    setState(DEFAULT_AUTH_STATE);
    setUserId(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, userId, isLoadingAuth, login, logout }),
    [state, userId, isLoadingAuth, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
