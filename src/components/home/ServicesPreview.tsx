import { Link } from 'react-router-dom';
import { ArrowUpRight, Dumbbell, UserCog, Flame, Salad, Activity, HeartPulse } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GYM_SERVICES } from '@/data/services';
import type { Service } from '@/types';

const ICONS: Record<string, LucideIcon> = {
  Dumbbell, UserCog, Flame, Salad, Activity, HeartPulse,
};

function ServiceCard({ s }: { s: Service }) {
  const Icon = ICONS[s.icon] ?? Dumbbell;
  return (
    <Link to="/services" className="card-vg p-6 group flex flex-col h-full">
      <Icon className="w-8 h-8 text-[hsl(var(--red))] mb-4" />
      <h3 className="font-display text-2xl mb-2">{s.title}</h3>
      <p className="text-sm text-[hsl(var(--text-body))] flex-1">{s.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-[hsl(var(--text-muted))] uppercase tracking-widest">{s.duration}</span>
        <ArrowUpRight className="w-4 h-4 text-[hsl(var(--red))] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
      </div>
    </Link>
  );
}

export function ServicesPreview() {
  return (
    <section className="py-24 container-vg">
      <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
        <div>
          <div className="overline mb-3">What We Offer</div>
          <h2 className="section-heading">SERVICES</h2>
        </div>
        <Link to="/services" className="text-sm uppercase tracking-wider font-semibold text-[hsl(var(--red))] hover:text-[hsl(var(--red-hover))]">View all →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GYM_SERVICES.map((s) => <ServiceCard key={s.id} s={s} />)}
      </div>
    </section>
  );
}
