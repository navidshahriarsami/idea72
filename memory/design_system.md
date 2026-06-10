---
name: design-system
description: PathwayAU design system — colors, typography, spacing, component rules, and core screen wireframes. Generated with ui-ux-pro-max skill (gov/SaaS reasoning).
metadata:
  type: project
---

# PathwayAU — Design System & Wireframes
*Generated: 2026-06-10 | Source: ui-ux-pro-max skill (--design-system, government/SaaS reasoning)*

## DESIGN DIRECTION

Two source patterns blended: **Government/Public Service** (trust, accessibility, WCAG AAA) +
**SaaS dashboard** (data-dense, comparison tables, select/swap/lock interactions). Audience is
622,000+ international students — many on mobile, many ESL — so clarity and accessibility
outrank visual flair.

**Style:** Accessible & Ethical (WCAG AAA) — high contrast, large text, keyboard nav, semantic
color, no decorative motion.

**Anti-patterns to avoid:** ornate design, low contrast, AI purple/pink gradients, emoji-as-icons,
heavy animation, glassmorphism on data tables.

---

## COLOR SYSTEM (Government/Public Service palette)

| Role | Hex | Usage |
|---|---|---|
| Primary | `#0F172A` | Headers, primary buttons, nav |
| On Primary | `#FFFFFF` | Text/icons on primary |
| Secondary | `#334155` | Secondary text, sub-headers |
| Accent / CTA | `#0369A1` | Links, primary CTAs, active states, "VERIFIED" badges |
| Background | `#F8FAFC` | Page background |
| Foreground | `#020617` | Body text |
| Card | `#FFFFFF` | Cards, panels, tables |
| Muted | `#E8ECF1` | Disabled fields, subtle dividers |
| Muted Foreground | `#64748B` | Secondary/meta text, timestamps, citations |
| Border | `#E2E8F0` | Card borders, table borders |
| Destructive | `#DC2626` | Errors, "blocked/expired" states, visa expiry alerts |
| Success | `#059669` | "Verified", "On track", eligible |
| Warning | `#D97706` | Staleness 🟠 tier, action-needed banners |

**Semantic tokens only** — never raw hex in components. Map to CSS variables / Tailwind theme.

**Trust badge colors** (Module 9 — every fact gets one):
- 🟢 Live API verified → `--color-success`
- 🟡 Recent snapshot (PDF, <45 days) → `--color-accent`
- 🟠 Stale (45–90 days) → `--color-warning`
- 🔴 Expired / re-verify required → `--color-destructive`

---

## TYPOGRAPHY

