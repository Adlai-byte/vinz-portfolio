import PostEditor from "@/components/admin/PostEditor";
import { createPost } from "../actions";

export default function NewPostPage() {
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
          <h1 className="text-2xl font-bold text-text-primary mt-4">New Post</h1>
          <p className="text-sm text-text-dimmed mt-1">
            Create a new blog post or research article.
          </p>
        </div>

        <PostEditor action={createPost} />
      </div>
    </div>
  );
}
