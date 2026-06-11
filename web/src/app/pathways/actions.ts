"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function selectPathway(formData: FormData) {
  const studentId = String(formData.get("studentId") ?? "");
  const pathwayCode = String(formData.get("pathwayCode") ?? "");
  const anzscoCode = String(formData.get("anzscoCode") ?? "");
  if (!studentId || !pathwayCode || !anzscoCode) return;

  await prisma.$transaction([
    // Swapping is allowed while nothing is locked — demote any other pick.
    prisma.pathwayAssessment.updateMany({
      where: { studentId, status: "SELECTED" },
      data: { status: "CANDIDATE" },
    }),
    prisma.pathwayAssessment.update({
      where: {
        studentId_pathwayCode_anzscoCode: {
          studentId,
          pathwayCode,
          anzscoCode,
        },
      },
      data: { status: "SELECTED" },
    }),
  ]);

  redirect(`/pathways?student=${studentId}`);
}

// Baseline GSM document set; nomination evidence is added for 190/491.
const BASE_DOCUMENTS = [
  "Passport biodata page",
  "Skills assessment outcome",
  "English test evidence",
  "Academic transcripts and completion letter",
  "Health examination (HAP ID)",
  "Police clearance — Australia (AFP)",
  "Police clearance — home country",
];

export async function lockPathway(formData: FormData) {
  const studentId = String(formData.get("studentId") ?? "");
  const pathwayCode = String(formData.get("pathwayCode") ?? "");
  const anzscoCode = String(formData.get("anzscoCode") ?? "");
  if (!studentId || !pathwayCode || !anzscoCode) return;

  const hasEnglishTest =
    (await prisma.englishTestResult.count({ where: { studentId } })) > 0;

  const documents = [...BASE_DOCUMENTS];
  if (pathwayCode === "190" || pathwayCode === "491") {
    documents.push("State nomination evidence");
  }

  const existing = await prisma.documentChecklistItem.findMany({
    where: { studentId },
    select: { documentType: true },
  });
  const existingTypes = new Set(existing.map((d) => d.documentType));

  await prisma.$transaction([
    prisma.pathwayAssessment.update({
      where: {
        studentId_pathwayCode_anzscoCode: {
          studentId,
          pathwayCode,
          anzscoCode,
        },
      },
      data: { status: "LOCKED", lockedAt: new Date() },
    }),
    prisma.documentChecklistItem.createMany({
      data: documents
        .filter((documentType) => !existingTypes.has(documentType))
        .map((documentType) => ({
          studentId,
          documentType,
          status:
            documentType === "English test evidence" && hasEnglishTest
              ? "uploaded"
              : "missing",
        })),
    }),
  ]);

  redirect(`/roadmap?student=${studentId}`);
}
