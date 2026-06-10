---
name: module-13-vevo-verification
description: Module 13 — VEVO Student Identity & Visa Verification. Live Home Affairs API call creates a verified student profile on first use. Covers onboarding form design, API integration, user account creation, and what data is stored.
metadata:
  type: project
---

# Module 13 — VEVO Student Identity & Visa Verification
*Added: 2026-06-08 | Priority: CRITICAL — This is the entry point for every student on PathwayAU*

## PURPOSE

Every student's PathwayAU journey starts here. Instead of self-reported visa details (error-prone, outdated), the platform calls the live Home Affairs Visa Entitlements API the moment a student registers. Their account is created with government-verified data, not what they type.

---

## API DETAILS

```
API:       (Visa) Entitlements v1.0.31
Endpoint:  POST https://api.public.homeaffairs.gov.au/visa/v1/entitlements/checks
Auth:      OAuth2 Client Credentials + mTLS machine certificate
Token URL: https://mtls.epsts.homeaffairs.gov.au/securityservices/sps/oauth/oauth20/token
x-api-key: clientId from Home Affairs Access Manager (am.homeaffairs.gov.au)
Rate:      5,000 calls/day
Enrol at:  am.homeaffairs.gov.au | Process key: vevo
Contact:   VEVO.Projects@homeaffairs.gov.au
Spec:      (Visa)_Entitlements-1.0.31.yaml (saved in Downloads)
```

---

## STUDENT ONBOARDING FORM — INPUT FIELDS

The student fills ONE short form. Everything else is pulled from government.

```
SECTION 1 — Identity (required for VEVO API call)
  □ Given Name (first name)
  □ Family Name (surname)
  □ Date of Birth                        [date picker]
  □ Passport Number                      [travel document ID]
  □ Passport Issuing Country             [3-letter ICAO code dropdown — e.g. IND, CHN, NED]

SECTION 2 — Contact & Study (platform use only, not sent to VEVO)
  □ Email address                        [creates login]
  □ Password                             [account security]
  □ Current course name                  [free text or CRICOS lookup]
  □ Institution name                     [free text or CRICOS lookup]
  □ Study location postcode              [for regional bonus calculation]
  □ Course start date                    [for timeline calculations]
  □ Course end date (expected)           [for 485 planning]

SECTION 3 — Consent
  □ [checkbox] I consent to PathwayAU verifying my visa status with the
    Australian Department of Home Affairs via the VEVO API.
  □ [checkbox] I agree to the Terms of Service and Privacy Policy.
```

**Fields NOT asked** (fetched automatically from VEVO):
- Visa subclass
- Visa expiry date
- Work rights / work conditions
- Study entitlements
- Residence status
- Immigration status
- Whether they are onshore/offshore

---

## API CALLS ON REGISTRATION (4 sequential calls)

The platform makes 4 VEVO API calls at registration, one per entitlement category:

```python
VEVO_CALLS = [
    "STUDY_ENTITLEMENTS",    # scope: VSA:ENT:D
    "WORK_ENTITLEMENTS",     # scope: VSA:ENT:E
    "IMMIGRATION_STATUS",    # scope: VSA:ENT:G
    "RESIDENCE_STATUS",      # scope: VSA:ENT:C
]
# Each call uses same request body, different entitlementCategory
# Consolidate all 4 responses into one student profile object
```

**Request body (same structure for all 4 calls):**
```json
{
  "data": {
    "entitlementCategory": "STUDY_ENTITLEMENTS",
    "givenName": "Navid",
    "familyName": "Shahriar",
    "birthDate": "1999-03-15",
    "travelDocumentId": "PA1234567",
    "travelDocumentIssuingCountry": "AUS"
  }
}
```

---

## VERIFIED STUDENT PROFILE — WHAT IS STORED

After the 4 API calls, the platform creates a `StudentProfile` record:

```json
{
  "student_id": "uuid-generated",
  "verified_at": "2026-06-08T14:32:28Z",
  "verification_source": "Home Affairs Visa Entitlements API v1.0.31",
  "verification_endpoint": "POST https://api.public.homeaffairs.gov.au/visa/v1/entitlements/checks",

  "identity": {
    "given_name": "Navid",
    "family_name": "Shahriar",
    "birth_date": "1999-03-15",
    "passport_number": "PA1234567",          // stored encrypted
    "passport_country": "AUS"
  },

  "visa": {
    "subclass": "500",                        // ← from VEVO response
    "class": "FA-500",
    "type": "STUDENT_VISA",
    "grant_date": "2022-03-01",
    "expiry_date": "2026-12-31",             // ← key for 485 planning
    "grant_number": "xxxx",
    "stream": "Student",
    "period_of_stay": "M48",
    "entries_allowed": "M",
    "status": "GRANTED",
    "applicant_role": "PRIMARY"
  },

  "entitlements": {
    "study_status": "UNLIMITED",             // NIL / LIMITED / UNLIMITED
    "study_conditions": [
      {"code": "8105", "description": "Must study full time"}
    ],
    "work_status": "LIMITED",                // NIL / LIMITED / UNLIMITED
    "work_conditions": [
      {"code": "8104", "description": "Work limited to 48 hours per fortnight while course in session"}
    ]
  },

  "status": {
    "immigration_status": "TEMPORARY_RESIDENT",
    "residence_status": "TEMPORARY_RESIDENT",
    "is_onshore": true,
    "location": "ONSHORE",
    "ministerial_intervention_pending": false,
    "permanent_resident_visa_applicant": false,
    "permanent_resident_lodgement_date": null
  },

  "study_context": {
    "course_name": "Bachelor of Networking",
    "institution": "Melbourne Institute of Technology",
    "location_postcode": "2000",
    "course_start": "2022-02-01",
    "course_end_expected": "2025-12-31"
  },

  "platform_derived": {
    "days_until_visa_expiry": 206,           // calculated field
    "age_at_visa_expiry": 27,               // for 485 age cap check
    "australian_study_requirement_met": true, // 2+ years CRICOS
    "eligible_for_485": true,               // age ≤ 35 + IELTS check pending
    "regional_study_bonus": false           // postcode 2000 = metro
  }
}
```

