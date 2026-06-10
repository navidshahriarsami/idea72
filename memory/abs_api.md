# ABS (Australian Bureau of Statistics) — Golden Source of Truth API
*Created: 2026-06-08 | Status: LIVE, FREE, NO AUTH REQUIRED*

## Base URL
```
https://data.api.abs.gov.au/rest/
```

## Authentication
- **None required** — API keys removed as of 29 November 2024
- Fully public, no registration needed
- Contact: api.data@abs.gov.au for register of interest

## Standard Format
- Complies with SDMX 2.1
- Response formats: XML (default), JSON (`format=jsondata`), CSV (`format=csv`)

## Core Endpoint Patterns

### Get Data
```
GET https://data.api.abs.gov.au/rest/data/{agencyId},{dataflowId},{version}/{dataKey}
  ?startPeriod=YYYY-MM
  &endPeriod=YYYY-MM
  &format=jsondata
  &detail=dataonly
```

### List All Dataflows
```
GET https://data.api.abs.gov.au/rest/dataflow/ABS
```

### Get Metadata / Structure
```
GET https://data.api.abs.gov.au/rest/{structureType}/{agencyId}/{structureId}/{version}
```

## Key Dataflow IDs for Migration Platform

### Labour Force (Employment by Occupation/ANZSCO)
```
Dataflow: ABS,LF,1.0.0
Publication: Labour Force Australia Detailed
Reference period: March 2026 (FINAL release under this title — publication ceased)
Occupation tables: Table 07, EQ07a, EQ07b, EQ08, EQ09, EQ13
Frequency: Quarterly (Feb, May, Aug, Nov)

Example: https://data.api.abs.gov.au/rest/data/ABS,LF,1.0.0/M1.3.1599.10.AUS?format=jsondata
```

### CPI (reference format example)
```
ABS,CPI,1.0.0
```

## XLSX Downloads (Labour Force Detailed — March 2026)
```
Monthly bulk zip:  27.68 MB
Quarterly pivot:   153.98 MB (tables EQ02-14, LQ1-2, UQ2-3)
Occupation ANZSCO: Table 07 — quarterly, Feb 2026 reference

Direct files available at:
https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia-detailed/latest-release
```

## ⚠️ Critical Warning — OSCA Transition
- ANZSCO is being REPLACED by OSCA from September 2026
- ABS has SUSPENDED Labour Force occupation data during transition
- OSCA-based profiles releasing mid-2026
- OSCA: 1,156 occupations (vs ANZSCO's older count)
- Platform must handle BOTH codes (ANZSCO for now, OSCA from Sept 2026)
- OSCA spec: https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/latest-release

## Interactive API Explorer
```
https://api.gov.au/assets/APIs/abs/DataAPI.openapi.html
```

## ABS Data Explorer (visual query builder)
```
https://explore.data.abs.gov.au
```

## Key ABS URLs
- Labour Force Latest: https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia/latest-release
- Labour Force Detailed: https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia-detailed/latest-release
- ANZSCO Classification: https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations
- OSCA New Classification: https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/latest-release
- All Employment Stats: https://www.abs.gov.au/statistics/labour/employment-and-unemployment
