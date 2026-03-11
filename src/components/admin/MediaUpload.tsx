"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImageIcon, Film, Trash2, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface MediaUploadProps {
  onInsert: (markdown: string) => void;
}

export default function MediaUpload({ onInsert }: MediaUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    if (loaded) return;
    const res = await fetch("/api/upload");
    if (res.ok) {
      setMedia(await res.json());
      setLoaded(true);
    }
  }, [loaded]);

  const open = () => {
    setIsOpen(true);
    loadMedia();
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      const data = await res.json();
      setMedia((prev) => [
        { url: data.url, pathname: data.pathname, size: file.size, uploadedAt: new Date().toISOString() },
        ...prev,
      ]);
    }
    setUploading(false);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const deleteFile = async (url: string) => {
    if (!confirm("Delete this file?")) return;
    const res = await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (res.ok) {
      setMedia((prev) => prev.filter((m) => m.url !== url));
    }
  };

  const insertMedia = (file: MediaFile) => {
    const isVideo = file.pathname.match(/\.(mp4|webm|mov)$/i);
    if (isVideo) {
      onInsert(`![video](${file.url})`);
    } else {
      onInsert(`![image](${file.url})`);
    }
    setIsOpen(false);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const isImage = (path: string) => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(path);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        title="Media Library"
        className="p-1.5 rounded hover:bg-background text-text-dimmed hover:text-text-primary transition-colors"
      >
        <Upload size={15} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-background border border-border rounded-xl w-full max-w-3xl max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-lg font-semibold text-text-primary">Media Library</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-text-dimmed hover:text-text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Upload zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`mx-5 mt-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver
                    ? "border-text-primary bg-surface"
                    : "border-border hover:border-text-dimmed"
                }`}
              >
                {uploading ? (
                  <div className="flex items-center justify-center gap-2 text-text-dimmed">
                    <Loader2 size={20} className="animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <div>
                    <Upload size={24} className="mx-auto mb-2 text-text-dimmed" />
                    <p className="text-sm text-text-dimmed mb-2">
                      Drag & drop images or videos here
                    </p>
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="text-xs px-3 py-1.5 bg-surface border border-border rounded-md text-text-muted hover:text-text-primary transition-colors"
                    >
                      Browse Files
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFiles(e.target.files)}
                    />
                  </div>
                )}
              </div>

              {/* Media grid */}
              <div className="flex-1 overflow-y-auto p-5">
                {media.length === 0 && loaded && (
                  <p className="text-center text-text-dimmed text-sm py-8">
                    No media uploaded yet
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {media.map((file) => (
                    <div
                      key={file.url}
                      className="group relative bg-surface border border-border rounded-lg overflow-hidden"
                    >
                      {/* Preview */}
                      <div
                        className="aspect-square cursor-pointer"
                        onClick={() => insertMedia(file)}
                      >
                        {isImage(file.pathname) ? (
                          <img
                            src={file.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-background">
                            <Film size={32} className="text-text-dimmed" />
                          </div>
                        )}
                      </div>

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => insertMedia(file)}
                          className="text-xs px-3 py-1.5 bg-text-primary text-background rounded-md font-medium"
                        >
                          Insert
                        </button>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyUrl(file.url)}
                            className="p-1.5 bg-surface/80 rounded text-text-muted hover:text-text-primary transition-colors"
                            title="Copy URL"
                          >
                            {copied === file.url ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteFile(file.url)}
                            className="p-1.5 bg-surface/80 rounded text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* File info */}
                      <div className="px-2 py-1.5 border-t border-border">
                        <p className="text-[10px] text-text-dimmed truncate font-mono">
                          {file.pathname.replace("blog/", "")}
                        </p>
                        <p className="text-[10px] text-text-dimmed">
                          {formatSize(file.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
