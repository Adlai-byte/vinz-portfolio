# Vinz Portfolio Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dark, minimal, monochrome single-page developer portfolio for Vinz using Next.js, Tailwind CSS, and Framer Motion.

**Architecture:** Single-page app with Next.js App Router. One `page.tsx` composes all section components. Framer Motion handles scroll-triggered animations. Monochrome palette (no color accents). Sticky navbar with scroll-spy.

**Tech Stack:** Next.js 15, Tailwind CSS 4, Framer Motion 11, Geist font, Lucide React (icons)

**Design doc:** `docs/plans/2026-03-02-portfolio-design.md`

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json` (via CLI)
- Create: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` (via CLI)

**Step 1: Initialize Next.js project**

Run from `D:/Dev Portfolio`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Select defaults when prompted. This creates the full project scaffold.

**Step 2: Install additional dependencies**

```bash
npm install framer-motion lucide-react
```

- `framer-motion` — scroll animations, page transitions
- `lucide-react` — lightweight monochrome SVG icons (GitHub, LinkedIn, etc.)

**Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: Dev server at `http://localhost:3000` shows default Next.js page.

**Step 4: Commit**

```bash
git init && git add -A && git commit -m "chore: scaffold Next.js project with Tailwind and Framer Motion"
```

---

### Task 2: Global Theme Setup (Layout, Fonts, CSS)

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx` (clear default content)

**Step 1: Set up globals.css with monochrome theme**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-background: #0a0a0a;
  --color-surface: #141414;
  --color-border: #262626;
  --color-text-primary: #fafafa;
  --color-text-muted: #a1a1aa;
  --color-text-dimmed: #71717a;

  --font-sans: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
}

::selection {
  background-color: #ffffff30;
}
```

**Step 2: Update layout.tsx**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vinz — Full-Stack & Mobile Developer",
  description:
    "Developer portfolio of Vinz — building web and mobile experiences with React, Next.js, Kotlin, and Jetpack Compose.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
