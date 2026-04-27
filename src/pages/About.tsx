import { GraduationCap, Linkedin, Instagram, Quote } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { TRAINERS } from '@/data/trainers';

const CREDENTIALS: string[] = ['Final Year - NHCE', 'NSCA-CSCS', 'Precision Nutrition', '9+ Years Coaching'];

const TIMELINE: { year: string; title: string; description: string }[] = [
  { year: '2021', title: 'Studio Founded', description: 'Vikas starts a compact coaching studio close to NHCE.' },
  { year: '2022', title: '100 Members', description: 'Early student and local member transformations drive rapid growth.' },
  { year: '2023', title: 'Expanded Facility', description: 'The gym scales to a larger strength and conditioning floor.' },
  { year: '2025', title: '500+ Community', description: 'A strong coaching team supports members across goals and levels.' },
];

const VALUES: { name: string; line: string }[] = [
  { name: 'Discipline', line: 'Show up. Do the work. The rest follows.' },
  { name: 'Evidence', line: 'Programs built on science, not trends.' },
  { name: 'Community', line: 'Stronger together. Always.' },
  { name: 'Excellence', line: 'Nothing average leaves this gym.' },
];

export default function About() {
  return (
    <>
      <PageBanner title="Our Story" subtitle="Built in Bengaluru. Trained for life." breadcrumb={['Home', 'About']} />

      {/* Founder */}
      <section className="py-20 container-vg grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="card-vg p-8">
            <div className="w-32 h-32 rounded-full bg-[hsl(var(--red))] flex items-center justify-center font-display text-5xl text-white mx-auto mb-6">VA</div>
            <div className="text-center">
              <div className="font-display text-4xl">Vikas AP</div>
              <div className="text-sm text-[hsl(var(--text-muted))]">Founder & Head Coach</div>
              <div className="badge-vg bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-body))] mt-3">
                <GraduationCap className="w-3 h-3" /> NHCE, Bengaluru
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {CREDENTIALS.map((c) => (
                  <span key={c} className="badge-vg bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] text-[hsl(var(--text-body))]">{c}</span>
                ))}
              </div>
              <div className="flex gap-3 justify-center mt-6">
                {[Linkedin, Instagram].map((I, i) => (
                  <a key={i} href="#" className="w-10 h-10 border border-[hsl(var(--border-color))] flex items-center justify-center text-[hsl(var(--text-body))] hover:text-[hsl(var(--red))] hover:border-[hsl(var(--red))] transition rounded-sm">
                    <I className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Quote className="w-12 h-12 text-[hsl(var(--red))] mb-4" />
          <p className="font-display text-3xl md:text-4xl leading-tight mb-8 text-[hsl(var(--text-primary))]">
            "Strength is built in silence. Character is built when nobody's watching. We coach both."
          </p>
          <div className="space-y-4 text-[hsl(var(--text-body))]">
            <p>Vikas AP started lifting at 16. In his final year at New Horizon College of Engineering, he began coaching classmates in a small campus corner.</p>
            <p>That early mentorship became a mission. With NSCA and Precision Nutrition certifications, he launched VikasGym to deliver evidence-based coaching to the Bengaluru fitness community.</p>
            <p>Today, VikasGym supports 500+ members with a disciplined, science-driven approach and a supportive coaching team focused on long-term results.</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-[hsl(var(--bg-surface))] border-y border-[hsl(var(--border-color))]">
        <div className="container-vg">
          <div className="overline mb-3">Our Journey</div>
          <h2 className="section-heading mb-12">MILESTONES</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-[hsl(var(--border-color))]" />
            {TIMELINE.map((t) => (
              <div key={t.year} className="relative">
                <div className="w-3 h-3 rounded-full bg-[hsl(var(--red))] mx-auto mb-4 ring-4 ring-[hsl(var(--bg-surface))] relative z-10" />
                <div className="font-display text-3xl text-[hsl(var(--red))] text-center">{t.year}</div>
                <div className="font-semibold text-center mt-1">{t.title}</div>
                <p className="text-sm text-[hsl(var(--text-muted))] text-center mt-2">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 container-vg">
        <div className="overline mb-3">What We Stand For</div>
        <h2 className="section-heading mb-12">CORE VALUES</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v) => (
            <div key={v.name} className="card-vg p-6">
              <div className="font-display text-3xl mb-2">{v.name}</div>
              <p className="text-sm text-[hsl(var(--text-body))]">{v.line}</p>
              <div className="w-12 h-0.5 bg-[hsl(var(--red))] mt-4" />
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[hsl(var(--bg-surface))] border-t border-[hsl(var(--border-color))]">
        <div className="container-vg">
          <div className="overline mb-3">Coaches</div>
          <h2 className="section-heading mb-12">THE TEAM</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TRAINERS.map((t) => (
              <div key={t.id} className="card-vg p-6">
                <div className="w-16 h-16 rounded-sm bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] flex items-center justify-center font-display text-xl mb-4">{t.initials}</div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-[hsl(var(--red))] mt-1">{t.specialization}</div>
                <div className="badge-vg bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-muted))] mt-2">{t.yearsExperience} yrs</div>
                <p className="text-xs text-[hsl(var(--text-body))] mt-3">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
