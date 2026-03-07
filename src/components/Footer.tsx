"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Eye } from "lucide-react";

export default function Footer() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/views", { method: "POST" })
      .then((res) => res.json())
      .then((data) => setViews(data.count))
      .catch(() => {});
  }, []);

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
          <div className="flex items-center gap-3">
            <p className="text-xs text-text-dimmed/60">
              Built with Next.js & Tailwind CSS
            </p>
            {views !== null && (
              <span className="inline-flex items-center gap-1 text-xs text-text-dimmed/60">
                <Eye size={12} />
                {views.toLocaleString()} visits
              </span>
            )}
          </div>
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
