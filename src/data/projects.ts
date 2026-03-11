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

const frameworkLabels: Record<string, string> = {
  nextjs: "Next.js",
  vite: "Vite",
  remix: "Remix",
  nuxtjs: "Nuxt.js",
  svelte: "SvelteKit",
  gatsby: "Gatsby",
  astro: "Astro",
  angular: "Angular",
  vue: "Vue",
  ember: "Ember",
  hugo: "Hugo",
  jekyll: "Jekyll",
  eleventy: "11ty",
  docusaurus: "Docusaurus",
  blitzjs: "Blitz.js",
  redwoodjs: "RedwoodJS",
  sanity: "Sanity",
  storybook: "Storybook",
};

// Manually curated metadata for each Vercel project.
// Keyed by project name (as it appears in Vercel).
const projectMeta: Record<
  string,
  { title?: string; description: string; tags: string[]; image: string; images?: string[]; demo?: string; badge?: string }
> = {
  "pokemon-battle-royale": {
    description:
      "A retro pixel-art Pokemon battle royale simulator. Choose roster size and speed, pick Normal or Tournament mode, predict the winner, and watch Pokemon fight in a free-for-all with evolution mechanics, item drops, and dynamic weather events.",
    tags: ["JavaScript", "HTML Canvas", "CSS"],
    image: "/projects/pokemon-battle-royale.png",
    demo: "https://pokemon-br.vercel.app",
  },
  courtflow: {
    description:
      "A court booking platform for basketball, pickleball, tennis, and volleyball. Features real-time availability, recurring reservations, membership plans, and facility discovery across multiple venues.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    image: "/projects/courtflow.png",
  },
  kolekta: {
    description:
      "A smart waste collection management system for Mati City, Davao Oriental. Residents can report waste issues, track collection schedules, view GPS-tracked trucks, and monitor report status in real time.",
    tags: ["HTML", "Tailwind CSS", "JavaScript"],
    image: "/projects/kolekta.png",
    badge: "Code Reviewer",
  },
  "mikasa-v3": {
    description:
      "A property management system with smart scheduling, financial tracking, and real-time updates. Features automated bookings, check-ins, maintenance management, revenue dashboards, and instant notifications across all devices.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    image: "/projects/mikasa-v3.png",
    demo: "https://casa-concierge-mikasa.vercel.app",
  },
  "countdown-app-2026": {
    description:
      "An interactive New Year countdown web app with live timers, world timezone tracking, confetti effects, photo sharing, memes, and a guest book. Includes a guided onboarding tour and mobile-first design.",
    tags: ["Vite", "TypeScript", "PWA"],
    image: "/projects/countdown-app-2026.png",
  },
  dts: {
    title: "Advance Document Tracking System using Open Source Digital Signature",
    description:
      "An advanced document tracking system with open source digital signature integration. Features document routing, approval workflows, signature verification, audit trails, and real-time status tracking for institutional document management.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    image: "/projects/dts.png",
  },
};

interface VercelProject {
  name: string;
  framework: string | null;
  link?: { repo?: string; org?: string; type?: string };
  latestDeployments?: {
    alias?: string[];
    readyState?: string;
  }[];
}

export async function fetchVercelProjects(): Promise<Project[]> {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch("https://api.vercel.com/v9/projects?limit=20", {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const hiddenProjects = new Set(["vinz-portfolio", "dev-vinz"]);
    const vercelProjects: VercelProject[] = (data.projects ?? []).filter(
      (p: VercelProject) => !hiddenProjects.has(p.name),
    );

    return vercelProjects.map((p) => {
      const meta = projectMeta[p.name];

      const tags: string[] = meta
        ? meta.tags
        : [
            ...(p.framework && frameworkLabels[p.framework]
              ? [frameworkLabels[p.framework]]
              : p.framework
                ? [p.framework]
                : []),
            "Vercel",
          ];

      const github =
        p.link?.repo && p.link?.org
          ? `https://github.com/${p.link.org}/${p.link.repo}`
          : undefined;

      let demo: string | undefined = meta?.demo;
      if (!demo) {
        const deployment = p.latestDeployments?.[0];
        if (deployment?.alias?.length) {
          demo = `https://${deployment.alias[0]}`;
        }
      }

      const title = meta?.title ??
        p.name
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        title,
        description:
          meta?.description ??
          `Deployed on Vercel${p.framework ? ` with ${frameworkLabels[p.framework] ?? p.framework}` : ""}.`,
        tags,
        github,
        demo,
        image: meta?.image,
        images: meta?.images,
        badge: meta?.badge,
      };
    });
  } catch {
    return [];
  }
}

export const staticProjects: Project[] = [
  {
    title: "CheckIt",
    description:
      "A smart grading and classroom management system for instructors. Features QR-coded answer sheet scanning, item analysis, score distribution, attendance tracking, calendar scheduling, GPA computation, and performance reports.",
    tags: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS"],
    image: "/projects/checkit.png",
  },
  {
    title: "Electrical Circuit Learning Game",
    description:
      "An interactive Android game for learning electrical installation through circuit building. Features drag-and-drop components, click-to-connect wiring with Bezier curves, real-time circuit simulation, short circuit detection, visual effects, progressive levels, and a tutorial system.",
    tags: ["Kotlin", "LibGDX", "Android", "Gradle"],
    images: ["/projects/circuit-game-menu.png", "/projects/circuit-game-play.png"],
  },
];
