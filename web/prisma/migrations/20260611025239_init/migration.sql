-- CreateEnum
CREATE TYPE "VisaVerificationSource" AS ENUM ('VEVO_API', 'VEVO_PDF', 'SELF_REPORT');

-- CreateEnum
CREATE TYPE "PathwayAssessmentStatus" AS ENUM ('CANDIDATE', 'SELECTED', 'LOCKED');

-- CreateEnum
CREATE TYPE "NominationStatus" AS ENUM ('OPEN', 'CLOSED', 'CAPPED');

-- CreateEnum
CREATE TYPE "OccupationListType" AS ENUM ('CSOL', 'MLTSSL', 'STSOL', 'OSL', 'SPL');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "givenName" TEXT NOT NULL,
    "familyName" TEXT NOT NULL,
    "birthDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaProfile" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "visaSubclass" TEXT NOT NULL,
    "visaClass" TEXT,
    "visaGrantDate" DATE,
    "visaExpiryDate" DATE NOT NULL,
    "status" TEXT NOT NULL,
    "residenceStatus" TEXT,
    "immigrationStatus" TEXT,
    "studyEntitlementStatus" TEXT,
    "workEntitlementStatus" TEXT,
    "studyConditions" JSONB,
    "workConditions" JSONB,
    "visaHolderIsOnshore" BOOLEAN,
    "verificationSource" "VisaVerificationSource" NOT NULL,
    "verifiedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyContext" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "courseStart" DATE NOT NULL,
    "courseEndExpected" DATE NOT NULL,
    "locationPostcode" TEXT NOT NULL,
    "regionalBonusEligible" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StudyContext_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cricosProviderCode" TEXT NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "cricosCourseCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnzscoOccupation" (
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "unitGroup" TEXT NOT NULL,
    "skillLevel" INTEGER NOT NULL,

    CONSTRAINT "AnzscoOccupation_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CourseAnzscoLink" (
    "courseId" TEXT NOT NULL,
    "anzscoCode" TEXT NOT NULL,

    CONSTRAINT "CourseAnzscoLink_pkey" PRIMARY KEY ("courseId","anzscoCode")
);

-- CreateTable
CREATE TABLE "AssessingBody" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,

    CONSTRAINT "AssessingBody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnzscoAssessingBodyLink" (
    "anzscoCode" TEXT NOT NULL,
    "assessingBodyId" TEXT NOT NULL,

    CONSTRAINT "AnzscoAssessingBodyLink_pkey" PRIMARY KEY ("anzscoCode","assessingBodyId")
);

