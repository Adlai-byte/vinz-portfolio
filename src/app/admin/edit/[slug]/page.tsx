import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { updatePost } from "../../actions";
import { getPostBySlugAdmin } from "@/lib/posts";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlugAdmin(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <a
            href="/admin"
            className="text-sm text-text-dimmed hover:text-text-muted transition-colors"
          >
            &larr; Back to dashboard
          </a>
          <h1 className="text-2xl font-bold text-text-primary mt-4">Edit Post</h1>
          <p className="text-sm text-text-dimmed mt-1">
            Editing: {post.title}
          </p>
        </div>

        <PostEditor action={updatePost} post={post} />
      </div>
    </div>
  );
}
