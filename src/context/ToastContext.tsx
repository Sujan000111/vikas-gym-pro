import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ToastState, ToastType } from '@/types';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface ToastContextValue {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ICONS: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const BORDERS: Record<ToastType, string> = {
  success: 'border-l-green-500',
  error: 'border-l-red-500',
  warning: 'border-l-amber-500',
  info: 'border-l-blue-500',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const remove = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration = 3000): void => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    window.setTimeout(() => remove(id), duration);
  }, [remove]);

  const value = useMemo<ToastContextValue>(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              className={`animate-toast-in flex items-start gap-3 bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] border-l-4 ${BORDERS[t.type]} rounded-sm px-4 py-3 shadow-xl`}
            >
              <Icon className="w-5 h-5 mt-0.5 shrink-0 text-[hsl(var(--text-primary))]" />
              <p className="flex-1 text-sm text-[hsl(var(--text-body))]">{t.message}</p>
              <button
                onClick={() => remove(t.id)}
                className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))] transition"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
