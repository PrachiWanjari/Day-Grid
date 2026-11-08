# DayGrid – Smart Task & Daily Productivity Tracker

> Structure your day, master your momentum. An intentional, privacy-first daily productivity suite featuring hourly time-blocking, Eisenhower priority matrix, Pomodoro focus sprints with synthesized Web Audio acoustic cues, daily habit wins tracker, bio-energy logger, and multi-day productivity analytics.

---

## 1. Project Overview

DayGrid is an executive-caliber, web-based daily productivity operating system designed for professionals, engineers, and students who value intentional focus over reactive multitasking. It bridges strategic task prioritization with tactical execution, ensuring daily habits and deep work schedules reflect long-term leverage.

### Key Visual & Architectural Identity
- **Design Language**: Thoughtfully tailored around calming, high-contrast, low-cognitive-load aesthetics:
  - **Soft Sage Green** (`#4A7C59` / `#E8F3EB`)
  - **Slate Blue-Grey** (`#334155` / `#0B1C30`)
  - **Warm Off-White** (`#FBFBFA`)
  - **Accent Status Hues** (`#B93822` Red for Do-First Crises, `#0284C7` Sky Blue for Wins, `#D97706` Amber for Meetings)
- **Zero-Latency Client-Side Architecture**: Operates 100% in the user's browser with no mandatory external cloud accounts or tracking pixels.

---

## 2. Technology Stack

- **Core Framework**: React 19 (SPA with Hooks, Context API)
- **Language**: TypeScript 5.8+ (Strict Type-Checking, zero compilation warnings)
- **Bundler & Build Tool**: Vite 8.3 (with Rollup manual chunk optimization)
- **Styling & Design System**: Tailwind CSS v4 (Modern CSS theme variables, zero arbitrary class pollution)
- **Icons**: Lucide React
- **Audio Synthesis**: Native Web Audio API (`AudioContext`, Oscillator nodes, Gain envelopes — zero external mp3/wav audio asset dependencies)
- **Routing**: React Router DOM v7 (Client-side routing with nested layout architecture, persistent navigation, and branded 404 page)
- **Deployment Platform**: Vercel / Netlify / GitHub Pages (Static SPA Output)

---

## 3. Core Features

### 1. Landing Page (`/`)
- Public showcase featuring brand identity, problem statement, core capability breakdown, 3-step workflow, user persona highlights, and instant navigation into the app.

### 2. Executive Dashboard (`/app/dashboard`)
- 4-KPI real-time metric strip (Schedule Completion, Active Crises, Daily Wins, Focused Minutes).
- Upcoming chronological time-blocks with instant completion toggles.
- Priority preview from the Eisenhower Matrix.
- Bio-Energy Logger for cognitive stamina check-ins.
- Focus Room Quick-Launch timer widget.

### 3. Daily Schedule (`/app/schedule`)
- Hourly time-blocking calendar with Day and 7-Day Week swimlane views.
- Conflict detection and warning alerts preventing double-booking.
- Category tagging (`Deep Work`, `Quick Wins`, `Wellness`, `Meeting`, `Personal`).
- Timezone-safe date navigation stepper (`<`, `Today`, `>`) and direct date picker.
- Working hour window compliance indicators.

### 4. 2×2 Priority Matrix (`/app/priorities`)
- Eisenhower Decision Framework:
  1. **DO FIRST** (Urgent & Important)
  2. **SCHEDULE** (Important, Not Urgent)
  3. **DELEGATE** (Urgent, Not Important)
  4. **ELIMINATE** (Neither Urgent nor Important)
- Dynamic task counters, quadrant re-assignment, quick-schedule bridge into today's calendar, and duplicate prevention.

### 5. Focus Room (`/app/focus`)
- Timestamp-anchored Pomodoro timer (`Deep Focus`, `Short Break`, `Long Break`).
- Continuous background sync resilient to tab switches, browser throttling, and page refreshes.
- Dual-Mode Synthesized Web Audio alerts (Task & Win Chimes, Focus Completion Bells).
- Single-task intention binding and filterable historical session logs.

