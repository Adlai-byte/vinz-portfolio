# Portfolio V2 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add blog/research CMS, photo lightbox, update Hero CTAs, remove experience section and extra social links.

**Architecture:** Next.js App Router with Supabase for blog posts. Admin route with password gate via env var. Image lightbox as a client component. Blog pages use dynamic routes with ISR.

**Tech Stack:** Next.js 16, Supabase JS client, Framer Motion, Tailwind CSS 4, react-markdown

---

### Task 1: Save Circuit Game Screenshots & Update Project Data

**Files:**
- Create: `public/projects/circuit-game-menu.png` (from user-provided screenshot)
- Create: `public/projects/circuit-game-play.png` (from user-provided screenshot)
- Modify: `src/data/projects.ts`

**Step 1:** Save the two user-provided screenshots to `public/projects/`

**Step 2:** Update `Project` interface to add `images?: string[]`

```typescript
export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
  images?: string[];
  badge?: string;
}
```

**Step 3:** Update the Electrical Circuit Learning Game in `staticProjects` to use `images`:

```typescript
{
  title: "Electrical Circuit Learning Game",
  description: "...",
  tags: ["Kotlin", "LibGDX", "Android", "Gradle"],
  images: ["/projects/circuit-game-menu.png", "/projects/circuit-game-play.png"],
},
```

**Step 4:** Update `fetchVercelProjects` return to pass through `images` from meta if needed (currently no Vercel projects use it, but keep interface consistent).

**Step 5:** Commit: `feat: add circuit game screenshots and multi-image support`

---

### Task 2: Remove Experience Section

**Files:**
- Delete: `src/components/Experience.tsx`
- Delete: `src/data/experience.ts`
- Modify: `src/app/page.tsx` — remove Experience import and usage
- Modify: `src/components/Navbar.tsx` — remove Experience from navLinks

**Step 1:** In `src/app/page.tsx`:
- Remove `import Experience from "@/components/Experience";`
- Remove `<Experience />` from JSX

**Step 2:** In `src/components/Navbar.tsx`:
- Remove `{ label: "Experience", href: "#experience" }` from navLinks array

**Step 3:** Delete `src/components/Experience.tsx` and `src/data/experience.ts`

**Step 4:** Commit: `feat: remove experience section`

---

### Task 3: Update Hero CTAs

**Files:**
- Modify: `src/components/Hero.tsx`

**Step 1:** Replace the two CTA buttons:

```tsx
<a
  href="mailto:vinzlloydalferez@gmail.com?subject=Quote%20Request"
  className="px-6 py-3 bg-text-primary text-background font-medium rounded-lg hover:bg-text-muted transition-colors duration-200 text-sm"
>
  Get a Quote
</a>
<a
  href="#contact"
  className="px-6 py-3 border border-border text-text-primary rounded-lg hover:bg-surface transition-colors duration-200 text-sm"
>
  Get in Touch
</a>
```

**Step 2:** Commit: `feat: update hero CTAs to quote request and contact`

---

### Task 4: Update Contact Section

**Files:**
- Modify: `src/components/Contact.tsx`

**Step 1:** Remove Facebook, GitHub, LinkedIn. Keep only Email. Remove unused imports. Update section number to 04.

```tsx
"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-sm font-mono text-text-dimmed mb-2">04</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Get in Touch</h3>
          <p className="text-text-muted max-w-md mx-auto mb-10 leading-relaxed">
            I&apos;m always open to new opportunities and interesting projects.
            Feel free to reach out.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <a
            href="mailto:vinzlloydalferez@gmail.com"
            className="inline-flex items-center gap-3 px-8 py-4 bg-surface border border-border rounded-lg hover:border-text-dimmed hover:bg-background transition-all duration-200"
          >
            <Mail size={20} className="text-text-muted" />
            <span className="text-text-primary">vinzlloydalferez@gmail.com</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
```

**Step 2:** Commit: `feat: simplify contact to email only`

---

### Task 5: Image Lightbox Component

**Files:**
- Create: `src/components/ImageLightbox.tsx`
- Modify: `src/components/Projects.tsx`

**Step 1:** Create `src/components/ImageLightbox.tsx`:

A client component that:
- Receives `images: string[]`, `initialIndex: number`, `alt: string`, `onClose: () => void`
- Shows fullscreen dark overlay with blur
- Displays current image centered
- Left/right arrows if multiple images
- Close on X button, Escape key, or clicking backdrop
- Framer Motion fade animation

