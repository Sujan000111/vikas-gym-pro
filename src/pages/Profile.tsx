import { User, Mail, Shield } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { userEmail, isAdmin } = useAuth();

  return (
    <>
      <PageBanner title="Profile" subtitle="View your account information." breadcrumb={['Home', 'Profile']} />
      <section className="container-vg py-16 max-w-3xl">
        <div className="card-vg p-8 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[hsl(var(--red)/0.2)] border border-[hsl(var(--red)/0.35)] flex items-center justify-center">
              <User className="w-5 h-5 text-[hsl(var(--red))]" />
            </div>
            <div>
              <h2 className="font-display text-3xl">Your Account</h2>
              <p className="text-sm text-[hsl(var(--text-muted))]">Manage your profile and access.</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="p-4 rounded-lg border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-elevated))/0.45]">
              <div className="text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1">Email</div>
              <div className="flex items-center gap-2 text-[hsl(var(--text-body))]">
                <Mail className="w-4 h-4 text-[hsl(var(--red))]" />
                {userEmail ?? '-'}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-[hsl(var(--border-color))] bg-[hsl(var(--bg-elevated))/0.45]">
              <div className="text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1">Role</div>
              <div className="flex items-center gap-2 text-[hsl(var(--text-body))]">
                <Shield className="w-4 h-4 text-[hsl(var(--red))]" />
                {isAdmin ? 'Admin' : 'Member'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
