import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (!isAdmin) {
      addToast('Admin access required. Please log in.', 'warning');
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate, addToast]);

  if (!isAdmin) return null;
  return <>{children}</>;
}
