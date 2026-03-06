import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import BlogPreviewCards from "./BlogPreviewCards";

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <BlogPreviewCards posts={posts} />

        <div className="mt-10 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-primary rounded-lg hover:bg-surface transition-colors duration-200 text-sm"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
}
