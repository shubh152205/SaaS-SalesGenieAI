# Design — SaaS AI Powered Sales Intelligence Forecasting

**Version:** 1.0.0  
**Scope:** Visual identity, design system tokens, component patterns, and interaction guidelines.

---

## 1. Brand Identity

### Platform Name
**SaaS AI Powered Sales Intelligence Forecasting**  
Short name for UI: **SalesGenie AI**  
Badge: `SaaS` (electric indigo pill, top-left of full logo lockup)

### Brand Voice
- **Professional but not sterile.** Enterprise-grade precision without corporate coldness.
- **Data-confident.** Every element should feel backed by intelligence, not guesswork.
- **Velocity-oriented.** The platform communicates urgency and momentum, not patience.

### Core Brand Values
1. **Autonomous Intelligence** — the system acts, recommends, and predicts without manual input.
2. **Revenue Clarity** — every pixel should reduce cognitive load for a sales rep in a high-pressure environment.
3. **Precision Signal** — no vanity metrics; only decision-driving data surfaces.

---

## 2. Color System

### Brand Primaries

| Token | Light Mode Value | Dark Mode Value | Usage |
|:---|:---|:---|:---|
| `--brand-primary` | `#465fff` | `#465fff` | Buttons, active states, focus rings, CTAs |
| `--brand-secondary` | `#6172f3` | `#6172f3` | Hover states, secondary actions |
| `--brand-accent-cyan` | `#06b6d4` | `#38bdf8` | AI-action buttons, live pulse indicators |
| `--brand-accent-amber` | `#f79009` | `#fbbf24` | Warm lead badges, warning states |

### Surface Palette

| Token | Light Mode | Dark Mode |
|:---|:---|:---|
| `--bg-primary` | `#f9fafb` | `#0b1329` |
| `--bg-surface` | `#ffffff` | `rgba(255,255,255,0.03)` |
| `--bg-elevated` | `#f2f4f7` | `rgba(255,255,255,0.06)` |
| `--border-subtle` | `#eaecf0` | `rgba(255,255,255,0.08)` |
| `--border-medium` | `#d0d5dd` | `rgba(255,255,255,0.15)` |

### Text Palette

| Token | Light Mode | Dark Mode |
|:---|:---|:---|
| `--text-primary` | `#101828` | `#f2f4f7` |
| `--text-secondary` | `#475467` | `#98a2b3` |
| `--text-tertiary` | `#667085` | `#667085` |
| `--text-inverse` | `#ffffff` | `#0b1329` |

### Semantic Status Colors

| Semantic | Background (Light) | Text (Light) | Background (Dark) | Text (Dark) |
|:---|:---|:---|:---|:---|
| Hot Lead / Critical | `#fef3f2` | `#f04438` | `rgba(239,68,68,0.14)` | `#f87171` |
| Qualified / Info | `#f0f9ff` | `#0ba5ec` | `rgba(6,182,212,0.14)` | `#38bdf8` |
| Closed Won / Success | `#ecfdf3` | `#12b76a` | `rgba(16,185,129,0.14)` | `#34d399` |
| Warm / Warning | `#fffaeb` | `#b54708` | `rgba(251,191,36,0.14)` | `#fbbf24` |
| Cold / Neutral | `#f8f9fa` | `#667085` | `rgba(152,162,179,0.14)` | `#98a2b3` |

---

## 3. Typography System

### Font Stack

```css
/* Primary UI Font — headings, body, labels, buttons */
font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Data & Metrics Font — scores, ARR values, timestamps, code */
font-family: 'JetBrains Mono', 'Courier New', monospace;

/* Editorial Accent — marketing/presentation context only */
font-family: 'Instrument Serif', Georgia, serif;
```

### Type Scale

| Role | Font | Weight | Size | Line Height |
|:---|:---|:---|:---|:---|
| Page Title | Outfit | 700 | `1.75rem` | `1.2` |
| Section Heading | Outfit | 600 | `1.25rem` | `1.3` |
| Card Title | Outfit | 600 | `1rem` | `1.4` |
| Body | Outfit | 400 | `0.875rem` | `1.6` |
| Small Label | Outfit | 500 | `0.75rem` | `1.4` |
| Micro Label | Outfit | 600 | `0.625rem` | `1.2` (ALL CAPS, 0.08em tracking) |
| KPI Metric | JetBrains Mono | 700 | `2rem` | `1.0` |
| Score Badge | Outfit | 700 | `0.875rem` | `1` |
| Table Header | Outfit | 600 | `0.75rem` | `1.2` (ALL CAPS) |

