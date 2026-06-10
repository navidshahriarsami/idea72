import Link from "next/link";
import { ArrowLeft, FileUp } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-secondary hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Link>
        <p className="text-sm font-medium text-muted-foreground">
          Step 1 of 3
        </p>
      </div>

      <main className="mt-10 flex-1">
        <h1 className="text-3xl font-bold text-primary">Verify your visa</h1>
        <p className="mt-2 text-secondary">
          We use your official myVEVO record — no manual entry of visa details
          needed.
        </p>

        {/* Module 13 — myVEVO PDF upload (parsing to be implemented) */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
          <FileUp className="h-10 w-10 text-accent" aria-hidden="true" />
          <p className="font-semibold text-card-foreground">
            Drag &amp; drop your myVEVO PDF here
          </p>
          <button
            type="button"
            className="mt-2 min-h-11 rounded-md bg-accent px-6 py-2 font-semibold text-on-accent hover:opacity-90"
          >
            Browse files
          </button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Don&apos;t have one? Generate it free in the myVEVO app from the
          Department of Home Affairs.
        </p>
        <p className="mt-4 rounded-md bg-muted p-4 text-sm text-secondary">
          Your visa data is stored encrypted. We never see your passport
          number in plain text.
        </p>
      </main>
    </div>
  );
}
