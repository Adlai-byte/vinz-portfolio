"use client";

import { motion } from "framer-motion";

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
          <h2 className="text-sm font-mono text-text-dimmed mb-2">
            // --- 01
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">About Me</h3>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-text-muted max-w-2xl leading-relaxed mb-12"
        >
          I build things fast. I use an agentic development workflow &mdash;
          AI-assisted coding that lets me ship full features in minutes instead
          of hours. I work across the entire stack: web, mobile, backend,
          infra. Whatever the problem needs, I learn it and build it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-surface border border-border rounded-lg p-6 max-w-md"
        >
          <p className="font-mono text-sm md:text-base text-text-primary leading-relaxed break-words">
            <span className="text-text-dimmed">tech_stack</span>
            {" = "}
            <span className="text-emerald-400">
              &quot;A little bit of everything&quot;
            </span>
          </p>
          <p className="font-mono text-xs text-text-dimmed mt-2">
            // Any language. Any framework. Whatever ships.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
