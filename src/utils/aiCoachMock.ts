import type { AICoachFormData, AICoachResult, DayPlan, WorkoutDay } from '@/types';
import { calculateBMR, calculateMacros, calculateTDEE, calculateTarget, waterIntakeLitres } from './bmr';

const VEG_MEALS = {
  breakfast: ['Oats with banana, peanut butter & milk', 'Paneer bhurji with 2 multigrain rotis', 'Vegetable poha + boiled eggs (or tofu)', 'Greek yogurt parfait with berries & granola'],
  midMorningSnack: ['Apple + 20 almonds', 'Roasted chickpeas (50g)', 'Protein shake + banana', 'Hummus with carrot sticks'],
  lunch: ['Brown rice + dal + paneer sabzi + salad', 'Quinoa pulao + curd + green veg', 'Roti + rajma + cucumber salad', 'Mixed veg khichdi + raita'],
  eveningSnack: ['Sprouts chaat', 'Boiled corn + ghee', 'Protein bar + green tea', 'Cottage cheese cubes + fruit'],
  dinner: ['Grilled paneer + sautéed veg + 1 roti', 'Tofu stir-fry with brown rice', 'Vegetable soup + 2 multigrain toasts + paneer', 'Dal tadka + jeera rice + salad'],
};
const NV_MEALS = {
  breakfast: ['4 egg-white omelette + 2 toast + fruit', 'Chicken keema with 2 rotis', 'Oats + whey + banana', 'Greek yogurt + berries + granola'],
  midMorningSnack: ['Apple + 20 almonds', 'Boiled eggs (2)', 'Protein shake + banana', 'Tuna on crackers'],
  lunch: ['Grilled chicken + brown rice + salad', 'Fish curry + rice + sautéed greens', 'Chicken biryani (lean) + raita', 'Egg curry + 2 rotis + salad'],
  eveningSnack: ['Boiled eggs + green tea', 'Protein bar + fruit', 'Chicken sandwich (whole wheat)', 'Cottage cheese cubes'],
  dinner: ['Grilled fish + sautéed veg + 1 roti', 'Chicken stir-fry + brown rice', 'Egg bhurji + 2 multigrain toasts', 'Tandoori chicken + salad + 1 roti'],
};

const pick = <T>(arr: T[], i: number): T => arr[i % arr.length];

const buildDietPlan = (form: AICoachFormData): DayPlan[] => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const m = form.dietaryPreference === 'non_veg' ? NV_MEALS : VEG_MEALS;
  return days.map((day, i) => ({
    day,
    breakfast: pick(m.breakfast, i),
    midMorningSnack: pick(m.midMorningSnack, i),
    lunch: pick(m.lunch, i),
    eveningSnack: pick(m.eveningSnack, i),
    dinner: pick(m.dinner, i),
  }));
};

const buildWorkoutPlan = (): WorkoutDay[] => [
  {
    day: 'Monday', focus: 'Push (Chest / Shoulders / Triceps)',
    exercises: [
      { name: 'Barbell Bench Press', sets: 4, reps: '6–8', rest: '90s', notes: 'Progressive load' },
      { name: 'Overhead Press', sets: 3, reps: '8–10', rest: '75s', notes: 'Strict form' },
      { name: 'Incline DB Press', sets: 3, reps: '10–12', rest: '60s', notes: 'Squeeze top' },
      { name: 'Lateral Raises', sets: 3, reps: '12–15', rest: '45s', notes: 'Light + controlled' },
      { name: 'Tricep Rope Pushdown', sets: 3, reps: '12', rest: '45s', notes: 'Full extension' },
    ],
  },
  {
    day: 'Tuesday', focus: 'Pull (Back / Biceps)',
    exercises: [
      { name: 'Deadlift', sets: 4, reps: '5', rest: '120s', notes: 'Reset every rep' },
      { name: 'Pull-ups (assisted ok)', sets: 4, reps: 'AMRAP', rest: '90s', notes: 'Full ROM' },
      { name: 'Barbell Row', sets: 3, reps: '8', rest: '75s', notes: 'Flat back' },
      { name: 'Face Pulls', sets: 3, reps: '15', rest: '45s', notes: 'Rear-delt focus' },
      { name: 'Barbell Curl', sets: 3, reps: '10', rest: '60s', notes: 'No swing' },
    ],
  },
  {
    day: 'Wednesday', focus: 'Legs (Quad-dominant)',
    exercises: [
      { name: 'Back Squat', sets: 4, reps: '6–8', rest: '120s', notes: 'Below parallel' },
      { name: 'Bulgarian Split Squat', sets: 3, reps: '10/leg', rest: '75s', notes: 'Tall posture' },
      { name: 'Leg Press', sets: 3, reps: '12', rest: '75s', notes: 'Slow eccentric' },
      { name: 'Walking Lunges', sets: 3, reps: '20 steps', rest: '60s', notes: 'DBs at sides' },
      { name: 'Standing Calf Raise', sets: 4, reps: '15', rest: '45s', notes: 'Pause at top' },
    ],
  },
  {
    day: 'Thursday', focus: 'Conditioning + Core',
    exercises: [
      { name: 'Rower Intervals', sets: 6, reps: '250m', rest: '60s', notes: 'Hard pace' },
      { name: 'Kettlebell Swings', sets: 4, reps: '20', rest: '60s', notes: 'Hip drive' },
      { name: 'Hanging Leg Raise', sets: 3, reps: '12', rest: '45s', notes: 'No swing' },
      { name: 'Plank', sets: 3, reps: '60s', rest: '30s', notes: 'Glutes squeezed' },
    ],
  },
  {
    day: 'Friday', focus: 'Upper Body Hypertrophy',
    exercises: [
      { name: 'Incline Bench Press', sets: 4, reps: '8', rest: '90s', notes: '' },
      { name: 'Lat Pulldown', sets: 4, reps: '10', rest: '75s', notes: 'Wide grip' },
      { name: 'Cable Row', sets: 3, reps: '12', rest: '60s', notes: '' },
      { name: 'DB Shoulder Press', sets: 3, reps: '10', rest: '60s', notes: '' },
      { name: 'Hammer Curl + Skullcrusher SS', sets: 3, reps: '12 each', rest: '60s', notes: 'Superset' },
    ],
  },
];

export async function generateAIPlan(form: AICoachFormData): Promise<AICoachResult> {
  // Simulated latency for realism
  await new Promise((r) => setTimeout(r, 1200));
  const bmr = calculateBMR(form.weightKg, form.heightCm, form.age, form.gender);
  const tdee = calculateTDEE(bmr, form.activityLevel);
  const targetCalories = calculateTarget(tdee, form.goal);
  const { protein, carbs, fat } = calculateMacros(targetCalories, form.goal, form.weightKg);
  return {
    bmr, tdee, targetCalories, protein, carbs, fat,
    waterIntakeLitres: waterIntakeLitres(form.weightKg),
    dietPlan: buildDietPlan(form),
    workoutPlan: buildWorkoutPlan(),
  };
}
