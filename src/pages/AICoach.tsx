import { useEffect, useState, type FormEvent } from 'react';
import { Download, Printer, Sparkles } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { VGButton } from '@/components/ui/VGButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { ActivityLevel, AICoachFormData, AICoachResult, DietaryPreference, Gender, GoalType, SavedAIPlan } from '@/types';
import { generateAIPlan } from '@/utils/aiCoachService';
import { cn } from '@/lib/utils';

const GOALS: { v: GoalType; l: string; sub: string }[] = [
  { v: 'weight_loss', l: 'Weight Loss', sub: 'Lean down' },
  { v: 'muscle_gain', l: 'Muscle Gain', sub: 'Build size' },
  { v: 'maintenance', l: 'Maintenance', sub: 'Stay strong' },
  { v: 'athletic', l: 'Athletic', sub: 'Perform' },
];
const ACTS: { v: ActivityLevel; l: string; sub: string }[] = [
  { v: 'sedentary', l: 'Sedentary', sub: 'Desk job' },
  { v: 'light', l: 'Light', sub: '1-3 days/wk' },
  { v: 'moderate', l: 'Moderate', sub: '3-5 days/wk' },
  { v: 'very', l: 'Very Active', sub: '6-7 days/wk' },
];
const DIETS: { v: DietaryPreference; l: string }[] = [
  { v: 'veg', l: 'Vegetarian' }, { v: 'non_veg', l: 'Non-Veg' }, { v: 'vegan', l: 'Vegan' },
];

const initial: AICoachFormData = {
  name: '', age: 25, gender: 'male', heightCm: 175, weightKg: 75,
  goal: 'muscle_gain', activityLevel: 'moderate', dietaryPreference: 'non_veg', trainingDays: 5, equipment: 'full_gym', sleepHours: 7, limitations: '',
};

interface AIPlanRow {
  id: string;
  created_at: string;
  input_json: AICoachFormData;
  output_json: AICoachResult;
}

