import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  Settings,
} from 'lucide-react';

export const MobileNavigation: React.FC = () => {
  const ITEMS = [
    { to: '/app/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/app/schedule', label: 'Schedule', icon: Calendar },
    { to: '/app/priorities', label: 'Priorities', icon: Target },
    { to: '/app/focus', label: 'Focus', icon: Flame },
    { to: '/app/wins', label: 'Wins', icon: CheckCircle2 },
    { to: '/app/insights', label: 'Insights', icon: TrendingUp },
    { to: '/app/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] px-1 py-1.5 flex items-center justify-around shadow-lg"
      aria-label="Mobile Navigation"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-[9px] font-medium transition-colors ${
                isActive
                  ? 'text-[#1E5031] font-bold bg-[#E8F3EB]/80 shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0B1C30]'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 mb-0.5" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
