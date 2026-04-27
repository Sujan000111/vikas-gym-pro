import { VGButton } from '@/components/ui/VGButton';

const scrollTo = (id: string): void => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export function HeroSection() {
  return (
    <section className="relative min-h-[100vh] flex items-center pt-16 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(var(--red) / 0.15), transparent 50%), radial-gradient(circle at 80% 70%, hsl(var(--red) / 0.08), transparent 50%)',
        }}
        aria-hidden
      />
      <div className="container-vg relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8">
          <div className="overline mb-4">VikasGym · Bengaluru</div>
          <h1 className="font-display text-7xl sm:text-8xl md:text-[10rem] leading-[0.85] text-[hsl(var(--text-primary))]">
            FORGE YOUR
            <br />
            <span className="text-[hsl(var(--red))]">LIMITS.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-[hsl(var(--text-body))]">
            Science-backed training. Real results. New Horizon's finest gym — built by lifters, for lifters.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <VGButton size="lg" variant="primary" onClick={() => scrollTo('auth')}>Join Now</VGButton>
            <VGButton size="lg" variant="outline" onClick={() => scrollTo('pricing')}>Explore Plans</VGButton>
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-4">
          <div className="card-vg p-8 space-y-6 bg-[hsl(var(--bg-surface))]/80 backdrop-blur">
            <div>
              <div className="overline mb-2">Today</div>
              <div className="font-display text-5xl">5:30 — 22:30</div>
            </div>
            <div className="h-px bg-[hsl(var(--border-color))]" />
            <div className="space-y-3 text-sm">
              {['Open Gym Floor', 'HIIT @ 7:00 PM', 'Strength Block @ 8:00 PM'].map((s) => (
                <div key={s} className="flex items-center gap-2 text-[hsl(var(--text-body))]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--red))]" />
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
