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
          <h2 className="text-sm font-mono text-text-dimmed mb-2">02</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-8">Projects</h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-6"
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
              whileHover={{ y: -2 }}
              className="group bg-surface border border-border rounded-xl overflow-hidden hover:border-text-dimmed transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row">
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
                    className="relative w-full md:w-80 lg:w-96 shrink-0 aspect-video md:aspect-auto bg-background cursor-pointer"
                  >
                    <Image
                      src={thumbnail}
                      alt={`${project.title} screenshot`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 384px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/20 hidden md:block" />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-col justify-between p-6 flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold">{project.title}</h4>
                        {project.badge && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-text-primary bg-text-dimmed/15 border border-text-dimmed/25 rounded-full px-2.5 py-0.5">
                            {project.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-dimmed hover:text-text-primary transition-colors"
                            aria-label={`${project.title} GitHub`}
                          >
                            <Github size={18} />
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
                            <ExternalLink size={18} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-text-muted leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-text-dimmed bg-background border border-border rounded px-2 py-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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
