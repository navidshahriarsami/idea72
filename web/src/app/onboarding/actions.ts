"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isRegionalPostcode } from "@/lib/regional";

export type OnboardingFormState = { error: string } | null;

export type VevoParseState =
  | { error: string }
  | {
      parsed: {
        givenName?: string;
        familyName?: string;
        birthDate?: string;
        visaSubclass?: string;
        visaExpiryDate?: string;
      };
    }
  | null;

export async function parseVevoPdf(
  _prevState: VevoParseState,
  formData: FormData,
): Promise<VevoParseState> {
  const file = formData.get("vevoPdf");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a PDF file." };
  }
  if (file.type !== "application/pdf") {
    return { error: "That doesn't look like a PDF — myVEVO exports are PDFs." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "File is too large (max 5 MB)." };
  }

  const { PDFParse } = await import("pdf-parse");
  const { parseVevoText } = await import("@/lib/vevo");

  let text: string;
  try {
    const parser = new PDFParse({
      data: new Uint8Array(await file.arrayBuffer()),
    });
    text = (await parser.getText()).text;
    await parser.destroy();
  } catch {
    return { error: "Couldn't read that PDF. Try re-exporting it from myVEVO." };
  }

  const details = parseVevoText(text);
  if (!details.visaSubclass && !details.visaExpiryDate) {
    return {
      error:
        "Couldn't find visa details in that PDF. Make sure it's a myVEVO export, or enter your details manually below.",
    };
  }

  return {
    parsed: {
      givenName: details.givenName,
      familyName: details.familyName,
      birthDate: details.birthDate,
      visaSubclass: details.visaSubclass,
      visaExpiryDate: details.visaExpiryDate,
    },
  };
}

export async function createStudentProfile(
  _prevState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const givenName = String(formData.get("givenName") ?? "").trim();
  const familyName = String(formData.get("familyName") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "");
  const visaSubclass = String(formData.get("visaSubclass") ?? "").trim();
  const visaExpiryDate = String(formData.get("visaExpiryDate") ?? "");
  const verificationSource =
    formData.get("verificationSource") === "VEVO_PDF"
      ? ("VEVO_PDF" as const)
      : ("SELF_REPORT" as const);

  if (
    !email ||
    !givenName ||
    !familyName ||
    !birthDate ||
    !visaSubclass ||
    !visaExpiryDate
  ) {
    return { error: "Please fill in every field." };
  }

  const student = await prisma.student.upsert({
    where: { email },
    update: { givenName, familyName, birthDate: new Date(birthDate) },
    create: {
      email,
      givenName,
      familyName,
      birthDate: new Date(birthDate),
    },
  });

  await prisma.visaProfile.upsert({
    where: { studentId: student.id },
    update: {
      visaSubclass,
      visaExpiryDate: new Date(visaExpiryDate),
      status: "GRANTED",
      verificationSource,
      verifiedAt: new Date(),
    },
    create: {
      studentId: student.id,
      visaSubclass,
      visaExpiryDate: new Date(visaExpiryDate),
      status: "GRANTED",
      verificationSource,
      verifiedAt: new Date(),
    },
  });

  redirect(`/onboarding/study?student=${student.id}`);
}

export async function saveStudyContext(
  _prevState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const studentId = String(formData.get("studentId") ?? "");
  const courseId = String(formData.get("courseId") ?? "");
  const courseStart = String(formData.get("courseStart") ?? "");
  const courseEndExpected = String(formData.get("courseEndExpected") ?? "");
  const locationPostcode = String(formData.get("locationPostcode") ?? "").trim();

  if (!studentId || !courseId || !courseStart || !courseEndExpected) {
    return { error: "Please fill in every field." };
  }
  if (!/^\d{4}$/.test(locationPostcode)) {
    return { error: "Postcode must be 4 digits." };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { error: "Please choose a course from the list." };

  const data = {
    institutionId: course.institutionId,
    courseId,
    courseStart: new Date(courseStart),
    courseEndExpected: new Date(courseEndExpected),
    locationPostcode,
    regionalBonusEligible: isRegionalPostcode(locationPostcode),
  };

  await prisma.studyContext.upsert({
    where: { studentId },
    update: data,
    create: { studentId, ...data },
  });

  redirect(`/onboarding/english?student=${studentId}`);
}

const PROFICIENCY_THRESHOLDS: Record<
  string,
  { superior: number; proficient: number; competent: number }
> = {
  IELTS: { superior: 8, proficient: 7, competent: 6 },
  PTE: { superior: 79, proficient: 65, competent: 50 },
  TOEFL: { superior: 110, proficient: 94, competent: 64 },
};

export async function saveEnglishTest(
  _prevState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const studentId = String(formData.get("studentId") ?? "");
  const testType = String(formData.get("testType") ?? "");
  const overall = Number(formData.get("overall"));
  const testDate = String(formData.get("testDate") ?? "");

  if (!studentId || !testType || !testDate || Number.isNaN(overall)) {
    return { error: "Please fill in every field." };
  }

  const thresholds = PROFICIENCY_THRESHOLDS[testType];
  if (!thresholds) return { error: "Unsupported test type." };

  const proficiencyLevel =
    overall >= thresholds.superior
      ? "superior"
      : overall >= thresholds.proficient
        ? "proficient"
        : "competent";

  const taken = new Date(testDate);
  const expiry = new Date(taken);
  expiry.setFullYear(expiry.getFullYear() + 3);

  await prisma.englishTestResult.create({
    data: {
      studentId,
      testType,
      scores: { overall },
      testDate: taken,
      expiryDate: expiry,
      proficiencyLevel,
    },
  });

  redirect(`/onboarding/done?student=${studentId}`);
}
