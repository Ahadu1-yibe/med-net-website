import { submitApplication, submitContact } from "../src/lib/actions/public";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
let pass = 0;
let fail = 0;
function check(name: string, condition: boolean) {
  if (condition) {
    pass++;
    console.log(`  PASS  ${name}`);
  } else {
    fail++;
    console.log(`  FAIL  ${name}`);
  }
}

function fd(entries: Record<string, string | string[]>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    if (Array.isArray(v)) v.forEach((item) => form.append(k, item));
    else form.set(k, v);
  }
  return form;
}

async function main() {
  console.log("\n=== PUBLIC FORM ACTION TESTS ===\n");

  console.log("[Join application]");
  const valid = await submitApplication(null, fd({
    fullName: "Audit Applicant",
    email: "form-audit@test.example",
    institution: "Audit University",
    discipline: "Medicine",
    location: "Addis Ababa",
    interests: ["Research", "Digital Health"],
    skills: "Data analysis",
    motivation: "This motivation is definitely long enough to pass validation checks.",
    portfolioUrl: "",
    consent: "on",
  }));
  check("valid application accepted", valid?.ok === true);
  const stored = await db.membershipApplication.findFirst({ where: { email: "form-audit@test.example" } });
  check("application persisted with interests", stored !== null && JSON.parse(stored.interests).length === 2);

  const invalid = await submitApplication(null, fd({
    fullName: "A",
    email: "not-an-email",
    institution: "X",
    discipline: "",
    motivation: "short",
    consent: "on",
  }));
  check("invalid application rejected with message", invalid?.ok === false && !!invalid?.message);

  const noConsent = await submitApplication(null, fd({
    fullName: "Audit Two", email: "form-audit2@test.example", institution: "Audit University",
    discipline: "Nursing", motivation: "This motivation is definitely long enough.", consent: "off",
  }));
  check("missing consent rejected", noConsent?.ok === false);

  const honeypot = await submitApplication(null, fd({
    fullName: "Bot Bot", email: "bot@spam.example", institution: "Spam", discipline: "Other",
    motivation: "Spammy spam spam spam spam.", consent: "on", website: "http://spam.example",
  }));
  const botStored = await db.membershipApplication.findFirst({ where: { email: "bot@spam.example" } });
  check("honeypot silently drops bot submission", honeypot?.ok === true && botStored === null);

  const dup = await submitApplication(null, fd({
    fullName: "Audit Applicant", email: "form-audit@test.example", institution: "Audit University",
    discipline: "Medicine", motivation: "This motivation is definitely long enough.", consent: "on",
  }));
  check("duplicate pending application blocked", dup?.ok === false);

  const xss = await submitApplication(null, fd({
    fullName: "<script>alert(1)</script>", email: "xss@test.example", institution: "<img src=x onerror=alert(1)>",
    discipline: "Medicine", motivation: "Motivation with <b>tags</b> & \"quotes\" 'single' %20 %nul.", consent: "on",
  }));
  check("special characters stored safely (parameterized)", xss?.ok === true);
  const xssRow = await db.membershipApplication.findFirst({ where: { email: "xss@test.example" } });
  check("raw content preserved without execution", xssRow?.fullName.includes("<script>") === true);

  console.log("[Contact form]");
  const contact = await submitContact(null, fd({
    name: "Audit Sender", email: "contact-audit@test.example", category: "PARTNERSHIP",
    message: "This is a sufficiently long partnership inquiry message for the audit.",
  }));
  check("valid contact accepted", contact?.ok === true);
  const cStored = await db.contactSubmission.findFirst({ where: { email: "contact-audit@test.example" } });
  check("contact persisted", cStored?.category === "PARTNERSHIP");

  const badContact = await submitContact(null, fd({
    name: "X", email: "bad", category: "GENERAL", message: "too short",
  }));
  check("invalid contact rejected", badContact?.ok === false);

  const contactHp = await submitContact(null, fd({
    name: "Bot", email: "bot2@spam.example", category: "GENERAL", message: "spam spam spam spam spam spam", website: "spam",
  }));
  const botContact = await db.contactSubmission.findFirst({ where: { email: "bot2@spam.example" } });
  check("contact honeypot works", contactHp?.ok === true && botContact === null);

  console.log("[Rate limiting]");
  let limited = false;
  for (let i = 0; i < 6; i++) {
    const r = await submitContact(null, fd({
      name: `Rate Test ${i}`, email: `rate${i}@test.example`, category: "GENERAL",
      message: "Rate limit test message that is long enough to pass validation.",
    }));
    if (r?.ok === false && r.message.includes("Too many")) limited = true;
  }
  check("6th rapid submission rate-limited", limited);

  console.log("[Cleanup]");
  await db.membershipApplication.deleteMany({ where: { email: { contains: "test.example" } } });
  await db.contactSubmission.deleteMany({ where: { email: { contains: "test.example" } } });
  const remaining = await db.membershipApplication.count({ where: { email: { contains: "test.example" } } });
  check("test data cleaned", remaining === 0);

  console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===\n`);
  if (fail > 0) process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
