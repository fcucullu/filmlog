"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, Rocket } from "lucide-react";

const navItems = [
  { href: "/", icon: Camera, label: "Rolls" },
  { href: "/apps", icon: Rocket, label: "Apps" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#2a2a2a] pb-[env(safe-area-inset-bottom)] z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "text-[#E5A100]"
                  : "text-[#8B8B8B] hover:text-[#E5A100]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
