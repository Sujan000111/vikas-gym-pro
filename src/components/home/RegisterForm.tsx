import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VGButton } from '@/components/ui/VGButton';
import { useToast } from '@/context/ToastContext';
import type { MembershipTier } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const GOALS: { value: string; label: string }[] = [
  { value: 'weight_loss', label: 'Lose Fat' },
  { value: 'muscle_gain', label: 'Build Muscle' },
  { value: 'general', label: 'General Fitness' },
  { value: 'athletic', label: 'Athletic Performance' },
];

const TIERS: { tier: MembershipTier; price: string }[] = [
  { tier: 'Basic', price: '₹1,499' },
  { tier: 'Pro', price: '₹2,999' },
  { tier: 'Elite', price: '₹5,499' },
];

interface RegState {
  fullName: string; email: string; phone: string; dob: string;
  goal: string; tier: MembershipTier; password: string; confirm: string; terms: boolean;
}

interface ErrState { [k: string]: string | undefined }

const initial: RegState = {
  fullName: '', email: '', phone: '', dob: '',
  goal: 'muscle_gain', tier: 'Pro', password: '', confirm: '', terms: false,
};

export function RegisterForm() {
  const [state, setState] = useState<RegState>(initial);
  const [errors, setErrors] = useState<ErrState>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const e: ErrState = {};
    if (!state.fullName.trim()) e.fullName = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(state.email)) e.email = 'Invalid email';
    if (!/^[+\d\s-]{10,15}$/.test(state.phone)) e.phone = 'Invalid phone';
    if (!state.dob) e.dob = 'Required';
    if (state.password.length < 8) e.password = 'Min 8 chars';
    if (state.confirm !== state.password) e.confirm = 'Does not match';
    if (!state.terms) e.terms = 'You must accept';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validate()) {
      addToast('Please fix the highlighted fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const email = state.email.trim().toLowerCase();
      const { data: existing, error: existingError } = await supabase
        .from('app_users')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      if (existingError) throw existingError;
      if (existing) throw new Error('Email already registered. Please log in.');

      const { data: createdUser, error: createError } = await supabase
        .from('app_users')
        .insert({
          full_name: state.fullName,
          email,
          phone: state.phone,
          dob: state.dob,
          password: state.password,
          role: 'member',
        })
        .select('id')
        .single();
      if (createError) throw createError;

      const { error: regError } = await supabase.from('registrations').insert({
        full_name: state.fullName,
        email,
        phone: state.phone,
        dob: state.dob,
        goal: state.goal,
        tier: state.tier,
      });
      if (regError) throw regError;

      if (!createdUser?.id) {
        throw new Error('Could not create account.');
      }

      const loginResult = await login(email, state.password);
      if (!loginResult.ok) {
        throw new Error(loginResult.message ?? 'Account created, but auto-login failed.');
      }

      addToast(`Welcome, ${state.fullName.split(' ')[0]}! Registration successful.`, 'success', 4000);
      setState(initial);
      setErrors({});
      navigate('/profile');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      addToast(message, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (key: keyof RegState): string =>
    cn(
      'w-full bg-[hsl(var(--bg-elevated))] border rounded-sm px-3 h-11 text-sm focus:outline-none transition',
      errors[key] ? 'border-red-500' : 'border-[hsl(var(--border-color))] focus:border-[hsl(var(--red))]',
    );

  return (
    <form onSubmit={handleSubmit} className="card-vg p-8 space-y-5">
      <div>
        <div className="overline mb-2">New Member</div>
        <h3 className="font-display text-3xl">Create Account</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Full Name</label>
          <input value={state.fullName} onChange={(e) => setState({ ...state, fullName: e.target.value })} className={inputCls('fullName')} />
          {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Email</label>
          <input type="email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} className={inputCls('email')} />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Phone</label>
          <input value={state.phone} onChange={(e) => setState({ ...state, phone: e.target.value })} placeholder="+91 ..." className={inputCls('phone')} />
          {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Date of Birth</label>
          <input type="date" value={state.dob} onChange={(e) => setState({ ...state, dob: e.target.value })} className={inputCls('dob')} />
          {errors.dob && <p className="text-xs text-red-400 mt-1">{errors.dob}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Fitness Goal</label>
        <select value={state.goal} onChange={(e) => setState({ ...state, goal: e.target.value })} className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))]">
          {GOALS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Membership Tier</label>
        <div className="grid grid-cols-3 gap-2">
          {TIERS.map((t) => (
            <button
              key={t.tier}
              type="button"
              onClick={() => setState({ ...state, tier: t.tier })}
              className={cn(
                'p-3 rounded-sm border-2 text-left transition',
                state.tier === t.tier
                  ? 'border-[hsl(var(--red))] bg-[hsl(var(--red)/0.05)]'
                  : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--text-muted))]',
              )}
            >
              <div className="font-display text-xl">{t.tier}</div>
              <div className="text-xs text-[hsl(var(--text-muted))]">{t.price}/mo</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Password</label>
          <input type="password" value={state.password} onChange={(e) => setState({ ...state, password: e.target.value })} className={inputCls('password')} />
          {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
        </div>
        <div>
          <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Confirm</label>
          <input type="password" value={state.confirm} onChange={(e) => setState({ ...state, confirm: e.target.value })} className={inputCls('confirm')} />
          {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={state.terms} onChange={(e) => setState({ ...state, terms: e.target.checked })} className="mt-1 accent-[hsl(var(--red))]" />
        <span className="text-[hsl(var(--text-body))]">I agree to the terms, conditions, and gym etiquette rules.</span>
      </label>
      {errors.terms && <p className="text-xs text-red-400 -mt-3">{errors.terms}</p>}

      <VGButton type="submit" loading={loading} className="w-full">Create Account</VGButton>
      <p className="text-sm text-[hsl(var(--text-muted))] text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-[hsl(var(--red))] hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
}
