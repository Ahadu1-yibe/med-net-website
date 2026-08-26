import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { postConfig } from "@/components/admin/entity-configs";
import { savePost } from "@/lib/actions/posts";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  return (
    <>
      <AdminPageHeader
        title="New post"
        description="Create an event, news article, insight or announcement."
      />
      <EntityForm config={postConfig} values={{ type: "NEWS" }} action={savePost} entityBase="posts" />
    </>
  );
}
