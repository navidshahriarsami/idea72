# Universal Platform Architecture — ALL Students, ALL Courses, ALL ANZSCO
*Created: 2026-06-08 | Covers 622,000+ international students*

## SCOPE CHANGE
Previous: ICT/Networking students only
NOW: Every student, every course, every assessing body, every ANZSCO code

## Platform Name (proposed): PathwayAU

## Data Sources — Universal (All Courses, All Students)

### Course Data
- CRICOS XLSX (data.gov.au) — all approved student visa courses — monthly
- training.gov.au API (Swagger) — all VET qualifications
- AQF levels 1–10 — rules-based mapping

### Occupation Data
- JSA Occupation Shortage List XLSX — all 1,022 occupations
- ABS Labour Force API — employment by ANZSCO
- OSCA (replacing ANZSCO Sept 2026)
- immi.homeaffairs.gov.au skill occupation list (MLTSSL/STSOL/ROL/CSOL)

### Assessing Body Data (39 bodies — all scraped/downloaded)
- ACS: 26 codes (ICT + Data Science)
- Engineers Australia: 31 codes
- TRA: 133 codes (trades)
- ANMAC: 20 codes (nursing/midwifery)
- VETASSESS: 341+ codes (catch-all)
- AITSL: 10+ codes (teaching)
- AMC/AHPRA: medical occupations
- ADC: dental
- CPA/CAANZ/IPA: accounting
- AACA: architecture
- AIQS: quantity surveying
- ISNSW: surveying [new]
- 25+ specialist bodies: social work, pharmacy, OT, physio, speech, nutrition, etc.

## Core Architecture — 5 Engines

### ENGINE 1: Universal Course Classifier
INPUT: Any course name / CRICOS code / keyword
PROCESS:
  1. Fuzzy match against CRICOS XLSX (all courses)
  2. Classify by AQF level (1–10)
  3. Identify field of study (22 ASCED broad fields)
  4. Map to candidate ANZSCO codes (all 1,022)
  5. Identify assessing body per ANZSCO
OUTPUT: {cricos_code, aqf_level, field, anzsco_candidates[], assessing_body[]}

### ENGINE 2: ANZSCO Router
INPUT: ANZSCO code
PROCESS:
  Lookup master routing table:
  → Which assessing body?
  → What pathways available?
  → What qualifications needed?
  → Assessment fee + processing time
  → Which visa lists is it on? (MLTSSL/STSOL/CSOL/ROL)
OUTPUT: {body, pathways[], fee, processing_weeks, lists[]}

### ENGINE 3: Points Engine
INPUT: Student profile (age, English, quals, work exp, etc.)
PROCESS: Full official points table calculation
OUTPUT: {current_score, max_achievable, gap, boosters[]}

### ENGINE 4: PR Probability Engine
INPUT: ANZSCO + points + visa target
PROCESS: Historical SkillSelect rounds + shortage data + state lists
OUTPUT: {p189, p190_by_state, p491_by_state, p482_186, timeline}

### ENGINE 5: Plan Generator + Comparison + Lock
INPUT: Student profile + ANZSCO + probability scores
PROCESS: Generate all viable plans, rank by probability
OUTPUT: comparison_table[], selected_plan, locked_roadmap

## A-Z Student Life Roadmap — Universal Template

### PHASE 0: PRE-ENROLMENT (Before arriving in Australia)
□ Course → ANZSCO alignment check (Module 12)
□ Confirm occupation is on MLTSSL/STSOL/CSOL
□ Check age eligibility for 485 at graduation
□ Select study location: metro vs regional (+5 pts)
□ English preparation (IELTS 7+ target from day 1)

### PHASE 1: ARRIVAL & STUDY (Year 1–2 on Subclass 500)
□ Enrol in CRICOS-registered course
□ Work rights: 48 hrs/fortnight during semester (post-Mar 2024 rule)
□ Start building relevant work experience records
□ If regional → confirm postcode qualifies for regional study bonus
□ Language: NAATI-eligible language? → start prep

### PHASE 2: MID-STUDY STRATEGY (Year 1–2)
□ Check if Professional Year applicable (ICT/Engineering/Accounting)
□ Enrol in PY if applicable → +5 pts (must complete after graduation)
□ Begin NAATI CCL preparation if eligible language → +5 pts
□ Check if IELTS 8 achievable → +20 pts
□ Plan: will you need a Master's to boost points or change ANZSCO?

### PHASE 3: FINAL YEAR PREPARATION
□ Research all 8 state occupation lists NOW (before graduation)
□ Identify best state for your ANZSCO → watch quota status
□ Gather employment evidence for skills assessment
□ Book IELTS/PTE test → aim for highest possible score
□ Contact assessing body → understand exact doc requirements

### PHASE 4: GRADUATION → IMMEDIATE ACTIONS (Month 0–3)
□ Lodge skills assessment with correct body (45–90 day wait)
□ Apply for Subclass 485 if eligible (OR another 500 / 482 / BVA)
□ Complete Professional Year if enrolled
□ Begin collecting overseas employment references

### PHASE 5: EOI & INVITATION (Month 3–18)
□ Receive positive skills assessment → Lodge EOI in SkillSelect
□ Calculate exact points → confirm competitiveness
□ Monitor SkillSelect invitation rounds (monthly)
□ Monitor state quota openings (can open/close within hours)
□ If 190/491 → submit state nomination application when quota opens

### PHASE 6: INVITATION RECEIVED (60-day window)
□ Trigger health examination immediately (valid 12 months)
□ Order Police Clearance Certificates from ALL countries
□ Compile full ImmiAccount document checklist
□ Lodge PR visa application

### PHASE 7: PROCESSING & GRANT (6–18 months)
□ Bridging Visa A keeps you lawful
□ Respond to any Request for Further Information (RFI)
□ Track processing time percentiles
□ Grant → confirm obligations (190: 2yr state, 491: 3yr regional)

### PHASE 8: POST-PR (491 holders only)
□ 3 years regional residence + income threshold
□ Apply Subclass 191 (permanent)

## Probability Model — Universal (All Occupations)

Same formula for ALL ANZSCO codes:
P(PR) = base_probability × shortage_multiplier × state_factor × list_factor

list_factor:
  On MLTSSL (eligible for 189/190/491) = 1.0
  On STSOL only (190/491 only, not 189) = 0.7
  On CSOL only (482 employer-sponsored) = 0.5
  Not on any list = 0.1 (very limited options)

## Comparison Table — Universal Fields

| Field | Plan A | Plan B | Plan C | Plan D |
|---|---|---|---|---|
| Pathway | [dynamic] | [dynamic] | [dynamic] | [dynamic] |
| Assessing Body | [auto] | [auto] | [auto] | [auto] |
| Assessment Fee | $xxx | $xxx | $xxx | $xxx |
| Processing Time | x wks | x wks | x wks | x wks |
| PR Probability | X% | X% | X% | X% |
| Time to PR | x mo | x mo | x mo | x mo |
| Points Needed | xx | xx | xx | N/A |
| Your Points Now | xx | xx | xx | N/A |
| Gap | +/- | +/- | +/- | N/A |
| Key Risk | [auto] | [auto] | [auto] | [auto] |
| Booster Needed | [auto] | [auto] | [auto] | [auto] |

## SELECT / SWAP / LOCK
SELECT: Pick primary plan
SWAP variables: change state / improve English / add PY / upgrade degree / change ANZSCO
LOCK: Freeze plan → generate dated roadmap with alerts
VERSION: Every swap creates a new version (non-destructive)
