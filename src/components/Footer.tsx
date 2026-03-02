"use client";

import { ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-text-dimmed">
            &copy; {new Date().getFullYear()} Vinz. All rights reserved.
          </p>
          <p className="text-xs text-text-dimmed/60">
            Built with Next.js & Tailwind CSS
          </p>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-surface hover:border-text-dimmed transition-colors duration-200"
          aria-label="Back to top"
        >
          <ArrowUp size={16} className="text-text-muted" />
        </button>
      </div>
    </footer>
  );
}
