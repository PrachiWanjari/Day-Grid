import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, LayoutDashboard, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-between text-[#334155] font-body">
      {/* Top Simple Brand Bar */}
      <header className="px-6 py-4 border-b border-[#E2E8F0] bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#4A7C59] flex items-center justify-center text-white font-bold font-display shadow-2xs group-hover:bg-[#316342] transition-colors">
              DG
            </div>
            <span className="font-display font-bold text-lg text-[#0B1C30]">DayGrid</span>
          </Link>
          <Link
            to="/app/dashboard"
            className="text-xs font-semibold text-[#4A7C59] hover:text-[#316342] transition-colors flex items-center gap-1"
          >
            <span>Open Dashboard</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Hero */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F3EB] border border-[#A3C9AE] text-[#4A7C59] flex items-center justify-center mx-auto shadow-2xs">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold text-[#4A7C59] uppercase tracking-wider font-tabular">
              404 – Page Not Found
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1C30]">
              Lost in the Schedule?
            </h1>
            <p className="text-sm text-[#515F74] leading-relaxed">
              The page you are looking for doesn't exist, has been moved, or the link may be broken. Let's get you back to your productive flow.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/app/dashboard"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors active:scale-[0.99] cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F8FAF9] rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#64748B]" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-[#E2E8F0] text-center text-xs text-[#94A3B8] font-tabular">
        DayGrid &copy; {new Date().getFullYear()} – Intentional Daily Productivity
      </footer>
    </div>
  );
};
