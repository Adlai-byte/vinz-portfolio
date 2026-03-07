# Code Breaker Game — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a terminal-styled Mastermind game at `/game` where players guess a 4-color code with feedback hints.

**Architecture:** Single `CodeBreaker.tsx` component handles all game state (secret code, guesses, timer). A thin `game/page.tsx` wraps it with Navbar. The terminal output is a scrollable log of guess results, with color-picker input below.

**Tech Stack:** React, Tailwind CSS, framer-motion (for win animation). No new dependencies.

---

### Task 1: Create the CodeBreaker component

**Files:**
- Create: `src/components/CodeBreaker.tsx`

**Step 1: Create the component with game constants and types**

The color palette, game logic helpers, and component skeleton:

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const COLORS = [
  { name: "red", hex: "#ff5f57" },
  { name: "green", hex: "#28c840" },
  { name: "blue", hex: "#3b82f6" },
  { name: "yellow", hex: "#febc2e" },
  { name: "purple", hex: "#a855f7" },
  { name: "orange", hex: "#f97316" },
] as const;

type ColorName = (typeof COLORS)[number]["name"];

const CODE_LENGTH = 4;

interface GuessResult {
  guess: ColorName[];
  correct: number;
  misplaced: number;
}

function generateSecret(): ColorName[] {
  const code: ColorName[] = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    code.push(COLORS[Math.floor(Math.random() * COLORS.length)].name);
  }
  return code;
}

