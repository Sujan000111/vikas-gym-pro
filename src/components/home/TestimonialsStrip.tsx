import { useEffect, useRef } from 'react';
import { TESTIMONIALS } from '@/data/testimonials';
import { StarRating } from '@/components/ui/StarRating';

export function TestimonialsStrip() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const id = window.setInterval(() => {
      if (!el) return;
      el.scrollLeft += 1;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 1) {
        el.scrollLeft = 0;
      }
    }, 25);
    return () => window.clearInterval(id);
  }, []);

  // Duplicate for visual continuity
  const items = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="py-20">
      <div className="container-vg mb-10">
        <div className="overline mb-3">Member Voices</div>
        <h2 className="section-heading">REAL RESULTS.</h2>
      </div>
      <div ref={ref} className="no-scrollbar overflow-x-auto">
        <div className="flex gap-5 px-4 lg:px-8" style={{ width: 'max-content' }}>
          {items.map((t, i) => (
            <div key={`${t.id}-${i}`} className="card-vg p-6 w-[320px] shrink-0 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-[hsl(var(--red)/0.15)] border border-[hsl(var(--red))] flex items-center justify-center font-semibold text-[hsl(var(--red))]">
                  {t.avatarInitials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.memberName}</div>
                  <div className="badge-vg bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-muted))] mt-0.5">{t.membershipType}</div>
                </div>
              </div>
              <StarRating value={t.rating} readOnly size={16} />
              <p className="mt-3 text-sm italic text-[hsl(var(--text-body))]">"{t.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
