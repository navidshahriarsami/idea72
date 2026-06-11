import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function OnboardingDonePage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const { student: studentId } = await searchParams;
  if (!studentId) notFound();

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      visaProfile: true,
      studyContext: { include: { institution: true, course: true } },
      englishTestResults: { orderBy: { testDate: "desc" }, take: 1 },
    },
  });
  if (!student) notFound();

  const study = student.studyContext;
  const english = student.englishTestResults[0];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8 sm:px-6">
      <main className="mt-10 flex-1">
        <h1 className="text-3xl font-bold text-primary">
          Onboarding complete, {student.givenName}
        </h1>
        <p className="mt-2 text-secondary">
          Here&apos;s what we have on file — pulled straight from the database.
        </p>

        <dl className="mt-8 grid gap-4 rounded-lg border border-border bg-card p-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd className="font-semibold text-card-foreground">
              {student.givenName} {student.familyName}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="font-semibold text-card-foreground">
              {student.email}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Visa subclass</dt>
            <dd className="font-semibold text-card-foreground">
              {student.visaProfile?.visaSubclass ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Visa expiry</dt>
            <dd className="font-semibold text-card-foreground">
              {student.visaProfile
                ? student.visaProfile.visaExpiryDate.toLocaleDateString(
                    "en-AU",
                    { dateStyle: "long" },
                  )
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Institution</dt>
            <dd className="font-semibold text-card-foreground">
              {study?.institution.name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Course</dt>
            <dd className="font-semibold text-card-foreground">
              {study ? `${study.course.name} (${study.course.level})` : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Study location</dt>
            <dd className="font-semibold text-card-foreground">
              {study
                ? `${study.locationPostcode}${study.regionalBonusEligible ? " — regional bonus eligible" : ""}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">English test</dt>
            <dd className="font-semibold text-card-foreground">
              {english
                ? `${english.testType} — ${english.proficiencyLevel}`
                : "—"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-muted-foreground">Verification</dt>
            <dd className="font-semibold text-card-foreground">
              {student.visaProfile?.verificationSource ?? "—"} — verify with a
              myVEVO upload anytime.
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/pathways?student=${student.id}`}
            className="inline-flex min-h-11 items-center rounded-md bg-accent px-6 py-2 font-semibold text-on-accent hover:opacity-90"
          >
            See your visa pathways
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center rounded-md border border-border px-6 py-2 font-semibold text-secondary hover:text-accent"
          >
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
