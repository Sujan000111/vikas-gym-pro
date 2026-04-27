import { Activity, Award, Brain, Check, Dumbbell, Flame, HeartPulse, Salad, Trophy, UserCog } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { VGButton } from '@/components/ui/VGButton';
import { GYM_SERVICES } from '@/data/services';
import type { Service, Suitability } from '@/types';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = { Dumbbell, UserCog, Flame, Salad, Activity, HeartPulse };

const SUIT_COLORS: Record<Suitability, string> = {
  Beginner: 'bg-green-500/10 text-green-400 border-green-500/30',
  Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Advanced: 'bg-red-500/10 text-red-400 border-red-500/30',
};

function ServiceDetailCard({ s }: { s: Service }) {
  const Icon = ICONS[s.icon] ?? Dumbbell;
  const enquire = (): void => {
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(`Hi VikasGym, I want info on ${s.title}.`)}`, '_blank');
  };
  return (
    <div className="card-vg p-7 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <Icon className="w-10 h-10 text-[hsl(var(--red))]" />
        <span className="font-display text-xl text-[hsl(var(--text-primary))]">{s.price}</span>
      </div>
      <h3 className="font-display text-3xl mb-2">{s.title}</h3>
      <p className="text-sm text-[hsl(var(--text-body))] mb-5">{s.description}</p>

      <ul className="space-y-2 mb-5">
        {s.included.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-[hsl(var(--text-body))]">
            <Check className="w-4 h-4 text-[hsl(var(--red))] mt-0.5 shrink-0" /> {f}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 mb-5">
        <span className="badge-vg bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-muted))] border border-[hsl(var(--border-color))]">{s.duration}</span>
        {s.suitableFor.map((sf) => (
          <span key={sf} className={cn('badge-vg border', SUIT_COLORS[sf])}>{sf}</span>
        ))}
      </div>

      <VGButton variant="outline" size="sm" onClick={enquire} className="w-full mt-auto">Enquire on WhatsApp</VGButton>
    </div>
  );
}

const WHY: { icon: LucideIcon; title: string; line: string }[] = [
  { icon: Award, title: 'Expert Trainers', line: 'Certified coaches with real-world results, not just credentials.' },
  { icon: Brain, title: 'Science-Based Methods', line: 'Programming rooted in evidence and refined by experience.' },
  { icon: Trophy, title: 'Proven Track Record', line: '500+ members. 98% retention. Results that compound.' },
];

export default function Services() {
  return (
    <>
      <PageBanner title="OUR SERVICES" subtitle="Pick a path. We'll coach the rest." breadcrumb={['Home', 'Services']} />

      <section className="py-16 container-vg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {GYM_SERVICES.map((s) => <ServiceDetailCard key={s.id} s={s} />)}
        </div>
      </section>

      <section className="py-20 bg-[hsl(var(--bg-surface))] border-y border-[hsl(var(--border-color))]">
        <div className="container-vg">
          <div className="overline mb-3 text-center">Why VikasGym</div>
          <h2 className="font-display text-5xl text-center mb-12">THE EDGE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY.map((w) => (
              <div key={w.title} className="text-center p-6">
                <w.icon className="w-12 h-12 text-[hsl(var(--red))] mx-auto mb-4" />
                <div className="font-display text-2xl mb-2">{w.title}</div>
                <p className="text-sm text-[hsl(var(--text-body))]">{w.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative" style={{ background: 'rgba(220,38,38,0.06)' }}>
        <div className="container-vg text-center">
          <h2 className="font-display text-5xl md:text-6xl mb-3">READY TO START?</h2>
          <p className="text-[hsl(var(--text-body))] mb-8">Book a tour. Train a session. See for yourself.</p>
          <a href="/#auth">
            <VGButton size="lg" variant="primary">Join VikasGym</VGButton>
          </a>
        </div>
      </section>
    </>
  );
}