-- CreateTable
CREATE TABLE "VisaPathway" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "baseRequirements" JSONB,

    CONSTRAINT "VisaPathway_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "SkillsAssessment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "anzscoCode" TEXT NOT NULL,
    "assessingBodyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "lodgedDate" DATE,
    "outcomeDate" DATE,
    "expiryDate" DATE,
    "outcome" TEXT,

    CONSTRAINT "SkillsAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnglishTestResult" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "testType" TEXT NOT NULL,
    "scores" JSONB NOT NULL,
    "testDate" DATE NOT NULL,
    "expiryDate" DATE NOT NULL,
    "proficiencyLevel" TEXT NOT NULL,

    CONSTRAINT "EnglishTestResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PointsCalculation" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPoints" INTEGER NOT NULL,
    "breakdown" JSONB NOT NULL,
    "sourceCitation" TEXT NOT NULL,

    CONSTRAINT "PointsCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathwayAssessment" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "pathwayCode" TEXT NOT NULL,
    "anzscoCode" TEXT NOT NULL,
    "prProbability" DOUBLE PRECISION NOT NULL,
    "minPointsRequired" INTEGER NOT NULL,
    "processingTimeEstimate" TEXT,
    "status" "PathwayAssessmentStatus" NOT NULL DEFAULT 'CANDIDATE',
    "lockedAt" TIMESTAMP(3),

    CONSTRAINT "PathwayAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Eoi" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "pathwayCode" TEXT NOT NULL,
    "anzscoCode" TEXT NOT NULL,
    "pointsAtLodgement" INTEGER NOT NULL,
    "dateOfEffect" DATE NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Eoi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthExamination" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "panelPhysician" TEXT,
    "examDate" DATE,
    "resultStatus" TEXT NOT NULL,
    "expiryDate" DATE,

    CONSTRAINT "HealthExamination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliceClearance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "issuedDate" DATE,
    "status" TEXT NOT NULL,

    CONSTRAINT "PoliceClearance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentChecklistItem" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3),

    CONSTRAINT "DocumentChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillSelectRound" (
    "id" TEXT NOT NULL,
    "pathwayCode" TEXT NOT NULL,
    "anzscoCode" TEXT NOT NULL,
    "roundDate" DATE NOT NULL,
    "occupationCeiling" INTEGER,
    "minPointsInvited" INTEGER,
    "sourceUrl" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillSelectRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StateNomination" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pathwayCode" TEXT NOT NULL,
    "anzscoCode" TEXT NOT NULL,
    "status" "NominationStatus" NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StateNomination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OccupationShortageStatus" (
    "id" TEXT NOT NULL,
    "anzscoCode" TEXT NOT NULL,
    "listType" "OccupationListType" NOT NULL,
    "status" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OccupationShortageStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessingTimeEstimate" (
    "id" TEXT NOT NULL,
    "pathwayCode" TEXT NOT NULL,
    "percentile50Days" INTEGER,
    "percentile75Days" INTEGER,
    "percentile90Days" INTEGER,
    "sourceUrl" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessingTimeEstimate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaFee" (
    "id" TEXT NOT NULL,
    "pathwayCode" TEXT NOT NULL,
    "baseFeeAud" DECIMAL(10,2) NOT NULL,
    "effectiveDate" DATE NOT NULL,
    "sourceUrl" TEXT NOT NULL,

    CONSTRAINT "VisaFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSourceCitation" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL,
    "refreshLogId" TEXT,

    CONSTRAINT "DataSourceCitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshLog" (
    "id" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RefreshLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VisaProfile_studentId_key" ON "VisaProfile"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "StudyContext_studentId_key" ON "StudyContext"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_cricosProviderCode_key" ON "Institution"("cricosProviderCode");

-- CreateIndex
CREATE UNIQUE INDEX "Course_cricosCourseCode_key" ON "Course"("cricosCourseCode");

-- CreateIndex
CREATE UNIQUE INDEX "AssessingBody_name_key" ON "AssessingBody"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PathwayAssessment_studentId_pathwayCode_anzscoCode_key" ON "PathwayAssessment"("studentId", "pathwayCode", "anzscoCode");

-- CreateIndex
CREATE UNIQUE INDEX "Eoi_studentId_key" ON "Eoi"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "SkillSelectRound_pathwayCode_anzscoCode_roundDate_key" ON "SkillSelectRound"("pathwayCode", "anzscoCode", "roundDate");

-- CreateIndex
CREATE UNIQUE INDEX "StateNomination_state_pathwayCode_anzscoCode_key" ON "StateNomination"("state", "pathwayCode", "anzscoCode");

-- CreateIndex
CREATE UNIQUE INDEX "OccupationShortageStatus_anzscoCode_listType_key" ON "OccupationShortageStatus"("anzscoCode", "listType");

-- CreateIndex
CREATE INDEX "DataSourceCitation_entityType_entityId_idx" ON "DataSourceCitation"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "VisaProfile" ADD CONSTRAINT "VisaProfile_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyContext" ADD CONSTRAINT "StudyContext_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyContext" ADD CONSTRAINT "StudyContext_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyContext" ADD CONSTRAINT "StudyContext_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAnzscoLink" ADD CONSTRAINT "CourseAnzscoLink_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseAnzscoLink" ADD CONSTRAINT "CourseAnzscoLink_anzscoCode_fkey" FOREIGN KEY ("anzscoCode") REFERENCES "AnzscoOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnzscoAssessingBodyLink" ADD CONSTRAINT "AnzscoAssessingBodyLink_anzscoCode_fkey" FOREIGN KEY ("anzscoCode") REFERENCES "AnzscoOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnzscoAssessingBodyLink" ADD CONSTRAINT "AnzscoAssessingBodyLink_assessingBodyId_fkey" FOREIGN KEY ("assessingBodyId") REFERENCES "AssessingBody"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsAssessment" ADD CONSTRAINT "SkillsAssessment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsAssessment" ADD CONSTRAINT "SkillsAssessment_anzscoCode_fkey" FOREIGN KEY ("anzscoCode") REFERENCES "AnzscoOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillsAssessment" ADD CONSTRAINT "SkillsAssessment_assessingBodyId_fkey" FOREIGN KEY ("assessingBodyId") REFERENCES "AssessingBody"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnglishTestResult" ADD CONSTRAINT "EnglishTestResult_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PointsCalculation" ADD CONSTRAINT "PointsCalculation_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathwayAssessment" ADD CONSTRAINT "PathwayAssessment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathwayAssessment" ADD CONSTRAINT "PathwayAssessment_pathwayCode_fkey" FOREIGN KEY ("pathwayCode") REFERENCES "VisaPathway"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PathwayAssessment" ADD CONSTRAINT "PathwayAssessment_anzscoCode_fkey" FOREIGN KEY ("anzscoCode") REFERENCES "AnzscoOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eoi" ADD CONSTRAINT "Eoi_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eoi" ADD CONSTRAINT "Eoi_pathwayCode_fkey" FOREIGN KEY ("pathwayCode") REFERENCES "VisaPathway"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eoi" ADD CONSTRAINT "Eoi_anzscoCode_fkey" FOREIGN KEY ("anzscoCode") REFERENCES "AnzscoOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HealthExamination" ADD CONSTRAINT "HealthExamination_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliceClearance" ADD CONSTRAINT "PoliceClearance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentChecklistItem" ADD CONSTRAINT "DocumentChecklistItem_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillSelectRound" ADD CONSTRAINT "SkillSelectRound_pathwayCode_fkey" FOREIGN KEY ("pathwayCode") REFERENCES "VisaPathway"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillSelectRound" ADD CONSTRAINT "SkillSelectRound_anzscoCode_fkey" FOREIGN KEY ("anzscoCode") REFERENCES "AnzscoOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateNomination" ADD CONSTRAINT "StateNomination_pathwayCode_fkey" FOREIGN KEY ("pathwayCode") REFERENCES "VisaPathway"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StateNomination" ADD CONSTRAINT "StateNomination_anzscoCode_fkey" FOREIGN KEY ("anzscoCode") REFERENCES "AnzscoOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccupationShortageStatus" ADD CONSTRAINT "OccupationShortageStatus_anzscoCode_fkey" FOREIGN KEY ("anzscoCode") REFERENCES "AnzscoOccupation"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProcessingTimeEstimate" ADD CONSTRAINT "ProcessingTimeEstimate_pathwayCode_fkey" FOREIGN KEY ("pathwayCode") REFERENCES "VisaPathway"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisaFee" ADD CONSTRAINT "VisaFee_pathwayCode_fkey" FOREIGN KEY ("pathwayCode") REFERENCES "VisaPathway"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataSourceCitation" ADD CONSTRAINT "DataSourceCitation_refreshLogId_fkey" FOREIGN KEY ("refreshLogId") REFERENCES "RefreshLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
