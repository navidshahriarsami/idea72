// Hand-curated starter reference data. Real ingestion jobs (RefreshLog)
// will replace this with live gov-sourced data later.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const institutions = [
  {
    cricosProviderCode: "00116K",
    name: "The University of Melbourne",
    state: "VIC",
    courses: [
      { cricosCourseCode: "077434M", name: "Master of Software Engineering", level: "Masters", anzsco: ["261313", "261312"] },
      { cricosCourseCode: "094628D", name: "Master of Data Science", level: "Masters", anzsco: ["261111", "224999"] },
      { cricosCourseCode: "060947F", name: "Master of Engineering (Civil)", level: "Masters", anzsco: ["233211"] },
    ],
  },
  {
    cricosProviderCode: "00098G",
    name: "University of New South Wales",
    state: "NSW",
    courses: [
      { cricosCourseCode: "035577A", name: "Bachelor of Engineering (Software)", level: "Bachelor", anzsco: ["261313"] },
      { cricosCourseCode: "058200E", name: "Master of Information Technology", level: "Masters", anzsco: ["261313", "262112"] },
      { cricosCourseCode: "019351E", name: "Master of Professional Accounting", level: "Masters", anzsco: ["221111"] },
    ],
  },
  {
    cricosProviderCode: "00026A",
    name: "The University of Sydney",
    state: "NSW",
    courses: [
      { cricosCourseCode: "087046M", name: "Master of Nursing", level: "Masters", anzsco: ["254499"] },
      { cricosCourseCode: "026269G", name: "Bachelor of Civil Engineering", level: "Bachelor", anzsco: ["233211"] },
    ],
  },
  {
    cricosProviderCode: "00008C",
    name: "Monash University",
    state: "VIC",
    courses: [
      { cricosCourseCode: "079084M", name: "Master of Teaching (Secondary)", level: "Masters", anzsco: ["241411"] },
      { cricosCourseCode: "088924B", name: "Master of Cybersecurity", level: "Masters", anzsco: ["262112"] },
    ],
  },
  {
    cricosProviderCode: "00025B",
    name: "The University of Queensland",
    state: "QLD",
    courses: [
      { cricosCourseCode: "084461D", name: "Master of Mechanical Engineering", level: "Masters", anzsco: ["233512"] },
      { cricosCourseCode: "001794B", name: "Bachelor of Nursing", level: "Bachelor", anzsco: ["254499"] },
    ],
  },
  {
    cricosProviderCode: "00122A",
    name: "RMIT University",
    state: "VIC",
    courses: [
      { cricosCourseCode: "079706G", name: "Bachelor of Information Technology", level: "Bachelor", anzsco: ["261312", "262112"] },
      { cricosCourseCode: "041979A", name: "Diploma of Commercial Cookery", level: "Diploma", anzsco: ["351311"] },
    ],
  },
];

const occupations = [
  { code: "261313", title: "Software Engineer", unitGroup: "2613", skillLevel: 1, bodies: ["ACS"] },
  { code: "261312", title: "Developer Programmer", unitGroup: "2613", skillLevel: 1, bodies: ["ACS"] },
  { code: "261111", title: "ICT Business Analyst", unitGroup: "2611", skillLevel: 1, bodies: ["ACS"] },
  { code: "262112", title: "ICT Security Specialist", unitGroup: "2621", skillLevel: 1, bodies: ["ACS"] },
  { code: "224999", title: "Information and Organisation Professionals nec", unitGroup: "2249", skillLevel: 1, bodies: ["VETASSESS"] },
  { code: "221111", title: "Accountant (General)", unitGroup: "2211", skillLevel: 1, bodies: ["CPA Australia"] },
  { code: "233211", title: "Civil Engineer", unitGroup: "2332", skillLevel: 1, bodies: ["Engineers Australia"] },
  { code: "233512", title: "Mechanical Engineer", unitGroup: "2335", skillLevel: 1, bodies: ["Engineers Australia"] },
  { code: "233311", title: "Electrical Engineer", unitGroup: "2333", skillLevel: 1, bodies: ["Engineers Australia"] },
  { code: "254499", title: "Registered Nurses nec", unitGroup: "2544", skillLevel: 1, bodies: ["ANMAC"] },
  { code: "241411", title: "Secondary School Teacher", unitGroup: "2414", skillLevel: 1, bodies: ["AITSL"] },
  { code: "241111", title: "Early Childhood (Pre-primary School) Teacher", unitGroup: "2411", skillLevel: 1, bodies: ["AITSL"] },
  { code: "351311", title: "Chef", unitGroup: "3513", skillLevel: 2, bodies: ["TRA"] },
  { code: "272511", title: "Social Worker", unitGroup: "2725", skillLevel: 1, bodies: ["AASW"] },
];

