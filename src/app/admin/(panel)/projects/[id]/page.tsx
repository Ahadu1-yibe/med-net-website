import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { projectConfig } from "@/components/admin/entity-configs";
import { deleteProject, saveProject } from "@/lib/actions/projects";
import { parseArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await db.project.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <>
      <AdminPageHeader title="Edit project" description={project.title} />
      <EntityForm
        config={projectConfig}
        action={saveProject}
        deleteAction={deleteProject}
        entityBase="projects"
        id={project.id}
        values={{
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description,
          category: project.category,
          status: project.status,
          problem: project.problem,
          approach: project.approach,
          impact: project.impact,
          coverImage: project.coverImage ?? "",
          externalUrl: project.externalUrl ?? "",
          repoUrl: project.repoUrl ?? "",
          technologies: parseArray(project.technologies).join(", "),
          team: parseArray(project.team).join(", "),
          tags: parseArray(project.tags).join(", "),
          featured: project.featured,
          published: project.published,
        }}
      />
    </>
  );
}
