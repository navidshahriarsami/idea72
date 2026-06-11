import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import {
  calculatePoints,
  estimateProbability,
  MIN_POINTS_REQUIRED,
  PATHWAY_BONUSES,
  POINTS_SOURCE,
} from "@/lib/points";
import { lockPathway, selectPathway } from "./actions";

export default async function PathwaysPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const { student: studentId } = await searchParams;
  if (!studentId) notFound();

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      studyContext: {
        include: {
          course: { include: { anzscoMappings: { include: { anzsco: true } } } },
        },
      },
      englishTestResults: { orderBy: { testDate: "desc" }, take: 1 },
    },
  });
  if (!student) notFound();

  const study = student.studyContext;
  if (!study) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-primary">
          Finish onboarding first
        </h1>
        <p className="mt-2 text-secondary">
          We need your study details to assess pathways.
        </p>
        <Link
          href={`/onboarding/study?student=${studentId}`}
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-6 py-2 font-semibold text-on-accent hover:opacity-90"
        >
          Add study details
        </Link>
      </div>
    );
  }

  const english = student.englishTestResults[0];
  const result = calculatePoints({
    birthDate: student.birthDate,
    englishProficiency: english?.proficiencyLevel,
    courseLevel: study.course.level,
    courseStart: study.courseStart,
    courseEndExpected: study.courseEndExpected,
    regionalBonusEligible: study.regionalBonusEligible,
  });

  // Persist a new snapshot only when the score changes, so page views
  // don't pile up identical rows.
  const latest = await prisma.pointsCalculation.findFirst({
    where: { studentId },
    orderBy: { calculatedAt: "desc" },
  });
  if (!latest || latest.totalPoints !== result.totalPoints) {
    await prisma.pointsCalculation.create({
      data: {
        studentId,
        totalPoints: result.totalPoints,
        breakdown: result.breakdown,
        sourceCitation: `${POINTS_SOURCE} (fetched ${new Date().toISOString()})`,
      },
    });
  }

  const occupations = study.course.anzscoMappings.map((m) => m.anzsco);
  const primaryOccupation = occupations[0];
  const pathways = await prisma.visaPathway.findMany({
    where: { code: { in: Object.keys(PATHWAY_BONUSES) } },
    orderBy: { code: "asc" },
  });

  const rows = pathways.map((pathway) => {
    const { bonus, label } = PATHWAY_BONUSES[pathway.code];
    const totalWithBonus = result.totalPoints + bonus;
    return {
      pathway,
      bonusLabel: label,
      totalWithBonus,
      eligible: totalWithBonus >= MIN_POINTS_REQUIRED,
      probability: estimateProbability(totalWithBonus),
    };
  });

  if (primaryOccupation) {
    for (const row of rows) {
      await prisma.pathwayAssessment.upsert({
        where: {
          studentId_pathwayCode_anzscoCode: {
            studentId,
            pathwayCode: row.pathway.code,
            anzscoCode: primaryOccupation.code,
          },
        },
        update: {
          prProbability: row.probability,
          minPointsRequired: MIN_POINTS_REQUIRED,
        },
        create: {
          studentId,
          pathwayCode: row.pathway.code,
          anzscoCode: primaryOccupation.code,
          prProbability: row.probability,
          minPointsRequired: MIN_POINTS_REQUIRED,
        },
      });
    }
  }

  const assessments = primaryOccupation
    ? await prisma.pathwayAssessment.findMany({
        where: { studentId, anzscoCode: primaryOccupation.code },
      })
    : [];
  const statusByPathway = new Map(
    assessments.map((a) => [a.pathwayCode, a.status]),
  );
  const locked = assessments.find((a) => a.status === "LOCKED");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
      <Link
        href={`/onboarding/done?student=${studentId}`}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-secondary hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to profile
      </Link>

      <main className="mt-8 flex-1">
        <h1 className="text-3xl font-bold text-primary">
          Your points: {result.totalPoints}
        </h1>
        <p className="mt-2 text-secondary">
          Points-tested pathways need at least {MIN_POINTS_REQUIRED}
          {" points. "}
          Here&apos;s how your score breaks down and what each pathway looks
          like for you.
        </p>

        <h2 className="mt-8 text-xl font-bold text-primary">
          Points breakdown
        </h2>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
          {result.breakdown.map((item) => (
            <li
              key={item.category}
              className="flex items-center justify-between gap-4 p-4"
            >
              <div>
                <p className="font-semibold text-card-foreground">
                  {item.category}
                </p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </div>
              <p
                className={`text-lg font-bold ${item.points > 0 ? "text-accent" : "text-muted-foreground"}`}
              >
                +{item.points}
              </p>
            </li>
          ))}
        </ul>

        {primaryOccupation ? (
          <p className="mt-4 text-sm text-secondary">
            Nominated occupation from your course:{" "}
            <span className="font-semibold">
              {primaryOccupation.title} ({primaryOccupation.code})
            </span>
            {occupations.length > 1
              ? ` — ${occupations.length - 1} alternative${occupations.length > 2 ? "s" : ""} available`
              : null}
          </p>
        ) : null}

        <h2 className="mt-10 text-xl font-bold text-primary">
          Pathway comparison
        </h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-130 bg-card text-left text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="p-4 font-medium">Pathway</th>
                <th className="p-4 font-medium">Nomination</th>
                <th className="p-4 font-medium">Your points</th>
                <th className="p-4 font-medium">Eligible</th>
                <th className="p-4 font-medium">Est. PR probability</th>
                <th className="p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.pathway.code}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="p-4 font-semibold text-card-foreground">
                    {row.pathway.name}
                  </td>
                  <td className="p-4 text-secondary">{row.bonusLabel}</td>
                  <td className="p-4 font-bold text-card-foreground">
                    {row.totalWithBonus}
                  </td>
                  <td className="p-4">
                    {row.eligible ? (
                      <span className="font-semibold text-accent">Yes</span>
                    ) : (
                      <span className="text-muted-foreground">
                        Needs {MIN_POINTS_REQUIRED - row.totalWithBonus} more
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-card-foreground">
                    {Math.round(row.probability * 100)}%
                  </td>
                  <td className="p-4">
                    {(() => {
                      if (!primaryOccupation) return null;
                      const status = statusByPathway.get(row.pathway.code);
                      if (status === "LOCKED") {
                        return (
                          <Link
                            href={`/roadmap?student=${studentId}`}
                            className="font-semibold text-accent underline"
                          >
                            Locked — view roadmap
                          </Link>
                        );
                      }
                      if (locked) return null;
                      const fields = (
                        <>
                          <input
                            type="hidden"
                            name="studentId"
                            value={studentId}
                          />
                          <input
                            type="hidden"
                            name="pathwayCode"
                            value={row.pathway.code}
                          />
                          <input
                            type="hidden"
                            name="anzscoCode"
                            value={primaryOccupation.code}
                          />
                        </>
                      );
                      if (status === "SELECTED") {
                        return (
                          <form action={lockPathway}>
                            {fields}
                            <button
                              type="submit"
                              className="min-h-9 rounded-md bg-accent px-3 py-1 text-sm font-semibold text-on-accent hover:opacity-90"
                            >
                              Lock &amp; build roadmap
                            </button>
                          </form>
                        );
                      }
                      return (
                        <form action={selectPathway}>
                          {fields}
                          <button
                            type="submit"
                            disabled={!row.eligible}
                            className="min-h-9 rounded-md border border-border px-3 py-1 text-sm font-semibold text-secondary hover:text-accent disabled:opacity-40"
                          >
                            Select
                          </button>
                        </form>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Probabilities are rough estimates until live SkillSelect round data
          is connected. Points table source:{" "}
          <a
            href={POINTS_SOURCE}
            className="underline hover:text-accent"
            target="_blank"
            rel="noreferrer"
          >
            Department of Home Affairs
          </a>
          .
        </p>
      </main>
    </div>
  );
}
