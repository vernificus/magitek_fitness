"use client";

import { useGame } from "@/context/GameContext";
import { User, Shield, Zap, Heart, Database } from "lucide-react";

export default function StatsPage() {
  const { gameState, resetGame } = useGame();
  const { stats, inventory } = gameState;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="panel bg-gradient-to-b from-slate-900 to-slate-950 border-t-4 border-t-indigo-500 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500 pointer-events-none">
          <User className="w-64 h-64" />
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 pb-8 border-b border-slate-800 relative z-10">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">HERO STATUS</h2>
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full font-semibold">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Level {stats.level}
            </div>
          </div>
          <div className="text-left sm:text-right mt-6 sm:mt-0 w-full sm:w-auto">
            <p className="text-sm font-medium text-slate-400 mb-2">Experience <span className="text-indigo-300">{stats.exp}</span> / {stats.expToNext}</p>
            <div className="w-full sm:w-64 stat-bar-bg h-3 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
                style={{ width: `${Math.min(100, (stats.exp / stats.expToNext) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          {/* Main Vitals */}
          <div className="flex flex-col gap-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-300">
              <Heart className="w-5 h-5 text-rose-400" /> Vitals
            </h3>

            <div className="flex flex-col gap-5">
              <div>
                <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
                  <span>Health (HP)</span>
                  <span className="text-rose-400">{stats.hp} <span className="text-slate-500">/ {stats.maxHp}</span></span>
                </div>
                <div className="stat-bar-bg h-2.5">
                  <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
                  <span>Magic (MP)</span>
                  <span className="text-cyan-400">{stats.mp} <span className="text-slate-500">/ {stats.maxMp}</span></span>
                </div>
                <div className="stat-bar-bg h-2.5">
                  <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${(stats.mp / stats.maxMp) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
                  <span>Stamina (SP)</span>
                  <span className="text-emerald-400">{stats.stamina} <span className="text-slate-500">/ {stats.maxStamina}</span></span>
                </div>
                <div className="stat-bar-bg h-2.5">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(stats.stamina / stats.maxStamina) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Combat Stats */}
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-300 mb-6">
              <Shield className="w-5 h-5 text-indigo-400" /> Attributes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500"/> STR</span>
                <span className="text-xl font-bold text-white">{stats.str}</span>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">MAG</span>
                <span className="text-xl font-bold text-cyan-400">{stats.mag}</span>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">DEF</span>
                <span className="text-xl font-bold text-slate-300">{stats.def}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="panel flex flex-col">
          <h3 className="text-lg font-bold flex items-center gap-2 text-slate-300 mb-6">
            <Database className="w-5 h-5 text-yellow-500" /> Inventory
          </h3>
          <ul className="flex flex-col gap-3 flex-1 justify-center">
            <li className="flex justify-between items-center bg-slate-950/30 p-3 rounded-lg">
              <span className="font-medium text-slate-300">Gold Coins</span>
              <span className="text-yellow-500 font-bold">{inventory.gold}</span>
            </li>
            <li className="flex justify-between items-center bg-slate-950/30 p-3 rounded-lg">
              <span className="font-medium text-slate-300">Materials</span>
              <span className="text-slate-400 font-bold">{inventory.materials}</span>
            </li>
            <li className="flex justify-between items-center bg-slate-950/30 p-3 rounded-lg">
              <span className="font-medium text-slate-300">Health Potions</span>
              <span className="text-emerald-400 font-bold">{inventory.potions}</span>
            </li>
          </ul>
        </div>

        <div className="panel flex flex-col justify-center items-center gap-6 border-red-500/30 bg-gradient-to-b from-slate-900 to-red-950/20">
          <div className="text-center">
            <h3 className="text-lg font-bold text-red-400 mb-2">System</h3>
            <p className="text-sm text-slate-400">Permanently delete your hero and start over.</p>
          </div>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to erase all data? This cannot be undone.")) {
                resetGame();
              }
            }}
            className="btn-danger w-full max-w-xs"
          >
            Erase Save Data
          </button>
        </div>
      </div>
    </div>
  );
}
