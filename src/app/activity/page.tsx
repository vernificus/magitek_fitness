"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { ActivityLog } from "@/types/game";

export default function ActivityPage() {
  const { addActivityLog, gameState } = useGame();

  const [type, setType] = useState<ActivityLog['type']>('cardio');
  const [duration, setDuration] = useState<number>(30);
  const [intensity, setIntensity] = useState<ActivityLog['intensity']>('medium');
  const [message, setMessage] = useState("");

  const handleTrain = (e: React.FormEvent) => {
    e.preventDefault();

    if (duration <= 0) {
      setMessage("Duration must be greater than 0.");
      return;
    }

    addActivityLog({
      type,
      durationMinutes: duration,
      intensity,
    });

    let rewardMsg = type === 'cardio'
      ? `Max HP and Stamina increased! HP fully restored.`
      : `Gained STR and crafting materials!`;

    setMessage(`Training complete! Earned EXP. ${rewardMsg}`);

    // Reset form briefly
    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="retro-panel">
        <h2 className="text-2xl text-yellow-300 mb-4">Training Grounds</h2>
        <p className="text-xs leading-loose mb-6">
          Push your limits! <br/>
          - <span className="text-green-400">Cardio</span> increases Max HP & Stamina, and fully heals you.<br/>
          - <span className="text-orange-400">Strength</span> increases STR and yields crafting materials.<br/>
          - Higher intensity yields greater EXP.
        </p>

        {message && (
          <div className="mb-6 p-4 border-2 border-yellow-300 text-yellow-300 text-sm bg-black/50">
            {message}
          </div>
        )}

        <form onSubmit={handleTrain} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm">Activity Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={type === 'cardio'}
                  onChange={() => setType('cardio')}
                  className="accent-yellow-400 w-4 h-4"
                />
                <span className="text-xs">Cardio (Run, Bike, Swim)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={type === 'strength'}
                  onChange={() => setType('strength')}
                  className="accent-yellow-400 w-4 h-4"
                />
                <span className="text-xs">Strength (Weights, Bodyweight)</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Duration (Minutes)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              className="retro-input max-w-[200px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm">Intensity</label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as ActivityLog['intensity'])}
              className="retro-input max-w-[200px]"
            >
              <option value="low">Low (Light sweat)</option>
              <option value="medium">Medium (Challenging)</option>
              <option value="high">High (Maximum effort)</option>
            </select>
          </div>

          <button type="submit" className="retro-button self-start mt-4">
            Begin Training
          </button>
        </form>
      </div>

      <div className="retro-panel">
        <h3 className="text-lg text-yellow-300 mb-4">Training History</h3>
        {gameState.activityLogs.length === 0 ? (
          <p className="text-xs text-gray-400">You haven't trained recently.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {gameState.activityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="text-xs flex justify-between border-b border-white/20 pb-2">
                <span className="capitalize">{log.type} ({log.intensity})</span>
                <span className="text-gray-400">{log.durationMinutes} mins</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
