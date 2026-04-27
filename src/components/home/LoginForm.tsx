import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { VGButton } from '@/components/ui/VGButton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface State { email: string; password: string; remember: boolean }

export function LoginForm() {
  const [state, setState] = useState<State>({ email: '', password: '', remember: false });
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const inputCls =
    'w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-lg px-4 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))] transition';

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!state.email || !state.password) {
      addToast('Email and password are required.', 'error');
      return;
    }
    setLoading(true);
    const result = await login(state.email, state.password);
    setLoading(false);
    if (result.ok) {
      addToast('Welcome back.', 'success');
      navigate('/dashboard');
    } else {
      addToast(result.message ?? 'Invalid credentials.', 'error', 5000);
    }
  };

  const handleForgot = (): void => {
    addToast('Reset link sent (demo).', 'info');
  };

  return (
    <form onSubmit={handleSubmit} className="card-vg p-8 space-y-5">
      <div>
        <div className="overline mb-2">Existing Member</div>
        <h3 className="font-display text-3xl">Login</h3>
        <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Use your registered email and password.</p>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Email</label>
        <input
          type="email"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          className={inputCls}
          placeholder="you@email.com"
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Password</label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'}
            value={state.password}
            onChange={(e) => setState({ ...state, password: e.target.value })}
            className={`${inputCls} pr-12`}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? 'Hide password' : 'Show password'}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md flex items-center justify-center text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))] hover:bg-[hsl(var(--bg-surface))] transition"
          >
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={state.remember}
            onChange={(e) => setState({ ...state, remember: e.target.checked })}
            className="accent-[hsl(var(--red))]"
          />
          <span className="text-[hsl(var(--text-body))]">Remember me</span>
        </label>
        <button type="button" onClick={handleForgot} className="text-[hsl(var(--red))] hover:underline">Forgot?</button>
      </div>

      <VGButton type="submit" loading={loading} className="w-full">Log In</VGButton>
      <p className="text-sm text-[hsl(var(--text-muted))] text-center">
        New to VikasGym?{' '}
        <Link to="/register" className="text-[hsl(var(--red))] hover:underline font-medium">
          Create an account
        </Link>
      </p>
    </form>
  );
}
