import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { VGButton } from '@/components/ui/VGButton';
import { StarRating } from '@/components/ui/StarRating';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { MembershipTier } from '@/types';
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

interface FeedbackRow {
  id: string;
  name: string;
  membership_type: MembershipTier;
  rating: 1 | 2 | 3 | 4 | 5;
  feedback_text: string;
  member_duration: string;
  created_at: string;
}

export default function Feedback() {
  const [state, setState] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [memberFeedback, setMemberFeedback] = useState<FeedbackRow[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(true);
  const [feedbackStats, setFeedbackStats] = useState<{ avg: string; total: number; recommend: number }>({
    avg: '0.0',
    total: 0,
    recommend: 0,
  });
  const { addToast } = useToast();
  const { userId, userEmail } = useAuth();

  useEffect(() => {
    const loadFeedback = async (): Promise<void> => {
      setLoadingFeedback(true);
      const { data, error } = await supabase
        .from('feedback')
        .select('id,name,membership_type,rating,feedback_text,member_duration,created_at,would_recommend')
        .order('created_at', { ascending: false })
        .limit(24);

      if (!error) {
        const rows = (data ?? []) as (FeedbackRow & { would_recommend?: boolean })[];
        setMemberFeedback(rows);
        const total = rows.length;
        const avg = total ? (rows.reduce((sum, r) => sum + Number(r.rating), 0) / total).toFixed(1) : '0.0';
        const recommend = total
          ? Math.round((rows.filter((r) => Boolean(r.would_recommend)).length / total) * 100)
          : 0;
        setFeedbackStats({ avg, total, recommend });
      }
      setLoadingFeedback(false);
    };

    void loadFeedback();
  }, []);

  useEffect(() => {
    const hydrateDefaults = async (): Promise<void> => {
      if (!userId && !userEmail) return;

      const q = supabase
        .from('app_users')
        .select('full_name,email')
        .limit(1)
        .maybeSingle();

      const { data, error } = userId
        ? await q.eq('id', userId)
        : await q.eq('email', userEmail ?? '');

      if (error || !data) return;

      setState((prev) => ({
        ...prev,
        name: prev.name.trim() ? prev.name : String(data.full_name ?? ''),
        email: prev.email.trim() ? prev.email : String(data.email ?? userEmail ?? ''),
      }));
    };

    void hydrateDefaults();
  }, [userId, userEmail]);

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
    const optimisticId = `temp-${Date.now()}`;
    const optimisticRow: FeedbackRow = {
      id: optimisticId,
      name: state.name,
      membership_type: state.membershipType,
      rating: state.rating,
      feedback_text: state.feedbackText,
      member_duration: state.memberDuration,
      created_at: new Date().toISOString(),
    };

    // Show immediately in UI before DB roundtrip.
    setMemberFeedback((prev) => [optimisticRow, ...prev].slice(0, 24));
    setLoading(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          name: state.name,
          email: state.email,
          membership_type: state.membershipType,
          member_duration: state.memberDuration,
          rating: state.rating,
          feedback_text: state.feedbackText,
          would_recommend: state.wouldRecommend,
        });
      if (error) throw error;

      setFeedbackStats((prev) => {
        const nextTotal = prev.total + 1;
        const currentAvg = Number(prev.avg);
        const nextAvg = ((currentAvg * prev.total + state.rating) / nextTotal).toFixed(1);
        const currentRecommendCount = Math.round((prev.recommend / 100) * prev.total);
        const nextRecommendCount = currentRecommendCount + (state.wouldRecommend ? 1 : 0);
        const nextRecommend = Math.round((nextRecommendCount / nextTotal) * 100);
        return { avg: nextAvg, total: nextTotal, recommend: nextRecommend };
      });

      setSubmitted(true);
      addToast('Thanks for the feedback!', 'success');
      setTimeout(() => document.getElementById('member-feedback')?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch (err) {
      // Roll back optimistic row when DB insert fails.
      setMemberFeedback((prev) => prev.filter((f) => f.id !== optimisticId));
      const message = err instanceof Error ? err.message : 'Could not submit feedback.';
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
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
            { v: `${feedbackStats.avg}/5`, l: 'Average Rating' },
            { v: `${feedbackStats.total}+`, l: 'Reviews Collected' },
            { v: `${feedbackStats.recommend}%`, l: 'Would Recommend' },
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
      <section id="member-feedback" className="py-20 bg-[hsl(var(--bg-surface))] border-t border-[hsl(var(--border-color))]">
        <div className="container-vg">
          <div className="overline mb-3">From Members</div>
          <h2 className="section-heading mb-12">WHAT THEY SAY</h2>
          {loadingFeedback ? (
            <div className="text-sm text-[hsl(var(--text-muted))]">Loading feedback...</div>
          ) : memberFeedback.length === 0 ? (
            <div className="text-sm text-[hsl(var(--text-muted))]">No member feedback yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {memberFeedback.map((t) => (
                <div key={t.id} className="card-vg p-6 border-b-2 border-b-[hsl(var(--red))]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-[hsl(var(--red)/0.15)] border border-[hsl(var(--red))] flex items-center justify-center text-sm font-semibold text-[hsl(var(--red))]">
                      {t.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-[hsl(var(--text-muted))]">{t.membership_type} · {t.member_duration}</div>
                    </div>
                  </div>
                  <StarRating value={t.rating} readOnly size={14} />
                  <p className="mt-3 italic text-sm text-[hsl(var(--text-body))]">"{t.feedback_text}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
