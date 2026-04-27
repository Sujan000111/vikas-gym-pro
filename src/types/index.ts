export type MembershipTier = 'Basic' | 'Pro' | 'Elite';
export type MemberStatus = 'Active' | 'Expiring' | 'Inactive';
export type Suitability = 'Beginner' | 'Intermediate' | 'Advanced';
export type GoalType = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'athletic';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very';
export type DietaryPreference = 'veg' | 'non_veg' | 'vegan';
export type Gender = 'male' | 'female' | 'other';
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type DashboardSection = 'overview' | 'members' | 'reports' | 'payments' | 'settings';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  membershipTier: MembershipTier;
  joinDate: string;
  expiryDate: string;
  status: MemberStatus;
  assignedTrainer: string;
  notes: string;
  avatarInitials: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  yearsExperience: number;
  bio: string;
  initials: string;
}

export interface Service {
  id: string;
  title: string;
  icon: string;
  description: string;
  included: string[];
  duration: string;
  suitableFor: Suitability[];
  price: string;
}

export interface Testimonial {
  id: string;
  memberName: string;
  membershipType: MembershipTier;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  joinDuration: string;
  avatarInitials: string;
}

export interface FeedbackEntry {
  id: string;
  name: string;
  email: string;
  membershipType: MembershipTier;
  memberDuration: string;
  rating: 1 | 2 | 3 | 4 | 5;
  feedbackText: string;
  wouldRecommend: boolean;
  createdAt: string;
}

export interface AICoachFormData {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  goal: GoalType;
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  limitations: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface DayPlan {
  day: string;
  breakfast: string;
  midMorningSnack: string;
  lunch: string;
  eveningSnack: string;
  dinner: string;
}

export interface AICoachResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterIntakeLitres: number;
  dietPlan: DayPlan[];
  workoutPlan: WorkoutDay[];
}

export interface MembershipPlan {
  tier: MembershipTier;
  price: string;
  features: string[];
  unavailableFeatures: string[];
  isPopular: boolean;
}

export interface KPICard {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  colorAccent: string;
}

export interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userEmail: string | null;
}

export interface ToastState {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}
