import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { VGButton } from '@/components/ui/VGButton';
import { StarRating } from '@/components/ui/StarRating';
import { TESTIMONIALS } from '@/data/testimonials';
import { useToast } from '@/context/ToastContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { FeedbackEntry, MembershipTier } from '@/types';
import { cn } from '@/lib/utils';

const MAX_CHARS = 500;

interface FormState {
  name: string; email: string; membershipType: MembershipTier; memberDuration: string;
  rating: 1 | 2 | 3 | 4 | 5; feedbackText: string; wouldRecommend: boolean | null;
}

const initial: FormState = {
  name: '', email: '', membershipType: 'Pro', memberDuration: '6-12 months',
  rating: 5, feedbackText: '', wouldRecommend: true,
};

export default function Feedback() {
  const [state, setState] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { addToast } = useToast();
  const [stored, setStored] = useLocalStorage<FeedbackEntry[]>('vg_feedback', []);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!state.name.trim() || !state.email.trim() || !state.feedbackText.trim()) {
      addToast('Please complete all required fields.', 'error');
      return;
    }
    if (state.wouldRecommend === null) {
      addToast('Let us know if you would recommend us.', 'error');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      name: state.name, email: state.email, membershipType: state.membershipType,
      memberDuration: state.memberDuration, rating: state.rating, feedbackText: state.feedbackText,
      wouldRecommend: state.wouldRecommend, createdAt: new Date().toISOString(),
    };
    setStored([entry, ...stored]);
    setLoading(false);
    setSubmitted(true);
    addToast('Thanks for the feedback!', 'success');
  };

  const reset = (): void => {
    setState(initial);
    setSubmitted(false);
  };

  return (
    <>
      <PageBanner title="YOUR VOICE" subtitle="Tell us how we're doing — and how we can be better." breadcrumb={['Home', 'Feedback']} />

      {/* Stats */}
      <section className="py-12 bg-[hsl(var(--bg-surface))] border-b border-[hsl(var(--border-color))]">
        <div className="container-vg grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { v: '4.9/5', l: 'Average Rating' },
            { v: '500+', l: 'Reviews Collected' },
            { v: '98%', l: 'Would Recommend' },
          ].map((s) => (
            <div key={s.l} className="card-vg p-6 text-center">
              <div className="font-display text-5xl text-[hsl(var(--red))]">{s.v}</div>
              <div className="text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mt-2">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-16 container-vg max-w-3xl">
        {submitted ? (
          <div className="card-vg p-12 text-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6 animate-pulse" />
            <h3 className="font-display text-4xl mb-2">THANK YOU.</h3>
            <p className="text-[hsl(var(--text-body))] mb-8">Every word helps us build a better gym.</p>
            <VGButton variant="outline" onClick={reset}>Submit Another</VGButton>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card-vg p-8 space-y-6">
            <div>
              <div className="overline mb-2">Share Your Experience</div>
              <h3 className="font-display text-3xl">YOUR FEEDBACK</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Full Name *</label>
                <input value={state.name} onChange={(e) => setState({ ...state, name: e.target.value })} className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Email *</label>
                <input type="email" value={state.email} onChange={(e) => setState({ ...state, email: e.target.value })} className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Membership</label>
                <select value={state.membershipType} onChange={(e) => setState({ ...state, membershipType: e.target.value as MembershipTier })} className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))]">
                  <option>Basic</option><option>Pro</option><option>Elite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Member For</label>
                <select value={state.memberDuration} onChange={(e) => setState({ ...state, memberDuration: e.target.value })} className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))]">
                  <option>{'< 3 months'}</option>
                  <option>3-6 months</option>
                  <option>6-12 months</option>
                  <option>1-2 years</option>
                  <option>2+ years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Overall Rating</label>
              <StarRating value={state.rating} onChange={(r) => setState({ ...state, rating: r })} size={32} />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Feedback *</label>
              <textarea
                value={state.feedbackText}
                onChange={(e) => setState({ ...state, feedbackText: e.target.value.slice(0, MAX_CHARS) })}
                rows={5}
                className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm p-3 text-sm focus:outline-none focus:border-[hsl(var(--red))] resize-none"
                placeholder="What's working? What could be better?"
              />
              <div className="text-xs text-[hsl(var(--text-muted))] mt-1 text-right">{state.feedbackText.length}/{MAX_CHARS}</div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Would you recommend us?</label>
              <div className="flex gap-2">
                {[
                  { v: true, l: 'Yes' },
                  { v: false, l: 'No' },
                ].map((opt) => (
                  <button
                    key={opt.l}
                    type="button"
                    onClick={() => setState({ ...state, wouldRecommend: opt.v })}
                    className={cn(
                      'flex-1 h-11 rounded-sm border-2 text-sm font-semibold uppercase tracking-wider transition',
                      state.wouldRecommend === opt.v
                        ? 'border-[hsl(var(--red))] bg-[hsl(var(--red))] text-white'
                        : 'border-[hsl(var(--border-color))] text-[hsl(var(--text-body))] hover:border-[hsl(var(--text-muted))]',
                    )}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>

            <VGButton type="submit" loading={loading} className="w-full">Submit Feedback</VGButton>
          </form>
        )}
      </section>

      {/* Existing testimonials */}
      <section className="py-20 bg-[hsl(var(--bg-surface))] border-t border-[hsl(var(--border-color))]">
        <div className="container-vg">
          <div className="overline mb-3">From Members</div>
          <h2 className="section-heading mb-12">WHAT THEY SAY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="card-vg p-6 border-b-2 border-b-[hsl(var(--red))]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-[hsl(var(--red)/0.15)] border border-[hsl(var(--red))] flex items-center justify-center text-sm font-semibold text-[hsl(var(--red))]">{t.avatarInitials}</div>
                  <div>
                    <div className="font-semibold text-sm">{t.memberName}</div>
                    <div className="text-xs text-[hsl(var(--text-muted))]">{t.membershipType} · {t.joinDuration}</div>
                  </div>
                </div>
                <StarRating value={t.rating} readOnly size={14} />
                <p className="mt-3 italic text-sm text-[hsl(var(--text-body))]">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
