# Module 12 — Course-to-PR Matchmaking Engine
*Created: 2026-06-08 | The most complex and valuable module*

## PURPOSE
Student enters their course/degree → system maps to ANZSCO → shows PR probability per pathway → comparison table → select/swap/lock plan

---

## ALL DATA SOURCES FOR THIS MODULE

### 1. CRICOS Register (All Approved Courses for Student Visa Holders)
```
Source: data.gov.au — Monthly XLSX
Latest: https://data.gov.au/data/dataset/e5ae7059-bfa8-4fa4-a5c0-c13cf3520193/resource/a737a81a-512d-4e97-b982-1c3be34bbe5a/download/cricos-providers-courses-and-locations-as-at-2026-3-2-11-34-49.xlsx
Dataset page: https://data.gov.au/data/dataset/cricos
Updated: Monthly (latest confirmed March 2026)
Fields: Provider name, CRICOS code, course name, AQF level, course duration, location, state
CKAN API: https://data.gov.au/api/3/action/package_show?id=cricos
```

### 2. training.gov.au API (VET Qualifications + Units of Competency)
```
Swagger: https://training.gov.au/swagger
Connect guide: https://training.gov.au/support/connecting-your-system-traininggovau-apis-1
Auth: Username + password (registration required)
Format: SOAP/XML + REST
Contains: Qualifications, skill sets, units of competency, training packages
Sandbox: Available for testing
ICT example: ICT60120 — Advanced Diploma of Information Technology
Use for: VET course → ANZSCO mapping
```

### 3. ACS Assessment Body (ICT ANZSCO Codes)
```
Source: acs.org.au/msa — HTML scrape (no API)
Covers: 25 ANZSCO codes (ICT/networking)
Assessment pathways:
  1. Post-Australian Study: AU bachelor + 1yr work OR Professional Year
  2. General Skills: Recognised tertiary + several years experience
  3. RPL (Recognition of Prior Learning): No formal qual + ample experience
  4. Qualification Only: AU diploma/assoc degree, no work experience needed

ACS qualification rule:
  - Bachelor = ICT Major if ≥33% of units are ICT
  - ICT Major = at least 65% of ICT content matches nominated ANZSCO
  - ACS-accredited courses = auto-qualify for ICT Major
  - Underpinned by SFIA (Skills Framework for the Information Age)

All 25 ACS ANZSCO codes (confirmed):
  135111, 135112, 135199, 223211, 261111, 261112, 261211, 261212,
  261311, 261312, 261313, 261314, 261316, 261399, 262111, 262112,
  262113, 263111, 263112, 263113, 263211, 263212, 263213, 263299, 313113
```

### 4. VETASSESS (341+ Non-ICT Professional Occupations)
```
Source: vetassess.com.au — HTML scrape, individual info sheets per occupation
Info sheets: https://www.vetassess.com.au/information-sheet/{id}/2013-anzsco
Nomination search: https://www.vetassess.com.au/nominate-an-occupation
Uses: ANZSCO 2013 for most | ANZSCO 2022 for CSOL (482/186 visas)
```

### 5. AQF (Australian Qualifications Framework) — Course Level Mapping
```
Source: aqf.edu.au (no API — rules-based)
Level 1–4:  Certificates I–IV (VET)
Level 5:    Diploma
Level 6:    Associate Degree / Advanced Diploma
Level 7:    Bachelor Degree ← most students
Level 8:    Graduate Certificate / Graduate Diploma
Level 8:    Bachelor Honours
Level 9:    Masters (Coursework & Research)
Level 10:   Doctorate (PhD)

Migration relevance:
  Level 7 (Bachelor) = 15 points + ACS pathway 1 or 2 eligible
  Level 9 MbyR/PhD   = 20 points + age cap raised to 50 on 485
  Level 5-6          = ACS qualification-only pathway eligible
```

### 6. mySkills / Training Occupation Pathways (VET → ANZSCO)
```
Source: myskills.gov.au + JSA Training Occupation Pathways (TOP) dataset
TOP dataset maps VET qualifications → ANZSCO codes (data-driven + JSA validated)
VET search: https://www.myskills.gov.au/courses/search/
National Register: https://training.gov.au
```

---

## THE MATCHMAKING ENGINE — Full Logic Design

