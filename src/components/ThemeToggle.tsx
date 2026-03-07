"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light");
    }
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  if (!mounted) {
    // Render a placeholder with the same dimensions to avoid layout shift
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-surface hover:border-text-dimmed transition-colors duration-200 card-elevated"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun size={16} className="text-text-muted" />
      ) : (
        <Moon size={16} className="text-text-muted" />
      )}
    </button>
  );
}
