import {
  ScheduleTask,
  MatrixTask,
  DailyWinItem,
  EnergyLogEntry,
  FocusSessionLog,
  PomodoroState,
  AppSettings,
  ActivityRecord,
} from '../types';

import {
  getTodayDateString,
  shiftDateString,
  formatDateToKey,
  parseDateKey,
} from './date';

export { getTodayDateString, shiftDateString, formatDateToKey, parseDateKey };

const today = getTodayDateString();
const yesterday = getTodayDateString(-1);
const twoDaysAgo = getTodayDateString(-2);

export const INITIAL_SCHEDULE_TASKS: ScheduleTask[] = [];

export const SAMPLE_SCHEDULE_TASKS: ScheduleTask[] = [
  // Today's schedule
  {
    id: 'sched-1',
    date: today,
    time: '07:00',
    endTime: '08:00',
    title: 'Morning Routine & Hydration',
    category: 'Wellness',
    completed: true,
    completedAt: Date.now() - 3600000 * 5,
    notes: 'Stretching, glass of water, and mindful breathing',
  },
  {
    id: 'sched-2',
    date: today,
    time: '08:00',
    endTime: '09:00',
    title: 'Review Daily Goals & Priority Matrix',
    category: 'Quick Wins',
    completed: true,
    completedAt: Date.now() - 3600000 * 4,
    notes: 'Prioritize top 3 objectives and organize matrix',
  },
  {
    id: 'sched-3',
    date: today,
    time: '09:00',
    endTime: '10:00',
    title: 'Project Development: Core Architecture',
    category: 'Deep Work',
    completed: true,
    completedAt: Date.now() - 3600000 * 3,
    notes: 'Implement reactive state synchronization engine',
  },
  {
    id: 'sched-4',
    date: today,
    time: '10:00',
    endTime: '11:00',
    title: 'Project Development: API Integration',
    category: 'Deep Work',
    completed: false,
    notes: 'Refine endpoint error boundaries and payload validation',
  },
  {
    id: 'sched-5',
    date: today,
    time: '11:00',
    endTime: '12:00',
    title: 'Complete Assignments & Code Review',
    category: 'Deep Work',
    completed: false,
    notes: 'Review outstanding pull requests and merge sprint tickets',
  },
  {
    id: 'sched-6',
    date: today,
    time: '12:00',
    endTime: '13:00',
    title: 'Healthy Lunch Break & Digital Detox',
    category: 'Wellness',
    completed: false,
    notes: 'Nutritious meal away from computer screens',
  },
  {
    id: 'sched-7',
    date: today,
    time: '13:00',
    endTime: '14:00',
    title: 'Emails and Messages Clearing',
    category: 'Quick Wins',
    completed: false,
    notes: 'Triage inbox, answer customer questions, brief team',
  },
  {
    id: 'sched-8',
    date: today,
    time: '14:00',
    endTime: '15:00',
    title: 'Study Session & Technical Reading',
    category: 'Deep Work',
    completed: false,
    notes: 'Deep dive into concurrent rendering and data structures',
  },
  {
    id: 'sched-9',
    date: today,
    time: '15:00',
    endTime: '16:00',
    title: 'Short Nature Walk & Afternoon Reset',
    category: 'Wellness',
    completed: false,
    notes: 'Fresh air, daylight exposure, and light aerobic movement',
  },
  {
    id: 'sched-10',
    date: today,
    time: '16:00',
    endTime: '17:00',
    title: 'Review Progress & Plan Tomorrow',
    category: 'Quick Wins',
    completed: false,
    notes: 'Log daily accomplishments and set tomorrow morning cue',
  },
  // Yesterday's completed tasks for historical trends
  {
    id: 'sched-prev-1',
    date: yesterday,
    time: '09:00',
    endTime: '11:00',
    title: 'Sprint Planning & Architecture Spec',
    category: 'Deep Work',
    completed: true,
    completedAt: Date.now() - 3600000 * 24,
  },
  {
    id: 'sched-prev-2',
    date: yesterday,
    time: '11:00',
    endTime: '12:00',
    title: 'Database Schema Migration',
    category: 'Deep Work',
    completed: true,
    completedAt: Date.now() - 3600000 * 22,
  },
  {
    id: 'sched-prev-3',
    date: yesterday,
    time: '14:00',
    endTime: '15:30',
    title: 'Client Demo & Feedback Synthesis',
    category: 'Meeting',
    completed: true,
    completedAt: Date.now() - 3600000 * 19,
  },
  // Two days ago tasks
  {
    id: 'sched-prev-4',
    date: twoDaysAgo,
    time: '09:00',
    endTime: '12:00',
    title: 'Refactor State Management & Unit Tests',
    category: 'Deep Work',
    completed: true,
    completedAt: Date.now() - 3600000 * 48,
  },
];