### INPUT (Student Profile)
```
□ Current/planned course name (free text or CRICOS lookup)
□ CRICOS code (if known)
□ AQF level (Cert IV / Diploma / Bachelor / Masters / PhD)
□ Field of study (ICT / Engineering / Business / Health / etc.)
□ Study location (metro / regional + postcode)
□ Study duration remaining (months)
□ Age (current)
□ English score (IELTS/PTE)
□ Work experience in Australia (months, occupation)
□ Work experience overseas (years, occupation)
□ NAATI language (if any)
□ Professional Year (done / planned / not applicable)
```

### PROCESSING LAYERS

#### Layer 1 — Course → ANZSCO Mapper
```
INPUT: Course name / CRICOS code
PROCESS:
  1. Fuzzy match course name against CRICOS dataset (all approved courses)
  2. Classify course by AQF level
  3. Map to candidate ANZSCO codes:
     - ICT courses → ACS 25-code list
     - VET courses → training.gov.au + TOP dataset
     - Other → VETASSESS occupation list
  4. ACS rule check:
     - If ≥33% ICT units AND ≥65% match to ANZSCO → "ICT Major" ✅
     - If <33% ICT → "ICT Minor" ⚠️ — extra work experience required
     - ACS-accredited courses → auto-qualify ✅
  5. Output: ranked list of eligible ANZSCO codes for this student
```

#### Layer 2 — ANZSCO → Shortage Score
```
INPUT: ANZSCO code
PROCESS:
  1. Lookup JSA Occupation Shortage List (XLSX — monthly download)
  2. Get shortage status: National Shortage / Regional / No Shortage
  3. Get shortage trend: Worsening / Stable / Improving
  4. Check if on MLTSSL (189/190/491 eligible)
  5. Check if on CSOL (482 Core Skills eligible)
  6. Check state occupation lists (all 8 states)
  7. ABS Labour Force data: employment size, vacancy rate
OUTPUT:
  shortage_score: 0–100
  national_shortage: true/false
  regional_shortage: [list of states]
  csol_eligible: true/false
  mltssl_eligible: true/false
```

#### Layer 3 — Points Calculator (per student profile)
```
INPUT: Full student profile
CALCULATE:
  age_points + english_points + au_work_points + overseas_work_points
  + qualification_points + regional_study_points + py_points
  + naati_points + partner_points + nomination_points
OUTPUT:
  base_score: current points
  achievable_score: with all optimisations
  gap_to_competitive: (target 85) - current
  recommendations: ranked list of point boosters
```

#### Layer 4 — PR Probability Engine
```
INPUT: ANZSCO code + points score + visa target (189/190/491)
PROCESS:
  Historical invitation data (SkillSelect rounds — last 24 months):
    - For this ANZSCO code:
        * Lowest points score invited (floor)
        * Most common points score invited (mode)
        * Was this occupation invited at all? (frequency)
    - Compare student's points to historical range
    - Factor in shortage status (national shortage = higher probability)
    - Factor in state availability (190/491 = check state quotas)

  Probability formula:
    P(invitation) = base_probability × shortage_multiplier × state_factor
    
    base_probability:
      points >= historical_mode + 5  → 85–95%
      points == historical_mode       → 60–75%
      points == historical_floor      → 30–45%
      points < historical_floor       → 5–15%
    
    shortage_multiplier:
      national_shortage = 1.3x
      regional_shortage = 1.1x
      no_shortage       = 0.8x
    
    state_factor (for 190/491):
      occupation on state list = 1.2x
      state quota open         = 1.1x
      state quota closed       = 0.3x

OUTPUT:
  pr_probability_189: X%
  pr_probability_190_by_state: {NSW: X%, VIC: Y%, ...}
  pr_probability_491_by_state: {NSW: X%, VIC: Y%, ...}
  pr_probability_482_186: X% (employer dependent)
  estimated_timeline: {min: months, median: months, max: months}
```

#### Layer 5 — Plan Generator (Pathway Options)
```
For each viable pathway, generate a complete PLAN OBJECT:

Plan = {
  id: uuid,
  name: "Plan A — 190 NSW Direct",
  visa_sequence: ["500 (current)", "190"],
  or: ["500 (current)", "485 (2yr)", "189"],
  or: ["500 (current)", "482 → 186"],
  
  steps: [
    {step: 1, action: "ACS skills assessment", duration: "3 months", cost: "$540"},
    {step: 2, action: "Lodge EOI", duration: "immediate", cost: "$0"},
    {step: 3, action: "Wait for invitation", duration: "3–18 months", cost: "$0"},
    {step: 4, action: "Lodge 190 application", duration: "immediate", cost: "$4,770"},
    {step: 5, action: "Health + PCC", duration: "1–3 months", cost: "$400"},
    {step: 6, action: "Decision", duration: "6–12 months", cost: "$0"},
  ],
  
  pr_probability: 72%,
  total_time_to_pr: "18–30 months",
  total_cost: "$7,000–$12,000 (excl. study)",
  risk_factors: ["State quota may close", "Points at floor"],
  boosters: ["Do PY (+5pts)", "Improve IELTS (+10pts)"],
  
  status: "draft" | "selected" | "locked"
}
```

