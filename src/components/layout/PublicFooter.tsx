import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowRight, ShieldCheck } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-[#E2E8F0] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#F1F5F9]">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#4A7C59] flex items-center justify-center text-white shadow-xs">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.3" />
                </svg>
              </div>
              <span className="font-display font-bold text-[#0B1C30] text-lg">DayGrid</span>
            </div>
            <p className="font-body text-sm text-[#515F74] leading-relaxed">
              Structure your day, master your momentum. Built for students, developers, and professionals who reject cognitive chaos.
            </p>
            <div className="pt-2">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A7C59] hover:text-[#316342] group"
              >
                <span>Launch DayGrid Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1C30] mb-3">
              Platform & Method
            </h4>
            <ul className="space-y-2 text-sm text-[#515F74]">
              <li>
                <a href="#problem" className="hover:text-[#316342] transition-colors">
                  The Productivity Problem
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#316342] transition-colors">
                  Feature Suite
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#316342] transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-[#316342] transition-colors">
                  Benefits & Personas
                </a>
              </li>
            </ul>
          </div>

          {/* Productivity Tools */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1C30] mb-3">
              Application Workspace
            </h4>
            <ul className="space-y-2 text-sm text-[#515F74]">
              <li>
                <Link to="/app/dashboard" className="hover:text-[#316342] transition-colors">
                  Dashboard Overview
                </Link>
              </li>
              <li>
                <Link to="/app/schedule" className="hover:text-[#316342] transition-colors">
                  Daily Schedule
                </Link>
              </li>
              <li>
                <Link to="/app/priorities" className="hover:text-[#316342] transition-colors">
                  Priority Matrix
                </Link>
              </li>
              <li>
                <Link to="/app/focus" className="hover:text-[#316342] transition-colors">
                  Focus Room
                </Link>
              </li>
              <li>
                <Link to="/app/wins" className="hover:text-[#316342] transition-colors">
                  Daily Wins Checklist
                </Link>
              </li>
              <li>
                <Link to="/app/insights" className="hover:text-[#316342] transition-colors">
                  Productivity Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Privacy */}
          <div>
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[#0B1C30] mb-3">
              Private & Local-First
            </h4>
            <p className="text-xs text-[#64748B] leading-relaxed mb-4">
              All tasks, quadrant mapping, and focus logs remain 100% private in your browser's local storage. No remote servers or tracking pixels.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-[#4A7C59] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-tracking guarantee</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>DayGrid — Structure your day, master your momentum.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-[#0B1C30] transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
