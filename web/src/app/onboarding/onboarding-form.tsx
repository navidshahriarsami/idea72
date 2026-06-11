"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { FileUp, Loader2 } from "lucide-react";
import {
  createStudentProfile,
  parseVevoPdf,
  type OnboardingFormState,
  type VevoParseState,
} from "./actions";

const fieldClass =
  "mt-1 w-full rounded-md border border-border bg-card px-3 py-2 text-card-foreground focus:outline-none focus:ring-2 focus:ring-accent";

export function VevoUpload({
  onParsed,
}: {
  onParsed: (state: VevoParseState) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.append("vevoPdf", file);
    startTransition(async () => {
      const result = await parseVevoPdf(null, formData);
      if (result && "error" in result) {
        setError(result.error);
      } else {
        onParsed(result);
      }
    });
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
      }}
      className={`mt-8 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed bg-card p-12 text-center ${
        dragging ? "border-accent bg-muted" : "border-border"
      }`}
    >
      {pending ? (
        <Loader2
          className="h-10 w-10 animate-spin text-accent"
          aria-hidden="true"
        />
      ) : (
        <FileUp className="h-10 w-10 text-accent" aria-hidden="true" />
      )}
      <p className="font-semibold text-card-foreground">
        {pending ? "Reading your myVEVO PDF…" : "Drag & drop your myVEVO PDF here"}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
        className="mt-2 min-h-11 rounded-md bg-accent px-6 py-2 font-semibold text-on-accent hover:opacity-90 disabled:opacity-50"
      >
        Browse files
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

export function OnboardingStep1() {
  const [state, formAction, pending] = useActionState<
    OnboardingFormState,
    FormData
  >(createStudentProfile, null);
  const [parsed, setParsed] = useState<NonNullable<
    Extract<VevoParseState, { parsed: unknown }>
  >["parsed"] | null>(null);

  return (
    <>
      <VevoUpload
        onParsed={(result) => {
          if (result && "parsed" in result) setParsed(result.parsed);
        }}
      />

      <p className="mt-6 text-sm text-muted-foreground">
        Don&apos;t have one? Generate it free in the myVEVO app from the
        Department of Home Affairs.
      </p>

      <h2 className="mt-10 text-xl font-bold text-primary">
        {parsed ? "Check your details" : "Or enter your details manually"}
      </h2>
      <p className="mt-1 text-sm text-secondary">
        {parsed
          ? "We've filled these in from your myVEVO PDF — add your email and confirm."
          : "Self-reported details can be verified later with your myVEVO record."}
      </p>

      {/* key remount re-applies defaultValues after a successful parse */}
      <form
        key={parsed ? "vevo" : "manual"}
        action={formAction}
        className="mt-6 grid gap-4 sm:grid-cols-2"
      >
        <input
          type="hidden"
          name="verificationSource"
          value={parsed ? "VEVO_PDF" : "SELF_REPORT"}
        />
        <label className="text-sm font-medium text-secondary">
          Given name
          <input
            name="givenName"
            required
            defaultValue={parsed?.givenName}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium text-secondary">
          Family name
          <input
            name="familyName"
            required
            defaultValue={parsed?.familyName}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium text-secondary sm:col-span-2">
          Email
          <input name="email" type="email" required className={fieldClass} />
        </label>
        <label className="text-sm font-medium text-secondary">
          Date of birth
          <input
            name="birthDate"
            type="date"
            required
            defaultValue={parsed?.birthDate}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium text-secondary">
          Visa subclass
          <input
            name="visaSubclass"
            placeholder="e.g. 500"
            required
            defaultValue={parsed?.visaSubclass}
            className={fieldClass}
          />
        </label>
        <label className="text-sm font-medium text-secondary">
          Visa expiry date
          <input
            name="visaExpiryDate"
            type="date"
            required
            defaultValue={parsed?.visaExpiryDate}
            className={fieldClass}
          />
        </label>

        {state?.error ? (
          <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="min-h-11 rounded-md bg-accent px-6 py-2 font-semibold text-on-accent hover:opacity-90 disabled:opacity-50 sm:col-span-2"
        >
          {pending ? "Saving…" : "Save details"}
        </button>
      </form>
    </>
  );
}
