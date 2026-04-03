"use client";

import { useGame } from "@/context/GameContext";

export default function StatsPage() {
  const { gameState, resetGame } = useGame();
  const { stats, inventory } = gameState;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      <div className="retro-panel">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 pb-6 border-b-4 border-white/30">
          <div>
            <h2 className="text-3xl text-yellow-300 mb-2">HERO STATUS</h2>
            <p className="text-sm">LVL {stats.level}</p>
          </div>
          <div className="text-right mt-4 sm:mt-0">
            <p className="text-xs mb-1">EXP: {stats.exp} / {stats.expToNext}</p>
            <div className="w-full sm:w-48 h-4 bg-gray-800 border-2 border-white">
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${Math.min(100, (stats.exp / stats.expToNext) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Vitals */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl text-blue-300 mb-2">VITALS</h3>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>HP (Health)</span>
                <span>{stats.hp} / {stats.maxHp}</span>
              </div>
              <div className="w-full h-4 bg-gray-800 border-2 border-white">
                <div className="h-full bg-red-500 transition-all" style={{ width: `${(stats.hp / stats.maxHp) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>MP (Magic)</span>
                <span>{stats.mp} / {stats.maxMp}</span>
              </div>
              <div className="w-full h-4 bg-gray-800 border-2 border-white">
                <div className="h-full bg-blue-500 transition-all" style={{ width: `${(stats.mp / stats.maxMp) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>SP (Stamina)</span>
                <span>{stats.stamina} / {stats.maxStamina}</span>
              </div>
              <div className="w-full h-4 bg-gray-800 border-2 border-white">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${(stats.stamina / stats.maxStamina) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Combat Stats */}
          <div>
            <h3 className="text-xl text-blue-300 mb-4">ATTRIBUTES</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">STR</span>
                <span className="text-yellow-100">{stats.str}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">MAG</span>
                <span className="text-yellow-100">{stats.mag}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">DEF</span>
                <span className="text-yellow-100">{stats.def}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="retro-panel">
          <h3 className="text-xl text-yellow-300 mb-4">INVENTORY</h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex justify-between">
              <span>Gold (GP)</span>
              <span className="text-yellow-400">{inventory.gold}</span>
            </li>
            <li className="flex justify-between">
              <span>Materials</span>
              <span className="text-gray-300">{inventory.materials}</span>
            </li>
            <li className="flex justify-between">
              <span>Potions</span>
              <span className="text-red-300">{inventory.potions}</span>
            </li>
          </ul>
        </div>

        <div className="retro-panel flex flex-col justify-center items-center gap-4 border-red-500">
          <h3 className="text-lg text-red-400">SYSTEM</h3>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to erase all data? This cannot be undone.")) {
                resetGame();
              }
            }}
            className="retro-button bg-red-900 hover:bg-red-700"
          >
            Erase Save Data
          </button>
        </div>
      </div>
    </div>
  );
}
