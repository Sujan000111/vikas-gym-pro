import { useNavigate } from 'react-router-dom';
import { VGButton } from '@/components/ui/VGButton';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[92vh] flex items-center pt-20 pb-12 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(var(--red) / 0.15), transparent 50%), radial-gradient(circle at 80% 70%, hsl(var(--red) / 0.08), transparent 50%)',
        }}
        aria-hidden
      />
      <div className="container-vg relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-8">
          <div className="overline mb-4">VikasGym · Bengaluru</div>
          <h1 className="font-display text-6xl sm:text-7xl md:text-[7rem] leading-[0.9] text-[hsl(var(--text-primary))]">
            Build Strength.
            <br />
            <span className="text-[hsl(var(--red))]">Build Discipline.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg text-[hsl(var(--text-body))]">
            Structured coaching for students and professionals who want measurable progress, better health, and a gym culture that stays serious.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <VGButton size="lg" variant="primary" onClick={() => navigate('/register')}>Start Membership</VGButton>
            <VGButton size="lg" variant="outline" onClick={() => navigate('/services')}>View Plans</VGButton>
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-4">
          <div className="card-vg p-8 space-y-6 bg-[hsl(var(--bg-surface))]/80 backdrop-blur">
            <div>
              <div className="overline mb-2">Today's Schedule</div>
              <div className="font-display text-5xl">5:30 AM - 10:30 PM</div>
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