---

## COMPARISON TABLE — UX Design

### Columns (per plan):
| Field | Plan A (190 NSW) | Plan B (491 QLD) | Plan C (485→189) | Plan D (482→186) |
|---|---|---|---|---|
| PR Probability | 72% 🟡 | 81% 🟢 | 58% 🟠 | 65% 🟡 |
| Time to PR | 18–30 mo | 24–36 mo | 36–54 mo | 30–42 mo |
| Total Cost | $7k–$12k | $6k–$10k | $14k–$22k | Employer-funded |
| PR Type | Permanent | Prov → PR | Permanent | Permanent |
| Key Risk | Quota closes | Regional req | 485 age ≤35 | Need employer |
| Points Needed | 85 | 75 | 90 | N/A |
| Your Points Now | 80 | 80 | 80 | 80 |
| Gap | -5 pts | +5 surplus | -10 pts | N/A |
| Recommended Booster | PY (+5) | None needed | IELTS 8 (+10) | Find sponsor |
| State Commitment | 2yr NSW | 3yr QLD | None | None |

### Row highlighting:
- 🟢 Best probability
- 🔵 Fastest time
- 💰 Lowest cost
- ⭐ MARA-recommended for profile

---

## SELECT / SWAP / LOCK MECHANISM

```
DRAFT    → Student views comparison table
           Can swap variables (e.g. change state, change qualification target)
           
SELECT   → Student picks Plan A as primary
           Plan B becomes "backup plan"
           System shows what needs to happen in next 30/60/90 days
           
SWAP     → Student changes one variable:
           "What if I do Professional Year?" → recalculate all probabilities
           "What if I target QLD instead of NSW?" → swap state → recalculate
           "What if I do Masters instead of stopping at Bachelor?" → recalculate
           All swaps are non-destructive — original plan preserved as version
           
LOCK     → Student confirms plan
           System creates a ROADMAP with:
           - Milestone dates
           - Countdown timers
           - Alert triggers ("Your ACS assessment will expire in 6 months")
           - Cost tracker
           - Document checklist per milestone
```

---

## PROBABILITY DATA INPUTS (all from government sources)

| Input | Source | Freshness |
|---|---|---|
| SkillSelect historical cutoffs | immi.homeaffairs.gov.au scrape | Monthly |
| Shortage status | JSA XLSX download | Quarterly |
| State occupation lists | 8 state portal scrapes | Weekly |
| State quota open/closed | 8 state portal scrapes | Real-time |
| Points table | immi.homeaffairs.gov.au | Verify monthly |
| CRICOS course list | data.gov.au XLSX | Monthly |
| ACS ANZSCO criteria | acs.org.au scrape | Quarterly verify |
| Processing times | immi.homeaffairs.gov.au | Monthly |
| Visa fee schedule | immi.homeaffairs.gov.au | Verify monthly |

---

## CERTIFICATIONS INTEGRATION (beyond degrees)

### ICT Certifications that ACS recognises as supporting evidence:
- CompTIA Network+ / Security+ / CySA+
- Cisco CCNA / CCNP (network administrator pathway)
- AWS / Azure / GCP certifications (cloud, systems)
- CISSP / CEH (security specialist pathway)
- PMP (ICT Project Manager pathway)

### How certifications affect the engine:
- Cannot replace formal qualification for skills assessment
- Can STRENGTHEN case for correct ANZSCO nomination
- Platform shows: "Your CCNA + Bachelor of Networking = strong case for 263112"
- Certifications also affect employer 482 sponsorship likelihood

### VET / TAFE Qualifications (training.gov.au API):
- ICT60120 — Advanced Diploma of IT
- ICT50220 — Diploma of IT (Networking)
- ICT40120 — Certificate IV in IT
- These map to ANZSCO via TOP dataset
- Qualification-only pathway at ACS (no work experience for Diploma/Assoc Degree)
