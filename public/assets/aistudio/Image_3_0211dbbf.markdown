---
name: Productive Serenity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#414942'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#717971'
  outline-variant: '#c1c9bf'
  surface-tint: '#376847'
  primary: '#316342'
  on-primary: '#ffffff'
  primary-container: '#4a7c59'
  on-primary-container: '#e1ffe5'
  inverse-primary: '#9dd3aa'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#465e55'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e776d'
  on-tertiary-container: '#e3fef1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b9efc5'
  primary-fixed-dim: '#9dd3aa'
  on-primary-fixed: '#00210e'
  on-primary-fixed-variant: '#1e5031'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#cde9dc'
  tertiary-fixed-dim: '#b2ccc1'
  on-tertiary-fixed: '#072018'
  on-tertiary-fixed-variant: '#344c43'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.625rem
    fontWeight: '600'
    lineHeight: 2.125rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Arimo
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: 0em
  body-md:
    fontFamily: Arimo
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Arimo
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-md:
    fontFamily: Archivo Narrow
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Archivo Narrow
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.02em
  time-grid:
    fontFamily: Archivo Narrow
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 0.75rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies mindful execution, deliberate pacing, and cognitive clarity. Designed for modern professionals, makers, and deep-focus knowledge workers, the interface rejects high-stress urgency cues in favor of a calm, grounded workspace that reduces decision fatigue and restores attention.

The visual style blends Scandinavian minimalism with high-precision digital craftsmanship:
- **Calm Utility:** Generous negative space and low visual friction allow daily priorities to breathe.
- **Tactile Precision:** Crisp, hairline containment borders paired with subtle surface elevation provide structure without heavy division.
- **Focused Typographic Clarity:** Functional geometric typography ensures dense scheduling grids remain effortless to scan and parse.

## Colors

The palette balances organic botanical greens with structured slate neutrals over a warm, tactile foundation:

- **Primary (`#4A7C59`):** Grounded Sage Green. Used for primary calls-to-action, active task completions, current timeline markers, and focused states. Its deep tone ensures high contrast against light surfaces.
- **Secondary (`#334155`):** Deep Slate Blue-Grey. Delivers high-legibility typography, primary structural headers, and strong navigational anchors.
- **Tertiary (`#8EA89D`):** Desaturated Laurel Green. Drives secondary metric indicators, progress tracking curves, and passive tags.
- **Surface Accents (`#E8F3EB`, `#D1E7D7`):** Mint Cream tints used exclusively for active card selection backgrounds, tag fills, and calm success indicators.
- **Neutrals & Canvas (`#FBFBFA`, `#F4F6F4`, `#E2E8F0`):** Soft, unbleached warm paper tones for page backgrounds, transitioning to crisp slate borders (`#E2E8F0` / `#CBD5E1`) for table grids, time slots, and card boundaries.

## Typography

The type system pairs modern geometric sans-serif shapes with a technical condensed sans engine for tabular time and scheduling components:

- **Primary Headlines (Plus Jakarta Sans):** Offers balanced proportions, crisp apertures, and refined geometry. Large headlines feature tight negative letter-spacing for editorial presence.
- **Primary Body (Arimo):** Provides a clean, highly readable humanistic sans-serif structure that remains open and comfortable for extended task writing and dense document reading.
- **Data, Matrices, and Time Labels (Archivo Narrow):** Applied deliberately to time increments, duration metrics, keyboard shortcut chips, and matrix axes. Its condensed nature optimizes horizontal space in scheduling grids.

## Layout & Spacing

The layout is grounded in a clean 8pt grid with structured subdivisions:

- **Desktop (12-column dynamic grid):** Fixed left navigation rail (64px collapsed, 240px expanded), 1.5rem gutters, and 2rem outer canvas margin. Time matrices reflow into horizontal swimlanes or multi-day columns based on viewport density.
- **Tablet (8-column fluid grid):** Consolidated split-pane interface with drawer navigation and 1rem gutters.
- **Mobile (4-column fluid grid):** 1rem margins with full-width stacked timeline blocks, single-column task stacks, and fixed bottom utility trays.