**Heading:** Poppins (geometric, modern, friendly — feels less "legal/intimidating" than serif
options, important for a stressed student audience)
**Body:** Open Sans (excellent readability at small sizes, ESL-friendly, wide language support)

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
```

**Type scale:** 12 / 14 / 16 / 18 / 24 / 32 / 40px
- Body: 16px / line-height 1.5, Open Sans 400
- Labels/meta: 14px, Open Sans 500
- Card titles: 18px, Poppins 600
- Section headers: 24px, Poppins 600
- Page titles: 32px, Poppins 700
- Hero: 40px, Poppins 700

---

## SPACING & LAYOUT

- 8px spacing rhythm (8/16/24/32/48)
- Breakpoints: 375 / 768 / 1024 / 1440
- Container max-width: 1280px (7xl) on desktop
- Mobile-first; bottom nav (≤5 items) on mobile, left sidebar on ≥1024px (adaptive nav)
- Touch targets ≥44×44px, 8px+ spacing between
- Sticky bottom CTA bar on mobile for primary actions (e.g. "Continue", "Lock Pathway")

---

## ICONS

Lucide icon set (SVG, consistent stroke width 1.5–2px). No emojis as functional icons —
the 🟢🟡🟠🔴 staleness badges in Module 13 docs are placeholders; in UI these become
colored dot/icon + text label (e.g. `<CheckCircle color="success"/> Verified 2 days ago`).

---

## NAVIGATION STRUCTURE

```
Desktop (≥1024px) — Left Sidebar             Mobile (<1024px) — Bottom Nav (5 max)
┌─────────────┬──────────────────┐           ┌──────────────────────────┐
│ PathwayAU   │                  │           │                           │
│             │                  │           │      [page content]      │
│ ⊙ Dashboard │   Page Content   │           │                           │
│ 🛂 My Visa   │                  │           ├──────────────────────────┤
│ 🎯 Pathways │                  │           │ Home  Visa  Path  Pts  Me │
│ 📊 Points   │                  │           └──────────────────────────┘
│ 📄 Documents│                  │
│ ⚙ Settings  │                  │
└─────────────┴──────────────────┘
```

Active item: filled icon + accent-colored left border + bold label (`nav-state-active`).
Sidebar collapses to icon-only on tablet (768–1024px) with tooltips.

---

## SCREEN 1 — LANDING PAGE (logged out)

Pattern: Hero + Trust signals + How it works + CTA (SaaS "Hero + Features + CTA", adapted with
gov trust signals per Accessible & Ethical style).

```
┌────────────────────────────────────────────────────────────────┐
│ PathwayAU            Home  How it works  Sources    [Get Started]│
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Your PR pathway, built from official Australian              │
│   government data — refreshed every 5 minutes.                 │
│                                                                  │
│   For all 622,000+ international students.                     │
│                                                                  │
│   [ Start My PR Journey → ]   [ See live data sources ]         │
│                                                                  │
│   ─────────────────────────────────────────────────────────    │
│   Trust strip:                                                  │
│   ✓ Home Affairs   ✓ ABS   ✓ data.gov.au   ✓ JSA   ✓ TGA       │
│   "Every fact cited with source + timestamp"                    │
├────────────────────────────────────────────────────────────────┤
│  HOW IT WORKS                                                   │
│  ① Verify your visa (myVEVO)  → ② See your pathways            │
│  → ③ Compare & lock a plan → ④ Track milestones live            │
├────────────────────────────────────────────────────────────────┤
│  LIVE DATA TICKER (auto-refresh)                                │
│  "189 invitation round: 4 Jun 2026 — 10,000 invited"            │
│  "Last sync: ABS Labour Force — 2 min ago"                      │
├────────────────────────────────────────────────────────────────┤
│  [ Start My PR Journey → ]                       Footer: gov    │
│                                                   source links   │
└────────────────────────────────────────────────────────────────┘
```

---

## SCREEN 2 — ONBOARDING / MODULE 13 (myVEVO Verification)

Pattern: single-column wizard, progressive disclosure (`progressive-disclosure`,
`multi-step-progress`), autosave (`form-autosave`).

```
┌────────────────────────────────────────────────────────────────┐
│ ← Back              Step 1 of 3 ●○○                              │
├────────────────────────────────────────────────────────────────┤
│  Verify your visa                                               │
│  We use your official myVEVO record — no manual entry of visa  │
│  details needed.                                                │
│                                                                  │
│  ┌──────────────────────────────────────────┐                  │
│  │   📄  Drag & drop your myVEVO PDF here     │                 │
│  │       or [ Browse files ]                  │                 │
│  └──────────────────────────────────────────┘                  │
│                                                                  │
│  Don't have one? [ Open myVEVO app → ]  (opens Home Affairs)    │
│                                                                  │
│  ℹ️ Your visa data is stored encrypted. We never see your       │
│     passport number in plain text.                              │
│                                                                  │
│                                          [ Continue → ]         │
└────────────────────────────────────────────────────────────────┘

After upload — confirmation card:
┌────────────────────────────────────────────────────────────────┐
│  ✓ VISA VERIFIED              Source: Home Affairs (myVEVO)     │
│                                Verified: 10 Jun 2026             │
│                                                                  │
│  Subclass 500 — Student Visa            Status: GRANTED         │
│  Expires: 31 Dec 2026 (204 days)                                │
│                                                                  │
│  📚 Study Rights: UNLIMITED                                      │
│  💼 Work Rights: LIMITED — 48 hrs/fortnight in session           │
│                                                                  │
│  [ Looks good — Continue → ]   [ Re-upload ]                    │
└────────────────────────────────────────────────────────────────┘

