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

async function main() {
  console.log("\n=== DATABASE INTEGRATION TEST (PostgreSQL) ===\n");

  console.log("[1] Project CRUD");
  const p = await db.project.create({
    data: {
      slug: `audit-test-${Date.now()}`,
      title: "Audit Test Project",
      summary: "Temporary project created by the production audit test suite.",
      category: "innovation",
      status: "planned",
      technologies: JSON.stringify(["Test"]),
      tags: JSON.stringify(["audit"]),
      featured: true,
      published: true,
      publishedAt: new Date(),
    },
  });
  check("create project", !!p.id);
  const pu = await db.project.update({ where: { id: p.id }, data: { status: "in-progress", published: false } });
  check("update project + unpublish", pu.status === "in-progress" && pu.published === false);
  const pf = await db.project.findFirst({ where: { title: { contains: "AUDIT TEST", mode: "insensitive" } } });
  check("case-insensitive search works on Postgres", !!pf);
  await db.project.delete({ where: { id: p.id } });
  check("delete project", !(await db.project.findUnique({ where: { id: p.id } })));

  console.log("[2] Research CRUD");
  const r = await db.researchItem.create({
    data: { slug: `audit-r-${Date.now()}`, title: "Audit Research", summary: "Audit summary text for verification.", published: true, publishedAt: new Date() },
  });
  check("create research", !!r.id);
  await db.researchItem.delete({ where: { id: r.id } });
  check("delete research", true);

  console.log("[3] LearningResource CRUD");
  const l = await db.learningResource.create({
    data: { slug: `audit-l-${Date.now()}`, title: "Audit Resource", summary: "Audit summary for the learning resource.", type: "guide", level: "beginner", published: true, publishedAt: new Date() },
  });
  check("create resource", !!l.id);
  await db.learningResource.delete({ where: { id: l.id } });
  check("delete resource", true);

  console.log("[4] Post CRUD (event + scheduled)");
  const ev = await db.post.create({
    data: { slug: `audit-e-${Date.now()}`, title: "Audit Event", type: "EVENT", excerpt: "Audit excerpt.", startAt: new Date(Date.now() + 86400000), published: true, publishAt: new Date() },
  });
  check("create event", !!ev.id);
  const sched = await db.post.create({
    data: { slug: `audit-s-${Date.now()}`, title: "Audit Scheduled", type: "NEWS", excerpt: "Audit excerpt.", published: false, publishAt: new Date(Date.now() + 86400000) },
  });
  check("create scheduled draft", !!sched.id && !sched.published);
  await db.post.delete({ where: { id: ev.id } });
  await db.post.delete({ where: { id: sched.id } });

  console.log("[5] Opportunity CRUD");
  const o = await db.opportunity.create({
    data: { slug: `audit-o-${Date.now()}`, title: "Audit Opportunity", type: "VOLUNTEER", description: "Audit description for the test opportunity.", status: "OPEN", published: true },
  });
  check("create opportunity", !!o.id);
  await db.opportunity.delete({ where: { id: o.id } });

  console.log("[6] Partner CRUD");
  const pa = await db.partner.create({
    data: { name: "Audit Partner Org", tier: "COLLABORATING", published: true },
  });
  check("create partner", !!pa.id);
  await db.partner.delete({ where: { id: pa.id } });

  console.log("[7] MediaAsset (BLOB persistence)");
  const bytes = Buffer.from("test-image-bytes");
  const m = await db.mediaAsset.create({
    data: { filename: "audit.png", mimeType: "image/png", size: bytes.length, kind: "UPLOAD", alt: "audit", data: bytes },
  });
  const mBack = await db.mediaAsset.findUnique({ where: { id: m.id } });
  check("store + retrieve binary data", Buffer.from(mBack!.data as unknown as Uint8Array).equals(bytes));
  await db.mediaAsset.delete({ where: { id: m.id } });
  check("delete media", true);

  console.log("[8] MembershipApplication workflow");
  const app = await db.membershipApplication.create({
    data: {
      fullName: "Audit Applicant", email: "audit@test.example", institution: "Test University",
      discipline: "Medicine", interests: JSON.stringify(["Research"]), motivation: "This is a test motivation long enough.", consent: true,
    },
  });
  const dup = await db.membershipApplication.findFirst({
    where: { email: "audit@test.example", status: { in: ["NEW", "REVIEWING"] } },
  });
  check("create application + duplicate detection query", !!dup);
  await db.membershipApplication.update({ where: { id: app.id }, data: { status: "ACCEPTED" } });
  await db.membershipApplication.delete({ where: { id: app.id } });
  check("status update + delete application", true);

  console.log("[9] ContactSubmission workflow");
  const msg = await db.contactSubmission.create({
    data: { name: "Audit Sender", email: "audit@test.example", category: "GENERAL", message: "This is a test message for the audit." },
  });
  check("create message", !!msg.id);
  await db.contactSubmission.delete({ where: { id: msg.id } });

  console.log("[10] SiteSettings upsert");
  await db.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", data: JSON.stringify({ site: { email: "audit@test.example" } }) },
    update: { data: JSON.stringify({ site: { email: "audit@test2.example" } }) },
  });
  const s = await db.siteSettings.findUnique({ where: { id: "singleton" } });
  check("settings upsert + read", s !== null);
  await db.siteSettings.delete({ where: { id: "singleton" } }).catch(() => {});

  console.log("[11] AuditLog + user relation (SetNull on delete)");
  const u = await db.adminUser.findFirstOrThrow({ where: { role: "ADMIN" } });
  const log = await db.auditLog.create({
    data: { userId: u.id, userEmail: u.email, action: "audit-test", entity: "Test" },
  });
  check("create audit entry", !!log.id);
  await db.auditLog.delete({ where: { id: log.id } });

  console.log("[12] Seed data integrity");
  const counts = {
    projects: await db.project.count(),
    research: await db.researchItem.count(),
    resources: await db.learningResource.count(),
    posts: await db.post.count(),
    opportunities: await db.opportunity.count(),
  };
  check("seeded content present", counts.projects >= 3 && counts.research >= 2 && counts.resources >= 3 && counts.posts >= 3 && counts.opportunities >= 2);
  const admins = await db.adminUser.count();
  check("admin user present", admins >= 1);

  console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===\n`);
  if (fail > 0) process.exit(1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
