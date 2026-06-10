import Link from "next/link";
import {
  ShieldCheck,
  FileCheck,
  GitCompareArrows,
  Milestone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const GOV_SOURCES = [
  "Home Affairs",
  "ABS",
  "data.gov.au",
  "Jobs & Skills Australia",
  "training.gov.au",
];

const STEPS = [
  {
    icon: FileCheck,
    title: "Verify your visa",
    body: "Upload your myVEVO record — your visa subclass, expiry and work rights come straight from Home Affairs, not manual entry.",
  },
  {
    icon: GitCompareArrows,
    title: "See your pathways",
    body: "Your course, occupation and points are matched against live 189 / 190 / 491 data — with PR probability for each option.",
  },
  {
    icon: ShieldCheck,
    title: "Compare & lock a plan",
    body: "Select, swap and compare pathways side by side, then lock one to generate your personalised roadmap.",
  },
  {
    icon: Milestone,
    title: "Track milestones live",
    body: "Skills assessment, English tests, EOI, invitation rounds — every milestone tracked against refreshed government data.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <span className="font-heading text-xl font-bold text-primary">
            PathwayAU
          </span>
          <nav aria-label="Main" className="flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="hidden text-sm font-medium text-secondary hover:text-accent sm:block"
            >
              How it works
            </Link>
            <Link
              href="#sources"
              className="hidden text-sm font-medium text-secondary hover:text-accent sm:block"
            >
              Sources
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent hover:opacity-90"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold leading-tight text-primary sm:text-5xl">
              Your PR pathway, built from official Australian government data.
            </h1>
            <p className="mt-4 text-lg text-secondary">
              For all 622,000+ international students. Every fact cited with
              its source and timestamp — refreshed continuously.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/onboarding"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-semibold text-on-accent hover:opacity-90"
              >
                Start My PR Journey
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="#sources"
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-card px-6 py-3 font-semibold text-primary hover:bg-muted"
              >
                See live data sources
              </Link>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section
          id="sources"
          aria-label="Government data sources"
          className="border-y border-border bg-card"
        >
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <p className="text-sm font-medium text-muted-foreground">
              100% government-sourced. Every displayed fact carries its exact
              source URL and fetch timestamp.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
              {GOV_SOURCES.map((source) => (
                <li
                  key={source}
                  className="flex items-center gap-2 text-sm font-semibold text-secondary"
                >
                  <CheckCircle2
                    className="h-4 w-4 text-success"
                    aria-hidden="true"
                  />
                  {source}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
        >
          <h2 className="text-2xl font-semibold text-primary">How it works</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-on-primary">
                    {i + 1}
                  </span>
                  <step.icon
                    className="h-5 w-5 text-accent"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Bottom CTA */}
        <section className="bg-primary">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
            <h2 className="text-2xl font-semibold text-on-primary sm:text-3xl">
              From verified visa to personalised PR roadmap in under 3 minutes.
            </h2>
            <Link
              href="/onboarding"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-8 py-3 font-semibold text-on-accent hover:opacity-90"
            >
              Start My PR Journey
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="text-sm text-muted-foreground">
            PathwayAU is an independent planning tool. It is not affiliated
            with the Department of Home Affairs and does not provide migration
            advice. All data is sourced from official Australian government
            publications.
          </p>
        </div>
      </footer>
    </div>
  );
}
