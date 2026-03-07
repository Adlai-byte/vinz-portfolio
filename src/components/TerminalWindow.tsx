"use client";

import { useEffect, useRef, useState } from "react";

const logLines = [
  { time: "12:00:01", text: "$ claude init new-project", type: "cmd" },
  { time: "12:00:02", text: "Scaffolded Next.js + TypeScript app", type: "ok" },
  { time: "12:00:03", text: "Configured Tailwind CSS + Playwright", type: "ok" },
  { time: "12:00:04", text: "$ claude implement auth-system", type: "cmd" },
  { time: "12:00:05", text: "Generated 12 components", type: "ok" },
  { time: "12:00:06", text: "Wrote 24 test cases", type: "ok" },
  { time: "12:00:07", text: "$ npx playwright test", type: "cmd" },
  { time: "12:00:08", text: "24/24 tests passed (3.2s)", type: "ok" },
  { time: "12:00:09", text: "$ vercel --prod", type: "cmd" },
  { time: "12:00:10", text: "Deployed to production", type: "ok" },
  { time: "12:00:11", text: "", type: "blank" },
  { time: "12:00:12", text: "Done in 10 min \u2014 Traditional estimate: 4+ hours", type: "summary" },
];

export default function TerminalWindow() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReducedMotion(true);
      setVisibleCount(logLines.length);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= logLines.length) {
        clearInterval(interval);
        // Loop after 4s pause
        setTimeout(() => setVisibleCount(0), 4000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Restart loop when count resets to 0 (after initial mount)
  useEffect(() => {
    if (visibleCount !== 0 || reducedMotion) return;

    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setVisibleCount(i);
        if (i >= logLines.length) {
          clearInterval(interval);
          setTimeout(() => setVisibleCount(0), 4000);
        }
      }, 400);
      return () => clearInterval(interval);
    }, 600);

    return () => clearTimeout(timeout);
  }, [visibleCount, reducedMotion]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleCount]);

  const lines = reducedMotion ? logLines : logLines.slice(0, visibleCount);

  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg border border-border overflow-hidden bg-surface">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs font-mono text-text-dimmed">
          vinz@dev ~ %
        </span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="p-4 font-mono text-xs md:text-sm leading-relaxed h-[280px] md:h-[320px] overflow-y-auto"
      >
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-text-dimmed shrink-0 select-none">
              [{line.time}]
            </span>
            {line.type === "cmd" && (
              <span className="text-text-primary">{line.text}</span>
            )}
            {line.type === "ok" && (
              <span className="text-emerald-400">
                <span className="mr-1">&#10003;</span>
                {line.text}
              </span>
            )}
            {line.type === "blank" && <span>&nbsp;</span>}
            {line.type === "summary" && (
              <span className="text-text-primary font-semibold">
                {line.text}
              </span>
            )}
          </div>
        ))}
        {/* Blinking cursor */}
        {visibleCount >= logLines.length && (
          <div className="flex gap-2 mt-1">
            <span className="text-text-dimmed select-none">&gt;</span>
            <span className="cursor-blink">_</span>
          </div>
        )}
      </div>
    </div>
  );
}