---

## 4. Spacing System

```css
--space-xs:   4px
--space-sm:   8px
--space-md:   12px
--space-lg:   16px
--space-xl:   20px
--space-2xl:  24px
--space-3xl:  32px
--space-4xl:  48px
--space-5xl:  64px
```

| Component | Padding |
|:---|:---|
| Card (standard) | `24px` |
| Card (compact) | `16px` |
| Button (primary) | `9px 18px` |
| Table cell | `16px 20px` |
| Input field | `10px 14px` |
| Page container | `24px` (horizontal) |

---

## 5. Shape System

```css
--radius-sm:   4px   /* Micro elements, tooltips */
--radius-md:   8px   /* Buttons, inputs, form fields */
--radius-lg:   12px  /* Small cards */
--radius-xl:   16px  /* Standard cards, modals */
--radius-2xl:  20px  /* Outer containers, panels */
--radius-full: 9999px /* Pills, badges, status dots */
```

---

## 6. Elevation & Shadow System

```css
/* Light Mode Shadows */
--shadow-xs:   0 1px 2px rgba(16,24,40,0.05);
--shadow-sm:   0 1px 3px rgba(16,24,40,0.1), 0 1px 2px rgba(16,24,40,0.06);
--shadow-md:   0 4px 8px rgba(16,24,40,0.08), 0 2px 4px rgba(16,24,40,0.06);
--shadow-lg:   0 12px 32px rgba(16,24,40,0.12), 0 4px 8px rgba(16,24,40,0.08);

/* Brand Glow (AI-action elements) */
--shadow-brand: 0 4px 12px rgba(70,95,255,0.35);
--shadow-cyan:  0 4px 12px rgba(6,182,212,0.35);

/* Dark Mode: reduce shadow opacity, add specular border instead */
/* Always pair dark-mode cards with: border: 1px solid rgba(255,255,255,0.08) */
```

---

## 7. Component Specifications

### 7.1 Buttons

```
Primary (Brand):
  background: #465fff
  color: #ffffff
  border-radius: 8px
  padding: 9px 18px
  font: Outfit 600 0.875rem
  hover: background #384dec + box-shadow: 0 4px 12px rgba(70,95,255,0.4)
  active: scale(0.97)

Secondary:
  background: var(--bg-surface)
  border: 1px solid var(--border-medium)
  color: var(--text-primary)
  hover: background var(--bg-elevated)

AI Action (Cyan):
  background: linear-gradient(135deg, #06b6d4, #0891b2)
  color: #ffffff
  box-shadow: 0 4px 12px rgba(6,182,212,0.3)

Danger:
  background: #fef3f2
  border: 1px solid #fecdca
  color: #f04438
```

### 7.2 Badges & Status Pills

```
Structure: border-radius 9999px · padding 3px 10px · font Outfit 600 0.75rem

Hot Lead:     bg #fef3f2,  text #f04438  (dark: bg rgba(239,68,68,0.14),  text #f87171)
Qualified:    bg #f0f9ff,  text #0ba5ec  (dark: bg rgba(6,182,212,0.14),  text #38bdf8)
Warm:         bg #fffaeb,  text #b54708  (dark: bg rgba(251,191,36,0.14), text #fbbf24)
Cold:         bg #f8f9fa,  text #667085  (dark: bg rgba(152,162,179,0.14),text #98a2b3)
Closed Won:   bg #ecfdf3,  text #12b76a  (dark: bg rgba(16,185,129,0.14), text #34d399)
```

### 7.3 Cards

```
Light Mode:
  background: #ffffff
  border: 1px solid #eaecf0
  border-radius: 16px
  padding: 24px
  box-shadow: 0 1px 3px rgba(16,24,40,0.1)
  hover: box-shadow 0 4px 12px rgba(16,24,40,0.1)

Dark Mode:
  background: rgba(255,255,255,0.03)
  border: 1px solid rgba(255,255,255,0.08)
  border-radius: 16px
  padding: 24px
  backdrop-filter: blur(8px)
  hover: border-color rgba(255,255,255,0.15)
```

### 7.4 Data Tables

```
Header row:
  background: var(--bg-elevated)
  font: Outfit 600 0.75rem UPPERCASE
  letter-spacing: 0.05em
  color: var(--text-secondary)
  sticky top: 0
  border-bottom: 2px solid var(--border-subtle)

Body rows:
  padding: 16px 20px
  border-bottom: 1px solid var(--border-subtle)
  hover: background rgba(70,95,255,0.03)
  transition: background 150ms ease

Numeric cells:
  font-family: JetBrains Mono
  text-align: right
```

