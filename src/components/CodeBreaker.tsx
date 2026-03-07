"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Constants & types
// ---------------------------------------------------------------------------

const COLORS = {
  Red: "#ff5f57",
  Green: "#28c840",
  Blue: "#3b82f6",
  Yellow: "#febc2e",
  Purple: "#a855f7",
  Orange: "#f97316",
} as const;

type ColorName = keyof typeof COLORS;

const COLOR_NAMES = Object.keys(COLORS) as ColorName[];
const CODE_LENGTH = 4;

interface GuessResult {
  guess: ColorName[];
  correct: number;
  misplaced: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateSecret(): ColorName[] {
  return Array.from(
    { length: CODE_LENGTH },
    () => COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)],
  );
}

function evaluate(
  guess: ColorName[],
  secret: ColorName[],
): { correct: number; misplaced: number } {
  let correct = 0;
  let misplaced = 0;

  const secretRemaining: (ColorName | null)[] = [...secret];
  const guessRemaining: (ColorName | null)[] = [...guess];

  // Pass 1 — exact matches
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guess[i] === secret[i]) {
      correct++;
      secretRemaining[i] = null;
      guessRemaining[i] = null;
    }
  }

  // Pass 2 — misplaced
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
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function ColorDot({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CodeBreaker() {
  const [secret, setSecret] = useState<ColorName[]>(generateSecret);
  const [currentGuess, setCurrentGuess] = useState<ColorName[]>([]);
  const [history, setHistory] = useState<GuessResult[]>([]);
  const [won, setWon] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [started, setStarted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Timer
  useEffect(() => {
    if (!started || won) return;
    const id = setInterval(() => setElapsed((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [started, won]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, won]);

  // Actions
  const addColor = useCallback(
    (color: ColorName) => {
      if (won) return;
      if (!started) setStarted(true);
      setCurrentGuess((prev) =>
        prev.length < CODE_LENGTH ? [...prev, color] : prev,
      );
    },
    [won, started],
  );

  const removeSlot = useCallback(
    (index: number) => {
      if (won) return;
      setCurrentGuess((prev) => prev.filter((_, i) => i !== index));
    },
    [won],
  );

  const clearGuess = useCallback(() => {
    if (won) return;
    setCurrentGuess([]);
  }, [won]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== CODE_LENGTH || won) return;
    const { correct, misplaced } = evaluate(currentGuess, secret);
    const result: GuessResult = { guess: [...currentGuess], correct, misplaced };
    setHistory((prev) => [...prev, result]);
    setCurrentGuess([]);
    if (correct === CODE_LENGTH) {
      setWon(true);
    }
  }, [currentGuess, secret, won]);

  const resetGame = useCallback(() => {
    setSecret(generateSecret());
    setCurrentGuess([]);
    setHistory([]);
    setWon(false);
    setElapsed(0);
    setStarted(false);
  }, []);

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
          <p className="text-text-muted">
            Initializing code_breaker v1.0...
          </p>
          <p className="text-text-muted">
            A secret 4-color code has been generated.
          </p>
          <p className="text-text-muted">
            Crack the code. Unlimited attempts.
          </p>
          <p className="text-text-muted flex items-center gap-1.5 flex-wrap">
            <span>Available:</span>
            {COLOR_NAMES.map((name) => (
              <ColorDot key={name} color={COLORS[name]} size={10} />
            ))}
          </p>

          <div className="mt-3 border-t border-border pt-3 space-y-1">
            {/* Guess history */}
            {history.map((entry, i) => (
              <div key={i} className="flex items-center gap-2 flex-wrap">
                <span className="text-text-dimmed select-none">
                  [attempt {String(i + 1).padStart(2, "0")}]
                </span>
                <span className="flex items-center gap-1">
                  {entry.guess.map((c, j) => (
                    <ColorDot key={j} color={COLORS[c]} size={12} />
                  ))}
                </span>
                <span className="text-text-dimmed select-none">-&gt;</span>
                <span className="text-emerald-400">
                  {entry.correct} correct
                </span>
                <span className="text-text-dimmed">,</span>
                <span className="text-yellow-400">
                  {entry.misplaced} misplaced
                </span>
              </div>
            ))}

            {/* Win state */}
            {won && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-3 space-y-1"
              >
                <p className="text-emerald-400 font-semibold">
                  ACCESS GRANTED
                </p>
                <p className="text-text-muted">
                  Code cracked in {history.length}{" "}
                  {history.length === 1 ? "attempt" : "attempts"} | Time:{" "}
                  {formatTime(elapsed)}
                </p>
              </motion.div>
            )}

            {/* Blinking cursor */}
            {!won && (
              <div className="flex gap-2 mt-1">
                <span className="text-text-dimmed select-none">&gt;</span>
                <span className="cursor-blink">_</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="mt-4 p-4 rounded-lg border border-border bg-surface">
        {/* Guess slots */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => {
            const color = currentGuess[i];
            return (
              <button
                key={i}
                type="button"
                onClick={() => color && removeSlot(i)}
                className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center transition-colors hover:border-text-dimmed"
                style={
                  color
                    ? { backgroundColor: COLORS[color], borderColor: COLORS[color] }
                    : undefined
                }
                aria-label={
                  color ? `Remove ${color} from slot ${i + 1}` : `Empty slot ${i + 1}`
                }
              />
            );
          })}
        </div>

        {/* Color picker */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {COLOR_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => addColor(name)}
              className="w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-text-dimmed/50"
              style={{ backgroundColor: COLORS[name] }}
              aria-label={`Pick ${name}`}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3">
          {won ? (
            <button
              type="button"
              onClick={resetGame}
              className="px-6 py-2 bg-text-primary text-background font-mono font-medium rounded-lg hover:bg-text-muted transition-colors text-sm"
            >
              $ play_again
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={resetGame}
                className="px-4 py-2 border border-border text-text-muted font-mono rounded-lg hover:bg-background transition-colors text-sm"
              >
                $ reset
              </button>
              <button
                type="button"
                onClick={submitGuess}
                disabled={currentGuess.length !== CODE_LENGTH}
                className="px-6 py-2 bg-text-primary text-background font-mono font-medium rounded-lg hover:bg-text-muted transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
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
