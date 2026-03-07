"use client";

import { motion } from "framer-motion";
import AnimatedStats from "./AnimatedStats";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiKotlin,
  SiJetpackcompose,
  SiNodedotjs,
  SiGit,
  SiDotnet,
  SiJavascript,
  SiFlutter,
  SiMysql,
  SiSupabase,
  SiDocker,
  SiOpenai,
} from "react-icons/si";
import { FaJava, FaShieldAlt, FaCogs, FaRobot, FaMicrochip } from "react-icons/fa";

type TechItem = {
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  category: string;
};

const techStack: TechItem[] = [
  // Web
  { name: "React", icon: SiReact, category: "Web" },
  { name: "Next.js", icon: SiNextdotjs, category: "Web" },
  { name: "TypeScript", icon: SiTypescript, category: "Web" },
  { name: "JavaScript", icon: SiJavascript, category: "Web" },
  { name: "Tailwind CSS", icon: SiTailwindcss, category: "Web" },
  { name: "Node.js", icon: SiNodedotjs, category: "Web" },
  { name: "React Native", icon: SiReact, category: "Web" },
  // Mobile & Desktop
  { name: "Kotlin", icon: SiKotlin, category: "Mobile" },
  { name: "Jetpack Compose", icon: SiJetpackcompose, category: "Mobile" },
  { name: "Flutter", icon: SiFlutter, category: "Mobile" },
  { name: "Java", icon: FaJava, category: "Mobile" },
  { name: "JavaFX", icon: FaJava, category: "Mobile" },
  { name: "C#", icon: SiDotnet, category: "Mobile" },
  // Data & Infra
  { name: "MySQL", icon: SiMysql, category: "Infra" },
  { name: "Supabase", icon: SiSupabase, category: "Infra" },
  { name: "Docker", icon: SiDocker, category: "Infra" },
  { name: "Git", icon: SiGit, category: "Infra" },
  // Domains
  { name: "AI & AI Agents", icon: SiOpenai, category: "Domains" },
  { name: "Agentic Dev", icon: FaRobot, category: "Domains" },
  { name: "Systems Dev", icon: FaCogs, category: "Domains" },
  { name: "Cybersecurity", icon: FaShieldAlt, category: "Domains" },
];

const categories = [
  { key: "Web", label: "Web" },
  { key: "Mobile", label: "Mobile & Desktop" },
  { key: "Infra", label: "Data & Infrastructure" },
  { key: "Domains", label: "Domains" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-sm font-mono text-text-dimmed mb-2">01</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">About Me</h3>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-text-muted max-w-2xl leading-relaxed mb-12"
        >
          I&apos;m a full-stack and mobile developer who loves building clean,
          performant applications. I work across web and Android, turning ideas
          into polished products. I care about good design, solid architecture,
          and writing code that&apos;s easy to maintain.
        </motion.p>

        <AnimatedStats />

        {categories.map((cat) => {
          const items = techStack.filter((t) => t.category === cat.key);
          return (
            <div key={cat.key} className="mb-6 last:mb-0">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-xs font-mono text-text-dimmed uppercase tracking-wider mb-3"
              >
                {cat.label}
              </motion.p>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-wrap gap-3"
              >
                {items.map((tech) => (
                  <motion.div
                    key={tech.name}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2.5 bg-surface border border-border rounded-lg px-4 py-2.5 cursor-default"
                  >
                    <tech.icon size={16} className="text-text-dimmed shrink-0" />
                    <span className="text-sm text-text-muted">{tech.name}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
