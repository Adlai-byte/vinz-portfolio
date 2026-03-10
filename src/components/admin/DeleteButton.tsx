"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { deletePost } from "@/app/admin/actions";
import { Trash2, Loader2, CheckCircle, XCircle } from "lucide-react";

export default function DeleteButton({ slug, title }: { slug: string; title: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleDelete = () => {
    if (!confirm(`Delete "${title}"?`)) return;

    startTransition(async () => {
      const result = await deletePost(slug);

      if (result.success) {
        setToast({ message: `"${title}" deleted`, type: "success" });
        router.refresh();
      } else {
        setToast({ message: result.error || "Failed to delete", type: "error" });
      }

      setTimeout(() => setToast(null), 3000);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs px-3 py-1 border border-red-500/30 text-red-400 rounded hover:bg-red-500/10 transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
      >
        {isPending ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Trash2 size={12} />
        )}
        {isPending ? "Deleting..." : "Delete"}
      </button>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-6 left-1/2 z-[100] flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? <CheckCircle size={16} /> : <XCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
