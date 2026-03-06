import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  type: "blog" | "research";
  tags: string[];
  published: boolean;
  date: string;
  content: string;
  coverImage?: string;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug: data.slug || filename.replace(/\.md$/, ""),
        title: data.title || "Untitled",
        excerpt: data.excerpt || "",
        type: data.type || "blog",
        tags: data.tags || [],
        published: data.published !== false,
        date: data.date || "",
        content,
        coverImage: data.coverImage,
      } as Post;
    })
    .filter((post) => post.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getPostsByType(type: "blog" | "research"): Post[] {
  return getAllPosts().filter((p) => p.type === type);
}