Step 2: Contact & Study details (course, institution, dates, postcode)
Step 3: Consent checkboxes → [ Create my account ]
```

---

## SCREEN 3 — DASHBOARD (Home, post-verification)

Pattern: Executive Dashboard / Data-Dense, but simplified — students need 1 clear "what's next"
action plus status overview, not an analytics wall.

```
┌──────────┬─────────────────────────────────────────────────────┐
│ PathwayAU│  Welcome back, Navid                                 │
│          │                                                       │
│ ⊙ Dashboard│ ┌─────────────────────────────────────────────────┐│
│ 🛂 My Visa │ │ 🛂 VISA STATUS          🟡 Verified 14 days ago  ││
│ 🎯 Pathways│ │ Subclass 500 · Expires in 204 days                ││
│ 📊 Points  │ │ [ Re-verify with myVEVO ]                          ││
│ 📄 Documents│ └─────────────────────────────────────────────────┘│
│ ⚙ Settings │                                                       │
│            │ ┌─────────────────────┬─────────────────────────────┐│
│            │ │ 🎯 LOCKED PATHWAY    │ 📊 YOUR POINTS              ││
│            │ │ 189 — Software       │ 75 / 65 needed (current)    ││
│            │ │ Engineer (261313)    │ [ View breakdown → ]         ││
│            │ │ No shortage — verify │                              ││
│            │ │ skills assessment    │                              ││
│            │ │ [ View roadmap → ]   │                              ││
│            │ └─────────────────────┴─────────────────────────────┘│
│            │                                                       │
│            │ ⚠️ NEXT ACTION                                        │
│            │ Your skills assessment (ACS) hasn't started.         │
│            │ Recommended start: now (45–90 day processing)        │
│            │ [ Start ACS application → ]                          │
│            │                                                       │
│            │ LIVE UPDATES                                          │
│            │ • SkillSelect 189 round — 4 Jun 2026 — Source: HA     │
│            │ • ABS Labour Force data — synced 5 min ago            │
└──────────┴─────────────────────────────────────────────────────┘
```

---

## SCREEN 4 — PATHWAYS / COURSE-TO-PR MATCHMAKING (Module 12: Select / Swap / Lock)

Pattern: Comparison table (Analytics Dashboard "Comparative" pattern), with persistent
select/swap/lock controls — this is the platform's signature interaction.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Your Pathways                          [ Run new assessment ]           │
├────────────────────────────────────────────────────────────────────────┤
│ Filter: [ All visas ▾ ] [ All states ▾ ] [ Sort: PR probability ▾ ]      │
├──────────────┬─────────────┬─────────────┬─────────────┬───────────────┤
│              │ 189 Skilled │ 190 NSW     │ 491 Regional│               │
│              │ Independent │ Nominated   │ WA          │               │
├──────────────┼─────────────┼─────────────┼─────────────┼───────────────┤
│ PR Probability│ 🟢 78%      │ 🟢 85%      │ 🟡 60%      │               │
│ Your points   │ 75 (need 65)│ 80 (need 65)│ 70 (need 65)│               │
│ Min. invited  │ 85          │ Open        │ Open        │               │
│ Processing    │ ~12 months  │ ~9 months   │ ~6 months   │               │
│ Occupation    │ 🟢 No shortage│ 🟢 No shortage│🟢 No shortage│            │
│ Source        │ HA SkillSelect, ABS, JSA — synced 2 min ago             │
├──────────────┼─────────────┼─────────────┼─────────────┼───────────────┤
│              │ [ SELECT ]  │ [ SELECT ]  │ [ SELECT ]  │               │
│              │ ✓ SELECTED  │ [ SWAP ]    │ [ SWAP ]    │               │
│              │ [ LOCK 🔒 ] │             │             │               │
└──────────────┴─────────────┴─────────────┴─────────────┴───────────────┘

On mobile: cards stack vertically, comparison becomes a horizontally
swipeable carousel (one pathway per card, swipe to compare — `gesture-alternative`
also provides arrow buttons).

Locked state:
┌────────────────────────────────────────────────────────────────┐
│ 🔒 LOCKED: 189 — Software Engineer (261313)                     │
│ Roadmap generated below. [ Unlock & change ]                    │
└────────────────────────────────────────────────────────────────┘
```