const assessingBodies = [
  { name: "ACS", websiteUrl: "https://www.acs.org.au" },
  { name: "Engineers Australia", websiteUrl: "https://www.engineersaustralia.org.au" },
  { name: "VETASSESS", websiteUrl: "https://www.vetassess.com.au" },
  { name: "ANMAC", websiteUrl: "https://www.anmac.org.au" },
  { name: "CPA Australia", websiteUrl: "https://www.cpaaustralia.com.au" },
  { name: "AITSL", websiteUrl: "https://www.aitsl.edu.au" },
  { name: "TRA", websiteUrl: "https://www.tradesrecognitionaustralia.gov.au" },
  { name: "AASW", websiteUrl: "https://www.aasw.asn.au" },
];

const pathways = [
  { code: "189", name: "Skilled Independent visa (subclass 189)" },
  { code: "190", name: "Skilled Nominated visa (subclass 190)" },
  { code: "491", name: "Skilled Work Regional (Provisional) visa (subclass 491)" },
  { code: "485", name: "Temporary Graduate visa (subclass 485)" },
  { code: "482", name: "Skills in Demand visa (subclass 482)" },
];

async function main() {
  for (const body of assessingBodies) {
    await prisma.assessingBody.upsert({
      where: { name: body.name },
      update: { websiteUrl: body.websiteUrl },
      create: body,
    });
  }
  const bodyIdByName = new Map(
    (await prisma.assessingBody.findMany()).map((b) => [b.name, b.id]),
  );

  for (const occ of occupations) {
    const { bodies, ...data } = occ;
    await prisma.anzscoOccupation.upsert({
      where: { code: occ.code },
      update: data,
      create: data,
    });
    for (const name of bodies) {
      const assessingBodyId = bodyIdByName.get(name)!;
      await prisma.anzscoAssessingBodyLink.upsert({
        where: { anzscoCode_assessingBodyId: { anzscoCode: occ.code, assessingBodyId } },
        update: {},
        create: { anzscoCode: occ.code, assessingBodyId },
      });
    }
  }

  for (const inst of institutions) {
    const { courses, ...instData } = inst;
    const institution = await prisma.institution.upsert({
      where: { cricosProviderCode: inst.cricosProviderCode },
      update: { name: inst.name, state: inst.state },
      create: instData,
    });
    for (const course of courses) {
      const { anzsco, ...courseData } = course;
      const saved = await prisma.course.upsert({
        where: { cricosCourseCode: course.cricosCourseCode },
        update: { ...courseData, institutionId: institution.id },
        create: { ...courseData, institutionId: institution.id },
      });
      for (const anzscoCode of anzsco) {
        await prisma.courseAnzscoLink.upsert({
          where: { courseId_anzscoCode: { courseId: saved.id, anzscoCode } },
          update: {},
          create: { courseId: saved.id, anzscoCode },
        });
      }
    }
  }

  for (const pathway of pathways) {
    await prisma.visaPathway.upsert({
      where: { code: pathway.code },
      update: { name: pathway.name },
      create: pathway,
    });
  }

  const counts = {
    institutions: await prisma.institution.count(),
    courses: await prisma.course.count(),
    occupations: await prisma.anzscoOccupation.count(),
    assessingBodies: await prisma.assessingBody.count(),
    pathways: await prisma.visaPathway.count(),
  };
  console.log("Seeded:", counts);
}

main().finally(() => prisma.$disconnect());
