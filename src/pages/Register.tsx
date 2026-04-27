import { Link } from 'react-router-dom';
import { BadgeCheck, Users, ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { RegisterForm } from '@/components/home/RegisterForm';

export default function Register() {
  return (
    <>
      <PageBanner
        title="Create Membership Account"
        subtitle="Register in a few steps and start training with structured coaching."
        breadcrumb={['Home', 'Register']}
      />

      <section className="container-vg py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <aside className="lg:col-span-5 card-vg p-8">
            <div className="overline mb-3">New Member</div>
            <h2 className="font-display text-4xl mb-4">Join VikasGym professionally</h2>
            <p className="text-[hsl(var(--text-body))] mb-6">
              Choose your membership plan, set your goals, and let our coaching system guide your progress.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <BadgeCheck className="w-5 h-5 text-[hsl(var(--red))] mt-0.5" />
                <p className="text-sm text-[hsl(var(--text-body))]">Structured registration flow with input validation.</p>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-[hsl(var(--red))] mt-0.5" />
                <p className="text-sm text-[hsl(var(--text-body))]">Designed for students and professionals alike.</p>
              </div>
            </div>
            <Link to="/login" className="inline-flex mt-7 items-center gap-2 text-sm font-medium text-[hsl(var(--red))] hover:underline">
              Already have an account? Login <ArrowRight className="w-4 h-4" />
            </Link>
          </aside>

          <div className="lg:col-span-7">
            <RegisterForm />
          </div>
        </div>
      </section>
    </>
  );
}