function downloadPlan(form: AICoachFormData, r: AICoachResult): void {
  const lines: string[] = [];
  lines.push(`VIKASGYM — AI COACH PLAN FOR ${form.name.toUpperCase()}`);
  lines.push('='.repeat(60));
  lines.push(`BMR: ${r.bmr} kcal | TDEE: ${r.tdee} kcal | Target: ${r.targetCalories} kcal`);
  lines.push(`Protein: ${r.protein}g | Carbs: ${r.carbs}g | Fat: ${r.fat}g | Water: ${r.waterIntakeLitres}L`);
  lines.push('');
  lines.push('-- DIET PLAN --');
  r.dietPlan.forEach((d) => {
    lines.push(`\n${d.day}`);
    lines.push(`  Breakfast:  ${d.breakfast}`);
    lines.push(`  Mid-AM:     ${d.midMorningSnack}`);
    lines.push(`  Lunch:      ${d.lunch}`);
    lines.push(`  Snack:      ${d.eveningSnack}`);
    lines.push(`  Dinner:     ${d.dinner}`);
  });
  lines.push('\n-- WORKOUT PLAN --');
  r.workoutPlan.forEach((w) => {
    lines.push(`\n${w.day} — ${w.focus}`);
    w.exercises.forEach((e) => lines.push(`  ${e.name}: ${e.sets} x ${e.reps} (rest ${e.rest}) — ${e.notes}`));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vikasgym-plan-${form.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AICoach() {
  const [form, setForm] = useState<AICoachFormData>(initial);
  const [result, setResult] = useState<AICoachResult | null>(null);
  const [savedPlans, setSavedPlans] = useState<SavedAIPlan[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<'diet' | 'workout'>('diet');
  const { addToast } = useToast();
  const { userId, userEmail } = useAuth();

  useEffect(() => {
    const hydrateProfileDefaults = async (): Promise<void> => {
      if (!userId && !userEmail) return;

      const q = supabase
        .from('app_users')
        .select('full_name,dob')
        .limit(1)
        .maybeSingle();

      const { data, error } = userId
        ? await q.eq('id', userId)
        : await q.eq('email', userEmail ?? '');

      if (error || !data) return;

      const dob = data.dob ? new Date(data.dob as string) : null;
      const now = new Date();
      const derivedAge = dob
        ? Math.max(
            12,
            Math.min(
              90,
              now.getFullYear() -
                dob.getFullYear() -
                (now.getMonth() < dob.getMonth() || (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate()) ? 1 : 0),
            ),
          )
        : null;

      setForm((prev) => ({
        ...prev,
        name: prev.name.trim() ? prev.name : String(data.full_name ?? ''),
        age: derivedAge ?? prev.age,
      }));
    };

    void hydrateProfileDefaults();
  }, [userId, userEmail]);

  useEffect(() => {
    const loadSavedPlans = async (): Promise<void> => {
      setLoadingHistory(true);
      const q = supabase
        .from('ai_plans')
        .select('id,created_at,input_json,output_json')
        .order('created_at', { ascending: false })
        .limit(8);
      const { data, error } = userId
        ? await q.eq('user_id', userId)
        : await q.eq('email', userEmail ?? '');

      if (error) {
        setLoadingHistory(false);
        return;
      }
      const mapped = ((data ?? []) as AIPlanRow[]).map((p) => ({
        id: p.id,
        createdAt: p.created_at,
        form: p.input_json,
        result: p.output_json,
      }));
      setSavedPlans(mapped);
      setLoadingHistory(false);
    };

    if (userId || userEmail) {
      void loadSavedPlans();
    } else {
      setSavedPlans([]);
      setLoadingHistory(false);
    }
  }, [userId, userEmail]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!form.name.trim()) { addToast('Please enter your name.', 'error'); return; }
    if (form.age < 12 || form.age > 90) { addToast('Age must be between 12 and 90.', 'error'); return; }
    if (form.heightCm < 120 || form.weightKg < 30) { addToast('Please enter realistic height & weight.', 'error'); return; }
    if (form.trainingDays < 3 || form.trainingDays > 7) { addToast('Training days must be between 3 and 7.', 'error'); return; }
    if (form.sleepHours < 3 || form.sleepHours > 12) { addToast('Sleep hours must be between 3 and 12.', 'error'); return; }
    setLoading(true);
    try {
      const r = await generateAIPlan(form);
      setResult(r);
      const { data: inserted, error } = await supabase
        .from('ai_plans')
        .insert({
          user_id: userId,
          email: userEmail ?? null,
          input_json: form,
          output_json: r,
        })
        .select('id,created_at,input_json,output_json')
        .single();
      if (!error && inserted) {
        const mapped: SavedAIPlan = {
          id: (inserted as AIPlanRow).id,
          createdAt: (inserted as AIPlanRow).created_at,
          form: (inserted as AIPlanRow).input_json,
          result: (inserted as AIPlanRow).output_json,
        };
        setSavedPlans((prev) => [mapped, ...prev].slice(0, 8));
      }
      addToast('Plan generated. Scroll down.', 'success');
      setTimeout(() => document.getElementById('ai-results')?.scrollIntoView({ behavior: 'smooth' }), 200);
    } catch {
      addToast('Plan generation failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-11 text-sm focus:outline-none focus:border-[hsl(var(--red))]';

  return (
    <>
      <PageBanner title="AI COACH" subtitle="Personalized diet & training plan in seconds." breadcrumb={['Home', 'AI Coach']} />

      <section className="py-16 container-vg max-w-4xl">
        <form onSubmit={handleSubmit} className="card-vg p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[hsl(var(--red))]" />
            <h3 className="font-display text-3xl">TELL US ABOUT YOU</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Age</label>
              <input type="number" min={12} max={90} value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Training Days / Week</label>
              <input type="number" min={3} max={7} value={form.trainingDays} onChange={(e) => setForm({ ...form, trainingDays: Number(e.target.value) })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Equipment</label>
              <select value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value as AICoachFormData['equipment'] })} className={inputCls}>
                <option value="full_gym">Full Gym</option>
                <option value="dumbbells">Dumbbells</option>
                <option value="bodyweight">Bodyweight</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Sleep Hours</label>
              <input type="number" min={3} max={12} value={form.sleepHours} onChange={(e) => setForm({ ...form, sleepHours: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as Gender[]).map((g) => (
                <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                  className={cn('h-11 rounded-sm border-2 text-sm uppercase tracking-wider font-semibold transition',
                    form.gender === g ? 'border-[hsl(var(--red))] bg-[hsl(var(--red))] text-white' : 'border-[hsl(var(--border-color))] text-[hsl(var(--text-body))]')}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Height (cm)</label>
              <input type="number" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: Number(e.target.value) })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Weight (kg)</label>
              <input type="number" value={form.weightKg} onChange={(e) => setForm({ ...form, weightKg: Number(e.target.value) })} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Fitness Goal</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {GOALS.map((g) => (
                <button key={g.v} type="button" onClick={() => setForm({ ...form, goal: g.v })}
                  className={cn('p-3 rounded-sm border-2 text-left transition',
                    form.goal === g.v ? 'border-[hsl(var(--red))] bg-[hsl(var(--red)/0.05)]' : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--text-muted))]')}>
                  <div className="font-semibold text-sm">{g.l}</div>
                  <div className="text-xs text-[hsl(var(--text-muted))]">{g.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Activity Level</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {ACTS.map((a) => (
                <button key={a.v} type="button" onClick={() => setForm({ ...form, activityLevel: a.v })}
                  className={cn('p-3 rounded-sm border-2 text-left transition',
                    form.activityLevel === a.v ? 'border-[hsl(var(--red))] bg-[hsl(var(--red)/0.05)]' : 'border-[hsl(var(--border-color))] hover:border-[hsl(var(--text-muted))]')}>
                  <div className="font-semibold text-sm">{a.l}</div>
                  <div className="text-xs text-[hsl(var(--text-muted))]">{a.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Dietary Preference</label>
            <div className="grid grid-cols-3 gap-2">
              {DIETS.map((d) => (
                <button key={d.v} type="button" onClick={() => setForm({ ...form, dietaryPreference: d.v })}
                  className={cn('h-11 rounded-sm border-2 text-sm uppercase tracking-wider font-semibold transition',
                    form.dietaryPreference === d.v ? 'border-[hsl(var(--red))] bg-[hsl(var(--red))] text-white' : 'border-[hsl(var(--border-color))] text-[hsl(var(--text-body))]')}>
                  {d.l}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-2">Limitations / Injuries (optional)</label>
            <textarea value={form.limitations} onChange={(e) => setForm({ ...form, limitations: e.target.value })} rows={2}
              className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm p-3 text-sm focus:outline-none focus:border-[hsl(var(--red))] resize-none" />
          </div>

          <VGButton type="submit" size="lg" loading={loading} className="w-full">
            {loading ? 'Generating Your Plan…' : 'Generate My Plan'}
          </VGButton>
        </form>
      </section>

      <section className="py-4 container-vg max-w-4xl">
        <div className="card-vg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-3xl">PREVIOUS PLANS</h3>
            <div className="text-xs text-[hsl(var(--text-muted))]">Last 8 plans</div>
          </div>
          {loadingHistory ? (
            <div className="text-sm text-[hsl(var(--text-muted))]">Loading previous plans...</div>
          ) : savedPlans.length === 0 ? (
            <div className="text-sm text-[hsl(var(--text-muted))]">No saved plans yet.</div>
          ) : (
            <div className="space-y-2">
              {savedPlans.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { setForm(p.form); setResult(p.result); setTab('diet'); setTimeout(() => document.getElementById('ai-results')?.scrollIntoView({ behavior: 'smooth' }), 200); }}
                  className="w-full text-left p-3 rounded-sm border border-[hsl(var(--border-color))] hover:border-[hsl(var(--red))] transition"
                >
                  <div className="text-sm font-semibold">{p.form.goal.replace('_', ' ')} • {p.form.trainingDays} days • {p.form.equipment}</div>
                  <div className="text-xs text-[hsl(var(--text-muted))]">{new Date(p.createdAt).toLocaleString()} • Target {p.result.targetCalories} kcal</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {result && (
        <section id="ai-results" className="py-16 bg-[hsl(var(--bg-surface))] border-y border-[hsl(var(--border-color))]">
          <div className="container-vg">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="overline mb-2">Your Plan</div>
                <h2 className="font-display text-5xl">{form.name.toUpperCase()}, HERE'S YOUR <span className="text-[hsl(var(--red))]">BLUEPRINT</span></h2>
              </div>
              <div className="flex gap-2 no-print">
                <VGButton variant="outline" size="sm" onClick={() => downloadPlan(form, result)}>
                  <Download className="w-4 h-4" /> Download
                </VGButton>
                <VGButton variant="outline" size="sm" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" /> Print
                </VGButton>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
              <MetricCard label="BMR" value={result.bmr} />
              <MetricCard label="TDEE" value={result.tdee} />
              <MetricCard label="Target" value={`${result.targetCalories} kcal`} />
              <MetricCard label="Protein" value={`${result.protein}g`} />
              <MetricCard label="Carbs" value={`${result.carbs}g`} />
              <MetricCard label="Fat" value={`${result.fat}g`} />
              <MetricCard label="Water" value={`${result.waterIntakeLitres}L`} />
            </div>

            <div className="flex gap-2 mb-6 border-b border-[hsl(var(--border-color))]">
              {(['diet', 'workout'] as const).map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={cn('px-5 py-3 text-sm uppercase tracking-wider font-semibold transition',
                    tab === t ? 'text-[hsl(var(--red))] border-b-2 border-[hsl(var(--red))]' : 'text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-body))]')}>
                  {t === 'diet' ? 'Diet Plan' : 'Workout Plan'}
                </button>
              ))}
            </div>

            {tab === 'diet' ? (
              <div className="overflow-x-auto no-scrollbar">
                <div className="flex gap-4" style={{ width: 'max-content' }}>
                  {result.dietPlan.map((d) => (
                    <div key={d.day} className="card-vg p-5 w-[280px] shrink-0">
                      <div className="font-display text-2xl text-[hsl(var(--red))] mb-3">{d.day}</div>
                      {[
                        ['Breakfast', d.breakfast],
                        ['Mid-AM', d.midMorningSnack],
                        ['Lunch', d.lunch],
                        ['Snack', d.eveningSnack],
                        ['Dinner', d.dinner],
                      ].map(([label, val]) => (
                        <div key={label} className="mb-3">
                          <div className="text-xs uppercase tracking-widest text-[hsl(var(--text-muted))]">{label}</div>
                          <div className="text-sm text-[hsl(var(--text-body))]">{val}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {result.workoutPlan.map((w) => (
                  <div key={w.day} className="card-vg p-5">
                    <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
                      <div className="font-display text-2xl text-[hsl(var(--red))]">{w.day}</div>
                      <div className="text-sm text-[hsl(var(--text-body))]">{w.focus}</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm min-w-[600px]">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] border-b border-[hsl(var(--border-color))]">
                            <th className="py-2">Exercise</th><th>Sets</th><th>Reps</th><th>Rest</th><th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {w.exercises.map((ex) => (
                            <tr key={ex.name} className="border-b border-[hsl(var(--border-color))]/50">
                              <td className="py-2 font-medium">{ex.name}</td>
                              <td>{ex.sets}</td>
                              <td>{ex.reps}</td>
                              <td>{ex.rest}</td>
                              <td className="text-[hsl(var(--text-muted))]">{ex.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
