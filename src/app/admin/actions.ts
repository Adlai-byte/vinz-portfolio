"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_REPO = process.env.GITHUB_REPO || "Adlai-byte/vinz-portfolio";

async function githubApi(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${error}`);
  }
  return res.json();
}

export async function login(_prevState: { error: string } | null, formData: FormData) {
  const password = formData.get("password") as string;
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect("/admin");
  }
  return { error: "Invalid password" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin");
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const type = formData.get("type") as string;
  const tags = (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean);
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  const date = new Date().toISOString().split("T")[0];

  const frontmatter = `---
title: "${title}"
slug: "${slug}"
excerpt: "${excerpt}"
type: "${type}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
published: ${published}
date: "${date}"
---

${content}`;

  const encodedContent = Buffer.from(frontmatter).toString("base64");
  const path = `content/posts/${slug}.md`;

  await githubApi(`/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `blog: add "${title}"`,
      content: encodedContent,
      branch: "master",
    }),
  });

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin");
}

export async function updatePost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const originalSlug = formData.get("originalSlug") as string;
  const excerpt = formData.get("excerpt") as string;
  const type = formData.get("type") as string;
  const tags = (formData.get("tags") as string).split(",").map((t) => t.trim()).filter(Boolean);
  const content = formData.get("content") as string;
  const published = formData.get("published") === "on";
  const date = formData.get("date") as string;

  const frontmatter = `---
title: "${title}"
slug: "${slug}"
excerpt: "${excerpt}"
type: "${type}"
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
published: ${published}
date: "${date}"
---

${content}`;

  const path = `content/posts/${originalSlug}.md`;

  // Get the current file SHA (required for updates)
  const existing = await githubApi(`/contents/${path}`);
  const encodedContent = Buffer.from(frontmatter).toString("base64");

  await githubApi(`/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `blog: update "${title}"`,
      content: encodedContent,
      sha: existing.sha,
      branch: "master",
    }),
  });

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/");
  redirect("/admin");
}

export async function deletePost(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const path = `content/posts/${slug}.md`;

    const existing = await githubApi(`/contents/${path}`);

    await githubApi(`/contents/${path}`, {
      method: "DELETE",
      body: JSON.stringify({
        message: `blog: delete "${slug}"`,
        sha: existing.sha,
        branch: "master",
      }),
    });

    revalidatePath("/admin");
    revalidatePath("/blog");
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete" };
  }
}
