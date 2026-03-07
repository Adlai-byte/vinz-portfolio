const variants: Record<string, string> = {
  dots: ". . . . . . . . . . . . . . . . . . . . . . . . . .",
  code: "// ─────────────────────────────────────────────────",
  wave: "~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~^~",
  dashed: "- - - - - - - - - - - - - - - - - - - - - - - - - -",
};

export default function AsciiDivider({
  variant = "dots",
}: {
  variant?: keyof typeof variants;
}) {
  return (
    <div className="max-w-5xl mx-auto px-6 py-4 overflow-hidden">
      <pre className="text-text-dimmed/30 text-[10px] md:text-xs font-mono text-center select-none whitespace-nowrap">
        {variants[variant] ?? variants.dots}
      </pre>
    </div>
  );
}
