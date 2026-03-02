"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiFacebook } from "react-icons/si";

const socials = [
  { icon: SiGithub, label: "GitHub", href: "https://github.com/Adlai-byte" },
  {
    icon: SiFacebook,
    label: "Facebook",
    href: "https://www.facebook.com/vnz.llyd",
  },
  {
    icon: SiLinkedin,
    label: "LinkedIn",
    href: "https://linkedin.com/in/vinz",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:vinzlloydalferez@gmail.com",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-sm font-mono text-text-dimmed mb-2">04</h2>
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Get in Touch</h3>
          <p className="text-text-muted max-w-md mx-auto mb-10 leading-relaxed">
            I&apos;m always open to new opportunities and interesting projects.
            Feel free to reach out.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="flex items-center justify-center gap-6"
        >
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12 rounded-lg border border-border bg-surface hover:border-text-dimmed hover:bg-background transition-all duration-200"
              aria-label={social.label}
            >
              <social.icon
                size={20}
                className="text-text-muted group-hover:text-text-primary transition-colors"
              />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
