import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Target,
  Flame,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Zap,
  Code2,
  GraduationCap,
  Briefcase,
  Layers,
  BatteryCharging,
  ArrowDown,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-0 text-[#334155]">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-[#E2E8F0] pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Subtle decorative background ambient gradients */}
        <div className="absolute top-0 right-1/4 -z-10 w-[500px] h-[500px] bg-[#E8F3EB]/70 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 -z-10 w-[450px] h-[450px] bg-[#EFF4FF]/60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Brand, Tagline, & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E8F3EB] border border-[#A3C9AE] rounded-full text-xs font-semibold text-[#1E5031]">
                <Sparkles className="w-3.5 h-3.5 text-[#4A7C59]" />
                <span>The Single-Canvas Daily Productivity Operating System</span>
              </div>

              {/* Headline & Tagline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0B1C30] tracking-tight leading-[1.12]">
                Structure your day, <br className="hidden sm:inline" />
                <span className="text-[#316342]">master your momentum.</span>
              </h1>

              {/* Pitch */}
              <p className="font-body text-base sm:text-lg text-[#515F74] max-w-xl leading-relaxed">
                DayGrid unites deliberate time-blocking, Eisenhower priority quadrant mapping,
                Pomodoro sprint rooms, and bio-energy tracking into a calm, focused workspace.
                Eliminate decision fatigue and reclaim your deepest hours.
              </p>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/app/dashboard"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] active:scale-[0.99] rounded-lg shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A7C59]"
                >
                  <span>Get Started — It's Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-[#334155] bg-white hover:bg-[#F8FAF9] active:scale-[0.99] border border-[#CBD5E1] rounded-lg shadow-2xs transition-colors"
                >
                  <span>Explore Features</span>
                  <ArrowDown className="w-4 h-4 text-[#64748B]" />
                </a>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#F1F5F9] grid grid-cols-3 gap-6 max-w-md">
                <div>
                  <div className="text-xl font-bold font-tabular text-[#0B1C30]">100%</div>
                  <div className="text-xs text-[#64748B] mt-0.5">Private & Local-First</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-tabular text-[#0B1C30]">0s</div>
                  <div className="text-xs text-[#64748B] mt-0.5">Instant Access</div>
                </div>
                <div>
                  <div className="text-xl font-bold font-tabular text-[#0B1C30]">24/7</div>
                  <div className="text-xs text-[#64748B] mt-0.5">Distraction-Free</div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity UI Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-2 bg-gradient-to-tr from-[#E8F3EB] via-[#EFF4FF] to-[#DCE9FF]/50 rounded-2xl transform -rotate-1 blur-sm"></div>

                <div className="relative bg-white rounded-xl border border-[#E2E8F0] shadow-md p-6 space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]"></div>
                      <span className="font-display text-sm font-bold text-[#0B1C30]">
                        Today's Agenda & Focus
                      </span>
                    </div>
                    <span className="text-[11px] font-tabular text-[#1E5031] bg-[#E8F3EB] px-2 py-0.5 rounded font-semibold border border-[#A3C9AE]">
                      Active Mode
                    </span>
                  </div>

                  {/* Sample Time-block entries mockup */}
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-lg border border-[#CBD5E1] bg-white text-xs flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-tabular font-bold text-[#4A7C59] shrink-0">09:00</span>
                        <span className="font-medium text-[#0B1C30] truncate">
                          Project Architecture & Core Development
                        </span>
                      </div>
                      <span className="text-[10px] font-tabular px-2 py-0.5 rounded bg-[#E8F3EB] text-[#1E5031] border border-[#A3C9AE] shrink-0">
                        Deep Work
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-[#CBD5E1] bg-white text-xs flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-tabular font-bold text-[#4A7C59] shrink-0">11:00</span>
                        <span className="font-medium text-[#0B1C30] truncate">
                          Complete Milestone Deliverables & Code Review
                        </span>
                      </div>
                      <span className="text-[10px] font-tabular px-2 py-0.5 rounded bg-[#E8F3EB] text-[#1E5031] border border-[#A3C9AE] shrink-0">
                        Deep Work
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FBFBFA] text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-tabular font-bold text-[#059669] shrink-0">12:00</span>
                        <span className="font-medium text-[#334155] truncate">
                          Lunch Break & Mindful Walk
                        </span>
                      </div>
                      <span className="text-[10px] font-tabular px-2 py-0.5 rounded bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] shrink-0">
                        Wellness
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-[#E2E8F0] bg-[#FBFBFA] text-xs flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-tabular font-bold text-[#0284C7] shrink-0">13:00</span>
                        <span className="font-medium text-[#334155] truncate">
                          Triage Messages & Client Sync
                        </span>
                      </div>
                      <span className="text-[10px] font-tabular px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] shrink-0">
                        Quick Wins
                      </span>
                    </div>
                  </div>

                  {/* Mini Focus & Energy Strip */}
                  <div className="p-3 bg-[#F8FAF9] rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#4A7C59]" />
                      <span className="font-tabular font-bold text-[#0B1C30]">25:00</span>
                      <span className="text-[#64748B]">Pomodoro Ready</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-tabular text-[#1E5031]">
                      <BatteryCharging className="w-3.5 h-3.5 text-[#4A7C59]" />
                      <span className="font-semibold">Energy: High</span>
                    </div>
                  </div>

                  {/* Card bottom CTA */}
                  <div className="pt-2 flex items-center justify-between text-xs text-[#515F74]">
                    <span>Local-First Workspace</span>
                    <Link
                      to="/app/dashboard"
                      className="font-semibold text-[#4A7C59] hover:underline flex items-center gap-1"
                    >
                      <span>Open Live Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT INTRODUCTION (THE PRODUCTIVITY PROBLEM DAYGRID SOLVES) */}
      <section id="problem" className="py-20 md:py-24 bg-[#FBFBFA] border-b border-[#E2E8F0] scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <div className="text-xs font-semibold text-[#4A7C59] uppercase tracking-wider font-tabular mb-2">
              The Problem & The Paradigm Shift
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1C30] tracking-tight">
              Why traditional to-do lists keep you overwhelmed and exhausted
            </h2>
            <p className="font-body text-[#515F74] text-base sm:text-lg mt-3 leading-relaxed">
              Modern workers don't suffer from a lack of ambition—they suffer from a lack of spatial boundary. When 40 unstructured obligations live on a flat checklist, cognitive friction turns every minute into hesitation.
            </p>
          </div>

          {/* Problem vs DayGrid Solution Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Breakdown 1 */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#FEF2F2] text-[#B91C1C] flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#0B1C30]">
                  1. The Endless Flat To-Do List
                </h3>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Traditional checklists treat every item identically. Urgent interruptions shout over strategic goals, triggering continuous decision paralysis and shallow busyness.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-xs font-semibold text-[#1E5031] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                <span>DayGrid: Eisenhower Priority Mapping</span>
              </div>
            </div>

            {/* Breakdown 2 */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] text-[#D97706] flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#0B1C30]">
                  2. Severe Time Blindness
                </h3>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Assuming you have 8 hours of pure focus ignores biological reality. Without hour-by-hour boundaries, meetings encroach, lunch is skipped, and afternoon energy collapses.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-xs font-semibold text-[#1E5031] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                <span>DayGrid: Visual Hourly Time-Blocking</span>
              </div>
            </div>

            {/* Breakdown 3 */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#CBD5E1] transition-all">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#0B1C30]">
                  3. Context-Switching Fatigue
                </h3>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Fragmented attention destroys momentum. Jumping between code, email, and chat resets cognitive focus and adds 23 minutes of recovery time per interruption.
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-xs font-semibold text-[#1E5031] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                <span>DayGrid: 25-Min Pomodoro Sprint Rooms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURE OVERVIEW (HIGHLIGHTING 5 KEY FEATURES) */}
      <section id="features" className="py-20 md:py-24 bg-white border-b border-[#E2E8F0] scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-semibold text-[#4A7C59] uppercase tracking-wider font-tabular mb-2">
              Integrated Workspace Suite
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1C30] tracking-tight">
              Five specialized tools for deliberate daily execution
            </h2>
            <p className="font-body text-[#515F74] text-base mt-3">
              Everything works in unison: from macro daily strategy to micro focus sprints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1: Daily Schedule */}
            <div className="bg-[#FBFBFA] rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#4A7C59] transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#4A7C59] group-hover:scale-105 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1C30] group-hover:text-[#316342]">
                    Daily Schedule
                  </h3>
                  <div className="text-xs text-[#4A7C59] font-medium font-tabular mt-0.5">
                    Visual Hour-by-Hour Time-Blocking
                  </div>
                </div>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Allocate your day in intentional hourly slots. Visually tag tasks with categories (Deep Work, Quick Wins, Wellness, Meetings) with collision prevention and rapid inline completion.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                <Link
                  to="/app/schedule"
                  className="text-xs font-bold text-[#4A7C59] group-hover:text-[#316342] inline-flex items-center gap-1"
                >
                  <span>Launch Schedule View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 2: Priority Matrix */}
            <div className="bg-[#FBFBFA] rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#4A7C59] transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#B93822] group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1C30] group-hover:text-[#B93822]">
                    Priority Matrix
                  </h3>
                  <div className="text-xs text-[#B93822] font-medium font-tabular mt-0.5">
                    2×2 Eisenhower Decision Grid
                  </div>
                </div>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Categorize incoming work across urgency and importance: <strong>DO FIRST</strong>, <strong>SCHEDULE</strong>, <strong>DELEGATE</strong>, and <strong>ELIMINATE</strong>. Seamlessly move tasks between quadrants as priorities evolve.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                <Link
                  to="/app/priorities"
                  className="text-xs font-bold text-[#4A7C59] group-hover:text-[#316342] inline-flex items-center gap-1"
                >
                  <span>Launch Priority Matrix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 3: Focus Room */}
            <div className="bg-[#FBFBFA] rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#4A7C59] transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#4A7C59] group-hover:scale-105 transition-transform">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1C30] group-hover:text-[#316342]">
                    Focus Room
                  </h3>
                  <div className="text-xs text-[#4A7C59] font-medium font-tabular mt-0.5">
                    Pomodoro Focus Suite
                  </div>
                </div>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Distraction-free 25-minute sprint intervals with circular visual progress, harmonic Web Audio chimes, and persistent timestamp tracking that remains accurate even across page reloads.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                <Link
                  to="/app/focus"
                  className="text-xs font-bold text-[#4A7C59] group-hover:text-[#316342] inline-flex items-center gap-1"
                >
                  <span>Enter Focus Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 4: Daily Wins */}
            <div className="bg-[#FBFBFA] rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#4A7C59] transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0284C7] group-hover:scale-105 transition-transform">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1C30] group-hover:text-[#0284C7]">
                    Daily Wins
                  </h3>
                  <div className="text-xs text-[#0284C7] font-medium font-tabular mt-0.5">
                    Personal Habit Progress Engine
                  </div>
                </div>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Track vital daily habit anchors (hydration, meditation, reading, movement) with a dynamic progress bar and completion count that reinforces positive dopamine loops.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                <Link
                  to="/app/wins"
                  className="text-xs font-bold text-[#4A7C59] group-hover:text-[#316342] inline-flex items-center gap-1"
                >
                  <span>View Daily Wins</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 5: Productivity Insights */}
            <div className="bg-[#FBFBFA] rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#4A7C59] transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#7C3AED] group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1C30] group-hover:text-[#7C3AED]">
                    Productivity Insights
                  </h3>
                  <div className="text-xs text-[#7C3AED] font-medium font-tabular mt-0.5">
                    Bio-Energy & Execution Analytics
                  </div>
                </div>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Log your real-time bio-energy caliber (Low, Moderate, High, Excellent), analyze your time-budget distribution (Deep Work vs. Admin vs. Wellness), and audit execution balance.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                <Link
                  to="/app/insights"
                  className="text-xs font-bold text-[#4A7C59] group-hover:text-[#316342] inline-flex items-center gap-1"
                >
                  <span>Explore Insights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 6 / Integration: Central Dashboard */}
            <div className="bg-[#FBFBFA] rounded-xl border border-[#E2E8F0] p-7 shadow-xs flex flex-col justify-between hover:border-[#4A7C59] transition-all group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-white border border-[#CBD5E1] flex items-center justify-center text-[#059669] group-hover:scale-105 transition-transform">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#0B1C30] group-hover:text-[#059669]">
                    Executive Dashboard
                  </h3>
                  <div className="text-xs text-[#059669] font-medium font-tabular mt-0.5">
                    All-in-One Command Center
                  </div>
                </div>
                <p className="font-body text-sm text-[#515F74] leading-relaxed">
                  Review today's agenda at a glance: upcoming timeline blocks, urgent matrix actions, quick focus sprint widget, and overall day completion rates.
                </p>
              </div>
              <div className="pt-6 mt-6 border-t border-[#E2E8F0]">
                <Link
                  to="/app/dashboard"
                  className="text-xs font-bold text-[#4A7C59] group-hover:text-[#316342] inline-flex items-center gap-1"
                >
                  <span>Open Executive Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION (THREE SIMPLE STEPS) */}
      <section id="how-it-works" className="py-20 md:py-24 bg-[#FBFBFA] border-b border-[#E2E8F0] scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <div className="text-xs font-semibold text-[#4A7C59] uppercase tracking-wider font-tabular mb-2">
              The Daily Workflow
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1C30] tracking-tight">
              Three simple steps to mindful productivity
            </h2>
            <p className="font-body text-[#515F74] text-base sm:text-lg mt-3 leading-relaxed">
              DayGrid isn't complex software with endless configuration. It's a clean daily ritual designed to be completed in 5 minutes every morning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-xs relative space-y-4">
              <div className="text-3xl font-bold font-tabular text-[#A3C9AE]">
                01
              </div>
              <h3 className="font-display text-xl font-bold text-[#0B1C30]">
                Map Your Priorities
              </h3>
              <p className="font-body text-sm text-[#515F74] leading-relaxed">
                Triage incoming obligations in the Eisenhower matrix. Isolate the 1–2 crucial <strong>DO FIRST</strong> crises and move high-leverage growth tasks into <strong>SCHEDULE</strong> before noise takes over.
              </p>
              <div className="pt-4 text-xs font-tabular text-[#64748B] flex items-center gap-1">
                <span className="font-semibold text-[#316342]">Rule:</span> What is important is seldom urgent.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-xs relative space-y-4">
              <div className="text-3xl font-bold font-tabular text-[#A3C9AE]">
                02
              </div>
              <h3 className="font-display text-xl font-bold text-[#0B1C30]">
                Block Your Hours
              </h3>
              <p className="font-body text-sm text-[#515F74] leading-relaxed">
                Commit each hour to an explicit category. Protect your prime morning cognitive peak for Deep Work, slot administrative items into Quick Wins, and lock in Lunch and walks.
              </p>
              <div className="pt-4 text-xs font-tabular text-[#64748B] flex items-center gap-1">
                <span className="font-semibold text-[#316342]">Rule:</span> What gets scheduled gets executed.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 shadow-xs relative space-y-4">
              <div className="text-3xl font-bold font-tabular text-[#A3C9AE]">
                03
              </div>
              <h3 className="font-display text-xl font-bold text-[#0B1C30]">
                Sprint with Flow
              </h3>
              <p className="font-body text-sm text-[#515F74] leading-relaxed">
                Fire up the Pomodoro Focus Room. Put your phone away, work for 25 uninterrupted minutes, listen for the soothing harmonic chime, and record your bio-energy state.
              </p>
              <div className="pt-4 text-xs font-tabular text-[#64748B] flex items-center gap-1">
                <span className="font-semibold text-[#316342]">Rule:</span> Momentum compounds through small wins.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BENEFITS SECTION (FOR STUDENTS, DEVELOPERS, AND PROFESSIONALS) */}
      <section id="benefits" className="py-20 md:py-24 bg-white border-b border-[#E2E8F0] scroll-mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-xs font-semibold text-[#4A7C59] uppercase tracking-wider font-tabular mb-2">
              Engineered For Deep Craft
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B1C30] tracking-tight">
              Tailored for high-focus knowledge workers
            </h2>
            <p className="font-body text-[#515F74] text-base mt-3">
              Discover how DayGrid adapts to the unique workflows of creators, builders, and scholars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* For Students */}
            <div className="bg-[#FBFBFA] rounded-2xl border border-[#E2E8F0] p-8 shadow-xs space-y-5 hover:border-[#4A7C59] transition-all">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#4A7C59]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[#0B1C30]">
                  For Students & Researchers
                </h3>
                <p className="text-xs text-[#4A7C59] font-medium font-tabular mt-1">
                  Master Coursework Without Cramming
                </p>
              </div>
              <ul className="space-y-3 text-sm text-[#515F74]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
                  <span>Time-block study sessions across dense syllabi.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
                  <span>Use Pomodoro intervals to prevent cognitive burnout.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
                  <span>Differentiate impending assignments from exam prep.</span>
                </li>
              </ul>
            </div>

            {/* For Developers */}
            <div className="bg-[#FBFBFA] rounded-2xl border border-[#E2E8F0] p-8 shadow-xs space-y-5 hover:border-[#4A7C59] transition-all">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#0284C7]">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[#0B1C30]">
                  For Developers & Makers
                </h3>
                <p className="text-xs text-[#0284C7] font-medium font-tabular mt-1">
                  Protect Your Flow State from Noise
                </p>
              </div>
              <ul className="space-y-3 text-sm text-[#515F74]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>Shield 90-minute deep architectural development blocks.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>Triage pull requests, code reviews, and triage into Quick Wins.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>Keep track of bug fixes vs refactoring with Eisenhower quadrants.</span>
                </li>
              </ul>
            </div>

            {/* For Professionals */}
            <div className="bg-[#FBFBFA] rounded-2xl border border-[#E2E8F0] p-8 shadow-xs space-y-5 hover:border-[#4A7C59] transition-all">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#CBD5E1] flex items-center justify-center text-[#B93822]">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[#0B1C30]">
                  For Busy Professionals
                </h3>
                <p className="text-xs text-[#B93822] font-medium font-tabular mt-1">
                  Lead with Intentional Execution
                </p>
              </div>
              <ul className="space-y-3 text-sm text-[#515F74]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B93822] shrink-0 mt-0.5" />
                  <span>Ruthlessly delegate low-leverage administrative busywork.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B93822] shrink-0 mt-0.5" />
                  <span>Enforce realistic daily boundaries between meetings and strategic thought.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B93822] shrink-0 mt-0.5" />
                  <span>End every day with visible accomplishment and calm peace of mind.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FINAL GET STARTED CTA */}
      <section className="py-20 md:py-28 bg-[#FBFBFA]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-10 sm:p-16 shadow-md space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#E8F3EB]/70 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-[#EFF6FF]/70 rounded-full blur-2xl pointer-events-none"></div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#E8F3EB] border border-[#A3C9AE] rounded-full text-xs font-semibold text-[#1E5031]">
              <Sparkles className="w-3.5 h-3.5 text-[#4A7C59]" />
              <span>Free Forever · No Account Required</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#0B1C30] tracking-tight">
              Ready to take control of your day?
            </h2>

            <p className="font-body text-base sm:text-lg text-[#515F74] max-w-xl mx-auto leading-relaxed">
              Experience the clarity of visual time-blocking and Eisenhower decision mapping. All data is securely stored on your local machine.
            </p>

            <div className="pt-2">
              <Link
                to="/app/dashboard"
                className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] active:scale-[0.99] rounded-lg shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A7C59]"
              >
                <span>Get Started — Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B] font-tabular border-t border-[#F1F5F9]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#4A7C59]" />
                <span>Zero Tracking / 100% Private</span>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#4A7C59]" />
                <span>Instant Offline Availability</span>
              </div>
              <span aria-hidden="true">·</span>
              <div>Productive Serenity Design</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
