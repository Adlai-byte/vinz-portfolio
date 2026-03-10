import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — Vinz`,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <main>
      <Navbar />
      <PageTransition>
        <article className="pt-32 pb-20 md:pb-32 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-text-dimmed hover:text-text-muted transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider rounded-full px-2.5 py-0.5 border ${
                    post.type === "research"
                      ? "text-purple-400 border-purple-400/30 bg-purple-400/10"
                      : "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                  }`}
                >
                  {post.type}
                </span>
                <span className="text-xs text-text-dimmed font-mono">
                  {formatDate(post.date)}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {post.title}
              </h1>

              <p className="text-text-muted leading-relaxed">{post.excerpt}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono text-text-dimmed bg-surface border border-border rounded px-2 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Divider */}
            <div className="border-t border-border mb-10" />

            {/* Content */}
            <div className="prose-custom">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </article>
      </PageTransition>
      <Footer />
    </main>
  );
}