function evaluate(guess: ColorName[], secret: ColorName[]): { correct: number; misplaced: number } {
  let correct = 0;
  const secretRemaining: (ColorName | null)[] = [...secret];
  const guessRemaining: (ColorName | null)[] = [...guess];

  // First pass: exact matches
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === secret[i]) {
      correct++;
      secretRemaining[i] = null;
      guessRemaining[i] = null;
    }
  }

  // Second pass: misplaced
  let misplaced = 0;
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessRemaining[i] === null) continue;
    const idx = secretRemaining.indexOf(guessRemaining[i]);
    if (idx !== -1) {
      misplaced++;
      secretRemaining[idx] = null;
    }
  }

  return { correct, misplaced };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function ColorDot({ color, size = "w-5 h-5" }: { color: ColorName; size?: string }) {
  const hex = COLORS.find((c) => c.name === color)?.hex ?? "#666";
  return <span className={`${size} rounded-full inline-block`} style={{ backgroundColor: hex }} />;
}
```

**Step 2: Build the main component with state management**

Add the component function with all state, the handleGuess logic, reset, and timer:

```tsx
export default function CodeBreaker() {
  const [secret, setSecret] = useState<ColorName[]>(() => generateSecret());
  const [currentGuess, setCurrentGuess] = useState<ColorName[]>([]);
  const [history, setHistory] = useState<GuessResult[]>([]);
  const [won, setWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (!started || won) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [started, won]);

  // Auto-scroll terminal
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, won]);

  const addColor = useCallback((color: ColorName) => {
    setCurrentGuess((prev) => (prev.length < CODE_LENGTH ? [...prev, color] : prev));
  }, []);

  const removeSlot = useCallback((index: number) => {
    setCurrentGuess((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearGuess = useCallback(() => setCurrentGuess([]), []);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== CODE_LENGTH) return;
    if (!started) setStarted(true);

    const { correct, misplaced } = evaluate(currentGuess, secret);
    const result: GuessResult = { guess: [...currentGuess], correct, misplaced };
    setHistory((prev) => [...prev, result]);
    setCurrentGuess([]);

    if (correct === CODE_LENGTH) {
      setWon(true);
    }
  }, [currentGuess, secret, started]);

  const resetGame = useCallback(() => {
    setSecret(generateSecret());
    setCurrentGuess([]);
    setHistory([]);
    setWon(false);
    setElapsed(0);
    setStarted(false);
  }, []);
```

**Step 3: Build the JSX — terminal window + input area**

```tsx
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Terminal window */}
      <div className="rounded-lg border border-border overflow-hidden bg-surface">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs font-mono text-text-dimmed">
            vinz@dev ~ % ./code-breaker
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="p-4 font-mono text-xs md:text-sm leading-relaxed h-[320px] md:h-[380px] overflow-y-auto"
        >
          {/* Intro lines */}
          <p className="text-text-dimmed">{">"} Initializing code_breaker v1.0...</p>
          <p className="text-text-dimmed">{">"} A secret 4-color code has been generated.</p>
          <p className="text-text-dimmed">{">"} Crack the code. Unlimited attempts.</p>
          <div className="flex items-center gap-1 mt-1 mb-3">
            <span className="text-text-dimmed">{">"} Available:</span>
            {COLORS.map((c) => (
              <ColorDot key={c.name} color={c.name} size="w-3 h-3" />
            ))}
          </div>

          {/* Guess history */}
          {history.map((result, i) => (
            <div key={i} className="flex items-center gap-2 py-0.5">
              <span className="text-text-dimmed shrink-0 select-none">
                [attempt {String(i + 1).padStart(2, "0")}]
              </span>
              <span className="flex items-center gap-1">
                {result.guess.map((c, j) => (
                  <ColorDot key={j} color={c} size="w-4 h-4" />
                ))}
              </span>
              <span className="text-text-dimmed select-none mx-1">{"->"}</span>
              <span
                className={
                  result.correct === CODE_LENGTH
                    ? "text-emerald-400"
                    : result.correct === 0 && result.misplaced === 0
                      ? "text-text-dimmed"
                      : "text-text-muted"
                }
              >
                {result.correct} correct, {result.misplaced} misplaced
              </span>
            </div>
          ))}

          {/* Win state */}
          {won && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-4"
            >
              <p className="text-emerald-400 font-bold text-lg">{">"} ACCESS GRANTED</p>
              <p className="text-text-muted mt-1">
                {">"} Code cracked in {history.length} {history.length === 1 ? "attempt" : "attempts"} ({formatTime(elapsed)})
              </p>
            </motion.div>
          )}

          {/* Blinking cursor when not won */}
          {!won && history.length > 0 && (
            <div className="flex gap-2 mt-1">
              <span className="text-text-dimmed select-none">{">"}</span>
              <span className="cursor-blink">_</span>
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <div className="mt-4 p-4 rounded-lg border border-border bg-surface">
        {/* Current guess slots */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <button
              key={i}
              onClick={() => currentGuess[i] && removeSlot(i)}
              disabled={won}
              className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center transition-colors hover:border-text-dimmed disabled:opacity-50"
              style={
                currentGuess[i]
                  ? { backgroundColor: COLORS.find((c) => c.name === currentGuess[i])?.hex }
                  : undefined
              }
            >
              {!currentGuess[i] && <span className="text-text-dimmed text-xs">{i + 1}</span>}
            </button>
          ))}
        </div>

        {/* Color picker */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => addColor(c.name)}
              disabled={won || currentGuess.length >= CODE_LENGTH}
              className="w-8 h-8 rounded-full transition-transform hover:scale-110 disabled:opacity-40 disabled:hover:scale-100"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          {won ? (
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-text-primary text-background font-mono font-medium rounded-lg hover:bg-text-muted transition-colors text-sm"
            >
              $ play_again
            </button>
          ) : (
            <>
              <button
                onClick={clearGuess}
                disabled={currentGuess.length === 0}
                className="px-4 py-2 border border-border text-text-muted font-mono rounded-lg hover:bg-background transition-colors text-sm disabled:opacity-40"
              >
                $ reset
              </button>
              <button
                onClick={submitGuess}
                disabled={currentGuess.length !== CODE_LENGTH}
                className="px-6 py-2 bg-text-primary text-background font-mono font-medium rounded-lg hover:bg-text-muted transition-colors text-sm disabled:opacity-40"
              >
                $ crack
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 4: Verify no syntax errors**

Run: `npx next build`
Expected: Compiles (page not wired yet, but component should have no errors if imported)

**Step 5: Commit**

```bash
git add src/components/CodeBreaker.tsx
git commit -m "feat: add CodeBreaker game component"
```

---

### Task 2: Create the /game page

**Files:**
- Create: `src/app/game/page.tsx`

**Step 1: Create the page**

```tsx
import Navbar from "@/components/Navbar";
import CodeBreaker from "@/components/CodeBreaker";

export const metadata = {
  title: "Code Breaker | Vinz",
  description: "Crack the code — a terminal-styled Mastermind game.",
};

export default function GamePage() {
  return (
    <main>
      <Navbar />
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <CodeBreaker />
      </section>
    </main>
  );
}
```

**Step 2: Build and verify**

Run: `npx next build`
Expected: `/game` route appears in the route list, no errors.

**Step 3: Commit**

```bash
git add src/app/game/page.tsx
git commit -m "feat: add /game page for Code Breaker"
```

---

### Task 3: Add "Game" to the navbar

**Files:**
- Modify: `src/components/Navbar.tsx:10-15` (the `navLinks` array)

**Step 1: Add the Game link**

Change the `navLinks` array from:

```tsx
const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
];
```

To:

```tsx
const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "/blog" },
  { label: "Game", href: "/game" },
  { label: "Contact", href: "#contact" },
];
```

**Step 2: Build and verify**

Run: `npx next build`
Expected: No errors, `/game` route listed.

**Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add Game link to navbar"
```

---

### Task 4: Final verification and deploy

**Step 1: Full build check**

Run: `npx next build`
Expected: All routes compile, no type errors.

**Step 2: Commit all (if any remaining changes)**

```bash
git add -A
git commit -m "feat: complete Code Breaker game"
```

**Step 3: Push and deploy**

```bash
git push origin master
vercel --prod
```

---

## File Changelist

| File | Action |
|------|--------|
| `src/components/CodeBreaker.tsx` | **Create** — Game logic + terminal UI |
| `src/app/game/page.tsx` | **Create** — Page wrapper |
| `src/components/Navbar.tsx` | **Modify** — Add Game nav link |