export const INITIAL_MATRIX_TASKS: MatrixTask[] = [];

export const SAMPLE_MATRIX_TASKS: MatrixTask[] = [
  {
    id: 'mat-1',
    quadrant: 'do-first',
    title: 'Fix critical database deadlock in billing checkout',
    completed: false,
    notes: 'Affects 2% of renewal transactions',
    createdAt: Date.now() - 3600000 * 4,
  },
  {
    id: 'mat-2',
    quadrant: 'do-first',
    title: 'Submit finalized quarterly report to team lead',
    completed: true,
    completedAt: Date.now() - 3600000 * 2,
    notes: 'Summarizes completed sprints and OKR milestones',
    createdAt: Date.now() - 3600000 * 3,
  },
  {
    id: 'mat-3',
    quadrant: 'schedule',
    title: 'Architect component library refactor for v3',
    completed: false,
    notes: 'High leverage architectural improvement for long term speed',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'mat-4',
    quadrant: 'schedule',
    title: 'Read chapter 4 of Designing Data-Intensive Applications',
    completed: false,
    notes: 'Focus on consensus algorithms and distributed commit',
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    id: 'mat-5',
    quadrant: 'delegate',
    title: 'Coordinate team lunch order & venue RSVP',
    completed: false,
    notes: 'Pass details to workplace coordinator',
    createdAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'mat-6',
    quadrant: 'delegate',
    title: 'Forward hardware invoice receipts to finance',
    completed: true,
    completedAt: Date.now() - 3600000,
    notes: 'Scanned receipts attached in shared drive',
    createdAt: Date.now() - 3600000 * 1,
  },
  {
    id: 'mat-7',
    quadrant: 'eliminate',
    title: 'Unnecessary mid-day social feed refreshing',
    completed: false,
    notes: 'Block distracting sites during deep work intervals',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'mat-8',
    quadrant: 'eliminate',
    title: 'Re-organizing bookmarks folder for the 4th time',
    completed: true,
    completedAt: Date.now() - 3600000,
    notes: 'Replaced with global search shortcut',
    createdAt: Date.now() - 3600000,
  },
];

export const INITIAL_DAILY_WINS: DailyWinItem[] = [];

export const SAMPLE_DAILY_WINS: DailyWinItem[] = [
  // Today's goals
  { id: 'win-1', date: today, title: 'Hydrated with 2 liters of water throughout the day', completed: true, completedAt: Date.now() - 3600000 * 3, createdAt: Date.now() - 10000 },
  { id: 'win-2', date: today, title: 'Completed morning routine without checking notifications', completed: true, completedAt: Date.now() - 3600000 * 2, createdAt: Date.now() - 9000 },
  { id: 'win-3', date: today, title: 'Finished 2 high-intensity 50-minute deep work blocks', completed: true, completedAt: Date.now() - 3600000 * 1, createdAt: Date.now() - 8000 },
  { id: 'win-4', date: today, title: 'Prepared healthy whole-food lunch and ate mindfully', completed: false, createdAt: Date.now() - 7000 },
  { id: 'win-5', date: today, title: 'Took a brisk 20-minute walk to clear cognitive fog', completed: false, createdAt: Date.now() - 6000 },
  // Yesterday's goals for historical review
  { id: 'win-prev-1', date: yesterday, title: 'Morning meditation & mindful breathing', completed: true, completedAt: Date.now() - 3600000 * 25, createdAt: Date.now() - 3600000 * 26 },
  { id: 'win-prev-2', date: yesterday, title: 'Read 25 pages of software systems design', completed: true, completedAt: Date.now() - 3600000 * 22, createdAt: Date.now() - 3600000 * 26 },
  { id: 'win-prev-3', date: yesterday, title: 'No social media browsing during deep work intervals', completed: true, completedAt: Date.now() - 3600000 * 18, createdAt: Date.now() - 3600000 * 26 },
  { id: 'win-prev-4', date: yesterday, title: 'Evening inbox zero triage', completed: false, createdAt: Date.now() - 3600000 * 26 },
];

