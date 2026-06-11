import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OnboardingStep1 } from "./onboarding-form";

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

        <OnboardingStep1 />

        <p className="mt-4 rounded-md bg-muted p-4 text-sm text-secondary">
          Your visa data is stored encrypted. We never see your passport
          number in plain text.
        </p>
      </main>
    </div>
  );
}
