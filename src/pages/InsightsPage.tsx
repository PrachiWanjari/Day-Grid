import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BatteryCharging,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  BarChart3,
  CalendarRange,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTodayDateString } from '../utils/storage';
import { parseDateKey, formatDisplayDate } from '../utils/date';

export const InsightsPage: React.FC = () => {
  const { scheduleTasks, matrixTasks, dailyWins, focusLogs, energyLogs, activityRecords } = useApp();
  const [timeframe, setTimeframe] = useState<'7d' | '30d'>('7d');

  const daysCount = timeframe === '7d' ? 7 : 30;

  // 1. Compute timeframe stats from actual tracked data
  const timeframeStats = useMemo(() => {
    const days: {
      dateStr: string;
      dayLabel: string;
      tasksCount: number;
      completedTasks: number;
      focusMinutes: number;
      totalScore: number;
    }[] = [];

    for (let i = daysCount - 1; i >= 0; i--) {
      const dateStr = getTodayDateString(-i);
      const dateObj = parseDateKey(dateStr);
      const dayLabel =
        timeframe === '7d'
          ? new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj)
          : `${dateObj.getMonth() + 1}/${dateObj.getDate()}`;

      // Tasks for this date
      const dayTasks = scheduleTasks.filter((t) => t.date === dateStr);
      const currentCompletedIds = new Set(dayTasks.filter((t) => t.completed).map((t) => t.id));
      const archivedCompletedIds = new Set(
        activityRecords
          .filter((a) => a.date === dateStr && a.type === 'schedule')
          .map((a) => a.sourceId)
      );
      const completedTasks = new Set([...currentCompletedIds, ...archivedCompletedIds]).size;

      // Focus sessions for this date
      const startOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0).getTime();
      const endOfDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999).getTime();
      const dayFocusLogs = focusLogs.filter(
        (log) => log.timestamp >= startOfDay && log.timestamp <= endOfDay && log.mode === 'focus'
      );
      const focusMinutes = dayFocusLogs.reduce((acc, l) => acc + l.durationMinutes, 0);

      // Score formula
      const totalScore = completedTasks * 10 + focusMinutes;

      days.push({
        dateStr,
        dayLabel,
        tasksCount: Math.max(dayTasks.length, completedTasks),
        completedTasks,
        focusMinutes,
        totalScore,
      });
    }

    return days;
  }, [scheduleTasks, focusLogs, activityRecords, daysCount, timeframe]);

  // Max score for bar chart scaling
  const maxScore = useMemo(() => {
    return Math.max(...timeframeStats.map((d) => d.totalScore), 10);
  }, [timeframeStats]);

  // 2. Compute "Most Productive Day"
  const mostProductiveDay = useMemo(() => {
    let topDay = timeframeStats[0];
    for (const day of timeframeStats) {
      if (day.totalScore > topDay.totalScore) {
        topDay = day;
      }
    }
    const fullDayName = formatDisplayDate(topDay.dateStr, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    return {
      name: fullDayName,
      completedTasks: topDay.completedTasks,
      focusMinutes: topDay.focusMinutes,
      score: topDay.totalScore,
    };
  }, [timeframeStats]);

  // 3. Task Completion Statistics
  const totalScheduleTasks = scheduleTasks.length;
  const completedScheduleTasks = scheduleTasks.filter((t) => t.completed).length;
  const scheduleCompletionRate =
    totalScheduleTasks > 0 ? Math.round((completedScheduleTasks / totalScheduleTasks) * 100) : 0;

  const totalMatrixTasks = matrixTasks.length;
  const completedMatrixTasks = matrixTasks.filter((t) => t.completed).length;
  const matrixCompletionRate =
    totalMatrixTasks > 0 ? Math.round((completedMatrixTasks / totalMatrixTasks) * 100) : 0;

  const totalWins = dailyWins.length;
  const completedWins = dailyWins.filter((w) => w.completed).length;
  const winsCompletionRate =
    totalWins > 0 ? Math.round((completedWins / totalWins) * 100) : 0;

  // 4. Focus Duration Trends
  const totalFocusSessions = focusLogs.filter((l) => l.mode === 'focus').length;
  const totalFocusMinutes = focusLogs
    .filter((l) => l.mode === 'focus')
    .reduce((acc, l) => acc + l.durationMinutes, 0);
  const avgFocusMinutesPerSession =
    totalFocusSessions > 0 ? Math.round(totalFocusMinutes / totalFocusSessions) : 0;

  // 5. Category Balance (Deep Work vs. Quick Wins vs. Wellness)
  const deepWorkCount = scheduleTasks.filter((t) => t.category === 'Deep Work').length;
  const quickWinsCount = scheduleTasks.filter((t) => t.category === 'Quick Wins').length;
  const wellnessCount = scheduleTasks.filter((t) => t.category === 'Wellness').length;

  const deepWorkPct = totalScheduleTasks > 0 ? Math.round((deepWorkCount / totalScheduleTasks) * 100) : 0;
  const quickWinsPct = totalScheduleTasks > 0 ? Math.round((quickWinsCount / totalScheduleTasks) * 100) : 0;
  const wellnessPct = totalScheduleTasks > 0 ? Math.round((wellnessCount / totalScheduleTasks) * 100) : 0;

  // 6. Bio-Energy Stamina Average calculation
  const staminaAverage = useMemo(() => {
    if (energyLogs.length === 0) return 75;
    const scoreMap: Record<string, number> = { Low: 30, Moderate: 60, High: 85, Excellent: 100 };
    const sum = energyLogs.reduce((acc, l) => acc + (scoreMap[l.level] || 75), 0);
    return Math.round(sum / energyLogs.length);
  }, [energyLogs]);

  // Total timeframe focus and tasks
  const timeframeTotalFocusMinutes = useMemo(() => {
    return timeframeStats.reduce((acc, d) => acc + d.focusMinutes, 0);
  }, [timeframeStats]);

  const timeframeTotalTasksDone = useMemo(() => {
    return timeframeStats.reduce((acc, d) => acc + d.completedTasks, 0);
  }, [timeframeStats]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4A7C59] uppercase tracking-wider font-tabular mb-1">
            <BarChart3 className="w-4 h-4 text-[#4A7C59]" />
            <span>Productivity & Stamina Insights</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1C30]">
            Tracked Execution & Stamina
          </h2>
          <p className="font-body text-sm text-[#515F74] mt-1">
            Zero synthetic projections. All metrics derived from your live task blocks, completed goals, focus sprints, and energy logs.
          </p>
        </div>

        {/* Most Productive Day Badge */}
        <div className="p-4 rounded-xl bg-[#E8F3EB] border border-[#A3C9AE] text-left min-w-[220px] space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E5031]">
            <Award className="w-4 h-4 text-[#4A7C59]" />
            <span>Peak Momentum Day</span>
          </div>
          <div className="font-display text-base font-bold text-[#0B1C30]">
            {mostProductiveDay.name}
          </div>
          <div className="text-[11px] font-tabular text-[#316342]">
            {mostProductiveDay.completedTasks} tasks done · {mostProductiveDay.focusMinutes}m focus
          </div>
        </div>
      </div>

      {/* Timeframe Overview Bar Chart (7-Day vs 30-Day Toggle) */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
          <div>
            <h3 className="font-display text-base font-bold text-[#0B1C30]">
              Productivity Momentum ({timeframe === '7d' ? 'Last 7 Days' : 'Last 30 Days'})
            </h3>
            <p className="text-xs text-[#64748B]">
              Composite activity score: completed tasks + tracked focus minutes
            </p>
          </div>

          {/* Timeframe Toggle Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="flex items-center bg-[#F4F6F4] p-1 rounded-lg border border-[#E2E8F0]">
              <button
                onClick={() => setTimeframe('7d')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  timeframe === '7d'
                    ? 'bg-white text-[#0B1C30] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeframe('30d')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  timeframe === '30d'
                    ? 'bg-white text-[#0B1C30] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Period Summary Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#FBFBFA] border border-[#E2E8F0] rounded-lg">
            <span className="text-[11px] text-[#64748B]">Period Tasks Done</span>
            <div className="text-xl font-bold font-tabular text-[#0B1C30]">{timeframeTotalTasksDone}</div>
          </div>
          <div className="p-3 bg-[#FBFBFA] border border-[#E2E8F0] rounded-lg">
            <span className="text-[11px] text-[#64748B]">Period Focus Time</span>
            <div className="text-xl font-bold font-tabular text-[#1E5031]">{timeframeTotalFocusMinutes}m</div>
          </div>
          <div className="p-3 bg-[#FBFBFA] border border-[#E2E8F0] rounded-lg">
            <span className="text-[11px] text-[#64748B]">Daily Focus Avg</span>
            <div className="text-xl font-bold font-tabular text-[#0284C7]">
              {Math.round(timeframeTotalFocusMinutes / daysCount)}m/day
            </div>
          </div>
          <div className="p-3 bg-[#FBFBFA] border border-[#E2E8F0] rounded-lg">
            <span className="text-[11px] text-[#64748B]">Avg Stamina Index</span>
            <div className="text-xl font-bold font-tabular text-[#D97706]">{staminaAverage}%</div>
          </div>
        </div>

        {/* SVG/HTML Bar Chart */}
        <div className="pt-4 pb-2 overflow-x-auto">
          <div
            className={`grid gap-1.5 sm:gap-2.5 items-end h-48 sm:h-56 ${
              timeframe === '7d' ? 'min-w-[320px]' : 'min-w-[720px]'
            }`}
            style={{
              gridTemplateColumns:
                timeframe === '7d'
                  ? 'repeat(7, minmax(0, 1fr))'
                  : 'repeat(30, minmax(0, 1fr))',
            }}
          >
            {timeframeStats.map((day) => {
              const heightPercent = Math.max(10, Math.round((day.totalScore / maxScore) * 100));
              return (
                <div key={day.dateStr} className="flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 px-2 py-1 bg-[#0B1C30] text-white text-[10px] font-tabular rounded shadow-lg pointer-events-none whitespace-nowrap z-10">
                    <div>{day.dateStr}</div>
                    <div>{day.completedTasks} completed</div>
                    <div>{day.focusMinutes}m focus</div>
                  </div>

                  {/* The bar */}
                  <div className="w-full max-w-[40px] bg-[#F1F5F9] rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-[#4A7C59] hover:bg-[#316342] transition-all rounded-t-lg"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <span className="block text-[11px] font-bold text-[#0B1C30] font-tabular truncate">
                      {day.dayLabel}
                    </span>
                    {timeframe === '7d' && (
                      <span className="block text-[10px] text-[#64748B] font-tabular">
                        {day.completedTasks} done
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Task Completion Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Schedule Clearance</span>
            <Calendar className="w-4 h-4 text-[#4A7C59]" />
          </div>
          <div className="font-tabular text-3xl font-bold text-[#0B1C30]">
            {scheduleCompletionRate}%
          </div>
          <p className="text-xs text-[#515F74]">
            {completedScheduleTasks} of {totalScheduleTasks} hourly blocks cleared
          </p>
          <div className="pt-2 w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#4A7C59] rounded-full" style={{ width: `${scheduleCompletionRate}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Priority Matrix Resolution</span>
            <Zap className="w-4 h-4 text-[#B93822]" />
          </div>
          <div className="font-tabular text-3xl font-bold text-[#0B1C30]">
            {matrixCompletionRate}%
          </div>
          <p className="text-xs text-[#515F74]">
            {completedMatrixTasks} of {totalMatrixTasks} matrix items checked off
          </p>
          <div className="pt-2 w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#B93822] rounded-full" style={{ width: `${matrixCompletionRate}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Habit Wins Consistency</span>
            <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="font-tabular text-3xl font-bold text-[#0B1C30]">
            {winsCompletionRate}%
          </div>
          <p className="text-xs text-[#515F74]">
            {completedWins} of {totalWins} daily goals achieved
          </p>
          <div className="pt-2 w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
            <div className="h-full bg-[#0284C7] rounded-full" style={{ width: `${winsCompletionRate}%` }} />
          </div>
        </div>
      </div>

      {/* Focus Duration Trends & Bio-Energy History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Focus Duration Trends */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#D97706]" />
              <h3 className="font-display text-base font-bold text-[#0B1C30]">
                Focus Duration Trends
              </h3>
            </div>
            <span className="text-xs font-bold text-[#4A7C59] font-tabular">
              {totalFocusMinutes} Minutes Total
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0]">
              <div className="text-xs text-[#64748B]">Total Sprints Cleared</div>
              <div className="mt-1 font-tabular text-2xl font-bold text-[#0B1C30]">
                {totalFocusSessions}
              </div>
              <div className="text-[11px] text-[#4A7C59] mt-0.5 font-medium">Logged intervals</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FBFBFA] border border-[#E2E8F0]">
              <div className="text-xs text-[#64748B]">Avg Sprint Length</div>
              <div className="mt-1 font-tabular text-2xl font-bold text-[#0B1C30]">
                {avgFocusMinutesPerSession}m
              </div>
              <div className="text-[11px] text-[#64748B] mt-0.5">Per session</div>
            </div>
          </div>

          {/* Category distribution breakdown */}
          <div className="pt-2 space-y-3">
            <div className="text-xs font-semibold text-[#0B1C30] uppercase font-tabular">
              Category Time Allocation
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-xs text-[#515F74] mb-1">
                  <span>Deep Work ({deepWorkCount}h)</span>
                  <span className="font-tabular font-bold">{deepWorkPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full bg-[#4A7C59] rounded-full" style={{ width: `${deepWorkPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#515F74] mb-1">
                  <span>Quick Wins ({quickWinsCount}h)</span>
                  <span className="font-tabular font-bold">{quickWinsPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full bg-[#0284C7] rounded-full" style={{ width: `${quickWinsPct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-[#515F74] mb-1">
                  <span>Wellness ({wellnessCount}h)</span>
                  <span className="font-tabular font-bold">{wellnessPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full bg-[#059669] rounded-full" style={{ width: `${wellnessPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Level History Log */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2">
              <BatteryCharging className="w-4 h-4 text-[#4A7C59]" />
              <h3 className="font-display text-base font-bold text-[#0B1C30]">
                Bio-Energy Caliber History
              </h3>
            </div>
            <span className="text-xs text-[#64748B] font-tabular">Actual Tracked States</span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {energyLogs.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <BatteryCharging className="w-8 h-8 text-[#A3C9AE] mx-auto" />
                <p className="text-xs text-[#64748B]">
                  No energy logs recorded yet. Log your stamina from the dashboard!
                </p>
              </div>
            ) : (
              energyLogs.map((entry) => {
                const dateFormatted = new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                }).format(new Date(entry.timestamp));

                const badgeColors: Record<string, string> = {
                  Low: 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]',
                  Moderate: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
                  High: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]',
                  Excellent: 'bg-[#E8F3EB] text-[#1E5031] border-[#A3C9AE]',
                };

                return (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FBFBFA] flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border font-tabular ${
                            badgeColors[entry.level] || badgeColors.High
                          }`}
                        >
                          {entry.level} Caliber
                        </span>
                        <span className="text-[11px] font-tabular text-[#64748B]">
                          {dateFormatted}
                        </span>
                      </div>
                      {entry.note && (
                        <p className="text-[#334155] text-xs font-medium italic">
                          "{entry.note}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
