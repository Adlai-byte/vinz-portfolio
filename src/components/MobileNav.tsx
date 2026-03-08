"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FolderOpen, BookOpen, Gamepad2, Mail } from "lucide-react";

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Projects", href: "#projects", icon: FolderOpen },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Game", href: "/game", icon: Gamepad2 },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function MobileNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around py-2 px-1">
        {links.map((link) => {
          const isHash = link.href.startsWith("#");
          const href = isHash && !isHome ? `/${link.href}` : link.href;
          const isActive =
            (!isHash && pathname === link.href) ||
            (link.href === "/" && isHome && !links.some((l) => !l.href.startsWith("#") && l.href !== "/" && pathname === l.href));

          return (
            <Link
              key={link.label}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-colors ${
                isActive ? "text-text-primary" : "text-text-dimmed"
              }`}
            >
              <link.icon size={18} />
              <span className="text-[10px] font-mono">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
