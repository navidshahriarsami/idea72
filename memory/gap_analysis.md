# Gap Analysis — Student to PR Journey
*Created: 2026-06-08*

## Gaps in Original 10 Modules

### GAP 1 — Skills Assessment Body Matcher (CRITICAL — Missing entirely)
- No module identifies WHICH assessing body applies to which ANZSCO code
- ACS ≠ VETASSESS ≠ Engineers Australia ≠ ANMAC ≠ TRA ≠ CPA
- Wrong body = wasted $$ + months lost
- Must include: occupation → assessing body mapper
- Source: https://immi.homeaffairs.gov.au/visas/working-in-australia/skills-assessment

### GAP 2 — Health Examination Module (Missing)
- Mandatory for ALL PR visas
- Must use a Panel Physician (approved doctor list)
- Results valid for 12 months only — EXPIRES
- Timing critical: lodge health check AFTER invitation, before expiry
- Source: https://immi.homeaffairs.gov.au/help-support/tools/list-medical-practitioners

### GAP 3 — Police Clearance / Character Assessment (Missing)
- Required from EVERY country lived in for 12+ months in last 10 years
- Common delay source: some countries take 3–6 months
- Must be obtained BEFORE visa lodgement
- PCC backlogs causing major visa delays in 2026
- Pegged to: https://www.aussizzgroup.com/blog/australian-visa-delays-health-checks-pcc-character-clearance/

### GAP 4 — ANZSCO Code Accuracy Checker (Missing — HIGH RISK)
- Most consequential mistake: wrong ANZSCO code cascades through every step
- Skills assessment tied to code → EOI tied to code → visa tied to code
- Platform needs: job duties → correct ANZSCO code validator
- Source: https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations

### GAP 5 — Skills Assessment Expiry Tracker (Missing)
- Skills assessments have validity periods (typically 3 years)
- If it expires mid-EOI or mid-application → must reassess
- English test results also expire (IELTS/PTE: 3 years)
- Platform needs: expiry date calculator + countdown alert

### GAP 6 — ImmiAccount Application Readiness Checklist (Missing)
- Final lodgement requires specific documents in specific formats
- Missing/incorrect document = rejection or Request for Further Information (RFI)
- Checklist: passport, skills assessment, English test, employment evidence, health, PCC, relationship docs
- Source: https://immi.homeaffairs.gov.au/help-support/tools/document-checklist

### GAP 7 — Bridging Visa Status Tracker (Missing)
- BVA automatically granted when you lodge before current visa expires
- BVB needed if you need to travel while on bridging visa
- BVC has work restrictions
- Critical: students don't know they can stay lawfully on BVA while waiting
- Source: https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/bridging-visa-a-010

### GAP 8 — Professional Year (PY) Provider & Enrollment Module (Thin in Module 7)
- Module 7 mentions PY but doesn't track PY enrollment, deadlines, providers
- PY = 44 weeks structured program = +5 points
- ICT PY providers: ACS, Navitas, FITS, Holmes Institute
- Must start BEFORE EOI in some strategies
- Source: https://immi.homeaffairs.gov.au/visas/working-in-australia/working-in-australia/professional-year-program

### GAP 9 — Course-to-ANZSCO Alignment Checker (Pre-enrollment, Missing)
- Students enrolling in wrong course = dead-end pathway
- Platform should allow: "I want ANZSCO 263112 → which CRICOS course gets me there?"
- Reverse: "I studied Bachelor of Networking → which ANZSCO codes can I claim?"
- Source: CRICOS register + ACS assessment criteria

### GAP 10 — Processing Time Tracker (Missing)
- Each visa has a processing time range (50th/75th/90th percentile)
- Subclass 189: ~12 months at 75th percentile (2026)
- Subclass 190: varies by state, some as fast as 6 months
- Subclass 491: varies by state sponsor
- Source: https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-processing-times

### GAP 11 — Financial Planning Module (Missing)
- Total cost: AUD $70,000–$250,000 (tuition + visas + living + assessments)
- Visa fee schedule changes (confirmed March 2026 fee increases)
- Platform should: fee calculator per pathway
- Source: https://immi.homeaffairs.gov.au/help-support/tools/visa-pricing-estimator

### GAP 12 — State Quota Status Live Tracker (Partially in Module 5, needs expansion)
- States open/close/cap nomination rounds unpredictably
- NSW, VIC, SA close within hours of opening
- Real-time open/closed/capped status per state per occupation
- This is THE most time-sensitive data in the whole platform

## Revised Module List — 10 + 5 Additional

### Original 10 (retained):
1. SkillSelect Invitation Rounds
2. All Visa Subclasses
3. ANZSCO/OSCA Shortage Intelligence
4. Student Background Checker
5. Regional Probability Engine
6. PostGrad / Masters by Research Pathway
7. 485 Maximiser (PY + NAATI + IELTS)
8. Points Calculator
9. Trust / Verification Layer
10. Live Refresh Engine (5-min)

### 5 New Critical Modules (added Jun 2026):
11. Skills Assessment Body Matcher (ANZSCO → correct body)
12. Course-to-PR Matchmaking Engine (probability, comparison table, select/swap/lock)
13. **VEVO Student Identity & Visa Verification** ← NEW — Module 13
    Live visa check via Home Affairs Visa Entitlements API v1.0.31
    Creates verified student profile: visaSubclass, expiry, work rights, study entitlements
14. Health + Character + PCC Readiness Tracker
15. Document Checklist + ImmiAccount Readiness
16. Processing Time + Visa Fee Calculator
17. State Nomination Live Status (open/closed/capped per state per occupation)

## PR Journey Complete Timeline Map
```
PHASE 1 — STUDY (Subclass 500)
  → Choose course aligned to shortage ANZSCO (Module 9 — new)
  → Complete 2 years CRICOS (Australian Study Requirement)
  → Study in regional area for +5 points (Module 5)

PHASE 2 — PREPARE (While still studying)
  → English: IELTS 8+ for +20 pts (Module 7)
  → NAATI CCL: +5 pts (Module 7)
  → Professional Year enrollment (Module 7)
  → ACS/VETASSESS skills assessment lodge (Module 11 — new)
    → Takes 45-90 days, valid 3 years

PHASE 3 — BRIDGE (After graduation)
  → Option A: Apply 485 if eligible (age ≤35, IELTS 6.5)
  → Option B: Apply another 500 (further study)
  → Option C: Employer sponsors 482 directly
  → Option D: Lodge BVA and wait for invitation

PHASE 4 — EOI (SkillSelect)
  → Calculate exact points (Module 8)
  → Lodge EOI → get ranked in pool
  → Monitor invitation rounds (Module 1)

PHASE 5 — INVITATION
  → Receive invitation → 60 days to lodge application
  → Trigger health exam (Module 12 — new)
  → Trigger PCC from all countries (Module 12 — new)
  → Assemble ImmiAccount documents (Module 13 — new)

PHASE 6 — LODGE & WAIT
  → Lodge PR application
  → Processing: 6–18 months (Module 14 — new)
  → BVA keeps you lawful (Module 7 extended)

PHASE 7 — GRANT → PR
  → 189: live anywhere in Australia
  → 190: commit 2 years to nominating state
  → 491: 3 years regional → apply 191
```
