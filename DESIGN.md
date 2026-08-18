---
name: SaaS SalesGenie AI
description: Autonomous B2B SaaS CRM & Predictive Lead Intelligence Platform
colors:
  primary: "#465fff"
  primary-hover: "#384dec"
  primary-deep: "#273185"
  accent-cyan: "#06b6d4"
  accent-sky: "#38bdf8"
  success: "#12b76a"
  warning: "#f79009"
  error: "#f04438"
  neutral-bg: "#f2f4f7"
  neutral-card: "#ffffff"
  neutral-dark-bg: "#0b1329"
  neutral-dark-card: "#111c38"
  text-main: "#101828"
  text-muted: "#475467"
  text-dim: "#98a2b3"
  text-dark-main: "#f8fafc"
  border-subtle: "#eaecf0"
  border-dark-subtle: "rgba(255, 255, 255, 0.08)"
typography:
  display:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.35
  body:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "9px 18px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "9px 18px"
  button-secondary:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.md}"
    padding: "9px 18px"
  button-cyan:
    backgroundColor: "{colors.accent-cyan}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "9px 18px"
  card:
    backgroundColor: "{colors.neutral-card}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.neutral-card}"
    textColor: "{colors.text-main}"
    rounded: "{rounded.md}"
    padding: "10px 14px"
  badge:
    rounded: "{rounded.full}"
    padding: "3px 10px"
---

# Design System: SaaS SalesGenie AI

## Overview

**Creative North Star: "The Intelligent Revenue Cockpit"**

SaaS SalesGenie AI is designed as a precision instrumentation cockpit for high-velocity B2B SaaS revenue teams. The visual language blends analytical clarity with deep volumetric dimension and glass surfaces. High-density metrics, real-time ML intent scoring, and dynamic outreach workflows are rendered with absolute structural hierarchy, ensuring that critical pipeline decisions can be made in sub-second glances.

The interface maintains a tailored dual-theme architecture: in Light Mode, crisp porcelain white surfaces (`#ffffff`) float on a soft slate ground (`#f2f4f7`); in Dark Mode, translucent midnight cards (`rgba(255, 255, 255, 0.03)` on `#0b1329`) are framed by specular hairline borders (`rgba(255, 255, 255, 0.08)` to `0.22`), accented by electric indigo (`#465fff`) and aurora cyan (`#06b6d4`).

**Key Characteristics:**
- Deep dimension and glass surface styling with specular hairline borders.
- TailAdmin signature electric indigo primary brand and aurora cyan AI intelligence accents.
- High-contrast dual-mode parity across Light and Dark themes.
- Clear numeric typography pairing geometric Outfit headings with monospace JetBrains Mono telemetry.

## Colors

The palette balances deep midnight foundations with luminous electric indigo and aurora cyan telemetry signals.

### Primary
- **TailAdmin Electric Indigo** (`#465fff`): The core brand anchor, used for primary calls-to-action, active navigation states, selected tabs, and high-confidence ML highlights.
- **Deep Indigo Hover** (`#384dec`): Interactive hover state for primary triggers.
- **Midnight Brand Anchor** (`#273185`): Low-level brand grounding.

### Secondary
- **Aurora Cyan** (`#06b6d4`): Reserved for AI generative actions, NVIDIA NIM outreach synthesis, and meeting intelligence recording states.
- **Electric Sky** (`#38bdf8`): Subtle secondary highlights and informative badge text in dark mode.

### Neutral
- **Light Slate Canvas** (`#f2f4f7`): Base application background for Light Mode.
- **Midnight Abyssal Canvas** (`#0b1329`): Base application background for Dark Mode.
- **Porcelain Card Surface** (`#ffffff`): Light mode container card fill.
- **Translucent Obsidian Card Surface** (`rgba(255, 255, 255, 0.03)` / `#111c38`): Dark mode glass card fill.
- **Hairline Border Subtle** (`#eaecf0` / `rgba(255, 255, 255, 0.08)`): Primary surface boundaries and table dividers.
- **Deep Slate Text** (`#101828`): High-contrast primary reading text in light mode.
- **Pure Frosted Text** (`#f8fafc` / `rgba(255, 255, 255, 0.94)`): High-contrast primary reading text in dark mode.
- **Muted Steel Text** (`#475467` / `#94a3b8`): Secondary labels, timestamps, and column descriptions.

