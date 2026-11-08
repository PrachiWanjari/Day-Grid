import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  CalendarRange,
  RotateCcw,
  Layers,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScheduleTask, ScheduleCategory } from '../types';
import { TaskModal } from '../components/TaskModal';
import { getTodayDateString } from '../utils/storage';
import { formatDateToKey, formatDisplayDate, parseDateKey } from '../utils/date';

const CATEGORY_STYLES: Record<
  ScheduleCategory,
  { label: string; bg: string; text: string; border: string }
> = {
  'Deep Work': {
    label: 'Deep Work',
    bg: 'bg-[#E8F3EB]',
    text: 'text-[#1E5031]',
    border: 'border-[#A3C9AE]',
  },
  'Quick Wins': {
    label: 'Quick Wins',
    bg: 'bg-[#E0F2FE]',
    text: 'text-[#0369A1]',
    border: 'border-[#BAE6FD]',
  },
  Wellness: {
    label: 'Wellness',
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#065F46]',
    border: 'border-[#A7F3D0]',
  },
  Meeting: {
    label: 'Meeting',
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#92400E]',
    border: 'border-[#FDE68A]',
  },
  Personal: {
    label: 'Personal',
    bg: 'bg-[#EDE9FE]',
    text: 'text-[#5B21B6]',
    border: 'border-[#DDD6FE]',
  },
};

