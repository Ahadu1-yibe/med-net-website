import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";

export type HomepageSectionConfig = {
  visible: boolean;
  title: string;
  subtitle: string;
};

export type SiteSettingsData = {
  site: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    email: string;
    location: string;
    linkedin: string;
    twitter: string;
    github: string;
    telegram: string;
    footerNote: string;
  };
  appearance: {
    defaultMode: "system" | "light" | "dark";
    accent: string;
  };
  homepage: {
    hero: {
      badge: string;
      titleTop: string;
      titleHighlight: string;
      titleBottom: string;
      subtitle: string;
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
    };
    intro: HomepageSectionConfig & { body: string; points: string[] };
    areas: HomepageSectionConfig;
    projects: HomepageSectionConfig;
    research: HomepageSectionConfig;
    updates: HomepageSectionConfig;
    community: HomepageSectionConfig;
    partners: HomepageSectionConfig;
    cta: HomepageSectionConfig & {
      primaryLabel: string;
      primaryHref: string;
      secondaryLabel: string;
      secondaryHref: string;
    };
  };
};

export const DEFAULT_SETTINGS: SiteSettingsData = {
  site: {
    name: "Med-Net Digital Health Collaborative",
    shortName: "Med-Net",
    tagline: "Connecting people, knowledge and technology to advance healthcare.",
    description:
      "Med-Net Digital Health Collaborative is an emerging civil society organization based in Ethiopia that connects students, professionals, researchers and innovators to advance healthcare through digital health, education, research, innovation and collaboration.",
    email: "contact@med-net.org",
    location: "Ethiopia",
    linkedin: "",
    twitter: "",
    github: "",
    telegram: "",
    footerNote: "A civil society organization — formal registration in progress.",
  },
  appearance: {
    defaultMode: "system",
    accent: "teal",
  },
  homepage: {
    hero: {
      badge: "Emerging from Ethiopia · Open to the world",
      titleTop: "Building the future of healthcare",
      titleHighlight: "through technology",
      titleBottom: "and collaboration.",
      subtitle:
        "Med-Net is a digital health collaborative that connects people, knowledge, technology and innovation to strengthen healthcare — starting in Ethiopia, open to the world.",
      primaryLabel: "Explore Med-Net",
      primaryHref: "/about",
      secondaryLabel: "Join Med-Net",
      secondaryHref: "/join",
    },
    intro: {
      visible: true,
      title: "Healthcare's future will not be built by healthcare professionals alone.",
      subtitle: "",
      body: "Med-Net brings together medical and health science students, healthcare professionals, developers, data scientists, researchers, academics and innovators in one collaborative ecosystem. We learn together, research together, and build solutions together — because strengthening healthcare requires medicine, technology, education and innovation working as one.",
      points: [
        "An interdisciplinary community, not a single-discipline club",
        "Learning that emphasizes practical capability over theory alone",
        "Research and innovation aimed at real healthcare challenges",
        "Built by young people, designed to institutional credibility standards",
      ],
    },
    areas: {
      visible: true,
      title: "What we do",
      subtitle:
        "Four interconnected areas of work that turn interest in digital health into knowledge, evidence, solutions and community.",
    },
    projects: {
      visible: true,
      title: "Projects we are building",
      subtitle: "Initiatives developed by the Med-Net community to address real healthcare challenges.",
    },
    research: {
      visible: true,
      title: "Research & insights",
      subtitle: "Evidence, analysis and perspectives from the Med-Net research community.",
    },
    updates: {
      visible: true,
      title: "Events & announcements",
      subtitle: "Sessions, activities and news from across the network.",
    },
    community: {
      visible: true,
      title: "A place for builders, learners and contributors",
      subtitle:
        "Med-Net is growing its founding community. Whether you study medicine, write software, analyze data or drive innovation — there is a role for you.",
    },
    partners: {
      visible: true,
      title: "Partners & collaborators",
      subtitle: "We are building relationships with institutions that share our purpose.",
    },
    cta: {
      visible: true,
      title: "Build the future of healthcare with us.",
      subtitle:
        "Med-Net is at its beginning — which means founding members, volunteers and partners will shape what it becomes. Join people who are building something meaningful.",
      primaryLabel: "Join Med-Net",
      primaryHref: "/join",
      secondaryLabel: "Partner with us",
      secondaryHref: "/community",
    },
  },
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(override) || !isPlainObject(base)) {
    return (override === undefined ? base : (override as T)) ?? base;
  }
  const result: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = (base as Record<string, unknown>)[key];
    result[key] = isPlainObject(baseValue) ? deepMerge(baseValue, value) : value;
  }
  return result as T;
}

export const getSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: "singleton" } });
    if (!row) return DEFAULT_SETTINGS;
    return deepMerge(DEFAULT_SETTINGS, JSON.parse(row.data));
  } catch {
    return DEFAULT_SETTINGS;
  }
});

export async function saveSettings(patch: unknown): Promise<SiteSettingsData> {
  const current = await getSettings();
  const next = deepMerge(current, patch);
  const data = JSON.stringify(next);
  await db.siteSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", data },
    update: { data },
  });
  return next;
}