### Status & Semantics
- **Emerald Growth** (`#12b76a` / `#34d399`): Qualified leads, closed won deals, positive sentiment, and healthy pipeline stages.
- **Amber Caution** (`#f79009` / `#fbbf24`): Warm leads, pending tasks, and moderate follow-up urgency.
- **Hot Coral Rose** (`#f04438` / `#f87171`): Critical urgency items, hot intent leads ($\ge 80$), and deal loss signals.

### Named Rules
**The Glass Depth Hierarchy Rule.** Translucent glass surfaces require hairline specular borders (`rgba(255, 255, 255, 0.08)` to `0.14`) to preserve structural edge contrast without heavy opaque fills.

**The Intent Rarity Rule.** Vivid electric indigo and aurora cyan accents are reserved for active intelligence, actionable triggers, and state badges (≤15% total visual footprint per screen).

## Typography

**Display Font:** Outfit (fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
**Body Font:** Outfit
**Mono / Telemetry Font:** JetBrains Mono (fallback: `monospace`)

**Character:** Geometric, modern, and highly legible with tight letter-spacing for large numerical KPIs, paired with monospaced precision for tabular deal values and inference latencies.

### Hierarchy
- **Display / Title XXL** (800 weight, `2.25rem` / `36px`, `1.15` line-height, `-0.02em` letter-spacing): Primary page titles and hero ARR metrics.
- **Headline / Title XL** (700 weight, `1.75rem` / `28px`, `1.25` line-height, `-0.02em` letter-spacing): Section headers and KPI values.
- **Title / Title MD** (700 weight, `1.25rem` / `20px`, `1.35` line-height): Card headers, drawer titles, and modal headers.
- **Body / Theme SM** (400/500 weight, `0.875rem` / `14px`, `1.5` line-height): Standard descriptive copy, table cells, and form inputs.
- **Label / Theme XS** (600/700 weight, `0.75rem` / `12px`, `1.4` line-height, `0.05em` letter-spacing, uppercase): Status badges, table column headers, and metric sub-labels.

### Named Rules
**The Numeric Scannability Rule.** All financial amounts ($ARR/ACV) and ML percentage scores must use high-contrast text weights (600–800) with tabular number alignment.

## Layout

The spatial model uses an asymmetric dashboard layout optimized for wide monitors (1366px–1920px) with responsive collapse down to mobile viewports.

- **Sidebar Navigation:** Sticky fixed 280px sidebar collapsible to 84px icon-only rail.
- **Top Navigation Bar:** Sticky 72px header with 16px backdrop blur filter (`backdrop-filter: blur(16px)`).
- **Page Container:** Max-width 1680px with fluid padding (`24px 32px 48px` on desktop, `20px 16px 36px` on mobile).
- **Grid Layouts:**
  - Executive Analytics: 2-column split (`1.8fr` chart to `1.2fr` priority triage).
  - Lead Intelligence: 2-column split (`1.45fr` table to `1.1fr` intent inspector).
  - Kanban Pipeline: 5-column CSS grid (`minmax(0, 1fr)` per deal stage).
  - Meeting & Outreach: Split-screen workflow grids with live interaction panels.

## Elevation & Depth

Surfaces combine glass translucency, specular border reflections, and soft volumetric shadow tokens.

### Shadow Vocabulary
- **Subtle Surface** (`box-shadow: 0 1px 2px 0 rgba(16, 24, 40, 0.05)`): Low-elevation controls, dropdowns, and unselected chips.
- **Theme Card Shadow (Light)** (`box-shadow: 0px 1px 3px 0px rgba(16, 24, 40, 0.1), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)`): Default card elevation in Light Mode.
- **Theme Card Shadow (Dark)** (`box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.4)`): Volumetric depth for dark glass containers.
- **Luminous Indigo Glow** (`box-shadow: 0 0 25px -5px rgba(70, 95, 255, 0.2)`): Active AI generation cards, critical urgency alerts, and focused interaction targets.

### Named Rules
**The Flat-Rest Ambient-Active Rule.** Container cards remain flat at rest with hairline borders. Volumetric glow and border illumination appear strictly in response to user focus, hover, or active background ML processing.

## Shapes

- **Form Language:** Clean geometric rectangles softened by generous modern curvature.
- **Corner Radius Scale:**
  - Buttons & Inputs: `8px` (`--radius-md`)
  - Badges & Pills: `9999px` (`--radius-full`)
  - Cards & Modals: `16px` (`--radius-xl`)
  - Outer Containers: `20px` (`--radius-2xl`)
- **Borders:** Consistent 1px solid hairline borders across cards, tables, and inputs (`#eaecf0` in Light, `rgba(255, 255, 255, 0.08)` in Dark).

## Components

### Buttons
- **Primary:** Electric Indigo (`#465fff`), white text, 8px radius, `9px 18px` padding, 600 weight.
- **Hover / Active:** Deep Indigo (`#384dec`) with subtle shadow expansion (`0 4px 12px rgba(70, 95, 255, 0.4)`).
- **Secondary:** Card surface background, 1px border (`#d0d5dd`), dark text.
- **AI Action (Cyan):** Cyan gradient (`linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)`), white text.

### Badges & Status Pills
- **Shape:** Full pill radius (`9999px`), `3px 10px` padding, `0.75rem` font size, 600 weight.
- **Semantic Variants:**
  - Hot Lead / Critical: `#fef3f2` background with `#f04438` text (Dark: `rgba(239, 68, 68, 0.14)` with `#f87171`).
  - Qualified / Cyan: `#f0f9ff` background with `#0ba5ec` text (Dark: `rgba(6, 182, 212, 0.14)` with `#38bdf8`).
  - Closed Won / Success: `#ecfdf3` background with `#12b76a` text (Dark: `rgba(16, 185, 129, 0.14)` with `#34d399`).

### Cards / Containers
- **Corner Style:** `16px` radius (`--radius-xl`).
- **Background:** Solid white (`#ffffff`) in Light Mode; translucent glass (`rgba(255, 255, 255, 0.03)`) in Dark Mode.
- **Border:** 1px hairline border with hover transition to `--border-medium`.
- **Internal Padding:** `24px` standard, `16px` compact.

### Inputs & Select Fields
- **Style:** 1px border (`#d0d5dd`), `8px` radius, `10px 14px` padding, Outfit 14px text.
- **Focus State:** Electric Indigo border (`#465fff`) with 3px focus ring (`box-shadow: 0 0 0 3px rgba(70, 95, 255, 0.15)`).

### Data Tables
- **Header:** Sticky top header with subtle gray background (`#f9fafb`), 12px uppercase label styling with 0.05em tracking.
- **Row Hover:** Subtle indigo tint (`rgba(70, 95, 255, 0.03)`).
- **Cell Spacing:** `16px 20px` standard padding with tabular number alignment.

### Signature Component: Pulse Telemetry Indicator
- **Style:** `8px` circular indicator with infinite multi-stage ripple animation (`animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`) indicating live real-time ML inference and audio transcription activity.

## Do's and Don'ts

### Do:
- **Do** maintain strict visual parity and WCAG 2.1 AA contrast ratios across both Light and Dark themes.
- **Do** frame dark mode glass surfaces with 1px specular borders (`rgba(255, 255, 255, 0.08)`) to preserve card boundaries.
- **Do** format financial amounts and conversion metrics with `Outfit` 700+ weights and JetBrains Mono code tags.
- **Do** provide instant visual feedback on interactive AI triggers (audio recording mic pulses, generating spinners).

### Don't:
- **Don't** use opaque muddy black `#000000` backgrounds in dark mode; use rich midnight navy `#0b1329`.
- **Don't** flood entire cards with saturated primary colors; keep vibrant indigo and cyan restricted to ≤15% of screen area.
- **Don't** use heavy drop shadows without specular border definition on translucent card containers.
- **Don't** omit units, timeframes, or trend indicators on executive KPI metric cards.
