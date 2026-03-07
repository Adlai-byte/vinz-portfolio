"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Post } from "@/lib/posts";

const tabs = [
  { label: "All", value: "all" },
  { label: "Blog", value: "blog" },
  { label: "Research", value: "research" },
] as const;

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

export default function BlogPostsGrid({ posts }: { posts: Post[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "blog" | "research">(
    "all"
  );

  const filtered =
    activeTab === "all" ? posts : posts.filter((p) => p.type === activeTab);

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
              activeTab === tab.value
                ? "bg-surface border border-border text-text-primary"
                : "text-text-dimmed hover:text-text-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {filtered.length === 0 ? (
        <p className="text-text-dimmed text-sm">No posts found.</p>
      ) : (
        <motion.div
          key={activeTab}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filtered.map((post) => (
            <motion.div key={post.slug} variants={cardVariants}>
              <Link href={`/blog/${post.slug}`} className="block group">
                <div className="h-full bg-surface border border-border rounded-xl p-6 hover:border-text-dimmed transition-all duration-300 card-elevated">
                  {/* Type Badge & Date */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider rounded-full px-2.5 py-0.5 border ${
                        post.type === "research"
                          ? "text-purple-400 border-purple-400/30 bg-purple-400/10 badge-purple"
                          : "text-emerald-400 border-emerald-400/30 bg-emerald-400/10 badge-emerald"
                      }`}
                    >
                      {post.type}
                    </span>
                    <span className="text-xs text-text-dimmed font-mono">
                      {formatDate(post.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-semibold text-text-primary mb-2 transition-colors">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-sm text-text-muted leading-relaxed mb-4">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-text-dimmed bg-background border border-border rounded px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
