"use client";

import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] || null;
}

const customStyle = {
  ...oneDark,
  'pre[class*="language-"]': {
    ...oneDark['pre[class*="language-"]'],
    background: "#141414",
    margin: 0,
    borderRadius: 0,
  },
  'code[class*="language-"]': {
    ...oneDark['code[class*="language-"]'],
    background: "#141414",
  },
};

const components: Components = {
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const code = String(children).replace(/\n$/, "");

    if (!match) {
      // Inline code
      return (
        <code
          className="bg-surface px-1.5 py-0.5 rounded text-[0.875em] font-mono text-text-primary"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <div className="my-6 rounded-lg border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
          <span className="text-xs font-mono text-text-dimmed">{match[1]}</span>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs text-text-dimmed hover:text-text-primary transition-colors"
          >
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          style={customStyle}
          language={match[1]}
          PreTag="div"
          customStyle={{ margin: 0, padding: "1rem", fontSize: "0.875rem" }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  },

  pre: ({ children }) => <>{children}</>,

  img: ({ src, alt }) => {
    if (!src || typeof src !== "string") return null;

    // YouTube video embed via ![alt](youtube-url)
    const ytId = getYouTubeId(src);
    if (ytId) {
      return (
        <div className="relative w-full aspect-video my-6 rounded-lg overflow-hidden border border-border">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${ytId}`}
            title={alt || "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }

    // Uploaded video file (mp4, webm, mov)
    if (/\.(mp4|webm|mov)(\?|$)/i.test(src)) {
      return (
        <div className="my-6 rounded-lg overflow-hidden border border-border">
          <video controls className="w-full" preload="metadata">
            <source src={src} />
          </video>
        </div>
      );
    }

    const isBlob = src.includes(".public.blob.vercel-storage.com");

    return (
      <figure className="my-6">
        {isBlob ? (
          <Image
            src={src}
            alt={alt || ""}
            width={800}
            height={450}
            quality={75}
            sizes="(max-width: 768px) 100vw, 800px"
            className="rounded-lg border border-border w-full h-auto"
          />
        ) : (
          <img
            src={src}
            alt={alt || ""}
            loading="lazy"
            className="rounded-lg border border-border w-full"
          />
        )}
        {alt && alt !== "image" && (
          <figcaption className="text-center text-xs text-text-dimmed mt-2 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    );
  },

  a: ({ href, children }) => (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      className="text-text-primary underline underline-offset-2 hover:text-text-muted transition-colors"
    >
      {children}
    </a>
  ),

  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-surface text-text-primary text-left">{children}</thead>
  ),

  th: ({ children }) => (
    <th className="px-4 py-2.5 font-semibold text-xs uppercase tracking-wider border-b border-border">
      {children}
    </th>
  ),

  td: ({ children }) => (
    <td className="px-4 py-2.5 text-text-muted border-b border-border/50">{children}</td>
  ),

  tr: ({ children }) => (
    <tr className="hover:bg-surface/50 transition-colors">{children}</tr>
  ),
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
