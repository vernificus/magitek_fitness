"use client";

import { useGame } from "@/context/GameContext";
import Link from "next/link";
import DailyGoals from "@/components/DailyGoals";

import { Shield, Swords, UtensilsCrossed, Activity, ChevronRight } from "lucide-react";

export default function Home() {
  const { gameState } = useGame();

  return (
    <div className="flex flex-col gap-8">
      <div className="panel flex flex-col items-center text-center gap-4 py-12 bg-gradient-to-b from-slate-900 to-slate-950 border-t-4 border-t-indigo-500">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Welcome, Hero</h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Your journey begins here. Log your meals to build your strength, magic, and defense.
          Train your body to increase your stamina and health.
          When you are ready, enter the dungeon to test your might!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-6">
          <div className="panel">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" /> Quick Stats
              </h2>
              <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-sm font-semibold">
                Level {gameState.stats.level}
              </span>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <div className="flex justify-between text-sm mb-1.5 font-medium text-slate-300">
                  <span>Experience</span>
                  <span className="text-indigo-300">{gameState.stats.exp} / {gameState.stats.expToNext}</span>
                </div>
                <div className="stat-bar-bg">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(100, (gameState.stats.exp / gameState.stats.expToNext) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-sm text-slate-400 mb-1">Health (HP)</div>
                  <div className="text-xl font-bold text-rose-400">{gameState.stats.hp} <span className="text-sm text-slate-500 font-normal">/ {gameState.stats.maxHp}</span></div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-sm text-slate-400 mb-1">Magic (MP)</div>
                  <div className="text-xl font-bold text-cyan-400">{gameState.stats.mp} <span className="text-sm text-slate-500 font-normal">/ {gameState.stats.maxMp}</span></div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-sm text-slate-400 mb-1">Gold</div>
                  <div className="text-xl font-bold text-yellow-500">{gameState.inventory.gold}</div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                  <div className="text-sm text-slate-400 mb-1">Potions</div>
                  <div className="text-xl font-bold text-emerald-400">{gameState.inventory.potions}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/stats" className="btn-secondary w-full inline-flex justify-center items-center gap-2">
                View Full Status <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <DailyGoals />
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/food" className="panel group hover:border-indigo-500 cursor-pointer transition-all hover:shadow-indigo-500/10 flex items-center p-6 gap-4">
            <div className="bg-orange-500/10 p-4 rounded-full text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <UtensilsCrossed className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xl font-bold block mb-1 text-slate-100 group-hover:text-indigo-400 transition-colors">Tavern (Log Food)</span>
              <span className="text-sm text-slate-400">Fuel your body to build Strength, Magic, and Defense.</span>
            </div>
          </Link>

          <Link href="/activity" className="panel group hover:border-emerald-500 cursor-pointer transition-all hover:shadow-emerald-500/10 flex items-center p-6 gap-4">
            <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <Activity className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xl font-bold block mb-1 text-slate-100 group-hover:text-emerald-400 transition-colors">Training Grounds</span>
              <span className="text-sm text-slate-400">Log physical activity to increase HP, Stamina, and EXP.</span>
            </div>
          </Link>

          <Link href="/dungeon" className="panel group hover:border-rose-500 cursor-pointer transition-all hover:shadow-rose-500/10 flex items-center p-6 gap-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="bg-rose-500/10 p-4 rounded-full text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors relative z-10">
              <Swords className="w-8 h-8" />
            </div>
            <div className="relative z-10">
              <span className="text-xl font-bold block mb-1 text-rose-400 group-hover:text-rose-300 transition-colors">The Dungeon</span>
              <span className="text-sm text-slate-400">Put your stats to the test. Battle monsters for Gold and EXP.</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
