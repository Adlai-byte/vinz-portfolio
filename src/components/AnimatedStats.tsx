"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

type Stat = {
  value: number;
  suffix: string;
  label: string;
};

const stats: Stat[] = [
  { value: 5, suffix: "+", label: "Projects Completed" },
  { value: 3, suffix: "+", label: "Technologies" },
  { value: 1, suffix: "+", label: "Years Experience" },
  { value: 2, suffix: "+", label: "Frameworks Mastered" },
];

function AnimatedCounter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let current = 0;
    const duration = 1200;
    const stepTime = Math.max(Math.floor(duration / value), 50);

    const timer = setInterval(() => {
      current += 1;
      setCount(current);
      if (current >= value) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className="text-3xl md:text-4xl font-bold font-mono text-text-primary">
      {count}{suffix}
    </span>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          className="bg-surface border border-border rounded-lg p-5 text-center card-elevated"
        >
          <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
          <p className="text-xs md:text-sm text-text-muted mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
