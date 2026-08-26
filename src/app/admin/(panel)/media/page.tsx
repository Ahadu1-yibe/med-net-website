import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import MediaLibraryGrid from "@/components/admin/media-library-grid";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const assets = await db.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true,
      filename: true,
      mimeType: true,
      kind: true,
      alt: true,
      size: true,
      externalUrl: true,
      createdAt: true,
    },
  });

  return (
    <>
      <AdminPageHeader
        title="Media Library"
        description="Images uploaded for use across the website. Add alt text to keep the site accessible."
      />
      <MediaLibraryGrid
        assets={assets.map((a) => ({
          id: a.id,
          filename: a.filename,
          kind: a.kind,
          alt: a.alt,
          size: a.size,
          url: a.kind === "EXTERNAL" && a.externalUrl ? a.externalUrl : `/api/media/${a.id}`,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </>
  );
}
