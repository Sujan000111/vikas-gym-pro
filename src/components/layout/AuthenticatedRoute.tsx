import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export function AuthenticatedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (!isLoadingAuth && !isLoggedIn) {
      addToast('Please log in to continue.', 'warning');
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, isLoadingAuth, navigate, addToast]);

  if (isLoadingAuth) return null;
  if (!isLoggedIn) return null;
  return <>{children}</>;
}
