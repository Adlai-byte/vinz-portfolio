import { getAllPosts } from "@/lib/posts";
import BlogPostsGrid from "@/components/BlogPostsGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const revalidate = 3600;

export const metadata = {
  title: "Blog & Research — Vinz",
  description:
    "Articles on web development, mobile engineering, AI agents, and software architecture.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main>
      <Navbar />
      <section className="pt-32 pb-20 md:pb-32 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-sm font-mono text-text-dimmed mb-2">03</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">
            Blog & Research
          </h3>

          <BlogPostsGrid posts={posts} />
        </div>
      </section>
      <Footer />
    </main>
  );
}
