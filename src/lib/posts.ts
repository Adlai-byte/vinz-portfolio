import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

const GITHUB_REPO = process.env.GITHUB_REPO || "Adlai-byte/vinz-portfolio";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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

function parsePost(filename: string, raw: string): Post {
  const { data, content } = matter(raw);
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
}

// Fetch posts from GitHub API (used in production on Vercel)
async function fetchPostsFromGitHub(noCache = false): Promise<Post[]> {
  if (!GITHUB_TOKEN) return [];

  const fetchOptions: RequestInit & { next?: { revalidate: number } } = {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    ...(noCache ? { cache: "no-store" as const } : { next: { revalidate: 60 } }),
  };

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/content/posts`,
    fetchOptions
  );

  if (!res.ok) return [];

  const files = (await res.json()) as { name: string; download_url: string }[];
  const mdFiles = files.filter((f) => f.name.endsWith(".md"));

  const results = await Promise.all(
    mdFiles.map(async (file) => {
      try {
        const contentRes = await fetch(file.download_url, noCache ? { cache: "no-store" } : { next: { revalidate: 60 } });
        if (!contentRes.ok) return null;
        const raw = await contentRes.text();
        return parsePost(file.name, raw);
      } catch {
        return null;
      }
    })
  );

  return results.filter((p): p is Post => p !== null);
}

// Read posts from local filesystem (used in development)
function readPostsFromDisk(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  return files.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    return parsePost(filename, raw);
  });
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = GITHUB_TOKEN
    ? await fetchPostsFromGitHub()
    : readPostsFromDisk();

  return posts
    .filter((post) => post.published)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export async function getPostsByType(type: "blog" | "research"): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.type === type);
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  const posts = GITHUB_TOKEN
    ? await fetchPostsFromGitHub(true)
    : readPostsFromDisk();

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlugAdmin(slug: string): Promise<Post | null> {
  const posts = await getAllPostsAdmin();
  return posts.find((p) => p.slug === slug) || null;
}
