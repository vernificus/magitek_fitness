"use client";

import { useGame } from "@/context/GameContext";
import { useEffect, useState } from "react";

export default function DailyGoals() {
  const { gameState, gainExp, updateInventory } = useGame();
  const [claimed, setClaimed] = useState(false);
  const [progress, setProgress] = useState({
    calories: 0,
    protein: 0,
    activityMins: 0
  });

  const GOALS = {
    calories: 2000,
    protein: 100,
    activityMins: 30
  };

  useEffect(() => {
    // Calculate today's progress
    const today = new Date().setHours(0,0,0,0);

    const todayFood = gameState.foodLogs.filter(log => log.timestamp >= today);
    const todayActivity = gameState.activityLogs.filter(log => log.timestamp >= today);

    const calories = todayFood.reduce((sum, log) => sum + log.calories, 0);
    const protein = todayFood.reduce((sum, log) => sum + log.protein, 0);
    const activityMins = todayActivity.reduce((sum, log) => sum + log.durationMinutes, 0);

    setProgress({ calories, protein, activityMins });

    // Check if claimed today
    const lastClaimed = localStorage.getItem('rpg-tracker-daily-claimed');
    if (lastClaimed && parseInt(lastClaimed) >= today) {
      setClaimed(true);
    } else {
      setClaimed(false);
    }
  }, [gameState.foodLogs, gameState.activityLogs]);

  const allGoalsMet =
    progress.calories >= GOALS.calories &&
    progress.protein >= GOALS.protein &&
    progress.activityMins >= GOALS.activityMins;

  const handleClaim = () => {
    if (!allGoalsMet || claimed) return;

    gainExp(100);
    updateInventory({
      gold: gameState.inventory.gold + 50,
      potions: gameState.inventory.potions + 1
    });

    localStorage.setItem('rpg-tracker-daily-claimed', Date.now().toString());
    setClaimed(true);
    alert("Daily Quests Complete! Gained 100 EXP, 50 Gold, and 1 Potion.");
  };

  return (
    <div className="retro-panel mt-8">
      <h3 className="text-xl text-yellow-300 mb-4">Daily Quests</h3>
      <div className="flex flex-col gap-4 text-xs">
        <div>
          <div className="flex justify-between mb-1">
            <span>Consume {GOALS.calories} Calories</span>
            <span>{Math.round(progress.calories)} / {GOALS.calories}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 border border-white">
            <div className="h-full bg-blue-400" style={{ width: `${Math.min(100, (progress.calories / GOALS.calories) * 100)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Consume {GOALS.protein}g Protein</span>
            <span>{Math.round(progress.protein)} / {GOALS.protein}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 border border-white">
            <div className="h-full bg-red-400" style={{ width: `${Math.min(100, (progress.protein / GOALS.protein) * 100)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span>Train for {GOALS.activityMins} Mins</span>
            <span>{progress.activityMins} / {GOALS.activityMins}</span>
          </div>
          <div className="w-full h-2 bg-gray-800 border border-white">
            <div className="h-full bg-green-400" style={{ width: `${Math.min(100, (progress.activityMins / GOALS.activityMins) * 100)}%` }} />
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={!allGoalsMet || claimed}
          className="retro-button mt-2"
        >
          {claimed ? "Reward Claimed" : "Claim Daily Reward"}
        </button>
      </div>
    </div>
  );
}
