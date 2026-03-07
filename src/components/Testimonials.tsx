"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "Vinz delivered our entire platform in a fraction of the time we expected. His agentic workflow is no joke — what would have taken weeks was done in days.",
    name: "Alex R.",
    role: "Startup Founder",
  },
  {
    quote:
      "Incredibly fast turnaround without sacrificing quality. The code was clean, well-tested, and production-ready from day one.",
    name: "Maria S.",
    role: "Product Manager",
  },
  {
    quote:
      "Working with Vinz felt like having a full dev team. He handled frontend, backend, and deployment all on his own — and faster than our previous team of three.",
    name: "James T.",
    role: "CTO, Tech Agency",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-sm font-mono text-text-dimmed mb-2">
            // --- 03
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Testimonials</h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="bg-surface border border-border rounded-xl p-6 flex flex-col"
            >
              <span className="text-text-dimmed font-mono text-lg mb-3 select-none">
                &ldquo;
              </span>
              <p className="text-sm text-text-muted leading-relaxed flex-1">
                {t.quote}
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm font-semibold text-text-primary">
                  {t.name}
                </p>
                <p className="text-xs font-mono text-text-dimmed">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
