import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] || null;
}

const components: Components = {
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

    return (
      <figure className="my-6">
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          className="rounded-lg border border-border w-full"
        />
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