export const SchedulePage: React.FC = () => {
  const {
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
    settings,
    openConfirmModal,
  } = useApp();

  const [calendarView, setCalendarView] = useState<'day' | 'week'>('day');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<ScheduleTask | null>(null);
  const [initialModalTime, setInitialModalTime] = useState<string | undefined>(undefined);

  // Filter tasks for selected date
  const dayTasks = useMemo(() => {
    return scheduleTasks
      .filter((t) => t.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [scheduleTasks, selectedDate]);

  const filteredDayTasks = useMemo(() => {
    if (activeCategoryFilter === 'all') return dayTasks;
    return dayTasks.filter((t) => t.category === activeCategoryFilter);
  }, [dayTasks, activeCategoryFilter]);

  const existingTimes = useMemo(() => dayTasks.map((t) => t.time), [dayTasks]);

  // Time category hour counts for selected date
  const deepWorkCount = dayTasks.filter((t) => t.category === 'Deep Work').length;
  const quickWinsCount = dayTasks.filter((t) => t.category === 'Quick Wins').length;
  const wellnessCount = dayTasks.filter((t) => t.category === 'Wellness').length;

  const completedCount = dayTasks.filter((t) => t.completed).length;
  const totalCount = dayTasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Calculate current week days (Monday - Sunday) using noon-anchored local dates
  const currentWeekDays = useMemo(() => {
    const curr = parseDateKey(selectedDate);
    const dayOfWeek = curr.getDay(); // 0 is Sunday, 1 is Monday...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(curr);
    monday.setDate(curr.getDate() + diffToMonday);

    const week: { dateStr: string; dayName: string; dayNumber: number; isSelected: boolean }[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const str = formatDateToKey(day);
      week.push({
        dateStr: str,
        dayName: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(day),
        dayNumber: day.getDate(),
        isSelected: str === selectedDate,
      });
    }
    return week;
  }, [selectedDate]);

  const handleOpenAdd = (preferredTime?: string) => {
    setTaskToEdit(null);
    setInitialModalTime(preferredTime);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: ScheduleTask) => {
    setTaskToEdit(task);
    setInitialModalTime(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (task: ScheduleTask) => {
    openConfirmModal({
      title: 'Delete Scheduled Activity?',
      message: `Are you sure you want to remove "${task.title}" at ${task.time} from your daily schedule?`,
      confirmText: 'Delete Activity',
      isDestructive: true,
      onConfirm: () => deleteScheduleTask(task.id),
    });
  };

  const handleSaveModal = (data: Omit<ScheduleTask, 'id' | 'completed' | 'date'> & { id?: string; date?: string; endTime?: string }) => {
    if (data.id) {
      editScheduleTask(data.id, {
        time: data.time,
        endTime: data.endTime,
        title: data.title,
        category: data.category,
        notes: data.notes,
      });
    } else {
      addScheduleTask({
        date: selectedDate,
        time: data.time,
        endTime: data.endTime,
        title: data.title,
        category: data.category,
        notes: data.notes,
      });
    }
  };

  const formattedHeaderDate = useMemo(() => {
    return formatDisplayDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      {/* Top Bar: Date Stepper, Calendar View Toggle, and Add Activity */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#FBFBFA] border border-[#CBD5E1] rounded-lg p-0.5">
            <button
              type="button"
              onClick={goToPreviousDay}
              className="p-1.5 hover:bg-white text-[#515F74] hover:text-[#0B1C30] rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="px-3 py-1 text-xs font-bold text-[#0B1C30] hover:text-[#316342] font-tabular transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded-md"
              title="Jump to Today"
              aria-label="Jump to Today"
            >
              Today
            </button>
            <button
              type="button"
              onClick={goToNextDay}
              className="p-1.5 hover:bg-white text-[#515F74] hover:text-[#0B1C30] rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
              title="Next Day"
              aria-label="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              aria-label="Select schedule date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-tabular focus:outline-none focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15"
            />
            <span className="hidden sm:inline text-xs font-semibold text-[#515F74]">
              {formattedHeaderDate}
            </span>
          </div>
        </div>

        {/* View Toggle (Day / Week) & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#F4F6F4] p-1 rounded-lg border border-[#E2E8F0]">
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                calendarView === 'day'
                  ? 'bg-white text-[#0B1C30] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              Day View
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                calendarView === 'week'
                  ? 'bg-white text-[#0B1C30] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              Week View
            </button>
          </div>

          <button
            onClick={() => handleOpenAdd()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] active:scale-[0.99] rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Week View Overview Swimlane */}
      {calendarView === 'week' ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
            <h3 className="font-display text-base font-bold text-[#0B1C30] mb-4">
              7-Day Schedule Matrix
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
              {currentWeekDays.map((day) => {
                const dayItems = scheduleTasks
                  .filter((t) => t.date === day.dateStr)
                  .sort((a, b) => a.time.localeCompare(b.time));
                const dayCompleted = dayItems.filter((t) => t.completed).length;

                return (
                  <div
                    key={day.dateStr}
                    onClick={() => {
                      setSelectedDate(day.dateStr);
                      setCalendarView('day');
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                      day.isSelected
                        ? 'border-[#4A7C59] bg-[#E8F3EB]/40 ring-2 ring-[#4A7C59]/20'
                        : 'border-[#E2E8F0] bg-[#FBFBFA] hover:bg-white hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#64748B] uppercase font-tabular">
                          {day.dayName}
                        </span>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-tabular ${
                            day.isSelected ? 'bg-[#4A7C59] text-white' : 'text-[#0B1C30]'
                          }`}
                        >
                          {day.dayNumber}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] font-tabular text-[#64748B]">
                        {dayCompleted}/{dayItems.length} blocks
                      </div>

                      {/* Mini tasks previews */}
                      <div className="mt-2 space-y-1">
                        {dayItems.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="text-[10px] truncate p-1 rounded bg-white border border-[#E2E8F0] text-[#334155]"
                          >
                            <span className="font-bold text-[#4A7C59] mr-1">{item.time}</span>
                            {item.title}
                          </div>
                        ))}
                        {dayItems.length > 3 && (
                          <div className="text-[10px] text-[#64748B] text-center">
                            +{dayItems.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 text-[10px] text-[#4A7C59] font-semibold text-right">
                      View Day &rarr;
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Day View Content */
        <div className="space-y-6">
          {/* Daily Category Metrics Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
              <div className="text-xs font-medium text-[#64748B]">Daily Completion</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-tabular text-2xl font-bold text-[#0B1C30]">
                  {completedCount}/{totalCount}
                </span>
                <span className="text-xs font-semibold text-[#4A7C59]">({completionPercentage}%)</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
              <div className="text-xs font-medium text-[#64748B]">Deep Work Planned</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-tabular text-2xl font-bold text-[#1E5031]">
                  {deepWorkCount}h
                </span>
                <span className="text-xs text-[#64748B]">focus blocks</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
              <div className="text-xs font-medium text-[#64748B]">Quick Wins</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-tabular text-2xl font-bold text-[#0369A1]">
                  {quickWinsCount}h
                </span>
                <span className="text-xs text-[#64748B]">admin blocks</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
              <div className="text-xs font-medium text-[#64748B]">Wellness & Breaks</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-tabular text-2xl font-bold text-[#065F46]">
                  {wellnessCount}h
                </span>
                <span className="text-xs text-[#64748B]">recharge blocks</span>
              </div>
            </div>
          </div>

          {/* Interactive Day Schedule Container */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-1 p-1 bg-[#F4F6F4] rounded-lg overflow-x-auto max-w-full">
                <button
                  onClick={() => setActiveCategoryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    activeCategoryFilter === 'all'
                      ? 'bg-white text-[#0B1C30] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0B1C30]'
                  }`}
                >
                  All ({dayTasks.length})
                </button>
                {(['Deep Work', 'Quick Wins', 'Wellness', 'Meeting'] as ScheduleCategory[]).map((cat) => {
                  const count = dayTasks.filter((t) => t.category === cat).length;
                  const isSelected = activeCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                        isSelected
                          ? 'bg-white text-[#0B1C30] shadow-xs'
                          : 'text-[#64748B] hover:text-[#0B1C30]'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              <button
                onClick={resetSampleSchedule}
                className="text-xs text-[#64748B] hover:text-[#0B1C30] inline-flex items-center gap-1 font-tabular cursor-pointer"
                title="Populate an example daily routine"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Load Sample Routine</span>
              </button>
            </div>

            {/* Tasks List */}
            {filteredDayTasks.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#64748B] border border-dashed border-[#E2E8F0] rounded-xl space-y-3">
                <Clock className="w-8 h-8 text-[#A3C9AE] mx-auto" />
                <p className="font-semibold text-sm text-[#0B1C30]">
                  No activities scheduled for this date.
                </p>
                <p className="max-w-sm mx-auto">
                  Allocate your day in intentional hourly slots to protect cognitive stamina.
                </p>
                <button
                  onClick={() => handleOpenAdd()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Activity</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9] border border-[#E2E8F0] rounded-xl overflow-hidden shadow-2xs">
                {filteredDayTasks.map((task) => {
                  const style = CATEGORY_STYLES[task.category] || CATEGORY_STYLES['Deep Work'];
                  return (
                    <div
                      key={task.id}
                      className={`group p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                        task.completed ? 'bg-[#FBFBFA]/80 opacity-75' : 'hover:bg-[#F8FAF9]'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                        <button
                          onClick={() => toggleScheduleComplete(task.id)}
                          className="mt-0.5 sm:mt-0 text-[#94A3B8] hover:text-[#4A7C59] transition-colors shrink-0"
                          title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-[#4A7C59] fill-[#E8F3EB]" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>

                        <div className="w-24 shrink-0 font-tabular font-bold text-xs text-[#0B1C30]">
                          {task.time} {task.endTime ? `– ${task.endTime}` : ''}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                task.completed ? 'line-through text-[#64748B]' : 'text-[#0B1C30]'
                              }`}
                            >
                              {task.title}
                            </span>
                            <span
                              className={`text-[10px] font-tabular px-2 py-0.5 rounded border font-semibold ${style.bg} ${style.text} ${style.border}`}
                            >
                              {task.category}
                            </span>
                            {(task.time < settings.profile.workStartHour || task.time >= settings.profile.workEndHour) && (
                              <span className="text-[10px] font-tabular px-1.5 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                                Outside work window
                              </span>
                            )}
                          </div>
                          {task.notes && (
                            <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">
                              {task.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Edit / Delete Actions */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleOpenEdit(task)}
                          className="p-1.5 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#E8F3EB] rounded-md transition-colors"
                          title="Edit task"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteTask(task)}
                          className="p-1.5 text-[#64748B] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded-md transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        taskToEdit={taskToEdit}
        existingTimes={existingTimes}
        initialTime={initialModalTime}
      />
    </div>
  );
};
