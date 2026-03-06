# Portfolio V2 Design

## Changes

### 1. Removals
- Experience section (component, data file, page.tsx, navbar link)
- Facebook, GitHub, LinkedIn from Contact (keep email only)
- Section numbering: 01 About, 02 Projects, 03 Blog & Research, 04 Contact

### 2. Hero CTA
- "Get a Quote" -> mailto:vinzlloydalferez@gmail.com?subject=Quote Request
- "Get in Touch" -> scrolls to #contact

### 3. Project Photo Lightbox
- Click screenshot opens fullscreen modal overlay (dark backdrop + blur)
- Close via X button, Escape key, or click outside
- Framer Motion fade animation
- Multi-image projects: arrow navigation to cycle through images
- Projects with `images: string[]` show first on card, all in lightbox

### 4. Circuit Learning Game Screenshots
- Add 2 screenshots (game menu + gameplay) to public/projects/
- Update Project interface: add `images?: string[]` alongside `image?: string`
- First image shown on card, all viewable in lightbox

### 5. Blog & Research System

**Frontend:**
- `/blog` page: list all posts, filter tabs (All/Blog/Research)
- Cards: title, excerpt, type tag, date, cover image (optional)
- `/blog/[slug]` page: full rendered content, date, type, tags

**Database (Supabase):**
- `posts` table: id (uuid), title, slug (unique), excerpt, content (markdown), type (blog/research), tags (text[]), cover_image (url), published (boolean), created_at, updated_at

**Admin CMS (`/admin`):**
- Password gate via env var ADMIN_PASSWORD, cookie session after login
- Dashboard: list posts (published + drafts), edit/delete actions
- Editor: title, auto-slug, excerpt, type dropdown, tags input, cover image URL, markdown textarea with preview, publish toggle
- CRUD via Next.js Server Actions + Supabase

### 6. Navbar
- Links: About, Projects, Blog, Contact