### 7.5 Inputs & Form Fields

```
border: 1px solid var(--border-medium)
border-radius: 8px
padding: 10px 14px
font: Outfit 400 0.875rem
background: var(--bg-surface)
color: var(--text-primary)
placeholder: var(--text-tertiary)

focus:
  border-color: #465fff
  box-shadow: 0 0 0 3px rgba(70,95,255,0.15)
  outline: none

error:
  border-color: #f04438
  box-shadow: 0 0 0 3px rgba(240,68,56,0.15)
```

### 7.6 Signature Component: Pulse Telemetry Indicator

Used for: live ML inference active, audio recording in progress, model training.

```css
.pulse-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #465fff; /* or #06b6d4 for STT */
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(70,95,255,0.5); }
  50%       { opacity: 0.7; transform: scale(1.1); box-shadow: 0 0 0 6px rgba(70,95,255,0); }
}
```

---

## 8. Page Layout System

### 8.1 Shell Layout

```
┌───────────────────────────────────────────────────────────┐
│  NAVBAR  (height: 60px, sticky top, backdrop-blur: 12px)  │
├──────────────┬────────────────────────────────────────────┤
│   SIDEBAR    │  PAGE CONTENT                              │
│  (width:     │  (padding: 24px, max-width flexible)       │
│   240px,     │                                            │
│   fixed)     │  ┌─────────────────────────────────────┐  │
│              │  │  PAGE HEADER (title + subtitle)     │  │
│  Nav items   │  └─────────────────────────────────────┘  │
│  + brand     │  ┌─────────────────────────────────────┐  │
│  logo        │  │  CONTENT AREA (cards, tables, etc.) │  │
│  + status    │  └─────────────────────────────────────┘  │
│  indicators  │                                            │
└──────────────┴────────────────────────────────────────────┘
```

### 8.2 KPI Card Grid

```css
/* 3-column on desktop, 2-column on tablet, 1-column on mobile */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 20px;
```

### 8.3 Kanban Board

```css
/* 5 equal columns, horizontal scroll on mobile */
display: grid;
grid-template-columns: repeat(5, minmax(220px, 1fr));
gap: 16px;
overflow-x: auto;
```

---

## 9. Animation & Interaction Guidelines

### Motion Principles
- **Purpose over decoration:** Every animation must communicate state change, not just look beautiful.
- **Sub-200ms for feedback:** Interactive responses (button press, hover, focus) must feel instant.
- **Sub-400ms for transitions:** Page and panel transitions must feel fast, not cinematic.

### Easing Functions
```css
--ease-out:  cubic-bezier(0.0, 0.0, 0.2, 1)   /* Most transitions */
--ease-in:   cubic-bezier(0.4, 0.0, 1, 1)      /* Exit animations */
--ease-both: cubic-bezier(0.4, 0.0, 0.2, 1)   /* Bidirectional */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) /* Drag drop snap */
```

### Standard Transition Durations
| Interaction | Duration |
|:---|:---|
| Button hover | `150ms` |
| Input focus ring | `150ms` |
| Card hover elevation | `200ms` |
| Modal appear | `250ms` |
| Page fade | `300ms` |
| Sidebar collapse | `300ms` |
| Pulse telemetry | `2000ms infinite` |

---

## 10. Do's and Don'ts

### ✅ Do
- Use CSS custom property tokens for every color value — no raw hex in components.
- Use `JetBrains Mono` for all financial metrics, scores, durations, and code-adjacent values.
- Add a live pulse indicator on every async AI operation (transcription, NIM generation, ML scoring).
- Maintain WCAG 2.1 AA contrast ratios across both Light and Dark modes.
- Use 1px specular borders (`rgba(255,255,255,0.08)`) on all dark mode glass cards to define edges.

### ❌ Don't
- Don't use `#000000` for dark mode backgrounds — use `#0b1329` (midnight navy).
- Don't flood >15% of any screen with saturated brand indigo — reserve it for CTAs and active states only.
- Don't use generic gray spinners — use the branded pulse telemetry indicator for AI-active states.
- Don't omit timeframes or trend deltas on KPI metric cards — raw numbers without context violate the "precision signal" brand principle.
- Don't use opaque drop shadows without a complementary specular border on translucent dark surfaces.
- Don't use Instrument Serif outside of marketing/presentation context — it's not a UI font.
