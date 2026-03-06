"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  type: "blog" | "research";
  tags: string[];
  published: boolean;
  date: string;
  content: string;
}

interface PostEditorProps {
  action: (formData: FormData) => void;
  post?: PostData;
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function PostEditor({ action, post }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [type, setType] = useState<string>(post?.type || "blog");
  const [tags, setTags] = useState(post?.tags?.join(", ") || "");
  const [content, setContent] = useState(post?.content || "");
  const [published, setPublished] = useState(post?.published ?? true);
  const isEditing = !!post;

  useEffect(() => {
    if (!isEditing) {
      setSlug(toSlug(title));
    }
  }, [title, isEditing]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor */}
      <form action={action} className="space-y-4">
        {isEditing && (
          <>
            <input type="hidden" name="originalSlug" value={post.slug} />
            <input type="hidden" name="date" value={post.date} />
          </>
        )}

        <div>
          <label htmlFor="title" className="block text-sm text-text-muted mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-dimmed focus:outline-none focus:ring-2 focus:ring-text-dimmed/50"
            placeholder="Post title..."
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm text-text-muted mb-1">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-dimmed focus:outline-none focus:ring-2 focus:ring-text-dimmed/50 font-mono text-sm"
            placeholder="post-slug"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm text-text-muted mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-dimmed focus:outline-none focus:ring-2 focus:ring-text-dimmed/50 resize-none"
            placeholder="Brief description of the post..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm text-text-muted mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-text-dimmed/50"
            >
              <option value="blog">Blog</option>
              <option value="research">Research</option>
            </select>
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-background accent-text-primary"
              />
              Published
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm text-text-muted mb-1">
            Tags (comma-separated)
          </label>
          <input
            id="tags"
            name="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-dimmed focus:outline-none focus:ring-2 focus:ring-text-dimmed/50"
            placeholder="Next.js, React, TypeScript"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm text-text-muted mb-1">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={18}
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-text-primary placeholder-text-dimmed focus:outline-none focus:ring-2 focus:ring-text-dimmed/50 font-mono text-sm resize-y"
            placeholder="Write your post in Markdown..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-6 py-2 bg-text-primary text-background font-medium rounded-md hover:bg-text-muted transition-colors"
          >
            {isEditing ? "Update Post" : "Create Post"}
          </button>
          <a
            href="/admin"
            className="px-6 py-2 border border-border text-text-muted rounded-md hover:bg-surface transition-colors inline-flex items-center"
          >
            Cancel
          </a>
        </div>
      </form>

      {/* Live Preview */}
      <div className="hidden lg:block">
        <div className="sticky top-6">
          <h3 className="text-sm text-text-dimmed mb-3 font-mono">Preview</h3>
          <div className="bg-surface border border-border rounded-lg p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {title && (
              <h1 className="text-2xl font-bold text-text-primary mb-2">{title}</h1>
            )}
            {excerpt && (
              <p className="text-text-dimmed text-sm mb-4 italic">{excerpt}</p>
            )}
            {tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.split(",").map((tag, i) => {
                  const trimmed = tag.trim();
                  if (!trimmed) return null;
                  return (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-xs bg-background border border-border rounded-full text-text-dimmed"
                    >
                      {trimmed}
                    </span>
                  );
                })}
              </div>
            )}
            <hr className="border-border mb-4" />
            <div className="prose-custom">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
