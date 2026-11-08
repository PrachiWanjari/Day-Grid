import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Target,
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Plus,
  Play,
  Pause,
  RotateCcw,
  BatteryCharging,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskModal } from '../components/TaskModal';
import { MatrixTaskModal } from '../components/MatrixTaskModal';
import { EnergyLevelType } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    selectedDate,
    scheduleTasks,
    toggleScheduleComplete,
    addScheduleTask,
    matrixTasks,
    toggleMatrixComplete,
    addMatrixTask,
    dailyWins,
    toggleWin,
    currentEnergy,
    addEnergyLog,
    pomodoro,
    updatePomodoro,
    settings,
  } = useApp();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [energyNote, setEnergyNote] = useState('');

  // Daily Tasks for selected date
  const dayScheduleTasks = scheduleTasks.filter((t) => t.date === selectedDate);
  const completedSchedule = dayScheduleTasks.filter((t) => t.completed).length;
  const totalSchedule = dayScheduleTasks.length;
  const schedulePct = totalSchedule > 0 ? Math.round((completedSchedule / totalSchedule) * 100) : 0;

  // Matrix High-Priority Items
  const urgentImportantTasks = matrixTasks.filter((t) => t.quadrant === 'do-first');
  const pendingUrgentCount = urgentImportantTasks.filter((t) => !t.completed).length;
  const strategicScheduleTasks = matrixTasks.filter((t) => t.quadrant === 'schedule');

  // Daily Wins
  const completedWins = dailyWins.filter((w) => w.completed).length;
  const totalWins = dailyWins.length;
  const winsPct = totalWins > 0 ? Math.round((completedWins / totalWins) * 100) : 0;

  // Upcoming tasks for today chronologically
  const upcomingTasks = [...dayScheduleTasks]
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  const existingTimes = dayScheduleTasks.map((t) => t.time);

  // Focus Timer actions
  const handleToggleTimer = () => {
    if (pomodoro.isRunning) {
      updatePomodoro({
        ...pomodoro,
        isRunning: false,
        targetEndTime: null,
      });
    } else {
      const remaining = pomodoro.remainingSeconds > 0 ? pomodoro.remainingSeconds : pomodoro.durationSeconds;
      updatePomodoro({
        ...pomodoro,
        remainingSeconds: remaining,
        isRunning: true,
        targetEndTime: Date.now() + remaining * 1000,
      });
    }
  };

  const handleResetTimer = () => {
    updatePomodoro({
      ...pomodoro,
      remainingSeconds: pomodoro.durationSeconds,
      isRunning: false,
      targetEndTime: null,
    });
  };

  const formatTimerDigits = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectEnergy = (lvl: EnergyLevelType) => {
    addEnergyLog(lvl, energyNote.trim() || undefined);
    setEnergyNote('');
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4A7C59] uppercase tracking-wider font-tabular">
            <span className="w-2 h-2 rounded-full bg-[#4A7C59]"></span>
            <span>Welcome Back, {settings.profile.name}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1C30]">
            Executive Daily Command Center
          </h2>
          <p className="font-body text-sm text-[#515F74]">
            Working window: <span className="font-tabular font-medium">{settings.profile.workStartHour} – {settings.profile.workEndHour}</span> · {schedulePct}% of planned blocks completed today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] active:scale-[0.99] rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Block</span>
          </button>

          <Link
            to="/app/focus"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F8FAF9] rounded-lg transition-colors"
          >
            <Flame className="w-4 h-4 text-[#4A7C59]" />
            <span>Launch Focus Room</span>
          </Link>
        </div>
      </div>

      {/* 4-KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Schedule Completion */}
        <Link
          to="/app/schedule"
          className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-2xs hover:border-[#4A7C59] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Schedule Progress</span>
            <Calendar className="w-4 h-4 text-[#4A7C59]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-tabular text-2xl font-bold text-[#0B1C30]">
              {completedSchedule}/{totalSchedule}
            </span>
            <span className="text-xs font-semibold text-[#4A7C59]">({schedulePct}%)</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#4A7C59] transition-all duration-300 rounded-full" style={{ width: `${schedulePct}%` }}></div>
          </div>
        </Link>

        {/* Metric 2: Urgent Priority Items */}
        <Link
          to="/app/priorities"
          className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-2xs hover:border-[#4A7C59] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Do First (Urgent)</span>
            <Target className="w-4 h-4 text-[#B93822]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-tabular text-2xl font-bold text-[#0B1C30]">
              {pendingUrgentCount}
            </span>
            <span className="text-xs font-medium text-[#64748B]">pending crises</span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748B] font-tabular">
            {matrixTasks.length} total across 4 quadrants
          </div>
        </Link>

        {/* Metric 3: Daily Wins */}
        <Link
          to="/app/wins"
          className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-2xs hover:border-[#4A7C59] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Daily Wins</span>
            <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-tabular text-2xl font-bold text-[#0B1C30]">
              {completedWins}/{totalWins}
            </span>
            <span className="text-xs font-semibold text-[#0284C7]">({winsPct}%)</span>
          </div>
          <div className="mt-2 w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#0284C7] transition-all duration-300 rounded-full" style={{ width: `${winsPct}%` }}></div>
          </div>
        </Link>

        {/* Metric 4: Focus Time Today */}
        <Link
          to="/app/focus"
          className="bg-white rounded-xl border border-[#E2E8F0] p-4.5 shadow-2xs hover:border-[#4A7C59] transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Focused Minutes</span>
            <Flame className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-tabular text-2xl font-bold text-[#0B1C30]">
              {pomodoro.completedSessions * settings.defaultFocusDuration}m
            </span>
            <span className="text-xs font-medium text-[#D97706]">
              ({pomodoro.completedSessions} sprints)
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#64748B] font-tabular">
            {pomodoro.isRunning ? 'Active session running' : 'Ready to sprint'}
          </div>
        </Link>
      </div>

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Today's Schedule & Priority Previews */}
        <div className="lg:col-span-7 space-y-6">
          {/* Upcoming Schedule Tasks */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4A7C59]" />
                <h3 className="font-display text-base font-bold text-[#0B1C30]">
                  Upcoming Time-Blocks
                </h3>
              </div>
              <Link
                to="/app/schedule"
                className="text-xs font-semibold text-[#4A7C59] hover:underline flex items-center gap-1"
              >
                <span>Full Schedule</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* List */}
            <div className="divide-y divide-[#F1F5F9] mt-2">
              {upcomingTasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#64748B] space-y-2">
                  <p>No activities scheduled for this date.</p>
                  <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="text-xs font-semibold text-[#4A7C59] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Time Slot</span>
                  </button>
                </div>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`py-3.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                      task.completed ? 'opacity-65' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => toggleScheduleComplete(task.id)}
                        className="text-[#94A3B8] hover:text-[#4A7C59] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded"
                        aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
                        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-[#4A7C59] fill-[#E8F3EB]" />
                        ) : (
                          <Circle className="w-4.5 h-4.5" />
                        )}
                      </button>

                      <span className="font-tabular font-bold text-[#0B1C30] shrink-0 w-12">
                        {task.time}
                      </span>

                      <span
                        className={`truncate font-medium ${
                          task.completed ? 'line-through text-[#64748B]' : 'text-[#0B1C30]'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-tabular bg-[#F8FAF9] border border-[#E2E8F0] text-[#515F74] shrink-0">
                      {task.category}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">{completedSchedule} of {totalSchedule} completed today</span>
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="text-xs font-semibold text-[#4A7C59] hover:text-[#316342] inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Time-Block</span>
              </button>
            </div>
          </div>

          {/* Priority Task Preview (Do First & Schedule) */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#B93822]" />
                <h3 className="font-display text-base font-bold text-[#0B1C30]">
                  High Priority Highlights
                </h3>
              </div>
              <Link
                to="/app/priorities"
                className="text-xs font-semibold text-[#4A7C59] hover:underline flex items-center gap-1"
              >
                <span>View 2×2 Matrix</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {urgentImportantTasks.length === 0 && strategicScheduleTasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#64748B] space-y-1.5">
                <p>No high-priority tasks in Do First or Schedule.</p>
                <button
                  onClick={() => setIsMatrixModalOpen(true)}
                  className="text-xs font-semibold text-[#4A7C59] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Priority Item</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-3">
                {urgentImportantTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-[#F8FAF9] border-[#E2E8F0] text-[#64748B]'
                        : 'bg-[#FFFBFB] border-[#FCA5A5]/60 text-[#0B1C30]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        onClick={() => toggleMatrixComplete(task.id)}
                        className="text-[#94A3B8] hover:text-[#4A7C59] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded"
                        aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <span className={`truncate ${task.completed ? 'line-through text-[#64748B]' : 'font-medium'}`}>
                        {task.title}
                      </span>
                    </div>

                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FDF2F0] text-[#B93822] font-semibold shrink-0">
                      Do First
                    </span>
                  </div>
                ))}

                {strategicScheduleTasks.slice(0, 2).map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-[#F8FAF9] border-[#E2E8F0] text-[#64748B]'
                        : 'bg-[#FBFDFB] border-[#A3C9AE]/60 text-[#0B1C30]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        onClick={() => toggleMatrixComplete(task.id)}
                        className="text-[#94A3B8] hover:text-[#4A7C59] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded"
                        aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <span className={`truncate ${task.completed ? 'line-through text-[#64748B]' : 'font-medium'}`}>
                        {task.title}
                      </span>
                    </div>

                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#E8F3EB] text-[#1E5031] font-semibold shrink-0">
                      Schedule
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-3 border-t border-[#F1F5F9] text-right">
              <button
                onClick={() => setIsMatrixModalOpen(true)}
                className="text-xs font-semibold text-[#4A7C59] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Priority Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Focus Timer Widget, Energy Logger, Daily Wins */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Focus Timer Widget */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#4A7C59]" />
                <h3 className="font-display text-sm font-bold text-[#0B1C30]">
                  Focus Room Quick-Launch
                </h3>
              </div>
              <Link to="/app/focus" className="text-xs text-[#4A7C59] hover:underline font-semibold">
                Open Full Room &rarr;
              </Link>
            </div>

            <div className="py-6 flex flex-col items-center justify-center">
              <div className="font-tabular text-4xl sm:text-5xl font-bold text-[#0B1C30]">
                {formatTimerDigits(pomodoro.remainingSeconds)}
              </div>
              <div className="text-[11px] font-tabular uppercase text-[#64748B] mt-1 font-semibold">
                {pomodoro.isRunning ? 'Deep Work Sprint Active' : `${settings.defaultFocusDuration}m Sprint Ready`}
              </div>

              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={handleToggleTimer}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] rounded-lg shadow-xs flex items-center gap-2 transition-colors active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
                >
                  {pomodoro.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{pomodoro.isRunning ? 'Pause Sprint' : 'Start Focus Sprint'}</span>
                </button>

                <button
                  onClick={handleResetTimer}
                  aria-label="Reset focus sprint timer"
                  className="p-2.5 text-[#515F74] hover:text-[#0B1C30] hover:bg-[#F8FAF9] rounded-lg border border-[#CBD5E1] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Daily Bio-Energy Logger Widget */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <BatteryCharging className="w-4 h-4 text-[#4A7C59]" />
                <h3 className="font-display text-sm font-bold text-[#0B1C30]">
                  Bio-Energy Logger
                </h3>
              </div>
              <span className="text-xs font-bold text-[#4A7C59] font-tabular">
                Current: {currentEnergy.level}
              </span>
            </div>

            <p className="text-xs text-[#515F74]">
              How is your cognitive stamina right now? Update anytime:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {(['Low', 'Moderate', 'High', 'Excellent'] as EnergyLevelType[]).map((lvl) => {
                const isSelected = currentEnergy.level === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleSelectEnergy(lvl)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-[#4A7C59] bg-[#E8F3EB] text-[#1E5031] ring-1 ring-[#4A7C59]'
                        : 'border-[#E2E8F0] bg-white text-[#515F74] hover:bg-[#F8FAF9]'
                    }`}
                  >
                    {lvl}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Daily Wins Snapshot Widget */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                <h3 className="font-display text-sm font-bold text-[#0B1C30]">
                  Daily Habit Wins ({completedWins}/{totalWins})
                </h3>
              </div>
              <Link to="/app/wins" className="text-xs text-[#4A7C59] hover:underline font-semibold">
                Manage &rarr;
              </Link>
            </div>

            {dailyWins.length === 0 ? (
              <div className="py-4 text-center text-xs text-[#64748B] space-y-1">
                <p>No daily wins logged yet.</p>
                <Link to="/app/wins" className="text-xs font-semibold text-[#4A7C59] hover:underline inline-flex items-center gap-1">
                  <span>Add First Goal &rarr;</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2 mt-3">
                {dailyWins.slice(0, 3).map((win) => (
                  <div key={win.id} className="flex items-center gap-2.5 text-xs py-1">
                    <button
                      onClick={() => toggleWin(win.id)}
                      className="text-[#94A3B8] hover:text-[#4A7C59] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded"
                      aria-label={win.completed ? `Mark "${win.title}" incomplete` : `Mark "${win.title}" complete`}
                    >
                      {win.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <span className={`truncate ${win.completed ? 'line-through text-[#64748B]' : 'text-[#0B1C30]'}`}>
                      {win.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Task Modal for Quick Add */}
      <TaskModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={(data) => {
          addScheduleTask({
            date: selectedDate,
            time: data.time,
            title: data.title,
            category: data.category,
            notes: data.notes,
          });
        }}
        existingTimes={existingTimes}
      />

      {/* Matrix Task Modal for Quick Add */}
      <MatrixTaskModal
        isOpen={isMatrixModalOpen}
        onClose={() => setIsMatrixModalOpen(false)}
        onSave={(data) => {
          addMatrixTask({
            quadrant: 'do-first',
            title: data.title,
            notes: data.notes,
          });
        }}
        defaultQuadrant="do-first"
      />
    </div>
  );
};
