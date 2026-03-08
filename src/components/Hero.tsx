"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import TerminalWindow from "./TerminalWindow";
import WorkflowDiagram from "./WorkflowDiagram";
import QuoteModal from "./QuoteModal";
import ParticleGrid from "./ParticleGrid";

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;

    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, 80);
    return () => clearTimeout(timer);
  }, [started, displayed, text]);

  return (
    <span className="font-mono">
      {displayed}
      <span className={displayed.length < text.length ? "cursor-blink" : "opacity-0"}>_</span>
    </span>
  );
}

export default function Hero() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 hero-gradient" />
      <ParticleGrid />

      <div className="relative z-10 max-w-3xl w-full text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-text-dimmed text-sm font-mono mb-4"
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
          className="text-xl md:text-2xl text-text-muted mb-6"
        >
          <TypingText text="D3V3L0P3R" delay={700} />
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <p className="text-lg md:text-xl font-semibold text-text-primary">
            Agentic Development Workflow
          </p>
          <p className="text-sm text-text-dimmed font-mono mt-1">
            20x faster than traditional development
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mb-10"
        >
          <WorkflowDiagram />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mb-10"
        >
          <TerminalWindow />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <button
            onClick={() => setQuoteOpen(true)}
            className="px-6 py-3 bg-text-primary text-background font-medium rounded-lg hover:bg-text-muted transition-colors duration-200 text-sm"
          >
            Get a Quote
          </button>
          <a
            href="#contact"
            className="px-6 py-3 border border-border text-text-primary rounded-lg hover:bg-surface transition-colors duration-200 text-sm"
          >
            Get in Touch
          </a>
        </motion.div>

        <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
      </div>

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
