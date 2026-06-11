import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { StudyForm } from "./study-form";

export default async function StudyContextPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const { student: studentId } = await searchParams;
  if (!studentId) notFound();

  const [student, institutions, existing] = await Promise.all([
    prisma.student.findUnique({ where: { id: studentId } }),
    prisma.institution.findMany({
      orderBy: { name: "asc" },
      include: { courses: { orderBy: { name: "asc" } } },
    }),
    prisma.studyContext.findUnique({ where: { studentId } }),
  ]);
  if (!student) notFound();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          href="/onboarding"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-secondary hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <p className="text-sm font-medium text-muted-foreground">
          Step 2 of 3
        </p>
      </div>

      <main className="mt-10 flex-1">
        <h1 className="text-3xl font-bold text-primary">Your study details</h1>
        <p className="mt-2 text-secondary">
          Your course determines which occupations — and which visa pathways —
          are open to you. Studying regionally can add bonus points.
        </p>

        <StudyForm
          studentId={studentId}
          institutions={institutions.map((inst) => ({
            id: inst.id,
            name: inst.name,
            courses: inst.courses.map((c) => ({
              id: c.id,
              name: c.name,
              level: c.level,
            })),
          }))}
          defaults={
            existing
              ? {
                  institutionId: existing.institutionId,
                  courseId: existing.courseId,
                  locationPostcode: existing.locationPostcode,
                }
              : null
          }
        />
      </main>
    </div>
  );
}