**Step 2:** Update `src/components/Projects.tsx`:
- Add state for lightbox: `selectedProject` and `selectedImageIndex`
- Make project screenshot clickable (cursor-pointer, onClick sets state)
- Render `ImageLightbox` when a project is selected
- For projects with `images` array, use first image as card thumbnail
- Pass all images (from `images` array or single `image`) to lightbox

**Step 3:** Commit: `feat: add image lightbox for project screenshots`

---

### Task 6: Install Supabase & Setup Database

**Step 1:** Install dependencies:
```bash
npm install @supabase/supabase-js react-markdown
```

**Step 2:** Add env vars to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
ADMIN_PASSWORD=<password>
```

**Step 3:** Create `src/lib/supabase.ts`:
```typescript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
```

**Step 4:** Create `posts` table in Supabase dashboard (SQL):
```sql
CREATE TABLE posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'blog' CHECK (type IN ('blog', 'research')),
  tags text[] DEFAULT '{}',
  cover_image text,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published ON posts(published);
```

**Step 5:** Commit: `feat: add supabase client and blog dependencies`

---

### Task 7: Blog & Research Page

**Files:**
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`

**Step 1:** Create `src/app/blog/page.tsx`:
- Server component that fetches published posts from Supabase
- Filter tabs: All / Blog / Research (client interactive via search params or client state)
- Grid of post cards: title, excerpt, type badge, date, cover image
- Links to `/blog/[slug]`

**Step 2:** Create `src/app/blog/[slug]/page.tsx`:
- Server component that fetches single post by slug
- Renders markdown content with `react-markdown`
- Shows title, date, type, tags
- Back link to `/blog`

**Step 3:** Update `src/components/Navbar.tsx`:
- Add `{ label: "Blog", href: "/blog" }` to navLinks
- Handle mixed href types (hash links for homepage sections, regular links for pages)

**Step 4:** Add Blog section on homepage between Projects and Contact:
- Create `src/components/BlogPreview.tsx` — shows latest 3 published posts
- Section number 03, "Blog & Research" heading
- "View All" link to `/blog`
- Add to `src/app/page.tsx`

**Step 5:** Commit: `feat: add blog and research pages`

---

### Task 8: Admin CMS

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/edit/[id]/page.tsx`
- Create: `src/app/admin/new/page.tsx`
- Create: `src/components/admin/PostEditor.tsx`
- Create: `src/app/admin/actions.ts` (server actions)

**Step 1:** Create `src/app/admin/login/page.tsx`:
- Simple password form
- Server action that checks against `ADMIN_PASSWORD` env var
- Sets an HTTP-only cookie `admin_session` on success
- Redirects to `/admin`

**Step 2:** Create admin middleware or layout that checks for `admin_session` cookie:
- Create `src/app/admin/layout.tsx` that validates cookie
- If no valid cookie, redirect to `/admin/login`

**Step 3:** Create `src/app/admin/page.tsx` (dashboard):
- Lists all posts (published + drafts)
- Shows title, type, status (published/draft), date
- Edit and Delete buttons
- "New Post" button

**Step 4:** Create `src/components/admin/PostEditor.tsx`:
- Form with: title, slug (auto-generated), excerpt, type dropdown, tags input, cover image URL, markdown content textarea
- Side-by-side markdown preview
- Save (draft) and Publish buttons

**Step 5:** Create `src/app/admin/new/page.tsx` and `src/app/admin/edit/[id]/page.tsx`:
- Both use PostEditor component
- Edit page pre-fills with existing post data

**Step 6:** Create `src/app/admin/actions.ts`:
- Server actions: `login`, `createPost`, `updatePost`, `deletePost`, `togglePublish`
- All actions use Supabase client

**Step 7:** Commit: `feat: add admin CMS for blog posts`

---

### Task 9: Update Section Numbers & Navbar

**Files:**
- Modify: `src/components/About.tsx` — keep 01
- Modify: `src/components/Projects.tsx` — keep 02
- Modify: `src/components/BlogPreview.tsx` — set 03
- Modify: `src/components/Contact.tsx` — set 04

**Step 1:** Verify all section numbers are correct after all changes.

**Step 2:** Commit: `feat: update section numbering`

---

### Task 10: Deploy

**Step 1:** Add Supabase env vars to Vercel:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add ADMIN_PASSWORD production
```

**Step 2:** Push to GitHub and deploy:
```bash
git push origin master
vercel --prod --force --yes
vercel alias set <deployment-url> dev-vinz.vercel.app
```

**Step 3:** Verify all pages work: homepage, /blog, /blog/[slug], /admin