export const INITIAL_ENERGY_LOGS: EnergyLogEntry[] = [];

export const SAMPLE_ENERGY_LOGS: EnergyLogEntry[] = [
  {
    id: 'energy-1',
    level: 'High',
    timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
    note: 'Feeling energized after morning coffee and 90m deep work session',
  },
  {
    id: 'energy-2',
    level: 'Excellent',
    timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
    note: 'Morning peak cognition, zero mental fog',
  },
  {
    id: 'energy-3',
    level: 'Moderate',
    timestamp: Date.now() - 3600000 * 24, // yesterday
    note: 'Steady energy throughout development session',
  },
];

export const INITIAL_FOCUS_LOGS: FocusSessionLog[] = [];

export const SAMPLE_FOCUS_LOGS: FocusSessionLog[] = [
  {
    id: 'flog-1',
    mode: 'focus',
    durationMinutes: 25,
    timestamp: Date.now() - 3600000 * 3,
    taskTitle: 'Project Development: Core Architecture',
  },
  {
    id: 'flog-2',
    mode: 'focus',
    durationMinutes: 25,
    timestamp: Date.now() - 3600000 * 2,
    taskTitle: 'API Integration & Error Boundaries',
  },
  {
    id: 'flog-3',
    mode: 'focus',
    durationMinutes: 25,
    timestamp: Date.now() - 3600000 * 1,
    taskTitle: 'Priority Matrix Triage',
  },
  {
    id: 'flog-prev-1',
    mode: 'focus',
    durationMinutes: 25,
    timestamp: Date.now() - 3600000 * 26,
    taskTitle: 'Database Optimization',
  },
  {
    id: 'flog-prev-2',
    mode: 'focus',
    durationMinutes: 25,
    timestamp: Date.now() - 3600000 * 25,
    taskTitle: 'Design Token Migration',
  },
];

export const INITIAL_POMODORO: PomodoroState = {
  mode: 'focus',
  durationSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  isRunning: false,
  targetEndTime: null,
  completedSessions: 0,
};

export const INITIAL_SETTINGS: AppSettings = {
  soundEnabled: true,
  isMuted: false,
  soundVolume: 0.8,
  notificationSound: 'Soft Chime',
  pomodoroSound: 'Gentle Bell',
  notificationsEnabled: true,
  defaultFocusDuration: 25,
  defaultBreakDuration: 5,
  defaultLongBreakDuration: 15,
  autoStartBreaks: false,
  profile: {
    name: 'DayGrid User',
    title: 'Daily Productivity Focus',
    workStartHour: '08:00',
    workEndHour: '17:00',
    avatarColor: '#4A7C59',
  },
};

export const INITIAL_ACTIVITY_RECORDS: ActivityRecord[] = [];

export const SAMPLE_ACTIVITY_RECORDS: ActivityRecord[] = [
  {
    id: 'act-1',
    sourceId: 'sched-1',
    type: 'schedule',
    title: 'Morning Routine & Hydration',
    date: today,
    timestamp: Date.now() - 3600000 * 5,
  },
  {
    id: 'act-2',
    sourceId: 'sched-2',
    type: 'schedule',
    title: 'Review Daily Goals & Priority Matrix',
    date: today,
    timestamp: Date.now() - 3600000 * 4,
  },
  {
    id: 'act-3',
    sourceId: 'sched-3',
    type: 'schedule',
    title: 'Project Development: Core Architecture',
    date: today,
    timestamp: Date.now() - 3600000 * 3,
  },
  {
    id: 'act-prev-1',
    sourceId: 'sched-prev-1',
    type: 'schedule',
    title: 'Sprint Planning & Architecture Spec',
    date: yesterday,
    timestamp: Date.now() - 3600000 * 24,
  },
  {
    id: 'act-prev-2',
    sourceId: 'sched-prev-2',
    type: 'schedule',
    title: 'Database Schema Migration',
    date: yesterday,
    timestamp: Date.now() - 3600000 * 22,
  },
  {
    id: 'act-prev-3',
    sourceId: 'sched-prev-3',
    type: 'schedule',
    title: 'Client Demo & Feedback Synthesis',
    date: yesterday,
    timestamp: Date.now() - 3600000 * 19,
  },
  {
    id: 'act-prev-4',
    sourceId: 'sched-prev-4',
    type: 'schedule',
    title: 'Refactor State Management & Unit Tests',
    date: twoDaysAgo,
    timestamp: Date.now() - 3600000 * 48,
  },
];