Vertical rhythm relies on generous breathing room between thematic blocks (`space-xl`), while maintaining tight, predictable clustering within actionable tasks (`space-xs` to `space-sm`).

## Elevation & Depth

Visual hierarchy uses flat layered tonal planes enhanced with hairline boundaries and soft, diffuse ambient shadows:

- **Base Layer (Level 0):** Unbleached warm canvas (`#FBFBFA`).
- **Surface Layer (Level 1):** Solid white card containers (`#FFFFFF`) with a 1px border in `#E2E8F0` and an ultra-soft ambient shadow: `0 1px 3px rgba(51, 65, 85, 0.04), 0 4px 12px rgba(51, 65, 85, 0.02)`.
- **Raised & Active Layer (Level 2):** Hovered tasks, active time blocks, and drag previews: `0 4px 6px -1px rgba(51, 65, 85, 0.06), 0 10px 24px -3px rgba(51, 65, 85, 0.08)` paired with a soft primary accent border (`#A3C9AE`).
- **Overlay & Modal Layer (Level 3):** Dialogs, command palettes, and time-block detail sheets: `0 20px 40px -8px rgba(15, 23, 42, 0.12)` with a tinted backdrop scrim (`#1E293B` at 25% opacity with 4px backdrop blur).

## Shapes

The interface embraces a balanced rounded architecture (Radius Level 2):
- **Base Components (Inputs, Buttons, Cards, Time Cells):** `0.5rem` (8px) radius delivers structured discipline without appearing rigid.
- **Inner Accents & Nested Badges:** `0.25rem` (4px) to `0.375rem` (6px) to maintain proportional harmony within outer cards.
- **Large Panels & Modals:** `1rem` (16px) radius for soft visual containment.
- **Task Status Badges & Pills:** Full-radius capsules for high contrast against structured rectangular grids.

## Components

### Buttons
- **Primary:** Filled in Sage Green (`#4A7C59`), white text, no border. Subtle brightness shift and `scale(0.99)` transform on active press.
- **Secondary:** Surface white background, slate border (`#CBD5E1`), text in `#334155`. Hover shifts to `#F8FAF9` with border darkening to `#94A3B8`.
- **Ghost / Tool:** Transparent background with `#64748B` iconography; fills with `#E8F3EB` and sage text on hover.

### Inputs & Time Selectors
- Hairline border (`#CBD5E1`) over `#FFFFFF` background.
- Focus state activates a 1.5px `#4A7C59` boundary with a soft sage glow ring (`box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.15)`).
- Time selector fields render in `Archivo Narrow` with formatted tab stops.

### Checkboxes & Task Toggles
- Custom rounded squares (6px radius) with `#94A3B8` border.
- Completed state features smooth spring expansion filling with `#4A7C59`, exposing a crisp white checkmark and rendering strikethrough typography on the adjacent task label with 50% opacity.

### Chips & Priority Tags
- Soft capsule pills using Mint Cream fills (`#E8F3EB`) and deep sage text (`#2A4A33`) for routine tasks.
- High-priority indicators use a warm terracotta tint (`#FDF2F0` background, `#B93822` text).

### Cards & Grid Slots
- **Task Cards:** Clean white container, hairline border, subtle left border accent stripe indicating project category or priority.
- **Time Slots:** Light dotted or hairline border dividers (`#F1F5F9`) with monospaced time markers sitting left-aligned. Hovering reveals quick-slot creation prompts in `#E8F3EB`.

### Daily Matrix / Kanban Blocks
- Minimal container borders, muted column headers with task counters rendered in monospaced badge chips, supporting drag-and-drop handles that transition from 0% to 100% opacity on row hover.