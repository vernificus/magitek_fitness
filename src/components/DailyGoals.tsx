"use client";

import { useGame } from "@/context/GameContext";
import { useEffect, useState } from "react";

import { Flame, Dumbbell, Target, Activity } from "lucide-react";

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
    <div className="panel bg-gradient-to-br from-slate-900 to-slate-800 border-indigo-500/30">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-100">
          <Target className="w-5 h-5 text-indigo-400" /> Daily Quests
        </h3>
        {claimed && (
          <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md">
            Completed
          </span>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
            <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-400" /> Consume {GOALS.calories} Calories</span>
            <span className="text-slate-400">{Math.round(progress.calories)} / {GOALS.calories}</span>
          </div>
          <div className="stat-bar-bg h-2.5">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000 rounded-full" style={{ width: `${Math.min(100, (progress.calories / GOALS.calories) * 100)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
            <span className="flex items-center gap-1.5"><Dumbbell className="w-4 h-4 text-rose-400" /> Consume {GOALS.protein}g Protein</span>
            <span className="text-slate-400">{Math.round(progress.protein)} / {GOALS.protein}</span>
          </div>
          <div className="stat-bar-bg h-2.5">
            <div className="h-full bg-gradient-to-r from-rose-500 to-pink-400 transition-all duration-1000 rounded-full" style={{ width: `${Math.min(100, (progress.protein / GOALS.protein) * 100)}%` }} />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm font-medium mb-2 text-slate-300">
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-emerald-400" /> Train for {GOALS.activityMins} Mins</span>
            <span className="text-slate-400">{progress.activityMins} / {GOALS.activityMins}</span>
          </div>
          <div className="stat-bar-bg h-2.5">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 rounded-full" style={{ width: `${Math.min(100, (progress.activityMins / GOALS.activityMins) * 100)}%` }} />
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={!allGoalsMet || claimed}
          className={`mt-2 py-3 px-4 rounded-xl font-bold transition-all shadow-lg ${
            claimed
              ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 shadow-none"
              : !allGoalsMet
                ? "bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-400 hover:to-purple-400 hover:shadow-indigo-500/25 active:scale-[0.98]"
          }`}
        >
          {claimed ? "Reward Claimed" : "Claim Daily Reward"}
        </button>
      </div>
    </div>
  );
}
