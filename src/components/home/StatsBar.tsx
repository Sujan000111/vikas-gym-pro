import { useEffect, useRef, useState } from 'react';

interface Stat { value: number; label: string; suffix: string }

const STATS: Stat[] = [
  { value: 500, label: 'Active Members', suffix: '+' },
  { value: 12, label: 'Expert Trainers', suffix: '' },
  { value: 4, label: 'Years Strong', suffix: '' },
  { value: 98, label: 'Retention Rate', suffix: '%' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [n, setN] = useState<number>(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const start = performance.now();
          const tick = (now: number): void => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setN(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref} className="font-display text-5xl md:text-6xl text-[hsl(var(--text-primary))]">{n}{suffix}</span>;
}

export function StatsBar() {
  return (
    <section className="bg-[hsl(var(--bg-surface))] border-y border-[hsl(var(--border-color))] py-12">
      <div className="container-vg grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="w-10 h-0.5 bg-[hsl(var(--red))] mb-3" />
            <Counter target={s.value} suffix={s.suffix} />
            <div className="mt-2 text-xs uppercase tracking-widest text-[hsl(var(--text-muted))]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
