"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/posts";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPreviewCards({ posts }: { posts: Post[] }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <h2 className="text-sm font-mono text-text-dimmed mb-2">03</h2>
        <h3 className="text-2xl md:text-3xl font-bold mb-8">
          Blog & Research
        </h3>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col gap-4"
      >
        {posts.map((post) => (
          <motion.div key={post.slug} variants={cardVariants}>
            <Link href={`/blog/${post.slug}`} className="block group">
              <div className="bg-surface border border-border rounded-xl p-6 hover:border-text-dimmed transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider rounded-full px-2.5 py-0.5 border ${
                        post.type === "research"
                          ? "text-purple-400 border-purple-400/30 bg-purple-400/10"
                          : "text-emerald-400 border-emerald-400/30 bg-emerald-400/10"
                      }`}
                    >
                      {post.type}
                    </span>
                    <h4 className="text-lg font-semibold text-text-primary transition-colors">
                      {post.title}
                    </h4>
                  </div>
                  <span className="text-xs text-text-dimmed font-mono">
                    {formatDate(post.date)}
                  </span>
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
