"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { ActivityLog } from "@/types/game";
import { Dumbbell, Footprints, Timer, Zap, History, CheckCircle2 } from "lucide-react";

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
      <div className="panel bg-gradient-to-b from-slate-900 to-slate-950 border-t-4 border-t-emerald-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Training Grounds</h2>
        </div>

        <p className="text-sm text-slate-400 mb-8 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          Push your limits! <br/>
          <span className="flex items-center gap-2 mt-2 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> <strong>Cardio</strong> increases Max HP & Stamina, and fully heals you.</span>
          <span className="flex items-center gap-2 mt-1 text-slate-300"><span className="w-2 h-2 rounded-full bg-rose-400"></span> <strong>Strength</strong> increases STR and yields crafting materials.</span>
          <span className="flex items-center gap-2 mt-1 text-slate-300"><span className="w-2 h-2 rounded-full bg-indigo-400"></span> Higher intensity yields greater EXP.</span>
        </p>

        {message && (
          <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm font-medium animate-fade-in">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleTrain} className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-300">Activity Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col gap-2 transition-all ${type === 'cardio' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Footprints className={`w-5 h-5 ${type === 'cardio' ? 'text-emerald-400' : 'text-slate-500'}`} /> Cardio
                  </div>
                  <input
                    type="radio"
                    checked={type === 'cardio'}
                    onChange={() => setType('cardio')}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${type === 'cardio' ? 'border-emerald-500' : 'border-slate-600'}`}>
                    {type === 'cardio' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </div>
                </div>
                <p className="text-xs text-slate-400">Running, Cycling, Swimming</p>
              </label>

              <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col gap-2 transition-all ${type === 'strength' ? 'border-rose-500 bg-rose-500/10' : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Dumbbell className={`w-5 h-5 ${type === 'strength' ? 'text-rose-400' : 'text-slate-500'}`} /> Strength
                  </div>
                  <input
                    type="radio"
                    checked={type === 'strength'}
                    onChange={() => setType('strength')}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${type === 'strength' ? 'border-rose-500' : 'border-slate-600'}`}>
                    {type === 'strength' && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                  </div>
                </div>
                <p className="text-xs text-slate-400">Weightlifting, Calisthenics</p>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Timer className="w-4 h-4 text-slate-400" /> Duration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                className="input-field text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-400" /> Intensity
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value as ActivityLog['intensity'])}
                className="input-field text-lg appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] pr-10"
              >
                <option value="low">Low (Light sweat)</option>
                <option value="medium">Medium (Challenging)</option>
                <option value="high">High (Maximum effort)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button type="submit" className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]">
              Complete Training
            </button>
          </div>
        </form>
      </div>

      <div className="panel">
        <div className="flex items-center gap-2 mb-6">
          <History className="w-5 h-5 text-indigo-400" />
          <h3 className="text-lg font-bold text-white">Recent Training</h3>
        </div>

        {gameState.activityLogs.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/30 rounded-xl border border-slate-800 border-dashed">
            <p className="text-sm text-slate-500">You haven't trained recently. Time to get moving!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {gameState.activityLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex justify-between items-center p-4 bg-slate-950/50 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${log.type === 'cardio' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {log.type === 'cardio' ? <Footprints className="w-4 h-4" /> : <Dumbbell className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white capitalize">{log.type}</p>
                    <p className="text-xs text-slate-400 capitalize">{log.intensity} intensity</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-indigo-300">{log.durationMinutes} min</p>
                  <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