const STORAGE_KEYS = {
  SCHEDULE: 'daygrid_schedule_tasks_v3',
  MATRIX: 'daygrid_priority_matrix_v3',
  WINS: 'daygrid_daily_wins_v3',
  ENERGY_LOGS: 'daygrid_energy_logs_v3',
  FOCUS_LOGS: 'daygrid_focus_logs_v3',
  POMODORO: 'daygrid_pomodoro_state_v3',
  SETTINGS: 'daygrid_settings_v3',
  ACTIVITY: 'daygrid_activity_history_v3',
};

export function loadScheduleTasks(): ScheduleTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (raw === null) return INITIAL_SCHEDULE_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((t): t is Partial<ScheduleTask> => t && typeof t === 'object' && typeof t.title === 'string')
        .map((t) => ({
          id: t.id || `sched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          date: t.date || getTodayDateString(),
          time: t.time || '09:00',
          endTime: t.endTime,
          title: t.title || 'Untitled Activity',
          category: t.category || 'Deep Work',
          completed: Boolean(t.completed),
          completedAt: t.completedAt,
          notes: t.notes,
        })) as ScheduleTask[];
    }
    return INITIAL_SCHEDULE_TASKS;
  } catch (e) {
    console.warn('Storage parsing error for schedule tasks, falling back to defaults', e);
    return INITIAL_SCHEDULE_TASKS;
  }
}

export function saveScheduleTasks(tasks: ScheduleTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save schedule tasks', e);
  }
}

export function loadMatrixTasks(): MatrixTask[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MATRIX);
    if (raw === null) return INITIAL_MATRIX_TASKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((t): t is Partial<MatrixTask> => t && typeof t === 'object' && typeof t.title === 'string')
        .map((t) => ({
          id: t.id || `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          quadrant: t.quadrant || 'do-first',
          title: t.title || 'Untitled Priority',
          completed: Boolean(t.completed),
          completedAt: t.completedAt,
          notes: t.notes,
          createdAt: t.createdAt || Date.now(),
        })) as MatrixTask[];
    }
    return INITIAL_MATRIX_TASKS;
  } catch (e) {
    console.warn('Storage parsing error for matrix tasks', e);
    return INITIAL_MATRIX_TASKS;
  }
}

export function saveMatrixTasks(tasks: MatrixTask[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MATRIX, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save matrix tasks', e);
  }
}

