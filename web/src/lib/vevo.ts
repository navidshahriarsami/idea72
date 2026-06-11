// Extracts visa details from the text of a myVEVO PDF. Layouts vary
// between the app export and the VEVO email, so every field is matched
// independently and missing ones are simply omitted.

export type VevoDetails = {
  givenName?: string;
  familyName?: string;
  birthDate?: string; // yyyy-mm-dd
  visaSubclass?: string;
  visaClass?: string;
  visaGrantDate?: string;
  visaExpiryDate?: string;
};

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

function toIsoDate(raw: string): string | undefined {
  const trimmed = raw.trim();

  // "15 March 2027"
  const long = trimmed.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (long) {
    const month = MONTHS[long[2].toLowerCase()];
    if (month) {
      return `${long[3]}-${String(month).padStart(2, "0")}-${long[1].padStart(2, "0")}`;
    }
  }

  // "15/03/2027" (Australian day-first)
  const slash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    return `${slash[3]}-${slash[2].padStart(2, "0")}-${slash[1].padStart(2, "0")}`;
  }

  return undefined;
}

function matchField(text: string, labels: string[]): string | undefined {
  for (const label of labels) {
    // Label and value may be separated by a colon, newline, or both.
    const re = new RegExp(`${label}\\s*:?\\s*\\n?\\s*([^\\n]+)`, "i");
    const found = text.match(re);
    if (found) return found[1].trim();
  }
  return undefined;
}

export function parseVevoText(text: string): VevoDetails {
  const details: VevoDetails = {};

  const family = matchField(text, ["Family name", "Surname"]);
  if (family) details.familyName = family;

  const given = matchField(text, ["Given name\\(s\\)", "Given names?"]);
  if (given) details.givenName = given;

  const dob = matchField(text, ["Date of birth"]);
  if (dob) details.birthDate = toIsoDate(dob);

  // "Visa class / subclass: TU / 500" or separate "Visa subclass: 500"
  const classSubclass = text.match(
    /class\s*\/\s*subclass\s*:?\s*\n?\s*([A-Z]{1,3})\s*\/\s*(\d{3})/i,
  );
  if (classSubclass) {
    details.visaClass = classSubclass[1];
    details.visaSubclass = classSubclass[2];
  } else {
    const subclass = matchField(text, ["Visa subclass", "Subclass"]);
    const digits = subclass?.match(/\d{3}/);
    if (digits) details.visaSubclass = digits[0];
  }

  const grant = matchField(text, ["Visa grant date", "Grant date"]);
  if (grant) details.visaGrantDate = toIsoDate(grant);

  const expiry = matchField(text, [
    "Visa expiry date",
    "Expiry date",
    "Must leave by",
    "Stay until",
  ]);
  if (expiry) details.visaExpiryDate = toIsoDate(expiry);

  return details;
}