---

## SCREEN 5 — POINTS CALCULATOR (Module 8)

Pattern: Form with live-updating summary (sticky on desktop, collapsible drawer on mobile).

```
┌─────────────────────────────────┬────────────────────────────────┐
│ Points Calculator                │  YOUR SCORE          (sticky)  │
│                                   │  ┌────────────────────────────┐│
│ Age                               │  │        75 points            ││
│ ○ 18–24  ● 25–32  ○ 33–39  ...   │  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░  75/100 ││
│                                   │  │  Need 65+ for 189            ││
│ English                           │  │  ✓ Eligible — 78% probability││
│ ○ Competent  ● Proficient ○ Sup. │  └────────────────────────────┘│
│                                   │                                  │
│ Skilled employment (overseas)     │  Breakdown:                     │
│ [ 3–5 years ▾ ]                   │  Age            30               │
│                                   │  English         10               │
│ Education                         │  Employment       5               │
│ ● Bachelor (15)  ○ Masters (10)   │  Education       15               │
│                                   │  Aus. study       5               │
│ Australian study requirement      │  PY                5               │
│ ☑ Met (+5)                         │  NAATI             5               │
│                                   │  Regional study     0               │
│ Professional Year                 │                                  │
│ ☐ Completed (+5)                   │  Source: immi.homeaffairs.gov.au │
│                                   │  points table — synced today      │
│ [ ... more fields, progressive ]  │                                  │
└─────────────────────────────────┴────────────────────────────────┘

Mobile: score summary becomes a collapsed sticky bar at top
("75 pts · 78% eligible ▾") that expands to the breakdown on tap.
```

---

## SHARED COMPONENT PATTERNS

**Trust/Citation footer** (Module 9 — appears on every data card):
```
┌────────────────────────────────────────────┐
│ [card content]                              │
│ ──────────────────────────────────────────  │
│ Source: Home Affairs SkillSelect            │
│ Fetched: 10 Jun 2026, 14:32 AEST  🟢 Live    │
└────────────────────────────────────────────┘
```

**Staleness banner** (Module 13, shown when verification_source = VEVO_PDF and aging):
```
┌────────────────────────────────────────────┐
│ 🟠 Your visa data is 52 days old.            │
│    Please re-verify to keep your roadmap    │
│    accurate.        [ Re-verify now → ]      │
└────────────────────────────────────────────┘
```

**Empty/loading states**: skeleton shimmer for cards/tables while live data refreshes
(`progressive-loading`), never a blank table — always "Fetching latest from Home Affairs..."

---

## ACCESSIBILITY CHECKLIST (apply to every screen above)

- [ ] 4.5:1 text contrast (verify navy-on-white and white-on-navy combos)
- [ ] All icon-only buttons have aria-labels (e.g. re-verify, swap, lock)
- [ ] Comparison table has a non-color way to show shortage status (icon + text, not just green/red)
- [ ] Multi-step onboarding has visible progress + back navigation
- [ ] Sticky bottom CTA on mobile doesn't obscure content (safe-area padding)
- [ ] Live-refresh ticker respects `prefers-reduced-motion` (no auto-scroll marquee)
- [ ] Forms: labels visible (not placeholder-only), errors inline with recovery guidance

---

## NEXT STEPS FOR DEVELOPMENT

1. Set up design tokens (CSS variables / Tailwind theme) from the color table above
2. Build shared components first: TrustFooter, StalenessBanner, ComparisonTable, ScoreSummary
3. Build Module 13 onboarding flow (Screen 2) — entry point, fully specified
4. Build Dashboard (Screen 3) and Pathways/Select-Swap-Lock (Screen 4)
5. Points Calculator (Screen 5) can reuse form patterns from onboarding