### 6. Daily Wins (`/app/wins`)
- Micro-accomplishment checklist building stacking daily consistency.
- Multi-day historical records, progress percentage visualizer, and confetti completion banner.
- One-click roll-forward feature to copy unfinished goals from yesterday.

### 7. Productivity Insights (`/app/insights`)
- 7-Day and 30-Day productivity score trend charts.
- Hourly time allocation distributions and cognitive stamina correlations.
- Most Productive Day calculations derived strictly from genuine logged activity.

### 8. Settings & Profile (`/app/settings`)
- Profile preferences, working window configurations, and custom avatar customization (Hue family selector with 3-tier light/medium/dark swatches + color picker).
- Synthesized Web Audio Sound Suite with master volume slider and instant sound testing.
- JSON backup export and schema-validated restore.
- **100% Clean Canvas by Default**: New users arrive at an empty personal planner with no placeholder tasks. Sample demo routines can be loaded on-demand anytime.
- Factory reset and clean workspace wipe with confirmation safeguards.

---

## 4. Installation & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or later (v20+ recommended)
- **Package Manager**: npm, yarn, or pnpm

### Step-by-Step Setup
```bash
# 1. Clone the repository
git clone https://github.com/your-username/daygrid.git
cd daygrid

# 2. Install dependencies
npm install

# 3. Start development server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 5. Production Build

To compile and bundle DayGrid for high-performance production hosting:

```bash
# Run TypeScript type check and Vite production build
npm run build
```

The compiled static assets will be output to the `dist/` directory:
- `dist/index.html`: Optimized HTML entry point.
- `dist/assets/index-*.css`: Purged, minified Tailwind CSS.
- `dist/assets/vendor-react-*.js`: Code-split React runtime.
- `dist/assets/index-*.js`: DayGrid application bundle.

### Local Production Preview
To test the built production bundle locally using Vite's built-in preview server:
```bash
npm run preview
```

---

## 6. Deployment Instructions

### Option A: Deploy to Vercel (Recommended)
DayGrid includes a pre-configured `vercel.json` with SPA routing rewrites and asset cache headers.

#### Method 1: Deploy via Vercel Git Integration (Simplest)
1. Push your DayGrid project to a GitHub, GitLab, or Bitbucket repository.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your DayGrid repository.
4. Vercel automatically detects Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **"Deploy"**. Your application will be live in under a minute with HTTPS and edge routing.

#### Method 2: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Log in and deploy from project root
vercel

# Deploy directly to production
vercel --prod
```

### Option B: Deploy to Netlify
1. Create a `_redirects` file in the `public/` directory with the following line:
   ```
   /*    /index.html   200
   ```
2. Run `npm run build` and link your repository to Netlify with `dist` as the Publish directory.

---

## 7. Data Storage & Privacy Architecture

### Client-Side LocalStorage Architecture
All tasks, priority matrices, focus records, bio-energy entries, habit wins, and user preferences are saved strictly in the user's browser via the HTML5 `localStorage` API under the `daygrid_*` keys.

### Privacy & Data Ownership
- **No External Tracking**: No telemetry, analytics pixels, or third-party tracking scripts.
- **Offline Capable**: Functions seamlessly without active internet access once loaded.
- **Portability**: Users can export their entire workspace as an encrypted/clean JSON backup file at any time from **Settings & Profile** and import it into any other browser.

### Known Architectural Limitations
1. **Single-Device / Single-Browser Scope**: Because data is stored in the browser's local sandbox, data does **not** automatically sync across different browsers or physical devices (e.g., between a desktop browser and a mobile smartphone).
2. **Cache Clearing**: Clearing browser site data or cookies for the hosting domain will reset the workspace to default sample data unless a JSON backup has been exported. Users are encouraged to utilize the **Download JSON Backup** button in Settings periodically.

---

## 8. License

Licensed under the Apache-2.0 License.
