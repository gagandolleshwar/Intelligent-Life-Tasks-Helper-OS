export enum PriorityLevel {
  MUST = 'MUST',     // Red
  SHOULD = 'SHOULD', // Orange
  COULD = 'COULD',   // Green
  WOULD = 'WOULD'    // Yellow
}

export enum DomainId {
  WORK = 'WORK',
  HEALTH = 'HEALTH',
  SKILLS = 'SKILLS',
  JOY = 'JOY'
}

export interface Task {
  id: string;
  text: string;
  priority: PriorityLevel;
  completed: boolean;
}

export interface HealthData {
  waterIntake: number; // glasses
  sleepHours: number;
  mood: string;
  lastPeriodDate: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface SkillData {
  currentSkill: string;
  progress: number; // 0-100
  lastUpdate: string;
}

export interface AppState {
  userName: string | null;
  activeDomain: DomainId;
  tasks: Record<DomainId, Task[]>;
  health: HealthData;
  skill: SkillData;
}

export const INITIAL_HEALTH: HealthData = {
  waterIntake: 0,
  sleepHours: 7,
  mood: '',
  lastPeriodDate: '',
  meals: { breakfast: '', lunch: '', dinner: '' }
};

export const INITIAL_SKILL: SkillData = {
  currentSkill: '',
  progress: 0,
  lastUpdate: new Date().toISOString()
};