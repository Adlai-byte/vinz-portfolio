"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import ImageLightbox from "./ImageLightbox";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Projects({ projects }: { projects: Project[] }) {
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
    alt: string;
  } | null>(null);

  return (
    <section id="projects" className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-sm font-mono text-text-dimmed mb-2">// --- 02</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Projects</h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {projects.map((project) => {
            const allImages = project.images?.length
              ? project.images
              : project.image
                ? [project.image]
                : [];
            const thumbnail = allImages[0];

            return (
              <motion.div
                key={project.title}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-text-dimmed transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                {/* Screenshot */}
                {thumbnail && (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() =>
                      setLightbox({
                        images: allImages,
                        index: 0,
                        alt: project.title,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setLightbox({
                          images: allImages,
                          index: 0,
                          alt: project.title,
                        });
                      }
                    }}
                    className="relative w-full aspect-video bg-background cursor-pointer overflow-hidden"
                  >
                    <Image
                      src={thumbnail}
                      alt={`${project.title} screenshot`}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {allImages.length > 1 && (
                      <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-background/80 backdrop-blur-sm text-text-muted px-2 py-0.5 rounded-full border border-border">
                        {allImages.length} photos
                      </span>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-semibold">{project.title}</h4>
                      {project.badge && (
                        <span className="text-[10px] font-mono uppercase tracking-wider text-text-primary bg-text-dimmed/15 border border-text-dimmed/25 rounded-full px-2 py-0.5">
                          {project.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-dimmed hover:text-text-primary transition-colors"
                          aria-label={`${project.title} GitHub`}
                        >
                          <Github size={16} />
                        </a>
                      )}
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-dimmed hover:text-text-primary transition-colors"
                          aria-label={`${project.title} demo`}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-text-dimmed bg-background border border-border rounded px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}
