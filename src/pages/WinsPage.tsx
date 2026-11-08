import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Trophy,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Copy,
  Calendar,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDisplayDate } from '../utils/date';

export const WinsPage: React.FC = () => {
  const {
    dailyWins,
    toggleWin,
    addWin,
    deleteWin,
    copyYesterdayWins,
    selectedDate,
    setSelectedDate,
    goToToday,
    goToPreviousDay,
    goToNextDay,
    openConfirmModal,
  } = useApp();

  const [newWinTitle, setNewWinTitle] = useState('');

  // Filter wins by currently selected date
  const dateWins = useMemo(() => {
    return dailyWins.filter((w) => (w.date || selectedDate) === selectedDate);
  }, [dailyWins, selectedDate]);

  // Separate pending and completed for this date
  const pendingWins = useMemo(() => dateWins.filter((w) => !w.completed), [dateWins]);
  const completedWins = useMemo(() => dateWins.filter((w) => w.completed), [dateWins]);

  const totalCount = dateWins.length;
  const completedCount = completedWins.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWinTitle.trim()) return;
    addWin(newWinTitle.trim(), selectedDate);
    setNewWinTitle('');
  };

  const handleDeleteWithConfirm = (winId: string, winTitle: string) => {
    openConfirmModal({
      title: 'Delete Goal?',
      message: `Are you sure you want to delete "${winTitle}" from ${selectedDate}?`,
      confirmText: 'Delete Goal',
      isDestructive: true,
      onConfirm: () => deleteWin(winId),
    });
  };

  const formattedHeaderDate = useMemo(() => {
    return formatDisplayDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Date Navigation Stepper Bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-[#FBFBFA] border border-[#CBD5E1] rounded-lg p-0.5">
            <button
              onClick={goToPreviousDay}
              className="p-1.5 hover:bg-white text-[#515F74] hover:text-[#0B1C30] rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
              aria-label="Previous Day"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-xs font-bold text-[#0B1C30] hover:text-[#316342] font-tabular transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded-md"
              aria-label="Jump to Today"
              title="Jump to Today"
            >
              Today
            </button>
            <button
              onClick={goToNextDay}
              className="p-1.5 hover:bg-white text-[#515F74] hover:text-[#0B1C30] rounded-md transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
              aria-label="Next Day"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              aria-label="Filter goals by date"
              value={selectedDate}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] font-tabular focus:outline-none focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15"
            />
            <span className="text-xs font-semibold text-[#515F74]">
              {formattedHeaderDate}
            </span>
          </div>
        </div>

        {/* Copy yesterday's goals into today */}
        <button
          onClick={() => copyYesterdayWins()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A7C59] bg-[#E8F3EB] hover:bg-[#D1E7D7] border border-[#A3C9AE] rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          title="Roll forward unfinished goals from yesterday into today"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Yesterday's Unfinished Goals</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0284C7] uppercase tracking-wider font-tabular">
            <Trophy className="w-4 h-4 text-[#0284C7]" />
            <span>Habit & Micro-Accomplishment Engine</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1C30]">
            Daily Wins Checklist
          </h2>
          <p className="font-body text-sm text-[#515F74] max-w-lg">
            Track small, deliberate victories. Momentum is built by stacking quiet daily consistency rather than sporadic heroics.
          </p>
        </div>

        {/* Progress Badge */}
        <div className="bg-[#F8FAF9] p-4 rounded-xl border border-[#E2E8F0] text-center min-w-[150px]">
          <div className="font-tabular text-3xl font-bold text-[#0B1C30]">
            {completedCount}/{totalCount}
          </div>
          <div className="text-xs font-semibold text-[#4A7C59] mt-0.5 font-tabular">
            {progressPct}% Completed
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-[#515F74]">
          <span className="font-medium">Goal Completion on {selectedDate}</span>
          <span className="font-tabular font-bold text-[#0B1C30]">{progressPct}%</span>
        </div>
        <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4A7C59] transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {progressPct === 100 && totalCount > 0 && (
          <div className="mt-2 p-2.5 bg-[#E8F3EB] border border-[#A3C9AE] rounded-lg text-xs font-bold text-[#1E5031] flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#4A7C59]" />
            <span>All daily goals achieved on this date! Outstanding execution.</span>
          </div>
        )}
      </div>

      {/* Add New Goal Form */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs">
        <form onSubmit={handleAdd} className="flex items-center gap-3">
          <input
            type="text"
            value={newWinTitle}
            onChange={(e) => setNewWinTitle(e.target.value)}
            placeholder={`Add a daily goal for ${selectedDate} (e.g. 2L water, 30m reading, inbox zero)...`}
            className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15"
          />
          <button
            type="submit"
            disabled={!newWinTitle.trim()}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </form>
      </div>

      {/* Separated Sections: 1. Pending Goals */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <h3 className="font-display text-base font-bold text-[#0B1C30] flex items-center gap-2">
            <span>Pending Goals</span>
            <span className="text-xs font-tabular font-semibold px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E40AF]">
              {pendingWins.length}
            </span>
          </h3>
          <span className="text-xs text-[#64748B]">Click to check off</span>
        </div>

        {pendingWins.length === 0 ? (
          <p className="text-xs text-[#64748B] py-4 text-center">
            {totalCount === 0
              ? `No goals scheduled for ${selectedDate}. Add one above or copy yesterday's goals!`
              : 'All goals completed for this date! Outstanding effort.'}
          </p>
        ) : (
          <div className="space-y-2">
            {pendingWins.map((win) => (
              <div
                key={win.id}
                className="group p-3.5 rounded-lg border border-[#CBD5E1] bg-white text-sm flex items-center justify-between gap-3 hover:border-[#4A7C59] transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleWin(win.id)}
                    className="text-[#94A3B8] hover:text-[#4A7C59] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded"
                    aria-label={`Mark "${win.title}" complete`}
                    title="Mark complete"
                  >
                    <Circle className="w-5 h-5" />
                  </button>
                  <span className="font-medium text-[#0B1C30] truncate">
                    {win.title}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteWithConfirm(win.id, win.title)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-[#94A3B8] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded transition-all shrink-0 cursor-pointer focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
                  aria-label={`Delete goal "${win.title}"`}
                  title="Delete goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Separated Sections: 2. Completed Wins */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <h3 className="font-display text-base font-bold text-[#0B1C30] flex items-center gap-2">
            <span>Completed Wins</span>
            <span className="text-xs font-tabular font-semibold px-2 py-0.5 rounded bg-[#E8F3EB] text-[#1E5031]">
              {completedWins.length}
            </span>
          </h3>
          <span className="text-xs text-[#64748B]">Victories recorded</span>
        </div>

        {completedWins.length === 0 ? (
          <p className="text-xs text-[#64748B] py-4 text-center">
            No completed goals yet for {selectedDate}. Check off pending goals above to celebrate progress!
          </p>
        ) : (
          <div className="space-y-2">
            {completedWins.map((win) => (
              <div
                key={win.id}
                className="group p-3.5 rounded-lg border border-[#E2E8F0] bg-[#FBFBFA] text-sm flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleWin(win.id)}
                    className="text-[#4A7C59] shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded"
                    aria-label={`Mark "${win.title}" incomplete`}
                    title="Mark incomplete"
                  >
                    <CheckCircle2 className="w-5 h-5 fill-[#E8F3EB]" />
                  </button>
                  <span className="line-through text-[#64748B] truncate">
                    {win.title}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteWithConfirm(win.id, win.title)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-[#94A3B8] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded transition-all shrink-0 cursor-pointer focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
                  aria-label={`Delete goal "${win.title}"`}
                  title="Delete goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
