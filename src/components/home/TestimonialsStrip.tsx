import { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '@/data/testimonials';
import { StarRating } from '@/components/ui/StarRating';
import type { MembershipTier } from '@/types';
import { supabase } from '@/lib/supabase';

interface VoiceItem {
  id: string;
  memberName: string;
  membershipType: MembershipTier;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  avatarInitials: string;
}

export function TestimonialsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [voices, setVoices] = useState<VoiceItem[]>(TESTIMONIALS);

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

  useEffect(() => {
    const loadVoices = async (): Promise<void> => {
      const { data, error } = await supabase
        .from('feedback')
        .select('id,name,membership_type,rating,feedback_text')
        .order('created_at', { ascending: false })
        .limit(12);

      if (error || !data || data.length === 0) return;

      const mapped: VoiceItem[] = data.map((r) => ({
        id: String(r.id),
        memberName: String(r.name),
        membershipType: r.membership_type as MembershipTier,
        rating: Number(r.rating) as 1 | 2 | 3 | 4 | 5,
        quote: String(r.feedback_text),
        avatarInitials: String(r.name)
          .split(' ')
          .map((p) => p[0])
          .slice(0, 2)
          .join('')
          .toUpperCase(),
      }));

      setVoices(mapped);
    };

    void loadVoices();
  }, []);

  // Duplicate for visual continuity
  const items = [...voices, ...voices];

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
