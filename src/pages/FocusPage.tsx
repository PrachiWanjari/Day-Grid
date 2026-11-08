import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  BellRing,
  Flame,
  Clock,
  History,
  Trash2,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { playPomodoroSound } from '../utils/audio';

export const FocusPage: React.FC = () => {
  const {
    pomodoro,
    updatePomodoro,
    focusLogs,
    addFocusLog,
    clearFocusLogs,
    settings,
    scheduleTasks,
    selectedDate,
    openConfirmModal,
  } = useApp();

  const [sessionGoal, setSessionGoal] = useState('');
  const [toastAlert, setToastAlert] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'focus' | 'break'>('all');
  const intervalRef = useRef<number | null>(null);

  // Tab visibility change handler to immediately sync timer
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pomodoro.isRunning && pomodoro.targetEndTime) {
        const remainingMs = pomodoro.targetEndTime - Date.now();
        if (remainingMs > 0) {
          updatePomodoro({
            ...pomodoro,
            remainingSeconds: Math.ceil(remainingMs / 1000),
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pomodoro, updatePomodoro]);

  // Synchronize timer interval with targetEndTime timestamp
  useEffect(() => {
    if (pomodoro.isRunning && pomodoro.targetEndTime) {
      intervalRef.current = window.setInterval(() => {
        const remainingMs = pomodoro.targetEndTime! - Date.now();
        if (remainingMs <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;

          if (settings.soundEnabled && !settings.isMuted) {
            playPomodoroSound(settings.pomodoroSound, settings.soundVolume, settings.isMuted);
          }
          setToastAlert(true);

          // Log completed focus session
          const durationMins = Math.max(1, Math.round(pomodoro.durationSeconds / 60));
          addFocusLog({
            mode: pomodoro.mode,
            durationMinutes: durationMins,
            taskTitle: sessionGoal.trim() || undefined,
          });

          const newCompletedSessions =
            pomodoro.mode === 'focus' ? pomodoro.completedSessions + 1 : pomodoro.completedSessions;

          if (settings.autoStartBreaks && pomodoro.mode === 'focus') {
            const isLong = newCompletedSessions % 4 === 0;
            const nextMode = isLong ? 'long-break' : 'short-break';
            const breakMinutes = isLong
              ? settings.defaultLongBreakDuration
              : settings.defaultBreakDuration;
            const breakSeconds = breakMinutes * 60;

            updatePomodoro({
              ...pomodoro,
              mode: nextMode,
              durationSeconds: breakSeconds,
              remainingSeconds: breakSeconds,
              isRunning: true,
              targetEndTime: Date.now() + breakSeconds * 1000,
              completedSessions: newCompletedSessions,
            });
          } else {
            updatePomodoro({
              ...pomodoro,
              remainingSeconds: 0,
              isRunning: false,
              targetEndTime: null,
              completedSessions: newCompletedSessions,
            });
          }
        } else {
          const currentRemaining = Math.ceil(remainingMs / 1000);
          if (currentRemaining !== pomodoro.remainingSeconds) {
            updatePomodoro({
              ...pomodoro,
              remainingSeconds: currentRemaining,
            });
          }
        }
      }, 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    pomodoro.isRunning,
    pomodoro.targetEndTime,
    pomodoro.remainingSeconds,
    pomodoro.mode,
    pomodoro.durationSeconds,
    pomodoro.completedSessions,
    updatePomodoro,
    addFocusLog,
    sessionGoal,
    settings.soundEnabled,
    settings.isMuted,
    settings.soundVolume,
    settings.pomodoroSound,
    settings.autoStartBreaks,
    settings.defaultBreakDuration,
    settings.defaultLongBreakDuration,
  ]);

  const handleStart = () => {
    const remaining =
      pomodoro.remainingSeconds > 0 ? pomodoro.remainingSeconds : pomodoro.durationSeconds;
    setToastAlert(false);

    updatePomodoro({
      ...pomodoro,
      remainingSeconds: remaining,
      isRunning: true,
      targetEndTime: Date.now() + remaining * 1000,
    });
  };

  const handlePause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    updatePomodoro({
      ...pomodoro,
      isRunning: false,
      targetEndTime: null,
    });
  };

  const handleReset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;

    updatePomodoro({
      ...pomodoro,
      remainingSeconds: pomodoro.durationSeconds,
      isRunning: false,
      targetEndTime: null,
    });
    setToastAlert(false);
  };

  const handleSelectMode = (mode: 'focus' | 'short-break' | 'long-break') => {
    let seconds = settings.defaultFocusDuration * 60;
    if (mode === 'short-break') seconds = settings.defaultBreakDuration * 60;
    if (mode === 'long-break') seconds = settings.defaultLongBreakDuration * 60;

    updatePomodoro({
      ...pomodoro,
      mode,
      durationSeconds: seconds,
      remainingSeconds: seconds,
      isRunning: false,
      targetEndTime: null,
    });
    setToastAlert(false);
  };

  const handleClearHistory = () => {
    openConfirmModal({
      title: 'Clear Focus History?',
      message: 'Are you sure you want to delete all historical focus session records? This will also reset focus duration analytics.',
      confirmText: 'Clear All Sessions',
      isDestructive: true,
      onConfirm: () => clearFocusLogs(),
    });
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const timerProgress =
    pomodoro.durationSeconds > 0
      ? Math.max(
          0,
          Math.min(
            100,
            ((pomodoro.durationSeconds - pomodoro.remainingSeconds) / pomodoro.durationSeconds) * 100
          )
        )
      : 0;

  // Calculate actual daily focus duration from focus logs today
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const todayFocusLogs = focusLogs.filter(
    (log) => log.timestamp >= startOfToday && log.mode === 'focus'
  );
  const totalFocusMinutesToday = todayFocusLogs.reduce(
    (acc, log) => acc + log.durationMinutes,
    0
  );

  const pendingScheduleTasks = scheduleTasks.filter(
    (t) => t.date === selectedDate && !t.completed
  );

  const filteredHistory = focusLogs.filter((log) => {
    if (historyFilter === 'focus') return log.mode === 'focus';
    if (historyFilter === 'break') return log.mode === 'short-break' || log.mode === 'long-break';
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Focus Center */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="inline-flex items-center gap-1.5 p-1 bg-[#F4F6F4] rounded-xl border border-[#E2E8F0] mb-8">
          <button
            onClick={() => handleSelectMode('focus')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              pomodoro.mode === 'focus'
                ? 'bg-[#4A7C59] text-white shadow-xs'
                : 'text-[#515F74] hover:text-[#0B1C30]'
            }`}
          >
            Deep Focus ({settings.defaultFocusDuration}m)
          </button>
          <button
            onClick={() => handleSelectMode('short-break')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              pomodoro.mode === 'short-break'
                ? 'bg-[#4A7C59] text-white shadow-xs'
                : 'text-[#515F74] hover:text-[#0B1C30]'
            }`}
          >
            Short Break ({settings.defaultBreakDuration}m)
          </button>
          <button
            onClick={() => handleSelectMode('long-break')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              pomodoro.mode === 'long-break'
                ? 'bg-[#4A7C59] text-white shadow-xs'
                : 'text-[#515F74] hover:text-[#0B1C30]'
            }`}
          >
            Long Break ({settings.defaultLongBreakDuration}m)
          </button>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#E2E8F0]"
              strokeWidth="5"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-all duration-300 ${
                pomodoro.mode === 'focus' ? 'stroke-[#4A7C59]' : 'stroke-[#0284C7]'
              }`}
              strokeWidth="5"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * timerProgress) / 100}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-tabular text-5xl sm:text-6xl font-bold tracking-tight text-[#0B1C30]">
              {formatTime(pomodoro.remainingSeconds)}
            </span>
            <span className="text-xs uppercase font-semibold text-[#64748B] tracking-wider font-tabular mt-2">
              {pomodoro.isRunning
                ? pomodoro.mode === 'focus'
                  ? 'Focus Sprint Active'
                  : 'Resting & Recharging'
                : pomodoro.remainingSeconds === 0
                ? 'Session Finished'
                : 'Sprint Ready'}
            </span>
          </div>
        </div>

        {/* Completion Alert Banner */}
        {toastAlert && (
          <div className="max-w-sm mx-auto mt-6 p-3 bg-[#E8F3EB] border border-[#A3C9AE] rounded-lg text-xs font-semibold text-[#1E5031] flex items-center justify-center gap-2">
            <BellRing className="w-4 h-4 text-[#4A7C59]" />
            <span>Interval complete! Sound played and session recorded.</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          {pomodoro.isRunning ? (
            <button
              onClick={handlePause}
              className="px-8 py-3.5 bg-[#334155] hover:bg-[#1E293B] text-white rounded-xl text-sm font-semibold shadow-xs flex items-center gap-2.5 transition-colors active:scale-[0.99] cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pause Timer</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="px-8 py-3.5 bg-[#4A7C59] hover:bg-[#316342] text-white rounded-xl text-sm font-semibold shadow-xs flex items-center gap-2.5 transition-colors active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>
                {pomodoro.remainingSeconds < pomodoro.durationSeconds
                  ? 'Resume Sprint'
                  : pomodoro.mode === 'focus'
                  ? 'Start Focus Sprint'
                  : 'Start Break'}
              </span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-3.5 bg-white hover:bg-[#F8FAF9] text-[#515F74] border border-[#CBD5E1] rounded-xl text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
            aria-label="Reset Timer"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => playPomodoroSound(settings.pomodoroSound, settings.soundVolume, settings.isMuted)}
            className="p-3.5 bg-white hover:bg-[#F8FAF9] text-[#515F74] border border-[#CBD5E1] rounded-xl text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
            aria-label="Test Configured Completion Sound"
            title="Test Configured Completion Sound"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        {/* Intention & Task Linking */}
        <div className="max-w-md mx-auto mt-8 pt-6 border-t border-[#F1F5F9] space-y-3">
          <label className="block text-xs font-semibold text-[#515F74] uppercase tracking-wider font-tabular text-left">
            Current Single-Task Focus:
          </label>
          <input
            type="text"
            value={sessionGoal}
            onChange={(e) => setSessionGoal(e.target.value)}
            placeholder="e.g. Implement user authentication error boundaries..."
            className="w-full px-3.5 py-2.5 text-xs bg-[#FBFBFA] border border-[#CBD5E1] rounded-lg text-[#0B1C30] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A7C59] focus:bg-white"
          />

          {/* Quick pick from today's pending tasks */}
          {pendingScheduleTasks.length > 0 && (
            <div className="text-left">
              <span className="text-[10px] text-[#64748B] font-semibold uppercase font-tabular">
                Attach to scheduled activity:
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {pendingScheduleTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setSessionGoal(task.title)}
                    className="text-[11px] px-2 py-1 bg-white border border-[#CBD5E1] hover:border-[#4A7C59] text-[#334155] rounded-md truncate max-w-[200px] cursor-pointer"
                  >
                    {task.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Focus Session History & Daily Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Today's Focus Metrics */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#4A7C59]" />
              <h3 className="font-display text-sm font-bold text-[#0B1C30]">
                Daily Focus Duration
              </h3>
            </div>
            <span className="text-xs font-bold text-[#4A7C59] font-tabular">
              {todayFocusLogs.length} Sprints Today
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0]">
              <div className="text-xs font-medium text-[#64748B]">Total Tracked Focus</div>
              <div className="mt-1 font-tabular text-3xl font-bold text-[#0B1C30]">
                {totalFocusMinutesToday}m
              </div>
              <div className="text-[11px] text-[#4A7C59] font-medium mt-0.5">
                {(totalFocusMinutesToday / 60).toFixed(1)} hours today
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0]">
              <div className="text-xs font-medium text-[#64748B]">All-Time Sprints</div>
              <div className="mt-1 font-tabular text-3xl font-bold text-[#0B1C30]">
                {focusLogs.length}
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">
                {focusLogs.reduce((acc, l) => acc + l.durationMinutes, 0)}m all-time
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Filterable Session History Log */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#64748B]" />
                <h3 className="font-display text-sm font-bold text-[#0B1C30]">
                  Focus Session History
                </h3>
              </div>
              {focusLogs.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-[#64748B] hover:text-[#DC2626] flex items-center gap-1 cursor-pointer"
                  title="Clear focus logs"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear History</span>
                </button>
              )}
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 pt-3 pb-1">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                  historyFilter === 'all'
                    ? 'bg-[#4A7C59] text-white'
                    : 'bg-[#F4F6F4] text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                All ({focusLogs.length})
              </button>
              <button
                onClick={() => setHistoryFilter('focus')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                  historyFilter === 'focus'
                    ? 'bg-[#4A7C59] text-white'
                    : 'bg-[#F4F6F4] text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                Focus ({focusLogs.filter((l) => l.mode === 'focus').length})
              </button>
              <button
                onClick={() => setHistoryFilter('break')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                  historyFilter === 'break'
                    ? 'bg-[#4A7C59] text-white'
                    : 'bg-[#F4F6F4] text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                Breaks ({focusLogs.filter((l) => l.mode !== 'focus').length})
              </button>
            </div>

            <div className="space-y-2 mt-3 max-h-[170px] overflow-y-auto pr-1">
              {filteredHistory.length === 0 ? (
                <p className="text-xs text-[#64748B] py-6 text-center">
                  No sessions matching filter. Start a sprint to build momentum!
                </p>
              ) : (
                filteredHistory.slice(0, 8).map((log) => {
                  const timeStr = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                  }).format(new Date(log.timestamp));

                  const isFocus = log.mode === 'focus';

                  return (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#FBFBFA] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isFocus ? 'bg-[#4A7C59]' : 'bg-[#0284C7]'
                          }`}
                        />
                        <span className="font-medium text-[#0B1C30] truncate">
                          {log.taskTitle || (isFocus ? 'Deep Focus Sprint' : 'Recharge Break')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-tabular text-[#64748B]">
                        <span
                          className={`font-bold px-1.5 py-0.5 rounded ${
                            isFocus
                              ? 'text-[#1E5031] bg-[#E8F3EB]'
                              : 'text-[#0369A1] bg-[#E0F2FE]'
                          }`}
                        >
                          +{log.durationMinutes}m
                        </span>
                        <span>{timeStr}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
