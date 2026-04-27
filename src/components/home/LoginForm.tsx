import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!state.email || !state.password) {
      addToast('Email and password are required.', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(state.email, state.password);
    setLoading(false);
    if (ok) {
      addToast('Welcome back, admin.', 'success');
      navigate('/dashboard');
    } else {
      addToast('Invalid credentials. Try admin@vikasgym.com / Admin@123', 'error', 5000);
    }
  };

  const handleForgot = (): void => {
    addToast('Reset link sent (demo).', 'info');
  };

  return (
    <form onSubmit={handleSubmit} className="card-vg p-8 space-y-5">
      <div>
        <div className="overline mb-2">Existing Member</div>
        <h3 className="font-display text-3xl">LOG IN</h3>
        <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Demo admin: admin@vikasgym.com / Admin@123</p>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Email</label>
        <input
          type="email"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))] transition"
          placeholder="you@email.com"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Password</label>
        <div className="relative">
          <input
            type={showPwd ? 'text' : 'password'}
            value={state.password}
            onChange={(e) => setState({ ...state, password: e.target.value })}
            className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 pr-10 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))] transition"
            placeholder="••••••••"
          />
          <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))]">
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
    </form>
  );
}
