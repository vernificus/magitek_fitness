"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { GameState, INITIAL_STATE, FoodLog, ActivityLog } from '../types/game';

interface GameContextType {
  gameState: GameState;
  addFoodLog: (log: Omit<FoodLog, 'id' | 'timestamp'>) => void;
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  gainExp: (amount: number) => void;
  updateInventory: (updates: Partial<GameState['inventory']>) => void;
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  useMp: (amount: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'rpg-tracker-state';

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        setGameState(JSON.parse(savedState));
      } catch (e) {
        console.error("Failed to parse saved game state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState, isLoaded]);

  const levelUpCheck = (currentState: GameState, expGained: number): GameState => {
    let newState = { ...currentState };
    newState.stats.exp += expGained;

    while (newState.stats.exp >= newState.stats.expToNext) {
      newState.stats.exp -= newState.stats.expToNext;
      newState.stats.level += 1;
      newState.stats.expToNext = Math.floor(newState.stats.expToNext * 1.5);

      // Base stat increases on level up
      newState.stats.maxHp += 10;
      newState.stats.hp = newState.stats.maxHp;
      newState.stats.maxMp += 5;
      newState.stats.mp = newState.stats.maxMp;
      newState.stats.str += 2;
      newState.stats.mag += 2;
      newState.stats.def += 2;
      newState.stats.maxStamina += 5;
      newState.stats.stamina = newState.stats.maxStamina;
    }
    return newState;
  };

  const addFoodLog = (log: Omit<FoodLog, 'id' | 'timestamp'>) => {
    const newLog: FoodLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setGameState((prev) => {
      let newState = { ...prev };
      newState.foodLogs = [newLog, ...prev.foodLogs];

      // Stat gains from food macros
      // Protein -> STR
      if (log.protein >= 20) newState.stats.str += 1;
      // Carbs -> MAG and MP
      if (log.carbs >= 30) {
        newState.stats.mag += 1;
        newState.stats.maxMp += 2;
      }
      // Fat -> DEF
      if (log.fat >= 15) newState.stats.def += 1;

      // Small EXP reward
      return levelUpCheck(newState, 10);
    });
  };

  const addActivityLog = (log: Omit<ActivityLog, 'id' | 'timestamp'>) => {
    const newLog: ActivityLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    setGameState((prev) => {
      let newState = { ...prev };
      newState.activityLogs = [newLog, ...prev.activityLogs];

      const intensityMultiplier = log.intensity === 'high' ? 1.5 : log.intensity === 'medium' ? 1.0 : 0.5;
      const baseExp = log.durationMinutes * 2 * intensityMultiplier;

      if (log.type === 'cardio') {
        newState.stats.maxHp += Math.floor(log.durationMinutes / 10);
        newState.stats.maxStamina += Math.floor(log.durationMinutes / 10);
        // Heal full on cardio
        newState.stats.hp = newState.stats.maxHp;
        newState.stats.stamina = newState.stats.maxStamina;
      } else if (log.type === 'strength') {
        newState.stats.str += Math.floor(log.durationMinutes / 20);
        newState.inventory.materials += Math.floor(log.durationMinutes / 15);
      }

      return levelUpCheck(newState, Math.floor(baseExp));
    });
  };

  const gainExp = (amount: number) => {
    setGameState((prev) => levelUpCheck(prev, amount));
  };

  const updateInventory = (updates: Partial<GameState['inventory']>) => {
    setGameState((prev) => ({
      ...prev,
      inventory: { ...prev.inventory, ...updates },
    }));
  };

  const takeDamage = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        hp: Math.max(0, prev.stats.hp - amount),
      },
    }));
  };

  const heal = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        hp: Math.min(prev.stats.maxHp, prev.stats.hp + amount),
      },
    }));
  };

  const useMp = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        mp: Math.max(0, prev.stats.mp - amount),
      },
    }));
  };

  const resetGame = () => {
    setGameState(INITIAL_STATE);
  };

  if (!isLoaded) return null; // Or a loading spinner

  return (
    <GameContext.Provider
      value={{
        gameState,
        addFoodLog,
        addActivityLog,
        gainExp,
        updateInventory,
        takeDamage,
        heal,
        useMp,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