export function loadDailyWins(): DailyWinItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.WINS);
    if (raw === null) return INITIAL_DAILY_WINS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((w): w is Partial<DailyWinItem> => w && typeof w === 'object' && typeof w.title === 'string')
        .map((w) => ({
          id: w.id || `win-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          date: w.date || getTodayDateString(),
          title: w.title || 'Untitled Goal',
          completed: Boolean(w.completed),
          completedAt: w.completedAt,
          createdAt: w.createdAt || Date.now(),
        })) as DailyWinItem[];
    }
    return INITIAL_DAILY_WINS;
  } catch (e) {
    console.warn('Storage parsing error for daily wins', e);
    return INITIAL_DAILY_WINS;
  }
}

export function saveDailyWins(wins: DailyWinItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(wins));
  } catch (e) {
    console.error('Failed to save daily wins', e);
  }
}

export function loadEnergyLogs(): EnergyLogEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENERGY_LOGS);
    if (raw === null) return INITIAL_ENERGY_LOGS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((e): e is EnergyLogEntry => e && typeof e === 'object' && typeof e.level === 'string');
    }
    return INITIAL_ENERGY_LOGS;
  } catch (e) {
    console.warn('Storage parsing error for energy logs', e);
    return INITIAL_ENERGY_LOGS;
  }
}

export function saveEnergyLogs(logs: EnergyLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ENERGY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save energy logs', e);
  }
}

export function loadFocusLogs(): FocusSessionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOCUS_LOGS);
    if (raw === null) return INITIAL_FOCUS_LOGS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((f): f is FocusSessionLog => f && typeof f === 'object' && typeof f.durationMinutes === 'number');
    }
    return INITIAL_FOCUS_LOGS;
  } catch (e) {
    console.warn('Storage parsing error for focus logs', e);
    return INITIAL_FOCUS_LOGS;
  }
}

export function saveFocusLogs(logs: FocusSessionLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FOCUS_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to save focus logs', e);
  }
}

export function loadActivityRecords(): ActivityRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    if (raw === null) return INITIAL_ACTIVITY_RECORDS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((a): a is ActivityRecord => a && typeof a === 'object' && typeof a.date === 'string');
    }
    return INITIAL_ACTIVITY_RECORDS;
  } catch (e) {
    console.warn('Storage parsing error for activity history', e);
    return INITIAL_ACTIVITY_RECORDS;
  }
}

export function saveActivityRecords(records: ActivityRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(records));
  } catch (e) {
    console.error('Failed to save activity history', e);
  }
}

export function loadPomodoroState(): PomodoroState {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POMODORO);
    if (!raw) return INITIAL_POMODORO;
    const parsed: PomodoroState = JSON.parse(raw);

    if (parsed.isRunning && parsed.targetEndTime) {
      const remainingMs = parsed.targetEndTime - Date.now();
      if (remainingMs <= 0) {
        return {
          ...parsed,
          remainingSeconds: 0,
          isRunning: false,
          targetEndTime: null,
          completedSessions: (parsed.completedSessions || 0) + 1,
        };
      } else {
        return {
          ...parsed,
          remainingSeconds: Math.ceil(remainingMs / 1000),
        };
      }
    }

    return parsed;
  } catch (e) {
    return INITIAL_POMODORO;
  }
}

export function savePomodoroState(state: PomodoroState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POMODORO, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save pomodoro state', e);
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return INITIAL_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_SETTINGS,
      ...parsed,
      isMuted: typeof parsed.isMuted === 'boolean' ? parsed.isMuted : false,
      soundVolume: typeof parsed.soundVolume === 'number' ? parsed.soundVolume : 0.8,
      notificationSound: parsed.notificationSound || 'Soft Chime',
      pomodoroSound: parsed.pomodoroSound || 'Gentle Bell',
      profile: {
        ...INITIAL_SETTINGS.profile,
        ...(parsed.profile || {}),
        avatarColor: parsed.profile?.avatarColor || INITIAL_SETTINGS.profile.avatarColor,
        customAvatarColor: parsed.profile?.customAvatarColor,
      },
    };
  } catch (e) {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function resetAllToDefaults(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(INITIAL_SCHEDULE_TASKS));
    localStorage.setItem(STORAGE_KEYS.MATRIX, JSON.stringify(INITIAL_MATRIX_TASKS));
    localStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(INITIAL_DAILY_WINS));
    localStorage.setItem(STORAGE_KEYS.ENERGY_LOGS, JSON.stringify(INITIAL_ENERGY_LOGS));
    localStorage.setItem(STORAGE_KEYS.FOCUS_LOGS, JSON.stringify(INITIAL_FOCUS_LOGS));
    localStorage.setItem(STORAGE_KEYS.POMODORO, JSON.stringify(INITIAL_POMODORO));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(INITIAL_ACTIVITY_RECORDS));
  } catch (e) {
    console.error('Failed to reset to defaults', e);
  }
}

export function loadDemoDefaults(): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(SAMPLE_SCHEDULE_TASKS));
    localStorage.setItem(STORAGE_KEYS.MATRIX, JSON.stringify(SAMPLE_MATRIX_TASKS));
    localStorage.setItem(STORAGE_KEYS.WINS, JSON.stringify(SAMPLE_DAILY_WINS));
    localStorage.setItem(STORAGE_KEYS.ENERGY_LOGS, JSON.stringify(SAMPLE_ENERGY_LOGS));
    localStorage.setItem(STORAGE_KEYS.FOCUS_LOGS, JSON.stringify(SAMPLE_FOCUS_LOGS));
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(SAMPLE_ACTIVITY_RECORDS));
  } catch (e) {
    console.error('Failed to load demo defaults', e);
  }
}
