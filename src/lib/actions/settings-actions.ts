"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/settings";
import { logAudit } from "@/lib/actions/audit";
import { str, type ActionState } from "@/lib/actions/helpers";

function socialOrEmpty(value: string) {
  if (!value) return "";
  return /^https?:\/\/.+/.test(value) || value.startsWith("mailto:") ? value : "";
}

export async function saveSiteSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    await saveSettings({
      site: {
        name: str(formData, "name"),
        shortName: str(formData, "shortName"),
        tagline: str(formData, "tagline"),
        description: str(formData, "description"),
        email: str(formData, "email"),
        location: str(formData, "location"),
        linkedin: socialOrEmpty(str(formData, "linkedin")),
        twitter: socialOrEmpty(str(formData, "twitter")),
        github: socialOrEmpty(str(formData, "github")),
        telegram: socialOrEmpty(str(formData, "telegram")),
        footerNote: str(formData, "footerNote"),
      },
    });
    await logAudit("update", "SiteSettings", undefined, { section: "site" });
    revalidatePath("/", "layout");
    return { ok: true, message: "Site settings saved." };
  } catch {
    return { ok: false, message: "Could not save settings." };
  }
}

export async function saveHomepageSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    await saveSettings({
      homepage: {
        hero: {
          badge: str(formData, "heroBadge"),
          titleTop: str(formData, "heroTitleTop"),
          titleHighlight: str(formData, "heroTitleHighlight"),
          titleBottom: str(formData, "heroTitleBottom"),
          subtitle: str(formData, "heroSubtitle"),
          primaryLabel: str(formData, "heroPrimaryLabel"),
          primaryHref: str(formData, "heroPrimaryHref") || "/about",
          secondaryLabel: str(formData, "heroSecondaryLabel"),
          secondaryHref: str(formData, "heroSecondaryHref") || "/join",
        },
        intro: {
          visible: formData.get("introVisible") === "on",
          title: str(formData, "introTitle"),
          body: str(formData, "introBody"),
          points: str(formData, "introPoints")
            .split("\n")
            .map((p) => p.trim())
            .filter(Boolean),
        },
        areas: {
          visible: formData.get("areasVisible") === "on",
          title: str(formData, "areasTitle"),
          subtitle: str(formData, "areasSubtitle"),
        },
        projects: {
          visible: formData.get("projectsVisible") === "on",
          title: str(formData, "projectsTitle"),
          subtitle: str(formData, "projectsSubtitle"),
        },
        research: {
          visible: formData.get("researchVisible") === "on",
          title: str(formData, "researchTitle"),
          subtitle: str(formData, "researchSubtitle"),
        },
        updates: {
          visible: formData.get("updatesVisible") === "on",
          title: str(formData, "updatesTitle"),
          subtitle: str(formData, "updatesSubtitle"),
        },
        community: {
          visible: formData.get("communityVisible") === "on",
          title: str(formData, "communityTitle"),
          subtitle: str(formData, "communitySubtitle"),
        },
        partners: {
          visible: formData.get("partnersVisible") === "on",
          title: str(formData, "partnersTitle"),
          subtitle: str(formData, "partnersSubtitle"),
        },
        cta: {
          visible: formData.get("ctaVisible") === "on",
          title: str(formData, "ctaTitle"),
          subtitle: str(formData, "ctaSubtitle"),
          primaryLabel: str(formData, "ctaPrimaryLabel"),
          primaryHref: str(formData, "ctaPrimaryHref") || "/join",
          secondaryLabel: str(formData, "ctaSecondaryLabel"),
          secondaryHref: str(formData, "ctaSecondaryHref") || "/community",
        },
      },
    });
    await logAudit("update", "SiteSettings", undefined, { section: "homepage" });
    revalidatePath("/");
    revalidatePath("/admin/homepage");
    return { ok: true, message: "Homepage configuration saved." };
  } catch {
    return { ok: false, message: "Could not save the homepage configuration." };
  }
}

export async function saveAppearanceSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const mode = str(formData, "defaultMode");
    const accent = str(formData, "accent");
    await saveSettings({
      appearance: {
        defaultMode: ["system", "light", "dark"].includes(mode) ? mode : "system",
        accent: ["teal", "ocean", "forest", "violet"].includes(accent) ? accent : "teal",
      },
    });
    await logAudit("update", "SiteSettings", undefined, { section: "appearance" });
    revalidatePath("/", "layout");
    return { ok: true, message: "Appearance settings saved." };
  } catch {
    return { ok: false, message: "Could not save appearance settings." };
  }
}

export async function getSettingsSnapshot() {
  await requireAdmin();
  return getSettings();
}
