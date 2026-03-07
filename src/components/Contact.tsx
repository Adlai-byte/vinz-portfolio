"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import QuoteModal from "./QuoteModal";

export default function Contact() {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <section id="contact" className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-sm font-mono text-text-dimmed mb-2">// --- 05</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Get in Touch</h3>
          <p className="text-text-muted max-w-md mx-auto mb-10 leading-relaxed">
            I&apos;m always open to new opportunities and interesting projects.
            Feel free to reach out.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:vinzlloydalferez@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-surface border border-border rounded-lg hover:border-text-dimmed transition-all duration-200"
            >
              <Mail size={20} className="text-text-muted" />
              <span className="text-text-primary">vinzlloydalferez@gmail.com</span>
            </a>
            <button
              onClick={() => setQuoteOpen(true)}
              className="px-8 py-4 bg-text-primary text-background font-medium rounded-lg hover:bg-text-muted transition-colors duration-200 text-sm"
            >
              Get a Quote
            </button>
          </div>
        </motion.div>

        <QuoteModal isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
      </div>
    </section>
  );
}
