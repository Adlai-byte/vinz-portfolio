"use client";

import { useEffect, useState } from "react";
import { GitCommit, GitPullRequest, Star, GitFork } from "lucide-react";

interface GitEvent {
  type: string;
  repo: string;
  message: string;
  time: string;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 604800)}w ago`;
}

function EventIcon({ type }: { type: string }) {
  switch (type) {
    case "PushEvent":
      return <GitCommit size={14} className="text-emerald-400 shrink-0" />;
    case "PullRequestEvent":
      return <GitPullRequest size={14} className="text-purple-400 shrink-0" />;
    case "WatchEvent":
      return <Star size={14} className="text-yellow-400 shrink-0" />;
    case "ForkEvent":
      return <GitFork size={14} className="text-blue-400 shrink-0" />;
    default:
      return <GitCommit size={14} className="text-text-dimmed shrink-0" />;
  }
}

function formatEvent(event: { type: string; repo: { name: string }; payload?: Record<string, unknown>; created_at: string }): GitEvent | null {
  const repo = event.repo.name.replace("Adlai-byte/", "");
  const time = event.created_at;

  switch (event.type) {
    case "PushEvent": {
      const commits = (event.payload as { commits?: { message: string }[] })?.commits;
      const msg = commits?.[0]?.message?.split("\n")[0] || "pushed code";
      return { type: event.type, repo, message: msg, time };
    }
    case "PullRequestEvent": {
      const action = (event.payload as { action?: string })?.action || "opened";
      return { type: event.type, repo, message: `${action} a pull request`, time };
    }
    case "WatchEvent":
      return { type: event.type, repo, message: "starred repo", time };
    case "ForkEvent":
      return { type: event.type, repo, message: "forked repo", time };
    case "CreateEvent": {
      const refType = (event.payload as { ref_type?: string })?.ref_type || "branch";
      return { type: event.type, repo, message: `created ${refType}`, time };
    }
    default:
      return null;
  }
}

export default function GitHubActivity() {
  const [events, setEvents] = useState<GitEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.github.com/users/Adlai-byte/events?per_page=10")
      .then((res) => res.json())
      .then((data) => {
        const parsed = (data as Array<{ type: string; repo: { name: string }; payload?: Record<string, unknown>; created_at: string }>)
          .map(formatEvent)
          .filter((e): e is GitEvent => e !== null)
          .slice(0, 6);
        setEvents(parsed);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-lg border border-border bg-surface p-6">
        <p className="text-text-dimmed font-mono text-sm animate-pulse">
          $ fetching github activity...
        </p>
      </div>
    );
  }

  if (events.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg border border-border overflow-hidden bg-surface">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-background">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs font-mono text-text-dimmed">
          vinz@dev ~ % gh activity
        </span>
      </div>

      {/* Activity log */}
      <div className="p-4 font-mono text-xs md:text-sm space-y-2">
        {events.map((event, i) => (
          <div key={i} className="flex items-start gap-2">
            <EventIcon type={event.type} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-text-primary font-semibold truncate">
                  {event.repo}
                </span>
                <span className="text-text-dimmed shrink-0">
                  {timeAgo(event.time)}
                </span>
              </div>
              <p className="text-text-muted truncate">{event.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border">
        <a
          href="https://github.com/Adlai-byte"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-mono text-text-dimmed hover:text-text-muted transition-colors"
        >
          {">"} view full profile on github
        </a>
      </div>
    </div>
  );
}
