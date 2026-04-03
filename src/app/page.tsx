"use client";

import { useGame } from "@/context/GameContext";
import Link from "next/link";
import DailyGoals from "@/components/DailyGoals";

export default function Home() {
  const { gameState } = useGame();

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="retro-panel flex flex-col items-center text-center gap-4 py-8">
        <h1 className="text-3xl text-yellow-300 mb-2">Welcome Hero</h1>
        <p className="text-sm max-w-xl leading-loose">
          Your journey begins here. Log your meals to build your strength, magic, and defense.
          Train your body to increase your stamina and health.
          When you are ready, enter the dungeon to test your might!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="retro-panel">
          <h2 className="text-xl mb-4 text-yellow-300">Quick Stats</h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span>Level</span>
              <span>{gameState.stats.level}</span>
            </div>
            <div className="flex justify-between">
              <span>EXP</span>
              <span>{gameState.stats.exp} / {gameState.stats.expToNext}</span>
            </div>
            <div className="flex justify-between">
              <span>HP</span>
              <span className="text-red-400">{gameState.stats.hp} / {gameState.stats.maxHp}</span>
            </div>
            <div className="flex justify-between">
              <span>MP</span>
              <span className="text-blue-400">{gameState.stats.mp} / {gameState.stats.maxMp}</span>
            </div>
            <div className="flex justify-between">
              <span>Gold</span>
              <span className="text-yellow-400">{gameState.inventory.gold}</span>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link href="/stats" className="retro-button inline-block text-xs">
              View Full Status
            </Link>
          </div>

          <DailyGoals />
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/food" className="retro-panel hover:border-yellow-300 cursor-pointer transition-colors block text-center py-6">
            <span className="text-lg block mb-2">Inn (Tavern)</span>
            <span className="text-xs text-gray-300">Log Meals (Gain Stats)</span>
          </Link>

          <Link href="/activity" className="retro-panel hover:border-yellow-300 cursor-pointer transition-colors block text-center py-6">
            <span className="text-lg block mb-2">Training Grounds</span>
            <span className="text-xs text-gray-300">Log Activity (Gain EXP/HP)</span>
          </Link>

          <Link href="/dungeon" className="retro-panel hover:border-red-400 cursor-pointer transition-colors block text-center py-6 border-red-500">
            <span className="text-lg block mb-2 text-red-400">The Dungeon</span>
            <span className="text-xs text-gray-300">Battle Monsters (Earn Gold)</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
