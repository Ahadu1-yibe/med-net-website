import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

try {
  process.loadEnvFile?.();
} catch {}

const db = new PrismaClient();

const futureDate = (days: number) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function main() {
  console.log("Seeding Med-Net database…");

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Med-Net Admin";

  if (!email || !password) {
    console.warn("  Skipping admin user: set ADMIN_EMAIL and ADMIN_PASSWORD environment variables to create one.");
  } else if (password.length < 12) {
    console.warn("  Skipping admin user: ADMIN_PASSWORD must be at least 12 characters. Choose a strong, unique password.");
  } else {
    const existing = await db.adminUser.findUnique({ where: { email } });
    if (!existing) {
      await db.adminUser.create({
        data: {
          email,
          name,
          passwordHash: await bcrypt.hash(password, 12),
          role: "ADMIN",
        },
      });
      console.log(`  Admin user created: ${email}`);
    } else {
      console.log(`  Admin user already exists: ${email}`);
    }
  }

  const projectCount = await db.project.count();
  if (projectCount === 0) {
    await db.project.createMany({
      data: [
        {
          slug: "digital-health-foundation-series",
          title: "Digital Health Foundation Series",
          summary:
            "Sample entry demonstrating how Med-Net learning projects will appear. A structured introductory program covering digital health fundamentals for health science students.",
          description:
            "**This is a demonstration entry** — replace it with Med-Net's real initiatives through the admin dashboard.\n\nThe Digital Health Foundation Series is designed to give students and young professionals a practical grounding in digital health: what health information systems are, how telemedicine works in low-resource settings, where artificial intelligence is heading in clinical practice, and how data governance applies to health information.",
          category: "education",
          status: "planned",
          problem:
            "Many health science students graduate with little to no practical exposure to the digital systems that increasingly shape modern healthcare delivery.",
          approach:
            "A cohort-based series of practical sessions combining conceptual foundations with hands-on activities, delivered by members and invited practitioners, with learning materials published in the Learning Hub.",
          impact:
            "Equip early cohorts with working knowledge of digital health concepts and vocabulary, and identify members who want to go deeper through research and innovation projects.",
          technologies: stringify(["Workshops", "Learning Hub", "Case Studies"]),
          tags: stringify(["education", "digital-health", "foundations"]),
          featured: true,
          published: true,
          publishedAt: new Date(),
        },
        {
          slug: "community-health-worker-digital-toolkit",
          title: "Community Health Worker Digital Toolkit",
          summary:
            "Sample entry demonstrating project presentation. A proposed toolkit to help community health workers access practical health education materials on low-end devices.",
          description:
            "**This is a demonstration entry.**\n\nA proposed initiative to design and pilot a lightweight digital toolkit for community health workers — offline-capable educational content, simple data collection checklists, and referral guidance — built with and for the people who will use it.",
          category: "digital-health",
          status: "in-progress",
          problem:
            "Community health workers often lack access to up-to-date, practical educational materials that work on basic devices and unreliable connections.",
          approach:
            "Needs assessment with health extension workers, iterative prototyping with lightweight web technology, and pilot testing in partnership with local health institutions.",
          impact:
            "A validated, open toolkit that Med-Net members built together — demonstrating how interdisciplinary collaboration produces practical value for the health system.",
          technologies: stringify(["PWA", "Offline-first", "Open Content"]),
          tags: stringify(["community-health", "toolkit", "prototype"]),
          featured: false,
          published: true,
          publishedAt: new Date(),
        },
        {
          slug: "student-health-innovation-lab",
          title: "Student Health Innovation Lab",
          summary:
            "Sample entry demonstrating project presentation. A semester-long innovation program where interdisciplinary student teams prototype solutions to real health problems.",
          description:
            "**This is a demonstration entry.**\n\nThe Student Health Innovation Lab will bring together medical, public health, computer science and design students to work on real problems submitted by health professionals — from intake triage workflows to patient education — culminating in working prototypes and public presentations.",
          category: "innovation",
          status: "planned",
          problem:
            "Students rarely have structured opportunities to apply their skills to real healthcare problems across disciplinary boundaries.",
          approach:
            "Problem sourcing from health professionals, interdisciplinary team matching, mentorship from experienced members and partners, and a final demonstration day.",
          impact:
            "A pipeline of practical innovation experience, stronger bonds between disciplines, and prototype solutions that may mature into Med-Net projects.",
          technologies: stringify(["Hackathons", "Mentorship", "Prototyping"]),
          tags: stringify(["innovation", "students", "program"]),
          featured: false,
          published: true,
          publishedAt: new Date(),
        },
      ],
    });
    console.log("  Sample projects created (3)");
  }

  const researchCount = await db.researchItem.count();
  if (researchCount === 0) {
    await db.researchItem.createMany({
      data: [
        {
          slug: "digital-health-readiness-of-health-science-students",
          title: "Digital Health Readiness of Health Science Students — Survey Protocol",
          summary:
            "Sample entry demonstrating research presentation. A proposed baseline survey to understand digital health knowledge, access and interest among health science students.",
          description:
            "**This is a demonstration entry.**\n\nA proposed cross-sectional survey protocol designed to establish a baseline understanding of digital health readiness among health science students — covering device access, connectivity, digital literacy, and interest in digital health careers. Results would inform Med-Net's education programs and provide a citable baseline for future studies.",
          category: "digital-health",
          status: "proposed",
          authors: stringify(["Med-Net Research Working Group"]),
          tags: stringify(["survey", "students", "protocol"]),
          featured: true,
          published: true,
          publishedAt: new Date(),
        },
        {
          slug: "telemedicine-adoption-in-ethiopian-facilities",
          title: "Telemedicine Adoption in Ethiopian Health Facilities — Evidence Review",
          summary:
            "Sample entry demonstrating research presentation. A planned rapid evidence review of telemedicine adoption, enablers and barriers in Ethiopian health facilities.",
          description:
            "**This is a demonstration entry.**\n\nA planned rapid review synthesizing published evidence and documented experiences on telemedicine adoption in Ethiopian facilities — what has been piloted, what enabled or blocked adoption, and what lessons matter for future implementation. The review is intended to produce a public policy brief.",
          category: "health-systems",
          status: "proposed",
          authors: stringify(["Med-Net Research Working Group"]),
          tags: stringify(["telemedicine", "evidence-review", "policy"]),
          featured: false,
          published: true,
          publishedAt: new Date(),
        },
      ],
    });
    console.log("  Sample research items created (2)");
  }

  const resourceCount = await db.learningResource.count();
  if (resourceCount === 0) {
    await db.learningResource.createMany({
      data: [
        {
          slug: "what-is-digital-health",
          title: "What Is Digital Health, Really?",
          summary:
            "A plain-language introduction to digital health — what it covers, why it matters for Ethiopia, and where a student or young professional can start.",
          description:
            "**Sample learning resource — replace with Med-Net's real educational content.**\n\n## Beyond the buzzword\n\nDigital health is not one technology. It is the use of information and communication technologies — from a simple SMS reminder to hospital information systems and artificial intelligence — to improve how healthcare is delivered, understood and experienced.\n\n## Why it matters here\n\nIn Ethiopia, digital health is already part of the health system: community health information systems, electronic medical record rollouts, telemedicine initiatives and national digital health strategy all create demand for people who understand both health and technology.\n\n## Where to start\n\n1. Learn the vocabulary of health informatics\n2. Understand data: how it flows, where it lives, who protects it\n3. Pick a practical skill — analysis, development, design or research\n4. Connect with people doing the work — that is what Med-Net is for.",
          type: "article",
          level: "beginner",
          tags: stringify(["foundations", "digital-health"]),
          featured: true,
          published: true,
          publishedAt: new Date(),
        },
        {
          slug: "getting-started-with-health-data-analysis",
          title: "Getting Started with Health Data Analysis",
          summary:
            "A practical beginner's guide to working with health data — from spreadsheets to reproducible analysis — with tool suggestions and learning pathways.",
          description:
            "**Sample learning resource.**\n\nHealth data analysis is one of the most transferable skills a health or technology professional can build. This guide outlines a realistic pathway: mastering spreadsheet fundamentals, learning a statistical language like R or Python, understanding data ethics in health contexts, and practicing with open datasets.",
          type: "guide",
          level: "beginner",
          tags: stringify(["data-science", "skills"]),
          featured: false,
          published: true,
          publishedAt: new Date(),
        },
        {
          slug: "research-ethics-basics-for-student-researchers",
          title: "Research Ethics Basics for Student Researchers",
          summary:
            "What every student researcher should understand about informed consent, data protection, ethical review and responsible publication.",
          description:
            "**Sample learning resource.**\n\nResearch involving people carries responsibilities. This guide covers the fundamentals: why ethical review exists, what informed consent actually requires, how to protect participant data, and how to report findings honestly — including negative ones.",
          type: "guide",
          level: "intermediate",
          tags: stringify(["research", "ethics"]),
          featured: false,
          published: true,
          publishedAt: new Date(),
        },
      ],
    });
    console.log("  Sample learning resources created (3)");
  }

  const postCount = await db.post.count();
  if (postCount === 0) {
    await db.post.createMany({
      data: [
        {
          slug: "founding-member-virtual-introduction-session",
          title: "Founding Member Virtual Introduction Session",
          type: "EVENT",
          excerpt:
            "An online session for prospective founding members: who Med-Net is, what we are building, and how you can take part from the very beginning.",
          description:
            "**Sample announcement — replace with real events.**\n\nMed-Net is hosting a virtual introduction session for prospective founding members. We will present the organization's purpose, the areas of work, current founding-stage priorities, and the practical ways members can contribute right now — followed by open questions and discussion.\n\nThe session link will be shared with registered participants before the event.",
          location: "Online (link shared after registration)",
          startAt: futureDate(30),
          endAt: futureDate(30),
          tags: stringify(["community", "orientation"]),
          featured: true,
          published: true,
          publishAt: new Date(),
        },
        {
          slug: "med-net-begins-formal-establishment",
          title: "Med-Net Begins Formal Establishment as a Civil Society Organization",
          type: "NEWS",
          excerpt:
            "The founding group has begun the formal process of establishing Med-Net Digital Health Collaborative as a civil society organization in Ethiopia.",
          description:
            "**Sample announcement — replace with real organizational news.**\n\nMed-Net Digital Health Collaborative has entered its formal founding stage. Over the coming months, the founding group is finalizing the organization's constitution, establishing its governance structure, and preparing for official registration as a civil society organization.\n\nThis is the quiet, careful work of building an institution — and an open invitation: people who want to help build Med-Net now will shape what it becomes.",
          tags: stringify(["organization", "milestone"]),
          featured: false,
          published: true,
          publishAt: new Date(),
        },
        {
          slug: "why-digital-health-needs-interdisciplinary-teams",
          title: "Why Digital Health Needs Interdisciplinary Teams",
          type: "INSIGHT",
          excerpt:
            "Healthcare's hardest digital problems are rarely technical alone. A perspective on why medicine, technology, research and design must build together.",
          description:
            "**Sample insight — replace with Med-Net's real perspectives.**\n\nMost failed health-technology projects do not fail because of code. They fail because a clinical workflow was misunderstood, because data governance was an afterthought, because the people who would use the system were never part of building it.\n\nThis is the core argument behind Med-Net's existence: digital health is inherently interdisciplinary. The engineer who understands clinical reality, the clinician who understands what software can and cannot do, the researcher who can measure whether any of it worked — these people do not emerge by accident. They emerge from communities built for that purpose.",
          tags: stringify(["perspective", "collaboration"]),
          featured: false,
          published: true,
          publishAt: new Date(),
        },
      ],
    });
    console.log("  Sample posts created (3)");
  }

  const opportunityCount = await db.opportunity.count();
  if (opportunityCount === 0) {
    await db.opportunity.createMany({
      data: [
        {
          slug: "founding-local-ambassadors",
          title: "Founding Local Ambassadors — Call for Interest",
          type: "AMBASSADOR",
          description:
            "Med-Net is recruiting its first local ambassadors to represent the organization at universities, hospitals and regions. Ambassadors grow the local community, organize activities and connect members to national programs. This is a service role with real responsibility — ideal for people who want to build something meaningful and develop leadership experience.",
          requirements:
            "Current student or young professional in a health or technology field\nReliable, communicative and self-driven\nAble to commit a few hours per week\nPassion for connecting people around digital health",
          deadline: futureDate(45),
          applyEmail: "contact@med-net.org",
          status: "OPEN",
          featured: true,
          published: true,
        },
        {
          slug: "website-and-content-volunteers",
          title: "Website & Content Volunteers",
          type: "VOLUNTEER",
          description:
            "Help build and maintain Med-Net's digital presence: writing and editing content, managing the learning hub, designing graphics, or contributing to the website codebase. Remote-friendly with flexible hours.",
          requirements:
            "Writing, editing, design, or web development skills\nAbility to work independently\nInterest in digital health (no expertise required — curiosity is enough)",
          deadline: futureDate(60),
          applyEmail: "contact@med-net.org",
          status: "OPEN",
          featured: false,
          published: true,
        },
      ],
    });
    console.log("  Sample opportunities created (2)");
  }

  console.log("Seed complete. Sample content is clearly marked and ready to be replaced via the admin dashboard.");
}

function stringify(arr: string[]) {
  return JSON.stringify(arr);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
