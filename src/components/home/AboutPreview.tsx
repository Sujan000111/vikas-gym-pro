import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';

const CREDENTIALS: string[] = ['NHCE Alumni', 'NSCA-CSCS', 'Precision Nutrition', '9+ Years Coaching'];

export function AboutPreview() {
  return (
    <section className="py-24 container-vg grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div>
        <div className="overline mb-3">Who We Are</div>
        <h2 className="section-heading mb-6">BUILT BY A LIFTER.<br />RUN BY COACHES.</h2>
        <p className="text-[hsl(var(--text-body))] mb-4">
          VikasGym started in a small studio near New Horizon College of Engineering with one rule: no fluff, no shortcuts, just real coaching. Today we serve 500+ members with the same standard.
        </p>
        <p className="text-[hsl(var(--text-body))] mb-6">
          Every program is built on evidence. Every coach is certified. Every member gets attention — not just a swipe-card.
        </p>
        <Link to="/about" className="inline-flex items-center gap-2 text-[hsl(var(--red))] hover:gap-3 transition-all font-semibold uppercase tracking-wider text-sm">
          Read our story <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="card-vg p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-sm bg-[hsl(var(--red))] flex items-center justify-center font-display text-2xl text-white">VA</div>
          <div>
            <div className="font-display text-3xl">Vikas AP</div>
            <div className="text-sm text-[hsl(var(--text-muted))]">Founder & Head Coach</div>
          </div>
        </div>
        <div className="badge-vg bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-body))] mb-4">
          <GraduationCap className="w-3 h-3" /> New Horizon College of Engineering
        </div>
        <div className="flex flex-wrap gap-2">
          {CREDENTIALS.map((c) => (
            <span key={c} className="badge-vg bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-body))] border border-[hsl(var(--border-color))]">{c}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
