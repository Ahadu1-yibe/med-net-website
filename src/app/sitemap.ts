import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/research`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/updates`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/community`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/join`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];

  try {
    const [projects, research, resources, posts] = await Promise.all([
      db.project.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.researchItem.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.learningResource.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      db.post.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);

    return [
      ...staticRoutes,
      ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
      ...research.map((r) => ({ url: `${base}/research/${r.slug}`, lastModified: r.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
      ...resources.map((r) => ({ url: `${base}/learn/${r.slug}`, lastModified: r.updatedAt, changeFrequency: "monthly" as const, priority: 0.7 })),
      ...posts.map((p) => ({ url: `${base}/updates/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ];
  } catch {
    return staticRoutes;
  }
}
