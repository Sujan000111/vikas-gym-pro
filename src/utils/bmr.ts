import type { ActivityLevel, GoalType, Gender } from '@/types';

export function calculateBMR(
  weight: number,
  height: number,
  age: number,
  gender: Gender,
): number {
  // Mifflin-St Jeor
  const base = 10 * weight + 6.25 * height - 5 * age;
  if (gender === 'male') return Math.round(base + 5);
  if (gender === 'female') return Math.round(base - 161);
  return Math.round(base - 78);
}

const ACTIVITY_MULT: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
};

export function calculateTDEE(bmr: number, activity: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULT[activity]);
}

export function calculateTarget(tdee: number, goal: GoalType): number {
  switch (goal) {
    case 'weight_loss': return Math.round(tdee - 400);
    case 'muscle_gain': return Math.round(tdee + 300);
    case 'athletic': return Math.round(tdee + 150);
    default: return tdee;
  }
}

export function calculateMacros(
  target: number,
  goal: GoalType,
  weight: number,
): { protein: number; carbs: number; fat: number } {
  const proteinPerKg = goal === 'muscle_gain' || goal === 'athletic' ? 2.0 : 1.8;
  const protein = Math.round(weight * proteinPerKg);
  const fat = Math.round((target * 0.25) / 9);
  const carbs = Math.max(0, Math.round((target - protein * 4 - fat * 9) / 4));
  return { protein, carbs, fat };
}

export function waterIntakeLitres(weight: number): number {
  return Math.round((weight * 0.035) * 10) / 10;
}
