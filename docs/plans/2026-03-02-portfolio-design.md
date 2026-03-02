# Vinz's Developer Portfolio — Design Document

## Overview

A modern, dark, minimal single-page developer portfolio for Vinz — a full-stack and Android mobile developer working with React/Next.js and Kotlin/Jetpack Compose.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (scroll-triggered)
- **Fonts:** Inter/Geist (body), JetBrains Mono/Geist Mono (code accents)
- **Deployment:** Vercel-ready

## Visual Style

- **Theme:** Dark & minimal, monochrome palette
- **Background:** `#0a0a0a` (near black)
- **Surface/cards:** `#141414` with `#262626` borders
- **Text:** `#fafafa` (primary), `#a1a1aa` (muted)
- **No color accent** — pure monochrome (white, grays, black)
- **Aesthetic inspiration:** Vercel, Linear

## Architecture

Single `page.tsx` rendering all sections as components. Sticky nav with scroll-spy.

```
src/
  app/
    layout.tsx        — global layout, fonts, metadata
    page.tsx          — renders all sections
    globals.css       — Tailwind base + custom CSS variables
  components/
    Navbar.tsx        — sticky nav, glassmorphic blur, scroll-spy
    Hero.tsx          — full viewport, name, tagline, CTAs
    About.tsx         — bio, tech stack icons, stats
    Projects.tsx      — project cards grid
    Experience.tsx    — vertical timeline
    Contact.tsx       — social links
    Footer.tsx        — copyright, back-to-top
```

## Sections

### 1. Navbar
- Sticky top, backdrop-blur glassmorphic background
- Section links with active state based on scroll position
- Hamburger menu on mobile

### 2. Hero
- Full viewport height (`min-h-screen`)
- "Hi, I'm Vinz" with fade-in animation
- Tagline: "Full-Stack & Mobile Developer"
- Two CTA buttons: "View Projects" (scroll), "Get in Touch" (scroll)
- Subtle monochrome gradient or grain texture

### 3. About
- Short bio paragraph
- Tech stack icon grid (React, Next.js, Kotlin, Jetpack Compose, Tailwind, etc.)
- Hover effects on tech icons
- Optional quick stats (years experience, projects count)

### 4. Projects
- Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- Each card: thumbnail, title, description, tech tags, links (GitHub/demo)
- Staggered scroll-in animation via Framer Motion
- Monochrome card styling with subtle hover lift/border glow

### 5. Experience
- Vertical timeline with line + dots
- Alternating left/right layout on desktop, stacked on mobile
- Each entry: role, company/project, date range, description
- Scroll-triggered fade-in per entry

### 6. Contact
- Social icon links: GitHub, LinkedIn, Twitter/X, Email
- Clean minimal layout
- No form (keeps it simple)

### 7. Footer
- Copyright line
- "Built with Next.js & Tailwind"
- Back-to-top button

## Animations (Framer Motion)

- **Scroll-triggered:** `whileInView` fade + slide-up on each section
- **Staggered children:** project cards, timeline entries
- **Hover:** subtle card lift, nav link underline, icon scale
- **Hero:** text fade-in on load

## Responsive Breakpoints

- Mobile: < 640px (single column, hamburger nav)
- Tablet: 640-1024px (2-col projects grid)
- Desktop: > 1024px (3-col projects, alternating timeline)

## Performance

- Static generation (SSG) for fast load
- Optimized images via `next/image`
- Lazy-loaded sections below the fold
- Minimal JS bundle (no heavy libraries beyond Framer Motion)
