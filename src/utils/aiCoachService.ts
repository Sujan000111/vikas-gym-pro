import type { AICoachFormData, AICoachResult } from '@/types';
import { generateAIPlan as generateMockPlan } from './aiCoachMock';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'qwen/qwen3.5-plus-20260420';

const extractJson = (raw: string): string => {
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('LLM response does not contain valid JSON.');
  }
  return raw.slice(start, end + 1);
};

const sanitizeResult = (result: AICoachResult): AICoachResult => {
  return {
    ...result,
    targetCalories: Math.max(1200, Math.min(4500, Number(result.targetCalories) || 2000)),
    bmr: Math.max(800, Math.min(4000, Number(result.bmr) || 1500)),
    tdee: Math.max(1000, Math.min(5500, Number(result.tdee) || 2200)),
    protein: Math.max(40, Math.min(320, Number(result.protein) || 120)),
    carbs: Math.max(50, Math.min(600, Number(result.carbs) || 220)),
    fat: Math.max(20, Math.min(180, Number(result.fat) || 70)),
    waterIntakeLitres: Math.max(1.5, Math.min(8, Number(result.waterIntakeLitres) || 3)),
  };
};

async function generateLLMPlan(form: AICoachFormData): Promise<AICoachResult> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OpenRouter key.');
  }

  const prompt = `
You are an expert fitness coach and nutrition planner.
Generate a weekly plan in strict JSON only, matching this exact TypeScript shape:
{
  "bmr": number,
  "tdee": number,
  "targetCalories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "waterIntakeLitres": number,
  "dietPlan": [
    { "day": string, "breakfast": string, "midMorningSnack": string, "lunch": string, "eveningSnack": string, "dinner": string }
  ],
  "workoutPlan": [
    {
      "day": string,
      "focus": string,
      "exercises": [{ "name": string, "sets": number, "reps": string, "rest": string, "notes": string }]
    }
  ]
}

Rules:
- Provide 7 days dietPlan.
- Provide exactly ${form.trainingDays} workout days.
- Adapt exercises for equipment: ${form.equipment}.
- Keep it safe and realistic.
- No markdown, no explanations, only JSON object.

User profile:
${JSON.stringify(form)}
`.trim();

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: 'You are a strict JSON API. Return JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    throw new Error(`LLM request failed (${res.status}).`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('LLM response was empty.');
  }

  const parsed = JSON.parse(extractJson(content)) as AICoachResult;
  return sanitizeResult(parsed);
}

export async function generateAIPlan(form: AICoachFormData): Promise<AICoachResult> {
  try {
    return await generateLLMPlan(form);
  } catch {
    return generateMockPlan(form);
  }
}
