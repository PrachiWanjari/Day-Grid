import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  Settings,
  ArrowLeft,
  BatteryCharging,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AppSidebar: React.FC = () => {
  const { scheduleTasks, selectedDate, pomodoro, currentEnergy, settings } = useApp();

  const todayTasks = scheduleTasks.filter((t) => t.date === selectedDate);
  const completedToday = todayTasks.filter((t) => t.completed).length;

  const NAV_ITEMS = [
    { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/schedule', label: 'Daily Schedule', icon: Calendar },
    { to: '/app/priorities', label: 'Priority Matrix', icon: Target },
    { to: '/app/focus', label: 'Focus Room', icon: Flame },
    { to: '/app/wins', label: 'Daily Wins', icon: CheckCircle2 },
    { to: '/app/insights', label: 'Productivity Insights', icon: TrendingUp },
    { to: '/app/settings', label: 'Settings & Profile', icon: Settings },
  ];

  const profileInitials = settings.profile.name
    ? settings.profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'DG';

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#E2E8F0] h-screen sticky top-0 shrink-0 z-30 select-none">
      {/* Brand & Logo Header */}
      <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
        <Link to="/app/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[#4A7C59] flex items-center justify-center text-white shadow-xs group-hover:bg-[#316342] transition-colors">
            <svg className="w-4.5 h-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.3" />
            </svg>
          </div>
          <div>
            <div className="font-display font-bold text-base text-[#0B1C30]">DayGrid</div>
            <div className="text-[11px] text-[#64748B] font-tabular">Productivity App</div>
          </div>
        </Link>

        <Link
          to="/"
          className="p-1.5 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#F8FAF9] rounded-md transition-colors"
          title="Back to Landing Page"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* User Profile Mini Card in Sidebar */}
      <div className="px-4 py-3 mx-3 my-2 bg-[#FBFBFA] rounded-xl border border-[#E2E8F0] flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-tabular shadow-2xs"
          style={{ backgroundColor: settings.profile.avatarColor || '#4A7C59' }}
        >
          {profileInitials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold text-[#0B1C30] truncate">{settings.profile.name}</div>
          <div className="text-[10px] text-[#64748B] truncate">{settings.profile.title}</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-1 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] font-tabular">
          Core Workspaces
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[#4A7C59] focus-visible:outline-none ${
                  isActive
                    ? 'bg-[#E8F3EB] text-[#1E5031] font-bold border-l-3 border-[#4A7C59] pl-2.5 shadow-2xs'
                    : 'text-[#515F74] hover:bg-[#F8FAF9] hover:text-[#0B1C30]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Mini Persistent Widget in Sidebar Footer */}
      <div className="p-4 border-t border-[#F1F5F9] space-y-3 bg-[#FBFBFA]">
        {/* Pomodoro mini status */}
        <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase font-tabular flex items-center gap-1">
              <Flame className="w-3 h-3 text-[#4A7C59]" />
              Focus Room
            </span>
            <span
              className={`text-[10px] font-tabular font-bold px-1.5 py-0.5 rounded ${
                pomodoro.isRunning ? 'bg-[#E8F3EB] text-[#1E5031]' : 'bg-[#F1F5F9] text-[#64748B]'
              }`}
            >
              {pomodoro.isRunning ? 'Focusing' : 'Paused'}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-tabular font-bold text-sm text-[#0B1C30]">
              {Math.floor(pomodoro.remainingSeconds / 60)}:
              {(pomodoro.remainingSeconds % 60).toString().padStart(2, '0')}
            </span>
            <Link to="/app/focus" className="text-[11px] text-[#4A7C59] hover:underline font-semibold">
              Open Room &rarr;
            </Link>
          </div>
        </div>

        {/* Current Bio Energy & Schedule quick metrics */}
        <div className="flex items-center justify-between text-[11px] text-[#64748B] px-1 font-tabular">
          <span className="flex items-center gap-1">
            <BatteryCharging className="w-3.5 h-3.5 text-[#4A7C59]" />
            <span>Energy: {currentEnergy.level}</span>
          </span>
          <span>{completedToday}/{todayTasks.length} Done</span>
        </div>
      </div>
    </aside>
  );
};
