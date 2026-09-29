export type AvailableTime = 15 | 30 | 45 | 60 | 90;

export type NotificationLevel = 'low' | 'medium' | 'high';
export type NoiseLevel = 'quiet' | 'moderate' | 'loud';
export type EnergyLevel = 'low' | 'medium' | 'high';
export type FocusLevel = 'focused' | 'somewhat' | 'distracted';
export type EnvironmentQuality = 'comfortable' | 'some_distractions' | 'very_distracting';

export interface UserStudyInputs {
  subject: string;
  availableTime: AvailableTime;
  phoneNotifications: NotificationLevel;
  noiseLevel: NoiseLevel;
  energyLevel: EnergyLevel;
  currentFocus: FocusLevel;
  studyEnvironment: EnvironmentQuality;
}

export interface RecommendationItem {
  id: string;
  category: 'technology' | 'environment' | 'student';
  title: string;
  action: string;
}

export interface StudyPlan {
  subject: string;
  totalAvailableMinutes: number;
  focusMinutes: number;
  breakMinutes: number;
  sessionCount: number;
  effectiveStudyMinutes: number;
  totalBreakMinutes: number;
  recommendations: RecommendationItem[];
  explanation: string;
  mypAnalysis: {
    studentFactor: string;
    techFactor: string;
    envFactor: string;
    interactionSummary: string;
  };
}

export type TimerPhase = 'focus' | 'break';

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  phase: TimerPhase;
  currentSession: number;
  totalSessions: number;
  remainingSeconds: number;
  totalPhaseSeconds: number;
}
