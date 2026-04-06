"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";
import { Search, Loader2, UtensilsCrossed, ArrowRight, Shield, Zap, Info, Image as ImageIcon, Flame, Dumbbell } from "lucide-react";

interface SearchResult {
  code: string;
  product_name: string;
  image_url?: string;
  brands?: string;
  nutriments: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
}

export default function FoodPage() {
  const { addFoodLog, gameState } = useGame();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");

  const searchFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setMessage("");
    try {
      // Using Open Food Facts API
      const res = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
          searchQuery
        )}&search_simple=1&action=process&json=1&page_size=10`
      );
      const data = await res.json();
      setResults(data.products || []);
      if (data.products?.length === 0) {
        setMessage("No items found. Try another search.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to search. The tavern keeper is asleep.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleConsume = (product: SearchResult) => {
    const calories = product.nutriments?.["energy-kcal_100g"] || 0;
    const protein = product.nutriments?.proteins_100g || 0;
    const carbs = product.nutriments?.carbohydrates_100g || 0;
    const fat = product.nutriments?.fat_100g || 0;

    addFoodLog({
      name: product.product_name || "Unknown Item",
      calories,
      protein,
      carbs,
      fat,
    });

    // Provide some feedback
    let statMsg = [];
    if (protein >= 20) statMsg.push("STR up!");
    if (carbs >= 30) statMsg.push("MAG/MP up!");
    if (fat >= 15) statMsg.push("DEF up!");

    setMessage(`Consumed ${product.product_name || "item"}! ${statMsg.join(" ")}`);
    setResults([]);
    setSearchQuery("");
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="panel bg-gradient-to-b from-slate-900 to-slate-950 border-t-4 border-t-orange-500">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/20 p-2 rounded-lg text-orange-400">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">The Tavern</h2>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            Powered by <span className="text-slate-300">Open Food Facts API</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400"><Zap className="w-4 h-4" /></div>
            <p className="text-xs text-slate-300"><strong className="text-rose-400 block mb-0.5">Protein (20g+)</strong> Grants STR</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Zap className="w-4 h-4" /></div>
            <p className="text-xs text-slate-300"><strong className="text-cyan-400 block mb-0.5">Carbs (30g+)</strong> Grants MAG & Max MP</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-500/10 rounded-lg text-slate-400"><Shield className="w-4 h-4" /></div>
            <p className="text-xs text-slate-300"><strong className="text-slate-400 block mb-0.5">Fats (15g+)</strong> Grants DEF</p>
          </div>
        </div>

        {message && (
          <div className="mb-8 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-3 text-orange-400 text-sm font-medium animate-fade-in">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={searchFood} className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for rations (e.g., 'Apple', 'Chicken Breast')..."
              className="input-field w-full pl-10 h-12 text-lg"
            />
          </div>
          <button type="submit" className="btn-primary h-12 px-8 flex items-center gap-2 font-bold" disabled={isSearching}>
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {results.map((product) => (
            <div key={product.code} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl hover:border-slate-700 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 shrink-0">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                    {product.product_name || "Unknown Item"}
                  </h3>
                  {product.brands && <p className="text-xs text-slate-500 mb-2">{product.brands}</p>}

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                    <span className="font-semibold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {Math.round(product.nutriments?.["energy-kcal_100g"] || 0)} kcal
                    </span>
                    <span className="text-rose-400 flex items-center gap-1">
                      <Dumbbell className="w-3 h-3" /> Pro: {Math.round(product.nutriments?.proteins_100g || 0)}g
                    </span>
                    <span className="text-cyan-400 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Carb: {Math.round(product.nutriments?.carbohydrates_100g || 0)}g
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Fat: {Math.round(product.nutriments?.fat_100g || 0)}g
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-2 uppercase tracking-wider font-semibold">Values per 100g serving</div>
                </div>
              </div>
              <button
                onClick={() => handleConsume(product)}
                className="w-full sm:w-auto btn-secondary border-indigo-500/30 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                Consume <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-indigo-400" /> Recent Meals
        </h3>
        {gameState.foodLogs.length === 0 ? (
          <div className="text-center py-8 bg-slate-950/30 rounded-xl border border-slate-800 border-dashed">
            <p className="text-sm text-slate-500">Your stomach is empty. Visit the tavern to log food!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {gameState.foodLogs.slice(0, 6).map(log => (
              <div key={log.id} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                <span className="font-medium text-slate-300 truncate pr-4">{log.name}</span>
                <span className="text-sm font-bold text-orange-400 whitespace-nowrap">{Math.round(log.calories)} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