---

## UI — WHAT THE STUDENT SEES AFTER VERIFICATION

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VISA VERIFIED  |  Source: Dept. of Home Affairs  |  2026-06-08 14:32 AEST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  NAVID SHAHRIAR
  Subclass 500 — Student Visa
  Status:  GRANTED  |  Expires: 31 December 2026  (206 days remaining)

  📚 Study Rights:    UNLIMITED
  💼 Work Rights:     LIMITED — 48 hrs/fortnight during semester
  🌏 Location:        ONSHORE  (Australia)
  🏠 Residence:       TEMPORARY RESIDENT
  ⚠️ PR Application:  Not yet lodged

  ──────────────────────────────────────────────────────
  PATHWAY ALERT
  Your visa expires in 206 days.
  Start your PR pathway planning now →  [BEGIN ASSESSMENT]
  ──────────────────────────────────────────────────────
```

---

## RE-VERIFICATION SCHEDULE

Student visa status changes (e.g. Bridging Visa A granted, conditions updated). Platform must re-verify periodically:

| Trigger | Action |
|---|---|
| Student login (if last check > 7 days) | Auto re-verify via VEVO |
| Visa expiry < 90 days | Alert + force re-verify |
| Student reports visa change | Manual re-verify button |
| Platform scheduled job | Re-verify all users monthly |

Response field `currentTimestamp` from VEVO is stored as `last_verified_at` — shown in UI so student knows how fresh the data is.

---

## ERROR HANDLING

| VEVO Response | Platform Action |
|---|---|
| 200 OK | Create/update student profile |
| 400 Bad Request | Show form error: "Passport details don't match — please check and retry" |
| 401 Unauthorised | Platform auth issue — log, alert admin, show "Service temporarily unavailable" |
| 403 Forbidden | Scope issue — log for admin review |
| 404 / no match | "No visa record found for these details. Please check your passport number and date of birth." |
| 429 Rate limited | Queue request, retry after backoff |
| 500 Server Error | Retry 3× with exponential backoff, then show "VEVO service temporarily unavailable — please try again later" |

---

## PRIVACY & SECURITY

- Passport number stored **encrypted at rest** (AES-256)
- Passport number **never logged** in application logs
- mTLS certificate for OAuth — machine-to-machine, not user-facing tokens
- All API calls logged for Home Affairs auditing (their requirement)
- Student consent captured before any VEVO call is made
- Data retained per Australian Privacy Act 1988

---

## HOW MODULE 13 FEEDS ALL OTHER MODULES

```
Module 13 (VEVO verified profile)
    ↓
    → Module 4  (Student Background): visa subclass confirmed → skip manual entry
    → Module 2  (Visa Subclasses): current subclass known → show next step options
    → Module 7  (485 Maximiser): age at expiry + onshore status → 485 eligibility auto-calculated
    → Module 8  (Points Calculator): residence status feeds into points table
    → Module 12 (Course Matchmaking): study entitlements confirm CRICOS compliance
    → Module 14 (Health Check): immigration_status → which health exam pathway
    → Module 9  (Trust Layer): every fact cited with VEVO API + timestamp
    → Module 10 (Live Refresh): re-verify on schedule
```

---

## REGISTRATION TO PATHWAY — FLOW

```
STEP 1: Student opens PathwayAU → clicks "Start My PR Journey"
STEP 2: Fills onboarding form (5 identity fields + course info + consent)
STEP 3: Platform calls VEVO API 4× (takes ~2 seconds)
STEP 4: Student profile created with verified visa data
STEP 5: Platform shows verified visa card + pathway alert
STEP 6: Student clicks "Begin Assessment" → enters Module 12 (Course Matchmaking)
STEP 7: Points calculated, pathways ranked, comparison table shown
STEP 8: Student selects → locks → gets roadmap with milestone dates
```

**From registration to personalised PR roadmap: under 3 minutes.**
