"use client";

import { useActionState, useState } from "react";
import { saveStudyContext } from "../actions";
import type { OnboardingFormState } from "../actions";

type InstitutionOption = {
  id: string;
  name: string;
  courses: { id: string; name: string; level: string }[];
};

const fieldClass =
  "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent";

export function StudyForm({
  studentId,
  institutions,
  defaults,
}: {
  studentId: string;
  institutions: InstitutionOption[];
  defaults: {
    institutionId: string;
    courseId: string;
    locationPostcode: string;
  } | null;
}) {
  const [state, formAction, pending] = useActionState<
    OnboardingFormState,
    FormData
  >(saveStudyContext, null);
  const [institutionId, setInstitutionId] = useState(
    defaults?.institutionId ?? "",
  );

  const courses =
    institutions.find((inst) => inst.id === institutionId)?.courses ?? [];

  return (
    <form action={formAction} className="mt-6 grid gap-4">
      <input type="hidden" name="studentId" value={studentId} />

      <label className="text-sm font-medium text-secondary">
        Institution
        <select
          name="institutionId"
          required
          value={institutionId}
          onChange={(e) => setInstitutionId(e.target.value)}
          className={fieldClass}
        >
          <option value="">Select your institution…</option>
          {institutions.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium text-secondary">
        Course
        <select
          name="courseId"
          required
          defaultValue={defaults?.courseId ?? ""}
          className={fieldClass}
        >
          <option value="">
            {institutionId ? "Select your course…" : "Choose an institution first"}
          </option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.level})
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-secondary">
          Course start
          <input
            name="courseStart"
            type="date"
            required
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium text-secondary">
          Expected course end
          <input
            name="courseEndExpected"
            type="date"
            required
            className={fieldClass}
          />
        </label>
      </div>

      <label className="text-sm font-medium text-secondary">
        Postcode where you study
        <input
          name="locationPostcode"
          inputMode="numeric"
          pattern="\d{4}"
          placeholder="e.g. 3000"
          required
          defaultValue={defaults?.locationPostcode ?? ""}
          className={fieldClass}
        />
      </label>

      {state?.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-md bg-accent px-6 py-2 font-semibold text-on-accent hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Continue"}
      </button>
    </form>
  );
}