```

**Step 3: Clear page.tsx to a shell**

Replace `src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen">
      <p className="text-text-primary p-8">Portfolio coming soon.</p>
    </main>
  );
}
```

**Step 4: Verify**

Run `npm run dev`. Page should show "Portfolio coming soon." on a `#0a0a0a` dark background in Geist font.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: set up monochrome dark theme, Geist fonts, and global styles"
```

---

### Task 3: Navbar Component

**Files:**
- Create: `src/components/Navbar.tsx`
- Modify: `src/app/page.tsx` — add `<Navbar />`

**Step 1: Create Navbar**

Create `src/components/Navbar.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = navLinks.map((link) => link.href.slice(1));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#" className="text-lg font-bold tracking-tight">
          Vinz
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors duration-200 ${
                activeSection === link.href.slice(1)
                  ? "text-text-primary"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border"
        >
          <div className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
```

**Step 2: Add Navbar to page.tsx**

Update `src/app/page.tsx`:

```tsx
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <p className="text-text-primary p-8 pt-24">Portfolio coming soon.</p>
    </main>
  );
}
```

**Step 3: Verify**

Dev server: navbar visible, sticky on scroll, hamburger works on mobile viewport.

**Step 4: Commit**

```bash
git add src/components/Navbar.tsx src/app/page.tsx && git commit -m "feat: add sticky navbar with scroll-spy and mobile menu"
```

---

### Task 4: Hero Section

**Files:**
- Create: `src/components/Hero.tsx`
- Modify: `src/app/page.tsx` — add `<Hero />`

**Step 1: Create Hero component**

Create `src/components/Hero.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      {/* Subtle radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />

      <div className="relative z-10 max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-text-muted text-sm font-mono mb-4"
        >
          Hi, my name is
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-4"
        >
          Vinz
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-text-muted mb-8"
        >
          Full-Stack & Mobile Developer
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-text-dimmed max-w-lg mx-auto mb-10 leading-relaxed"
        >
          I build web and mobile experiences with React, Next.js, Kotlin, and
          Jetpack Compose.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="px-6 py-3 bg-text-primary text-background font-medium rounded-lg hover:bg-text-muted transition-colors duration-200"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 border border-border text-text-primary rounded-lg hover:bg-surface transition-colors duration-200"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown size={20} className="text-text-dimmed" />
        </motion.div>
      </motion.div>
    </section>
  );
}
```

**Step 2: Add Hero to page.tsx**

**Step 3: Verify** — full viewport hero with animations.

**Step 4: Commit**

```bash
git add src/components/Hero.tsx src/app/page.tsx && git commit -m "feat: add hero section with fade-in animations and CTAs"
```

---

### Task 5: About Section

**Files:**
- Create: `src/components/About.tsx`
- Modify: `src/app/page.tsx` — add `<About />`

**Step 1: Create About component**

Create `src/components/About.tsx` with:
- Section heading with `id="about"`
- Bio paragraph
- Tech stack grid using Lucide icons and custom SVG icons for tech logos
- Framer Motion `whileInView` fade-in animation
- Responsive grid: 4 cols on desktop, 3 on tablet, 2 on mobile

The tech stack items should be simple labeled icon cards showing: React, Next.js, TypeScript, Tailwind CSS, Kotlin, Jetpack Compose, Git, Node.js.

Each tech card: `bg-surface border border-border rounded-lg p-4` with hover scale effect via Framer Motion `whileHover={{ scale: 1.05 }}`.

**Step 2: Add to page.tsx**

**Step 3: Verify** — section visible, icons render, animations trigger on scroll.

**Step 4: Commit**

```bash
git add src/components/About.tsx src/app/page.tsx && git commit -m "feat: add about section with tech stack grid"
```

---

### Task 6: Projects Section

**Files:**
- Create: `src/components/Projects.tsx`
- Create: `src/data/projects.ts` — project data array
- Modify: `src/app/page.tsx` — add `<Projects />`

**Step 1: Create project data**

Create `src/data/projects.ts`:

```ts
export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    title: "Project One",
    description:
      "A brief description of this project and what problem it solves.",
    tags: ["React", "Next.js", "Tailwind CSS"],
    github: "https://github.com/vinz/project-one",
    demo: "https://project-one.vercel.app",
  },
  {
    title: "Project Two",
    description:
      "Another project showcasing mobile development skills.",
    tags: ["Kotlin", "Jetpack Compose", "Firebase"],
    github: "https://github.com/vinz/project-two",
  },
  {
    title: "Project Three",
    description:
      "A full-stack application with real-time features.",
    tags: ["Next.js", "Node.js", "WebSocket"],
    github: "https://github.com/vinz/project-three",
    demo: "https://project-three.vercel.app",
  },
];
```

**Step 2: Create Projects component**

Create `src/components/Projects.tsx`:
- Section heading with `id="projects"`
- Import project data from `@/data/projects`
- Responsive grid: 1 col mobile, 2 col `md:`, 3 col `lg:`
- Each card: `bg-surface border border-border rounded-xl p-6` with hover `border-text-dimmed` transition
- Show title, description, tech tags as small pills, GitHub/demo links with Lucide `ExternalLink` and `Github` icons
- Staggered `whileInView` animation on cards using Framer Motion `variants` and `staggerChildren: 0.1`

**Step 3: Add to page.tsx**

**Step 4: Verify** — cards render, stagger animation on scroll, links work, responsive grid.

**Step 5: Commit**

```bash
git add src/data/projects.ts src/components/Projects.tsx src/app/page.tsx && git commit -m "feat: add projects section with card grid and staggered animations"
```

---

### Task 7: Experience Timeline

**Files:**
- Create: `src/components/Experience.tsx`
- Create: `src/data/experience.ts` — experience data array
- Modify: `src/app/page.tsx` — add `<Experience />`

**Step 1: Create experience data**

Create `src/data/experience.ts`:

```ts
export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export const experience: ExperienceItem[] = [
  {
    role: "Full-Stack Developer",
    company: "Company Name",
    period: "2024 — Present",
    description:
      "Brief description of your role and key achievements.",
  },
  {
    role: "Android Developer",
    company: "Another Company",
    period: "2023 — 2024",
    description:
      "Brief description of your role and key achievements.",
  },
  {
    role: "Freelance Developer",
    company: "Self-Employed",
    period: "2022 — 2023",
    description:
      "Brief description of freelance work and notable projects.",
  },
];
```

**Step 2: Create Experience component**

Create `src/components/Experience.tsx`:
- Section heading with `id="experience"`
- Vertical timeline with a center line (`border-l border-border`) on desktop
- Each entry: dot on the line, role (bold), company (muted), period (mono font, dimmed), description
- Alternating left/right on `lg:` screens, stacked left-aligned on mobile
- `whileInView` fade-in + slide-up per entry

**Step 3: Add to page.tsx**

**Step 4: Verify** — timeline renders, animations on scroll, responsive layout.

**Step 5: Commit**

```bash
git add src/data/experience.ts src/components/Experience.tsx src/app/page.tsx && git commit -m "feat: add experience timeline section"
```

---

### Task 8: Contact Section

**Files:**
- Create: `src/components/Contact.tsx`
- Modify: `src/app/page.tsx` — add `<Contact />`

**Step 1: Create Contact component**

Create `src/components/Contact.tsx`:
- Section heading with `id="contact"`
- Heading: "Get in Touch"
- Short paragraph: "Feel free to reach out..."
- Row of social icon links using Lucide icons: `Github`, `Linkedin`, `Twitter`, `Mail`
- Each icon: `text-text-muted hover:text-text-primary transition-colors`, wrapped in `<a>` with `target="_blank"`
- Framer Motion `whileInView` fade-in

**Step 2: Add to page.tsx**

**Step 3: Verify**

**Step 4: Commit**

```bash
git add src/components/Contact.tsx src/app/page.tsx && git commit -m "feat: add contact section with social links"
```

---

### Task 9: Footer

**Files:**
- Create: `src/components/Footer.tsx`
- Modify: `src/app/page.tsx` — add `<Footer />`

**Step 1: Create Footer component**

Create `src/components/Footer.tsx`:
- Simple footer: copyright line, "Built with Next.js & Tailwind"
- Back-to-top button (arrow up icon) that smooth-scrolls to top
- `border-t border-border`, `bg-background`, `text-text-dimmed`

**Step 2: Add to page.tsx**

**Step 3: Verify**

**Step 4: Commit**

```bash
git add src/components/Footer.tsx src/app/page.tsx && git commit -m "feat: add footer with back-to-top button"
```

---

### Task 10: Final Assembly & Polish

**Files:**
- Modify: `src/app/page.tsx` — ensure all sections composed with proper spacing
- Verify: full page responsive at mobile / tablet / desktop breakpoints

**Step 1: Assemble page.tsx**

Ensure `src/app/page.tsx` has all sections in order:

```tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </main>
  );
}
```

**Step 2: Add section spacing**

Each section component should have consistent vertical padding: `py-20 md:py-32` and `px-6`. Max width container: `max-w-6xl mx-auto`.

**Step 3: Test all breakpoints**

- Mobile (375px): single column, hamburger nav, stacked timeline
- Tablet (768px): 2-col projects grid
- Desktop (1280px): 3-col projects, full nav, alternating timeline

**Step 4: Run production build**

```bash
npm run build
```

Expected: builds successfully with no errors.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: assemble full portfolio and polish responsive layout"
```
