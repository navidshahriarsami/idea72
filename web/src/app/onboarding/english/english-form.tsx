"use client";

import { useActionState } from "react";
import { saveEnglishTest } from "../actions";
import type { OnboardingFormState } from "../actions";

const fieldClass =
  "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent";

export function EnglishForm({ studentId }: { studentId: string }) {
  const [state, formAction, pending] = useActionState<
    OnboardingFormState,
    FormData
  >(saveEnglishTest, null);

  return (
    <form action={formAction} className="mt-6 grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="studentId" value={studentId} />

      <label className="text-sm font-medium text-secondary">
        Test type
        <select name="testType" required className={fieldClass}>
          <option value="">Select a test…</option>
          <option value="IELTS">IELTS</option>
          <option value="PTE">PTE Academic</option>
          <option value="TOEFL">TOEFL iBT</option>
        </select>
      </label>

      <label className="text-sm font-medium text-secondary">
        Overall score
        <input
          name="overall"
          type="number"
          step="0.5"
          required
          placeholder="e.g. 7.5"
          className={fieldClass}
        />
      </label>

      <label className="text-sm font-medium text-secondary sm:col-span-2">
        Test date
        <input name="testDate" type="date" required className={fieldClass} />
      </label>

      {state?.error ? (
        <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-md bg-accent px-6 py-2 font-semibold text-on-accent hover:opacity-90 disabled:opacity-50 sm:col-span-2"
      >
        {pending ? "Saving…" : "Finish"}
      </button>
    </form>
  );
}
