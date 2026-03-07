"use client";

import { deletePost } from "@/app/admin/actions";

export default function DeleteButton({ slug, title }: { slug: string; title: string }) {
  return (
    <form action={deletePost}>
      <input type="hidden" name="slug" value={slug} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(`Delete "${title}"?`)) {
            e.preventDefault();
          }
        }}
        className="text-xs px-3 py-1 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors badge-red"
      >
        Delete
      </button>
    </form>
  );
}
