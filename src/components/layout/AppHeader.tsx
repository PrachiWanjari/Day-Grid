import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Flame,
  Home,
  ChevronLeft,
  ChevronRight,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate } from '../../utils/date';

export const AppHeader: React.FC = () => {
  const location = useLocation();
  const { pomodoro, selectedDate, goToToday, goToPreviousDay, goToNextDay, settings } = useApp();

  const getPageMeta = (pathname: string) => {
    switch (pathname) {
      case '/app/dashboard':
        return { title: 'Dashboard', subtitle: 'Overview & Daily Momentum' };
      case '/app/schedule':
        return { title: 'Daily Schedule', subtitle: 'Hourly Time-Blocking & Calendar' };
      case '/app/priorities':
        return { title: 'Priority Matrix', subtitle: '2×2 Eisenhower Decision Grid' };
      case '/app/focus':
        return { title: 'Focus Room', subtitle: 'Pomodoro Sprints & Deep Work Sessions' };
      case '/app/wins':
        return { title: 'Daily Wins', subtitle: 'Goal & Habit Milestone Tracker' };
      case '/app/insights':
        return { title: 'Productivity Insights', subtitle: 'Stamina Trends & Weekly Analytics' };
      case '/app/settings':
        return { title: 'Settings & Profile', subtitle: 'Preferences & System Controls' };
      default:
        return { title: 'Workspace', subtitle: 'Productivity Suite' };
    }
  };

  const { title } = getPageMeta(location.pathname);

  const formattedDate = formatDisplayDate(selectedDate, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const profileInitials = settings.profile.name
    ? settings.profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'DG';

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-20 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs & Page Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-[#64748B] font-tabular">
            <Link to="/app/dashboard" className="hover:text-[#0B1C30] transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>DayGrid</span>
            </Link>
            <span aria-hidden="true" className="text-[#CBD5E1]">/</span>
            <span className="text-[#334155] font-semibold">{title}</span>
          </div>
          <h1 className="font-display text-lg font-bold text-[#0B1C30] tracking-tight truncate mt-0.5">
            {title}
          </h1>
        </div>

        {/* Right: Date Navigation, Focus Pill, & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Date Stepper (Syncs with Schedule & Dashboard) */}
          <div className="flex items-center bg-[#FBFBFA] border border-[#E2E8F0] rounded-lg p-0.5 text-xs font-tabular">
            <button
              onClick={goToPreviousDay}
              className="p-1 hover:bg-white text-[#64748B] hover:text-[#0B1C30] rounded transition-colors focus-visible:ring-1 focus-visible:ring-[#4A7C59] focus-visible:outline-none cursor-pointer"
              title="Previous Day"
              aria-label="Previous Day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={goToToday}
              className="px-2 py-0.5 font-bold text-[#0B1C30] hover:text-[#316342] transition-colors flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-[#4A7C59] focus-visible:outline-none cursor-pointer"
              title="Jump to Today"
              aria-label="Jump to Today"
            >
              <CalendarIcon className="w-3 h-3 text-[#4A7C59]" />
              <span className="truncate max-w-[80px] sm:max-w-none">{formattedDate}</span>
            </button>
            <button
              onClick={goToNextDay}
              className="p-1 hover:bg-white text-[#64748B] hover:text-[#0B1C30] rounded transition-colors focus-visible:ring-1 focus-visible:ring-[#4A7C59] focus-visible:outline-none cursor-pointer"
              title="Next Day"
              aria-label="Next Day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Pomodoro pill */}
          <Link
            to="/app/focus"
            className={`hidden xs:flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-tabular transition-all focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none ${
              pomodoro.isRunning
                ? 'bg-[#E8F3EB] border-[#A3C9AE] text-[#1E5031] ring-1 ring-[#4A7C59]/20'
                : 'bg-[#F8FAF9] border-[#E2E8F0] text-[#515F74] hover:border-[#CBD5E1]'
            }`}
            title="Open Focus Room"
            aria-label={`Open Focus Room, ${Math.floor(pomodoro.remainingSeconds / 60)} minutes remaining`}
          >
            <Flame className={`w-3.5 h-3.5 shrink-0 ${pomodoro.isRunning ? 'text-[#4A7C59] animate-pulse' : 'text-[#64748B]'}`} />
            <span className="font-bold">
              {Math.floor(pomodoro.remainingSeconds / 60)}:
              {(pomodoro.remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </Link>

          {/* User Profile Avatar Link */}
          <Link
            to="/app/settings"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-tabular shadow-2xs hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none shrink-0"
            style={{ backgroundColor: settings.profile.avatarColor || '#4A7C59' }}
            title="Settings & Profile"
            aria-label="User profile and settings"
          >
            {profileInitials}
          </Link>
        </div>
      </div>
    </header>
  );
};
