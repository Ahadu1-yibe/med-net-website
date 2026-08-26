import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { projectConfig } from "@/components/admin/entity-configs";
import { saveProject } from "@/lib/actions/projects";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  return (
    <>
      <AdminPageHeader
        title="New project"
        description="Describe the project clearly — what it does, the problem it addresses, and its current status."
      />
      <EntityForm
        config={projectConfig}
        values={{ category: "digital-health", status: "in-progress" }}
        action={saveProject}
        entityBase="projects"
      />
    </>
  );
}
