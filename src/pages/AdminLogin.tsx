import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { VGButton } from '@/components/ui/VGButton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Email and password are required.', 'error');
      return;
    }
    setLoading(true);
    const res = await login(email, password, { requireAdmin: true });
    setLoading(false);
    if (!res.ok) {
      addToast(res.message ?? 'Admin login failed.', 'error');
      return;
    }
    addToast('Welcome admin.', 'success');
    navigate('/dashboard');
  };

  const inputCls =
    'w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-lg px-4 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))] transition';

  return (
    <>
      <PageBanner title="Admin Access" subtitle="Restricted dashboard login for gym administrators." breadcrumb={['Home', 'Admin']} />
      <section className="container-vg py-16 max-w-xl">
        <form onSubmit={handleSubmit} className="card-vg p-8 space-y-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[hsl(var(--red))]" />
            <h2 className="font-display text-3xl">Admin Login</h2>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Admin Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} autoComplete="email" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} autoComplete="current-password" />
          </div>

          <VGButton type="submit" loading={loading} className="w-full">Login to Dashboard</VGButton>
        </form>
      </section>
    </>
  );
}
