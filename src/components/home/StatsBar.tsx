import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Stat { value: number; label: string; suffix: string }

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
  const [stats, setStats] = useState<Stat[]>([
    { value: 0, label: 'Active Members', suffix: '+' },
    { value: 0, label: 'Expert Trainers', suffix: '' },
    { value: 1, label: 'Years Strong', suffix: '' },
    { value: 0, label: 'Retention Rate', suffix: '%' },
  ]);

  useEffect(() => {
    const loadStats = async (): Promise<void> => {
      const { data: members, error } = await supabase
        .from('members')
        .select('status,assigned_trainer,join_date');

      if (error || !members) return;

      const active = members.filter((m) => m.status === 'Active').length;
      const expiring = members.filter((m) => m.status === 'Expiring').length;
      const total = members.length || 1;
      const retention = Math.round(((active + expiring) / total) * 100);

      const trainers = new Set(
        members
          .map((m) => String(m.assigned_trainer ?? '').trim())
          .filter((v) => v.length > 0),
      ).size;

      const yearsStrong = (() => {
        const dates = members
          .map((m) => new Date(String(m.join_date ?? '')))
          .filter((d) => !Number.isNaN(d.getTime()))
          .sort((a, b) => a.getTime() - b.getTime());
        if (dates.length === 0) return 1;
        const first = dates[0];
        const now = new Date();
        return Math.max(1, now.getFullYear() - first.getFullYear());
      })();

      setStats([
        { value: active, label: 'Active Members', suffix: '+' },
        { value: trainers, label: 'Expert Trainers', suffix: '' },
        { value: yearsStrong, label: 'Years Strong', suffix: '' },
        { value: retention, label: 'Retention Rate', suffix: '%' },
      ]);
    };

    void loadStats();
  }, []);

  return (
    <section className="bg-[hsl(var(--bg-surface))] border-y border-[hsl(var(--border-color))] py-12">
      <div className="container-vg grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
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
