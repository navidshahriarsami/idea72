import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { prisma } from "@/lib/db";

const STEPS = [
  {
    title: "Skills assessment",
    description:
      "Lodge your skills assessment with the assessing body for your occupation. Typically takes 8–12 weeks; the outcome is valid for 3 years.",
  },
  {
    title: "Expression of Interest (EOI)",
    description:
      "Submit your EOI in SkillSelect with your points claim. Your date of effect matters — earlier is better at equal points.",
  },
  {
    title: "Health examination",
    description:
      "Book with a Bupa panel physician once you have a HAP ID. Results are valid for 12 months.",
  },
  {
    title: "Police clearances",
    description:
      "AFP check plus one from every country you've lived in for 12+ months in the last 10 years.",
  },
  {
    title: "Visa lodgement",
    description:
      "After an invitation you have 60 days to lodge with all documents ready.",
  },
];

export default async function RoadmapPage({
  searchParams,
}: {
  searchParams: Promise<{ student?: string }>;
}) {
  const { student: studentId } = await searchParams;
  if (!studentId) notFound();

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      pathwayAssessments: {
        where: { status: "LOCKED" },
        include: {
          pathway: true,
          anzsco: {
            include: {
              assessingBodyLinks: { include: { assessingBody: true } },
            },
          },
        },
      },
      documentItems: { orderBy: { documentType: "asc" } },
    },
  });
  if (!student) notFound();

  const lockedAssessment = student.pathwayAssessments[0];
  if (!lockedAssessment) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold text-primary">No locked pathway</h1>
        <p className="mt-2 text-secondary">
          Pick and lock a pathway first to generate your roadmap.
        </p>
        <Link
          href={`/pathways?student=${studentId}`}
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-accent px-6 py-2 font-semibold text-on-accent hover:opacity-90"
        >
          Compare pathways
        </Link>
      </div>
    );
  }

  const assessingBodies = lockedAssessment.anzsco.assessingBodyLinks.map(
    (link) => link.assessingBody,
  );

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-8 sm:px-6">
      <Link
        href={`/pathways?student=${studentId}`}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-secondary hover:text-accent"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to pathways
      </Link>

      <main className="mt-8 flex-1">
        <h1 className="text-3xl font-bold text-primary">
          Your roadmap, {student.givenName}
        </h1>
        <p className="mt-2 text-secondary">
          {lockedAssessment.pathway.name} as{" "}
          <span className="font-semibold">
            {lockedAssessment.anzsco.title} ({lockedAssessment.anzscoCode})
          </span>
          {" — "}locked{" "}
          {lockedAssessment.lockedAt?.toLocaleDateString("en-AU", {
            dateStyle: "long",
          })}
          .
        </p>

        {assessingBodies.length > 0 ? (
          <p className="mt-4 rounded-md bg-muted p-4 text-sm text-secondary">
            Skills assessment for your occupation is done by{" "}
            {assessingBodies.map((body, i) => (
              <span key={body.id}>
                {i > 0 ? ", " : ""}
                <a
                  href={body.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold underline hover:text-accent"
                >
                  {body.name}
                </a>
              </span>
            ))}
            .
          </p>
        ) : null}

        <h2 className="mt-10 text-xl font-bold text-primary">Your steps</h2>
        <ol className="mt-4 space-y-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-on-accent">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-card-foreground">
                  {step.title}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-10 text-xl font-bold text-primary">
          Document checklist
        </h2>
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
          {student.documentItems.map((item) => (
            <li key={item.id} className="flex items-center gap-3 p-4">
              {item.status === "missing" ? (
                <Circle
                  className="h-5 w-5 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-accent"
                  aria-hidden="true"
                />
              )}
              <span className="text-card-foreground">{item.documentType}</span>
              <span className="ml-auto text-sm capitalize text-muted-foreground">
                {item.status}
              </span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
