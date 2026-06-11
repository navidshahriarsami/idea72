import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { EnglishForm } from "./english-form";

export default async function EnglishTestPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const { student: studentId } = await searchParams;
  if (!studentId) notFound();

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });
  if (!student) notFound();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/onboarding/study?student=${studentId}`}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-secondary hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <p className="text-sm font-medium text-muted-foreground">
          Step 3 of 3
        </p>
      </div>

      <main className="mt-10 flex-1">
        <h1 className="text-3xl font-bold text-primary">
          Your English test result
        </h1>
        <p className="mt-2 text-secondary">
          English proficiency is worth up to 20 points. Results are valid for 3
          years.
        </p>

        <EnglishForm studentId={studentId} />
      </main>
    </div>
  );
}
