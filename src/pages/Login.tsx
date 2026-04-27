import { Link } from 'react-router-dom';
import { ShieldCheck, Clock3, ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { LoginForm } from '@/components/home/LoginForm';

export default function Login() {
  return (
    <>
      <PageBanner
        title="Member Login"
        subtitle="Access your member dashboard, plans, and progress securely."
        breadcrumb={['Home', 'Login']}
      />

      <section className="container-vg py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-5 card-vg p-8">
            <div className="overline mb-3">Welcome Back</div>
            <h2 className="font-display text-4xl mb-4">Sign in to continue your fitness journey</h2>
            <p className="text-[hsl(var(--text-body))] mb-6">
              Professional member access with secure login and a smooth dashboard experience.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[hsl(var(--red))] mt-0.5" />
                <p className="text-sm text-[hsl(var(--text-body))]">Secure session-based login for admin access.</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="w-5 h-5 text-[hsl(var(--red))] mt-0.5" />
                <p className="text-sm text-[hsl(var(--text-body))]">Fast account access with streamlined form design.</p>
              </div>
            </div>
            <Link to="/register" className="inline-flex mt-7 items-center gap-2 text-sm font-medium text-[hsl(var(--red))] hover:underline">
              Need an account? Register here <ArrowRight className="w-4 h-4" />
            </Link>
          </aside>

          <div className="lg:col-span-7">
            <LoginForm />
          </div>
        </div>
      </section>
    </>
  );
}
