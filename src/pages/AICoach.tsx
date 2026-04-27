import { useState, type FormEvent } from 'react';
import { Download, Printer, Sparkles } from 'lucide-react';
import { PageBanner } from '@/components/ui/PageBanner';
import { VGButton } from '@/components/ui/VGButton';
import { MetricCard } from '@/components/ui/MetricCard';
import { useToast } from '@/context/ToastContext';
import type { ActivityLevel, AICoachFormData, AICoachResult, DietaryPreference, Gender, GoalType } from '@/types';
import { generateAIPlan } from '@/utils/aiCoachMock';
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
  goal: 'muscle_gain', activityLevel: 'moderate', dietaryPreference: 'non_veg', limitations: '',
};

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
  const [loading, setLoading] = useState<boolean>(false);
  const [tab, setTab] = useState<'diet' | 'workout'>('diet');
  const { addToast } = useToast();

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!form.name.trim()) { addToast('Please enter your name.', 'error'); return; }
    if (form.age < 12 || form.age > 90) { addToast('Age must be between 12 and 90.', 'error'); return; }
    if (form.heightCm < 120 || form.weightKg < 30) { addToast('Please enter realistic height & weight.', 'error'); return; }
    setLoading(true);
    try {
      const r = await generateAIPlan(form);
      setResult(r);
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
