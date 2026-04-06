"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import { useGame } from "@/context/GameContext";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/food", label: "Food" },
  { href: "/activity", label: "Activity" },
  { href: "/stats", label: "Stats" },
  { href: "/dungeon", label: "Dungeon" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { gameState } = useGame();

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 py-3 mb-6 shadow-sm">
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Fit Quest
          </h1>
          <div className="flex gap-4 text-sm font-medium text-slate-300 bg-slate-800/50 px-3 py-1.5 rounded-full">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              LVL {gameState.stats.level}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              HP {gameState.stats.hp}/{gameState.stats.maxHp}
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap gap-1 justify-center bg-slate-800/50 p-1 rounded-lg">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
