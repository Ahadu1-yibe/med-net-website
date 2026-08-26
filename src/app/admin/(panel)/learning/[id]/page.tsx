import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { resourceConfig } from "@/components/admin/entity-configs";
import { deleteResource, saveResource } from "@/lib/actions/learning";
import { parseArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.learningResource.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Edit resource" description={item.title} />
      <EntityForm
        config={resourceConfig}
        action={saveResource}
        deleteAction={deleteResource}
        entityBase="learning"
        id={item.id}
        values={{
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          description: item.description,
          type: item.type,
          level: item.level,
          coverImage: item.coverImage ?? "",
          externalUrl: item.externalUrl ?? "",
          tags: parseArray(item.tags).join(", "),
          featured: item.featured,
          published: item.published,
        }}
      />
    </>
  );
}
