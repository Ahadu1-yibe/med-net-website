import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { researchConfig } from "@/components/admin/entity-configs";
import { deleteResearch, saveResearch } from "@/lib/actions/research";
import { parseArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditResearchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await db.researchItem.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <>
      <AdminPageHeader title="Edit research item" description={item.title} />
      <EntityForm
        config={researchConfig}
        action={saveResearch}
        deleteAction={deleteResearch}
        entityBase="research"
        id={item.id}
        values={{
          title: item.title,
          slug: item.slug,
          summary: item.summary,
          description: item.description,
          category: item.category,
          status: item.status,
          authors: parseArray(item.authors).join(", "),
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
