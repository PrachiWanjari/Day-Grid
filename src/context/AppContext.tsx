import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ScheduleTask,
  MatrixTask,
  DailyWinItem,
  EnergyLogEntry,
  FocusSessionLog,
  PomodoroState,
  MatrixQuadrantId,
  EnergyLevelType,
  AppSettings,
  UserProfile,
  ActivityRecord,
  ScheduleCategory,
  ToastMessage,
} from '../types';

import {
  loadScheduleTasks,
  saveScheduleTasks,
  loadMatrixTasks,
  saveMatrixTasks,
  loadDailyWins,
  saveDailyWins,
  loadEnergyLogs,
  saveEnergyLogs,
  loadFocusLogs,
  saveFocusLogs,
  loadActivityRecords,
  saveActivityRecords,
  loadPomodoroState,
  savePomodoroState,
  loadSettings,
  saveSettings,
  resetAllToDefaults,
  INITIAL_SCHEDULE_TASKS,
  INITIAL_MATRIX_TASKS,
  INITIAL_DAILY_WINS,
  INITIAL_ENERGY_LOGS,
  INITIAL_FOCUS_LOGS,
  INITIAL_ACTIVITY_RECORDS,
  INITIAL_POMODORO,
  INITIAL_SETTINGS,
  SAMPLE_SCHEDULE_TASKS,
  SAMPLE_MATRIX_TASKS,
  SAMPLE_DAILY_WINS,
  SAMPLE_ENERGY_LOGS,
  SAMPLE_FOCUS_LOGS,
  SAMPLE_ACTIVITY_RECORDS,
  getTodayDateString,
  shiftDateString,
} from '../utils/storage';

