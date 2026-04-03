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
    <nav className="retro-panel rounded-none border-t-0 border-x-0 sticky top-0 z-50 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl text-yellow-300 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">
          Fit Fantasy
        </h1>
        <div className="text-xs flex gap-2">
          <span>LVL {gameState.stats.level}</span>
          <span>HP {gameState.stats.hp}/{gameState.stats.maxHp}</span>
        </div>
      </div>

      <ul className="flex flex-wrap gap-2 justify-center">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "block px-3 py-2 text-xs border-2 border-transparent hover:border-yellow-300 uppercase",
                  isActive && "bg-white/20 border-white"
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
