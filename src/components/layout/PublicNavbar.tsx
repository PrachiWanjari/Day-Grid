import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Brand mark */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-[#4A7C59] flex items-center justify-center text-white shadow-sm ring-2 ring-[#D1E7D7]/50 group-hover:bg-[#316342] transition-colors">
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" fillOpacity="0.3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-[#0B1C30]">
                DayGrid
              </span>
            </div>
          </Link>

          {/* Public Nav Links (Smooth Scroll Anchors) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#515F74]">
            <a href="#problem" className="hover:text-[#316342] transition-colors whitespace-nowrap shrink-0">
              The Problem
            </a>
            <a href="#features" className="hover:text-[#316342] transition-colors whitespace-nowrap shrink-0">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#316342] transition-colors whitespace-nowrap shrink-0">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-[#316342] transition-colors whitespace-nowrap shrink-0">
              Benefits
            </a>
          </nav>

          {/* CTA: Get Started */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/app/dashboard"
              className="inline-flex items-center gap-2 px-4.5 py-2 text-sm font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] active:scale-[0.99] rounded-lg transition-all shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A7C59] whitespace-nowrap shrink-0"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
