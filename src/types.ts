/**
 * Enhanced Types for DayGrid application
 */

export type ScheduleCategory = 'Deep Work' | 'Quick Wins' | 'Wellness' | 'Meeting' | 'Personal';

export interface ScheduleTask {
  id: string;
  date: string; // YYYY-MM-DD format for date navigation & calendar views
  time: string; // e.g., "09:00"
  endTime?: string; // e.g., "10:00"
  title: string;
  category: ScheduleCategory;
  completed: boolean;
  completedAt?: number;
  notes?: string;
}

export type MatrixQuadrantId = 'do-first' | 'schedule' | 'delegate' | 'eliminate';

export interface MatrixTask {
  id: string;
  quadrant: MatrixQuadrantId;
  title: string;
  completed: boolean;
  completedAt?: number;
  notes?: string;
  createdAt: number;
}

export interface DailyWinItem {
  id: string;
  date: string; // YYYY-MM-DD for historical daily records
  title: string;
  completed: boolean;
  completedAt?: number;
  createdAt: number;
}

export type EnergyLevelType = 'Low' | 'Moderate' | 'High' | 'Excellent';

export interface EnergyLogEntry {
  id: string;
  level: EnergyLevelType;
  timestamp: number;
  note?: string;
}

export interface FocusSessionLog {
  id: string;
  mode: 'focus' | 'short-break' | 'long-break';
  durationMinutes: number;
  timestamp: number;
  taskTitle?: string;
  notes?: string;
}

export interface PomodoroState {
  mode: 'focus' | 'short-break' | 'long-break';
  durationSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  targetEndTime: number | null; // Date.now() + remainingMs
  completedSessions: number;
}

export interface ActivityRecord {
  id: string;
  sourceId: string;
  type: 'schedule' | 'matrix' | 'win';
  title: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export type NotificationSoundType =
  | 'Default'
  | 'Soft Chime'
  | 'Bell'
  | 'Digital Ping'
  | 'Gentle Pop'
  | 'Water Drop'
  | 'Marimba'
  | 'Classic Notification';

export type PomodoroSoundType =
  | 'Default Alarm'
  | 'Gentle Bell'
  | 'Digital Alarm'
  | 'Classic Clock'
  | 'Soft Chime'
  | 'Nature Alert'
  | 'Double Beep'
  | 'Success Tone';

export interface UserProfile {
  name: string;
  title: string;
  workStartHour: string;
  workEndHour: string;
  avatarColor: string;
  customAvatarColor?: string;
}

export interface AppSettings {
  soundEnabled: boolean;
  isMuted: boolean;
  soundVolume: number; // 0 to 1
  notificationSound: NotificationSoundType;
  pomodoroSound: PomodoroSoundType;
  notificationsEnabled: boolean;
  defaultFocusDuration: number; // in minutes
  defaultBreakDuration: number; // in minutes
  defaultLongBreakDuration: number; // in minutes
  autoStartBreaks: boolean;
  profile: UserProfile;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
  duration?: number;
}
