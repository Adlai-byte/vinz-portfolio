"use client";

import { motion } from "framer-motion";

const steps = [
  { label: "Plan", detail: "Architecture & infrastructure design", icon: "01" },
  { label: "Agents", detail: "Multi-agent SOTA model execution", icon: "02" },
  { label: "Test", detail: "Test-driven validation & iteration", icon: "03" },
  { label: "Ship", detail: "Deploy to production", icon: "04" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function WorkflowDiagram() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* ASCII header */}
      <p className="font-mono text-xs text-text-dimmed mb-4 text-center">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        &gt; workflow.exe
      </p>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {steps.map((step, i) => (
          <motion.div key={step.label} variants={itemVariants} className="flex flex-col items-center">
            {/* Step box */}
            <div className="w-full bg-surface border border-border rounded-lg p-3 md:p-4 text-center hover:border-text-dimmed transition-colors">
              <span className="block font-mono text-[10px] text-text-dimmed mb-1">
                {step.icon}
              </span>
              <span className="block text-sm md:text-base font-semibold text-text-primary">
                {step.label}
              </span>
              <span className="block text-[10px] md:text-xs text-text-dimmed mt-1 leading-tight">
                {step.detail}
              </span>
            </div>

            {/* Arrow (except last) */}
            {i < steps.length - 1 && (
              <span className="hidden md:block absolute" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Flow arrows row */}
      <div className="grid grid-cols-4 gap-2 md:gap-3 mt-1">
        {steps.map((_, i) => (
          <div key={i} className="flex justify-center">
            {i < steps.length - 1 && (
              <span className="font-mono text-text-dimmed text-xs hidden md:block">
                →
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ASCII pipeline visualization */}
      <pre className="font-mono text-[10px] md:text-xs text-text-dimmed text-center mt-3 select-none">
        {`[ Human ] ──→ [ SOTA Agents ] ──→ [ Tests ] ──→ [ Production ]`}
      </pre>
      <p className="font-mono text-[10px] text-text-dimmed/50 text-center mt-1">
        // hybrid planning + multi-agent + TDD
      </p>
    </motion.div>
  );
}
