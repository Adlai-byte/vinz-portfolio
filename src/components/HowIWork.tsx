"use client";

import { motion } from "framer-motion";
import { MessageSquare, Palette, Code2, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Discovery",
    description: "Understand your goals, requirements, and constraints.",
  },
  {
    icon: Palette,
    title: "Design",
    description: "Architect the solution and define the tech stack.",
  },
  {
    icon: Code2,
    title: "Build",
    description: "Agentic development — ship features in hours, not weeks.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description: "Production-ready, tested, and deployed to your domain.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowIWork() {
  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-sm font-mono text-text-dimmed mb-2">
            // --- how it works
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-10">
            From Idea to Production
          </h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={stepVariants}
              className="relative bg-surface border border-border rounded-xl p-6 group hover:border-text-dimmed transition-colors duration-300"
            >
              <span className="text-xs font-mono text-text-dimmed mb-4 block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <step.icon
                size={24}
                className="text-text-muted mb-3 group-hover:text-text-primary transition-colors"
              />
              <h4 className="text-sm font-semibold text-text-primary mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <span className="hidden md:block absolute top-1/2 -right-3 text-text-dimmed/30 text-lg select-none">
                  &rarr;
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
