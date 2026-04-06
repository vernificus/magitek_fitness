"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Skull, ShieldAlert, Sword, Wand2, FlaskConical, Flag, Sparkles } from "lucide-react";

type Enemy = {
  name: string;
  hp: number;
  maxHp: number;
  str: number;
  def: number;
  expReward: number;
  goldReward: number;
};

const ENEMIES = [
  { name: "Slime", maxHp: 30, str: 5, def: 2, expReward: 15, goldReward: 5 },
  { name: "Goblin", maxHp: 60, str: 10, def: 5, expReward: 35, goldReward: 15 },
  { name: "Skeleton", maxHp: 100, str: 15, def: 8, expReward: 70, goldReward: 30 },
  { name: "Orc Bruiser", maxHp: 200, str: 25, def: 15, expReward: 150, goldReward: 75 },
];

export default function DungeonPage() {
  const { gameState, takeDamage, heal, useMp, updateInventory, gainExp } = useGame();

  const [inBattle, setInBattle] = useState(false);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [battleOver, setBattleOver] = useState(false);

  // Helper to add log messages
  const log = (msg: string) => {
    setCombatLog((prev) => [...prev.slice(-4), msg]);
  };

  const startBattle = () => {
    // Pick enemy based roughly on player level
    const maxIdx = Math.min(ENEMIES.length - 1, Math.floor((gameState.stats.level - 1) / 2));
    const randomIdx = Math.floor(Math.random() * (maxIdx + 1));
    const template = ENEMIES[randomIdx];

    setEnemy({
      ...template,
      hp: template.maxHp,
    });
    setInBattle(true);
    setBattleOver(false);
    setCombatLog([`A wild ${template.name} appears!`, "Command?"]);
    setPlayerTurn(true);
  };

  const endBattle = (won: boolean) => {
    setBattleOver(true);
    if (won && enemy) {
      log(`You defeated the ${enemy.name}!`);
      log(`Earned ${enemy.expReward} EXP and ${enemy.goldReward} Gold.`);
      gainExp(enemy.expReward);
      updateInventory({ gold: gameState.inventory.gold + enemy.goldReward });
    } else {
      log(`You were defeated... Retreating to town.`);
      // Penalty: maybe lose some gold or heal to 1 HP
      if (gameState.stats.hp <= 0) {
          heal(1); // Ensure player doesn't stay at 0 HP
      }
    }
  };

  // Enemy Turn Logic
  useEffect(() => {
    if (inBattle && !playerTurn && !battleOver && enemy) {
      const timer = setTimeout(() => {
        // Simple attack
        const dmg = Math.max(1, enemy.str - Math.floor(gameState.stats.def / 2));
        log(`${enemy.name} attacks! Takes ${dmg} damage.`);
        takeDamage(dmg);

        if (gameState.stats.hp - dmg <= 0) {
          endBattle(false);
        } else {
          setPlayerTurn(true);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [playerTurn, inBattle, battleOver, enemy, gameState.stats.hp, gameState.stats.def, takeDamage]);

  const handleAttack = () => {
    if (!playerTurn || battleOver || !enemy) return;

    const dmg = Math.max(1, gameState.stats.str - Math.floor(enemy.def / 2));
    log(`You attack! ${enemy.name} takes ${dmg} damage.`);

    const newEnemyHp = enemy.hp - dmg;
    setEnemy({ ...enemy, hp: newEnemyHp });

    if (newEnemyHp <= 0) {
      endBattle(true);
    } else {
      setPlayerTurn(false);
    }
  };

  const handleMagic = () => {
    if (!playerTurn || battleOver || !enemy) return;

    const cost = 5;
    if (gameState.stats.mp < cost) {
      log("Not enough MP!");
      return;
    }

    useMp(cost);
    // Magic ignores defense but relies on MAG stat
    const dmg = Math.max(5, gameState.stats.mag * 2);
    log(`You cast Fire! ${enemy.name} takes ${dmg} damage.`);

    const newEnemyHp = enemy.hp - dmg;
    setEnemy({ ...enemy, hp: newEnemyHp });

    if (newEnemyHp <= 0) {
      endBattle(true);
    } else {
      setPlayerTurn(false);
    }
  };

  const handleItem = () => {
    if (!playerTurn || battleOver || !enemy) return;

    if (gameState.inventory.potions <= 0) {
      log("Out of potions!");
      return;
    }

    updateInventory({ potions: gameState.inventory.potions - 1 });
    const healAmount = 50;
    heal(healAmount);
    log(`Used Potion! Restored ${healAmount} HP.`);
    setPlayerTurn(false);
  };

  const handleFlee = () => {
    if (!playerTurn || battleOver) return;
    log("You ran away safely.");
    setBattleOver(true);
  };

  if (!inBattle) {
    return (
      <div className="max-w-2xl mx-auto text-center flex flex-col gap-8 items-center pt-16">
        <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20 shadow-lg shadow-rose-500/10">
          <Skull className="w-12 h-12 text-rose-500" />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">The Dungeon</h2>
          <p className="text-lg text-slate-400 max-w-lg mx-auto">
            Monsters lurk in the shadows. Make sure you have trained and eaten well before entering.
          </p>
        </div>

        {gameState.stats.hp <= 0 && (
          <div className="flex items-center gap-2 bg-red-900/30 text-red-400 px-4 py-3 rounded-lg border border-red-800/50">
            <ShieldAlert className="w-5 h-5" />
            <p className="text-sm font-medium">You are too weak. Do some Cardio to recover HP!</p>
          </div>
        )}

        <button
          onClick={startBattle}
          disabled={gameState.stats.hp <= 0}
          className="bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xl px-12 py-5 rounded-xl shadow-xl shadow-rose-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 mt-4"
        >
          <Sword className="w-6 h-6" /> Enter Combat
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Battle Arena */}
      <div className="panel min-h-[400px] flex flex-col justify-between border-slate-700 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">

        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Enemy Status */}
        {enemy && (
          <div className="self-end p-6 text-right w-full sm:w-80 relative z-10 animate-fade-in">
            <div className="flex items-center justify-end gap-3 mb-3">
              <h3 className="text-rose-400 text-2xl font-bold tracking-tight">{enemy.name}</h3>
              <div className="bg-slate-800 p-2 rounded-lg border border-slate-700">
                <Skull className="w-6 h-6 text-rose-500" />
              </div>
            </div>
            <div className="flex justify-between text-sm font-medium text-slate-400 mb-1">
              <span>HP</span>
              <span>{Math.max(0, enemy.hp)} / {enemy.maxHp}</span>
            </div>
            <div className="stat-bar-bg h-3 bg-slate-950 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-600 to-red-400 transition-all duration-300"
                style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Action text overlay (optional visual flair) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none opacity-50 mix-blend-overlay">
          <Sword className="w-48 h-48 text-slate-500" />
        </div>

        {/* Player Status Summary */}
        <div className="self-start p-6 w-full sm:w-96 relative z-10">
          <h3 className="text-indigo-300 text-xl font-bold mb-4 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> HERO
          </h3>
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between text-sm font-medium text-slate-300 mb-1">
                <span>HP</span>
                <span>{gameState.stats.hp} / {gameState.stats.maxHp}</span>
              </div>
              <div className="stat-bar-bg h-2.5 bg-slate-950 border border-slate-800">
                <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${(gameState.stats.hp / gameState.stats.maxHp) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium text-slate-300 mb-1">
                <span>MP</span>
                <span>{gameState.stats.mp} / {gameState.stats.maxMp}</span>
              </div>
              <div className="stat-bar-bg h-2.5 bg-slate-950 border border-slate-800">
                <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${(gameState.stats.mp / gameState.stats.maxMp) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Menus */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[200px]">
        {/* Action Menu (takes 3 cols) */}
        <div className="panel md:col-span-3 flex flex-col justify-center bg-slate-900 border-slate-700">
          {battleOver ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <h4 className="text-xl font-bold text-white mb-2">Battle Concluded</h4>
              <button onClick={() => setInBattle(false)} className="btn-primary w-full max-w-sm py-3 flex items-center justify-center gap-2">
                <Flag className="w-5 h-5" /> Return to Town
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full">
              <button
                onClick={handleAttack}
                disabled={!playerTurn}
                className="btn-secondary h-16 flex items-center justify-center gap-3 text-lg hover:border-slate-500 hover:bg-slate-700 transition-all"
              >
                <Sword className="w-5 h-5 text-slate-400" /> Attack
              </button>
              <button
                onClick={handleMagic}
                disabled={!playerTurn}
                className="btn-secondary h-16 flex items-center justify-center gap-3 text-lg hover:border-cyan-500/50 hover:bg-slate-700 transition-all"
              >
                <Wand2 className="w-5 h-5 text-cyan-400" /> Magic <span className="text-xs text-cyan-500 ml-1">(5 MP)</span>
              </button>
              <button
                onClick={handleItem}
                disabled={!playerTurn}
                className="btn-secondary h-16 flex items-center justify-center gap-3 text-lg hover:border-emerald-500/50 hover:bg-slate-700 transition-all"
              >
                <FlaskConical className="w-5 h-5 text-emerald-400" /> Potion <span className="text-xs text-emerald-500 ml-1">({gameState.inventory.potions})</span>
              </button>
              <button
                onClick={handleFlee}
                disabled={!playerTurn}
                className="btn-secondary h-16 flex items-center justify-center gap-3 text-lg hover:border-rose-500/50 hover:bg-slate-700 transition-all"
              >
                <Flag className="w-5 h-5 text-rose-400" /> Flee
              </button>
            </div>
          )}
        </div>

        {/* Combat Log (takes 2 cols) */}
        <div className="panel md:col-span-2 overflow-y-auto flex flex-col justify-end gap-2 bg-slate-950 border-slate-800">
          {combatLog.map((line, i) => (
            <p key={i} className={`text-sm animate-fade-in ${
              line.includes('Take') ? 'text-rose-400 font-medium' :
              line.includes('defeated') || line.includes('Earned') ? 'text-emerald-400 font-medium' :
              line.includes('Not enough') ? 'text-amber-400' :
              'text-slate-300'
            }`}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
