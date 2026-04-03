"use client";

import { useState, useEffect } from "react";
import { useGame } from "@/context/GameContext";

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
      <div className="max-w-2xl mx-auto text-center flex flex-col gap-6 items-center pt-10">
        <h2 className="text-3xl text-red-400">The Dungeon</h2>
        <p className="text-sm">
          Monsters lurk in the shadows. Make sure you have trained and eaten well before entering.
        </p>
        {gameState.stats.hp <= 0 && (
          <p className="text-red-500 text-xs">You are too weak. Do some Cardio to recover HP!</p>
        )}
        <button
          onClick={startBattle}
          disabled={gameState.stats.hp <= 0}
          className="retro-button text-xl px-8 py-4 mt-8"
        >
          Enter Combat
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4">
      {/* Battle Arena */}
      <div className="retro-panel min-h-[300px] flex flex-col justify-between border-gray-400 relative overflow-hidden bg-black/80">
        {/* Enemy Status */}
        {enemy && (
          <div className="self-end p-4 text-right">
            <h3 className="text-red-400 text-xl mb-2">{enemy.name}</h3>
            <div className="text-xs mb-1">HP</div>
            <div className="w-48 h-4 bg-gray-800 border-2 border-white ml-auto">
              <div
                className="h-full bg-red-500 transition-all"
                style={{ width: `${Math.max(0, (enemy.hp / enemy.maxHp) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Player Status Summary */}
        <div className="self-start p-4">
          <h3 className="text-blue-300 text-lg mb-2">HERO</h3>
          <div className="flex gap-4 text-xs">
            <div>
              HP: {gameState.stats.hp}/{gameState.stats.maxHp}
            </div>
            <div>
              MP: {gameState.stats.mp}/{gameState.stats.maxMp}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Menus */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-48">
        {/* Combat Log */}
        <div className="retro-panel overflow-y-auto flex flex-col justify-end text-xs leading-loose">
          {combatLog.map((line, i) => (
            <p key={i} className="animate-fade-in">{line}</p>
          ))}
        </div>

        {/* Action Menu */}
        <div className="retro-panel flex">
          {battleOver ? (
            <div className="flex-1 flex items-center justify-center">
              <button onClick={() => setInBattle(false)} className="retro-button">
                Leave Battle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full p-2">
              <button
                onClick={handleAttack}
                disabled={!playerTurn}
                className="retro-button text-left flex items-center gap-2 hover:pl-4 transition-all"
              >
                ► Attack
              </button>
              <button
                onClick={handleMagic}
                disabled={!playerTurn}
                className="retro-button text-left flex items-center gap-2 hover:pl-4 transition-all"
              >
                ► Magic (5 MP)
              </button>
              <button
                onClick={handleItem}
                disabled={!playerTurn}
                className="retro-button text-left flex items-center gap-2 hover:pl-4 transition-all"
              >
                ► Potion ({gameState.inventory.potions})
              </button>
              <button
                onClick={handleFlee}
                disabled={!playerTurn}
                className="retro-button text-left flex items-center gap-2 hover:pl-4 transition-all"
              >
                ► Flee
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
