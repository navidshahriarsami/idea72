// GSM points test (subclasses 189/190/491) computed from the profile data
// captured during onboarding. Categories we don't capture yet (work
// experience, partner skills, NAATI, professional year) score 0 and are
// listed so the student can see what's missing.
// Source: https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189/points-table

export type PointsBreakdownItem = {
  category: string;
  points: number;
  detail: string;
};

export type PointsResult = {
  totalPoints: number;
  breakdown: PointsBreakdownItem[];
};

const POINTS_SOURCE =
  "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189/points-table";

export { POINTS_SOURCE };

function agePoints(birthDate: Date, at: Date): [number, string] {
  let age = at.getFullYear() - birthDate.getFullYear();
  const beforeBirthday =
    at.getMonth() < birthDate.getMonth() ||
    (at.getMonth() === birthDate.getMonth() &&
      at.getDate() < birthDate.getDate());
  if (beforeBirthday) age -= 1;

  if (age < 18 || age >= 45) return [0, `Age ${age} — outside 18–44`];
  if (age <= 24) return [25, `Age ${age} (18–24)`];
  if (age <= 32) return [30, `Age ${age} (25–32)`];
  if (age <= 39) return [25, `Age ${age} (33–39)`];
  return [15, `Age ${age} (40–44)`];
}

function englishPoints(proficiencyLevel?: string): [number, string] {
  switch (proficiencyLevel) {
    case "superior":
      return [20, "Superior English"];
    case "proficient":
      return [10, "Proficient English"];
    case "competent":
      return [0, "Competent English"];
    default:
      return [0, "No English test on file"];
  }
}

function qualificationPoints(courseLevel?: string): [number, string] {
  switch (courseLevel) {
    case "Doctorate":
      return [20, "Doctorate from an Australian institution"];
    case "Masters":
    case "Bachelor":
      return [15, `${courseLevel} degree`];
    case "Diploma":
      return [10, "Diploma or trade qualification"];
    default:
      return [0, "No qualification on file"];
  }
}

export function calculatePoints(profile: {
  birthDate: Date;
  englishProficiency?: string;
  courseLevel?: string;
  courseStart?: Date;
  courseEndExpected?: Date;
  regionalBonusEligible?: boolean;
}): PointsResult {
  const now = new Date();
  const breakdown: PointsBreakdownItem[] = [];

  const [age, ageDetail] = agePoints(profile.birthDate, now);
  breakdown.push({ category: "Age", points: age, detail: ageDetail });

  const [english, englishDetail] = englishPoints(profile.englishProficiency);
  breakdown.push({
    category: "English language",
    points: english,
    detail: englishDetail,
  });

  const [qual, qualDetail] = qualificationPoints(profile.courseLevel);
  breakdown.push({
    category: "Educational qualification",
    points: qual,
    detail: qualDetail,
  });

  // Australian study requirement: at least 2 academic years (92 weeks
  // CRICOS-registered study) in Australia.
  let australianStudy = 0;
  let studyDetail = "No Australian study on file";
  if (profile.courseStart && profile.courseEndExpected) {
    const weeks =
      (profile.courseEndExpected.getTime() - profile.courseStart.getTime()) /
      (7 * 24 * 3600 * 1000);
    if (weeks >= 92) {
      australianStudy = 5;
      studyDetail = "Meets the 2-academic-year Australian study requirement";
    } else {
      studyDetail = `Course length ~${Math.round(weeks)} weeks — under the 92-week requirement`;
    }
  }
  breakdown.push({
    category: "Australian study requirement",
    points: australianStudy,
    detail: studyDetail,
  });

  breakdown.push({
    category: "Regional study",
    points: profile.regionalBonusEligible && australianStudy > 0 ? 5 : 0,
    detail: profile.regionalBonusEligible
      ? australianStudy > 0
        ? "Studied in a designated regional area"
        : "Regional location, but Australian study requirement not yet met"
      : "Not in a designated regional area",
  });

  // Captured later in the journey — shown as 0 so gaps are visible.
  breakdown.push(
    {
      category: "Skilled employment",
      points: 0,
      detail: "Work experience not captured yet",
    },
    {
      category: "Other (partner, NAATI, professional year)",
      points: 0,
      detail: "Not captured yet",
    },
  );

  return {
    totalPoints: breakdown.reduce((sum, item) => sum + item.points, 0),
    breakdown,
  };
}

// Pathway-specific nomination bonuses on top of the base score.
export const PATHWAY_BONUSES: Record<string, { bonus: number; label: string }> =
  {
    "189": { bonus: 0, label: "No nomination" },
    "190": { bonus: 5, label: "State nomination (+5)" },
    "491": { bonus: 15, label: "State/family nomination (+15)" },
  };

export const MIN_POINTS_REQUIRED = 65;

// Coarse heuristic until SkillSelect round data is ingested: probability
// scales with margin above the 65-point floor, capped to (0.05, 0.95).
export function estimateProbability(totalPoints: number): number {
  const margin = totalPoints - MIN_POINTS_REQUIRED;
  return Math.min(0.95, Math.max(0.05, 0.35 + margin * 0.03));
}