import { playNotificationSound } from '../utils/audio';

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  // Calendar / Selected Date
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  goToToday: () => void;
  goToPreviousDay: () => void;
  goToNextDay: () => void;

  // Schedule
  scheduleTasks: ScheduleTask[];
  toggleScheduleComplete: (id: string) => void;
  addScheduleTask: (task: Omit<ScheduleTask, 'id' | 'completed'>) => void;
  editScheduleTask: (id: string, updates: Partial<ScheduleTask>) => void;
  deleteScheduleTask: (id: string) => void;
  resetSampleSchedule: () => void;

  // Matrix
  matrixTasks: MatrixTask[];
  toggleMatrixComplete: (id: string) => void;
  addMatrixTask: (data: { quadrant: MatrixQuadrantId; title: string; notes?: string }) => boolean;
  editMatrixTask: (id: string, updates: Partial<MatrixTask>) => void;
  deleteMatrixTask: (id: string) => void;
  moveMatrixTask: (id: string, targetQuadrant: MatrixQuadrantId) => void;
  sendMatrixTaskToSchedule: (matrixTaskId: string, time?: string, category?: ScheduleCategory) => void;

  // Daily Wins
  dailyWins: DailyWinItem[];
  toggleWin: (id: string) => void;
  addWin: (title: string, date?: string) => void;
  deleteWin: (id: string) => void;
  copyYesterdayWins: (targetDate?: string) => void;

  // Energy
  energyLogs: EnergyLogEntry[];
  currentEnergy: EnergyLogEntry;
  addEnergyLog: (level: EnergyLevelType, note?: string) => void;

  // Focus & Pomodoro
  pomodoro: PomodoroState;
  updatePomodoro: (state: PomodoroState) => void;
  focusLogs: FocusSessionLog[];
  addFocusLog: (session: Omit<FocusSessionLog, 'id' | 'timestamp'>) => void;
  clearFocusLogs: () => void;

  // Activity History (Preserved Completion Records)
  activityRecords: ActivityRecord[];

  // Settings & Profile
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  updateProfile: (profileUpdates: Partial<UserProfile>) => void;
  resetAllData: () => void;
  clearAllWorkspaceData: () => void;
  loadDemoData: () => void;
  importAllData: (data: unknown) => { success: boolean; message: string };

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Confirmation Modal
  confirmModal: ConfirmModalState | null;
  openConfirmModal: (opts: Omit<ConfirmModalState, 'isOpen'>) => void;
  closeConfirmModal: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateString());
  const [scheduleTasks, setScheduleTasks] = useState<ScheduleTask[]>(() => loadScheduleTasks());
  const [matrixTasks, setMatrixTasks] = useState<MatrixTask[]>(() => loadMatrixTasks());
  const [dailyWins, setDailyWins] = useState<DailyWinItem[]>(() => loadDailyWins());
  const [energyLogs, setEnergyLogs] = useState<EnergyLogEntry[]>(() => loadEnergyLogs());
  const [focusLogs, setFocusLogs] = useState<FocusSessionLog[]>(() => loadFocusLogs());
  const [activityRecords, setActivityRecords] = useState<ActivityRecord[]>(() => loadActivityRecords());
  const [pomodoro, setPomodoro] = useState<PomodoroState>(() => loadPomodoroState());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  // Toasts & Confirmation
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState | null>(null);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const duration = toast.duration ?? 3500;
    const newToast: ToastMessage = { ...toast, id, duration };

    setToasts((prev) => [...prev.slice(-4), newToast]); // keep up to 5 toasts

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openConfirmModal = useCallback((opts: Omit<ConfirmModalState, 'isOpen'>) => {
    setConfirmModal({ ...opts, isOpen: true });
  }, []);

  const closeConfirmModal = useCallback(() => {
    setConfirmModal(null);
  }, []);

  // LocalStorage synchronizations
  useEffect(() => {
    saveScheduleTasks(scheduleTasks);
  }, [scheduleTasks]);

  useEffect(() => {
    saveMatrixTasks(matrixTasks);
  }, [matrixTasks]);

  useEffect(() => {
    saveDailyWins(dailyWins);
  }, [dailyWins]);

  useEffect(() => {
    saveEnergyLogs(energyLogs);
  }, [energyLogs]);

  useEffect(() => {
    saveFocusLogs(focusLogs);
  }, [focusLogs]);

  useEffect(() => {
    saveActivityRecords(activityRecords);
  }, [activityRecords]);

  useEffect(() => {
    savePomodoroState(pomodoro);
  }, [pomodoro]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Date navigation helpers
  const goToToday = () => {
    setSelectedDate(getTodayDateString());
  };

  const goToPreviousDay = () => {
    setSelectedDate((prev) => shiftDateString(prev, -1));
  };

  const goToNextDay = () => {
    setSelectedDate((prev) => shiftDateString(prev, 1));
  };

  // Helper: Play completion sound if enabled
  const triggerCompletionSound = useCallback(() => {
    if (settings.soundEnabled && !settings.isMuted) {
      playNotificationSound(settings.notificationSound, settings.soundVolume, settings.isMuted);
    }
  }, [settings.soundEnabled, settings.isMuted, settings.notificationSound, settings.soundVolume]);

  // Schedule task actions
  const toggleScheduleComplete = (id: string) => {
    setScheduleTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      const isCompleting = target && !target.completed;

      if (isCompleting) {
        // Record immutable completion event in activity log
        setActivityRecords((actPrev) => [
          {
            id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            sourceId: target.id,
            type: 'schedule',
            title: target.title,
            date: target.date || selectedDate,
            timestamp: Date.now(),
          },
          ...actPrev,
        ]);
        triggerCompletionSound();
        addToast({
          type: 'success',
          title: 'Schedule block completed',
          description: target.title,
        });
      }

      return prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : undefined,
            }
          : t
      );
    });
  };

  const addScheduleTask = (newTask: Omit<ScheduleTask, 'id' | 'completed'>) => {
    let endTime = newTask.endTime;
    if (!endTime && newTask.time) {
      const [h, m] = newTask.time.split(':').map(Number);
      const nextH = (h + 1).toString().padStart(2, '0');
      endTime = `${nextH}:${(m || 0).toString().padStart(2, '0')}`;
    }

    const task: ScheduleTask = {
      ...newTask,
      date: newTask.date || selectedDate,
      endTime,
      id: `sched-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      completed: false,
    };
    setScheduleTasks((prev) => [...prev, task]);
    addToast({
      type: 'success',
      title: 'Activity scheduled',
      description: `${task.time} – ${task.title}`,
    });
  };

  const editScheduleTask = (id: string, updates: Partial<ScheduleTask>) => {
    setScheduleTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    addToast({
      type: 'info',
      title: 'Schedule updated',
      description: 'Your changes have been saved.',
    });
  };

  const deleteScheduleTask = (id: string) => {
    setScheduleTasks((prev) => prev.filter((t) => t.id !== id));
    addToast({
      type: 'info',
      title: 'Activity removed',
      description: 'Task cleared from schedule.',
    });
  };

  const resetSampleSchedule = () => {
    setScheduleTasks(SAMPLE_SCHEDULE_TASKS);
    addToast({
      type: 'info',
      title: 'Sample schedule loaded',
    });
  };

  // Matrix actions
  const toggleMatrixComplete = (id: string) => {
    setMatrixTasks((prev) => {
      const target = prev.find((t) => t.id === id);
      const isCompleting = target && !target.completed;

      if (isCompleting) {
        setActivityRecords((actPrev) => [
          {
            id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            sourceId: target.id,
            type: 'matrix',
            title: target.title,
            date: selectedDate,
            timestamp: Date.now(),
          },
          ...actPrev,
        ]);
        triggerCompletionSound();
        addToast({
          type: 'success',
          title: 'Priority marked complete',
          description: target.title,
        });
      }

      return prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : undefined,
            }
          : t
      );
    });
  };

  const addMatrixTask = (data: { quadrant: MatrixQuadrantId; title: string; notes?: string }): boolean => {
    // Check for duplicate title
    const isDuplicate = matrixTasks.some(
      (t) => t.title.trim().toLowerCase() === data.title.trim().toLowerCase() && !t.completed
    );
    if (isDuplicate) {
      addToast({
        type: 'warning',
        title: 'Duplicate priority',
        description: 'An active task with this exact description already exists in the matrix.',
      });
      return false;
    }

    const task: MatrixTask = {
      id: `mat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      quadrant: data.quadrant,
      title: data.title,
      notes: data.notes,
      completed: false,
      createdAt: Date.now(),
    };
    setMatrixTasks((prev) => [task, ...prev]);
    addToast({
      type: 'success',
      title: 'Added to Priority Matrix',
      description: `Assigned to ${data.quadrant.toUpperCase()}`,
    });
    return true;
  };

  const editMatrixTask = (id: string, updates: Partial<MatrixTask>) => {
    setMatrixTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    addToast({
      type: 'info',
      title: 'Priority updated',
    });
  };

  const deleteMatrixTask = (id: string) => {
    setMatrixTasks((prev) => prev.filter((t) => t.id !== id));
    addToast({
      type: 'info',
      title: 'Priority deleted',
    });
  };

  const moveMatrixTask = (id: string, targetQuadrant: MatrixQuadrantId) => {
    setMatrixTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, quadrant: targetQuadrant } : t))
    );
    addToast({
      type: 'info',
      title: 'Quadrant updated',
      description: `Moved item to ${targetQuadrant.toUpperCase()}`,
    });
  };

  // Synchronize Priority Matrix item into Schedule
  const sendMatrixTaskToSchedule = (matrixTaskId: string, time?: string, category: ScheduleCategory = 'Deep Work') => {
    const matrixItem = matrixTasks.find((t) => t.id === matrixTaskId);
    if (!matrixItem) return;

    const existingTimes = scheduleTasks.filter((t) => t.date === selectedDate).map((t) => t.time);
    const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    const targetTime = time || TIME_SLOTS.find((s) => !existingTimes.includes(s)) || '09:00';

    if (existingTimes.includes(targetTime)) {
      addToast({
        type: 'error',
        title: 'Schedule conflict',
        description: `A task is already scheduled at ${targetTime}. Choose an open time slot.`,
      });
      return;
    }

    addScheduleTask({
      date: selectedDate,
      time: targetTime,
      title: matrixItem.title,
      category,
      notes: matrixItem.notes || `Linked to ${matrixItem.quadrant.toUpperCase()} priority`,
    });
    addToast({
      type: 'success',
      title: 'Sent to Daily Schedule',
      description: `"${matrixItem.title}" scheduled for ${targetTime} on ${selectedDate}`,
    });
  };

  // Daily wins actions
  const toggleWin = (id: string) => {
    setDailyWins((prev) => {
      const target = prev.find((w) => w.id === id);
      const isCompleting = target && !target.completed;

      if (isCompleting) {
        setActivityRecords((actPrev) => [
          {
            id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            sourceId: target.id,
            type: 'win',
            title: target.title,
            date: target.date || selectedDate,
            timestamp: Date.now(),
          },
          ...actPrev,
        ]);
        triggerCompletionSound();
        addToast({
          type: 'success',
          title: 'Daily victory achieved!',
          description: target.title,
        });
      }

      return prev.map((w) =>
        w.id === id
          ? {
              ...w,
              completed: !w.completed,
              completedAt: !w.completed ? Date.now() : undefined,
            }
          : w
      );
    });
  };

  const addWin = (title: string, date?: string) => {
    const targetDate = date || selectedDate;
    const item: DailyWinItem = {
      id: `win-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: targetDate,
      title,
      completed: false,
      createdAt: Date.now(),
    };
    setDailyWins((prev) => [item, ...prev]);
    addToast({
      type: 'success',
      title: 'Daily goal added',
      description: title,
    });
  };

  const deleteWin = (id: string) => {
    setDailyWins((prev) => prev.filter((w) => w.id !== id));
    addToast({
      type: 'info',
      title: 'Goal removed',
    });
  };

  const copyYesterdayWins = (targetDate?: string) => {
    const effectiveDate = targetDate || selectedDate;
    const prevDateStr = shiftDateString(effectiveDate, -1);

    const prevWins = dailyWins.filter((w) => w.date === prevDateStr);
    if (prevWins.length === 0) {
      addToast({
        type: 'warning',
        title: 'No previous goals',
        description: 'No daily goals recorded for yesterday to copy.',
      });
      return;
    }

    const newCopies: DailyWinItem[] = prevWins.map((w) => ({
      id: `win-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: effectiveDate,
      title: w.title,
      completed: false,
      createdAt: Date.now(),
    }));

    setDailyWins((prev) => [...newCopies, ...prev]);
    addToast({
      type: 'success',
      title: 'Goals initialized',
      description: `Copied ${newCopies.length} goals from ${prevDateStr} to ${effectiveDate}.`,
    });
  };

  // Energy Log actions
  const currentEnergy: EnergyLogEntry =
    energyLogs[0] || {
      id: 'default',
      level: 'High',
      timestamp: Date.now(),
      note: 'Normal baseline',
    };

  const addEnergyLog = (level: EnergyLevelType, note?: string) => {
    const newEntry: EnergyLogEntry = {
      id: `energy-${Date.now()}`,
      level,
      timestamp: Date.now(),
      note: note || undefined,
    };
    setEnergyLogs((prev) => [newEntry, ...prev.slice(0, 49)]); // keep up to 50 logs
    addToast({
      type: 'success',
      title: 'Stamina recorded',
      description: `Bio-Energy set to ${level} caliber.`,
    });
  };

  // Focus Log actions
  const addFocusLog = (session: Omit<FocusSessionLog, 'id' | 'timestamp'>) => {
    const log: FocusSessionLog = {
      ...session,
      id: `flog-${Date.now()}`,
      timestamp: Date.now(),
    };
    setFocusLogs((prev) => [log, ...prev]);
  };

  const clearFocusLogs = () => {
    setFocusLogs([]);
    addToast({
      type: 'info',
      title: 'Focus logs cleared',
      description: 'Historical focus session records have been deleted.',
    });
  };

  // Settings & Profile actions
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const updateProfile = (profileUpdates: Partial<UserProfile>) => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileUpdates,
      },
    }));
  };

  // Global reset
  const resetAllData = () => {
    resetAllToDefaults();
    setScheduleTasks(INITIAL_SCHEDULE_TASKS);
    setMatrixTasks(INITIAL_MATRIX_TASKS);
    setDailyWins(INITIAL_DAILY_WINS);
    setEnergyLogs(INITIAL_ENERGY_LOGS);
    setFocusLogs(INITIAL_FOCUS_LOGS);
    setActivityRecords(INITIAL_ACTIVITY_RECORDS);
    setPomodoro(INITIAL_POMODORO);
    setSettings(INITIAL_SETTINGS);
    setSelectedDate(getTodayDateString());
    addToast({
      type: 'info',
      title: 'System reset complete',
      description: 'Factory sample data restored.',
    });
  };

  // Clear all workspace tasks and records to start with a fresh blank canvas
  const clearAllWorkspaceData = () => {
    setScheduleTasks([]);
    setMatrixTasks([]);
    setDailyWins([]);
    setEnergyLogs([]);
    setFocusLogs([]);
    setActivityRecords([]);
    saveScheduleTasks([]);
    saveMatrixTasks([]);
    saveDailyWins([]);
    saveEnergyLogs([]);
    saveFocusLogs([]);
    saveActivityRecords([]);
    addToast({
      type: 'info',
      title: 'Workspace cleared',
      description: 'All tasks and historical logs removed. You now have a fresh blank canvas.',
    });
  };

  // Load rich demonstration data on demand
  const loadDemoData = () => {
    setScheduleTasks(SAMPLE_SCHEDULE_TASKS);
    setMatrixTasks(SAMPLE_MATRIX_TASKS);
    setDailyWins(SAMPLE_DAILY_WINS);
    setEnergyLogs(SAMPLE_ENERGY_LOGS);
    setFocusLogs(SAMPLE_FOCUS_LOGS);
    setActivityRecords(SAMPLE_ACTIVITY_RECORDS);
    saveScheduleTasks(SAMPLE_SCHEDULE_TASKS);
    saveMatrixTasks(SAMPLE_MATRIX_TASKS);
    saveDailyWins(SAMPLE_DAILY_WINS);
    saveEnergyLogs(SAMPLE_ENERGY_LOGS);
    saveFocusLogs(SAMPLE_FOCUS_LOGS);
    saveActivityRecords(SAMPLE_ACTIVITY_RECORDS);
    addToast({
      type: 'info',
      title: 'Demo data loaded',
      description: 'Sample routine, matrix items, and goals populated.',
    });
  };

  // Import JSON backup with schema validation
  const importAllData = (backupData: unknown): { success: boolean; message: string } => {
    try {
      if (!backupData || typeof backupData !== 'object') {
        return { success: false, message: 'Invalid backup format: Expected a JSON object.' };
      }

      const data = backupData as Record<string, unknown>;

      if (Array.isArray(data.scheduleTasks)) {
        setScheduleTasks(data.scheduleTasks as ScheduleTask[]);
      }
      if (Array.isArray(data.matrixTasks)) {
        setMatrixTasks(data.matrixTasks as MatrixTask[]);
      }
      if (Array.isArray(data.dailyWins)) {
        setDailyWins(data.dailyWins as DailyWinItem[]);
      }
      if (Array.isArray(data.energyLogs)) {
        setEnergyLogs(data.energyLogs as EnergyLogEntry[]);
      }
      if (Array.isArray(data.focusLogs)) {
        setFocusLogs(data.focusLogs as FocusSessionLog[]);
      }
      if (Array.isArray(data.activityRecords)) {
        setActivityRecords(data.activityRecords as ActivityRecord[]);
      }
      if (data.settings && typeof data.settings === 'object') {
        setSettings({
          ...INITIAL_SETTINGS,
          ...(data.settings as AppSettings),
        });
      }

      addToast({
        type: 'success',
        title: 'Data restored successfully',
        description: 'All tasks, logs, and settings loaded.',
      });

      return { success: true, message: 'DayGrid data successfully restored!' };
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Import failed',
        description: String(err),
      });
      return { success: false, message: 'Failed to restore backup: ' + String(err) };
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        goToToday,
        goToPreviousDay,
        goToNextDay,
        scheduleTasks,
        toggleScheduleComplete,
        addScheduleTask,
        editScheduleTask,
        deleteScheduleTask,
        resetSampleSchedule,
        matrixTasks,
        toggleMatrixComplete,
        addMatrixTask,
        editMatrixTask,
        deleteMatrixTask,
        moveMatrixTask,
        sendMatrixTaskToSchedule,
        dailyWins,
        toggleWin,
        addWin,
        deleteWin,
        copyYesterdayWins,
        energyLogs,
        currentEnergy,
        addEnergyLog,
        pomodoro,
        updatePomodoro: setPomodoro,
        focusLogs,
        addFocusLog,
        clearFocusLogs,
        activityRecords,
        settings,
        updateSettings,
        updateProfile,
        resetAllData,
        clearAllWorkspaceData,
        loadDemoData,
        importAllData,
        toasts,
        addToast,
        removeToast,
        confirmModal,
        openConfirmModal,
        closeConfirmModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
