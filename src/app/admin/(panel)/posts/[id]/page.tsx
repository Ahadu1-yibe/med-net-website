import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/page-parts";
import EntityForm from "@/components/admin/entity-form";
import { postConfig } from "@/components/admin/entity-configs";
import { deletePost, savePost } from "@/lib/actions/posts";
import { toLocalInput, toDateInput } from "@/lib/admin-utils";
import { parseArray } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <>
      <AdminPageHeader title="Edit post" description={post.title} />
      <EntityForm
        config={postConfig}
        action={savePost}
        deleteAction={deletePost}
        entityBase="posts"
        id={post.id}
        values={{
          title: post.title,
          slug: post.slug,
          type: post.type,
          excerpt: post.excerpt,
          description: post.description,
          coverImage: post.coverImage ?? "",
          startAt: toLocalInput(post.startAt),
          endAt: toLocalInput(post.endAt),
          location: post.location ?? "",
          registrationUrl: post.registrationUrl ?? "",
          tags: parseArray(post.tags).join(", "),
          publishAt: toLocalInput(post.publishAt),
          featured: post.featured,
          published: post.published,
        }}
      />
      <input type="hidden" value={toDateInput(post.createdAt)} />
    </>
  );
}
