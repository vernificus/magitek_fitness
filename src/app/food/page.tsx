"use client";

import { useState } from "react";
import { useGame } from "@/context/GameContext";

interface SearchResult {
  code: string;
  product_name: string;
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
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      <div className="retro-panel">
        <h2 className="text-2xl text-yellow-300 mb-4">The Tavern</h2>
        <p className="text-xs leading-loose mb-6">
          Eat well to grow stronger! <br/>
          - <span className="text-red-400">Protein (20g+)</span> grants STR <br/>
          - <span className="text-blue-400">Carbs (30g+)</span> grants MAG & Max MP <br/>
          - <span className="text-gray-400">Fats (15g+)</span> grants DEF
        </p>

        <form onSubmit={searchFood} className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for rations..."
            className="retro-input flex-1"
          />
          <button type="submit" className="retro-button" disabled={isSearching}>
            {isSearching ? "Searching..." : "Search"}
          </button>
        </form>

        {message && (
          <div className="mb-6 p-4 border-2 border-yellow-300 text-yellow-300 text-sm bg-black/50">
            {message}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {results.map((product) => (
            <div key={product.code} className="border-2 border-white/50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-black/30">
              <div>
                <h3 className="text-sm text-yellow-100 mb-2">{product.product_name || "Unknown Item"}</h3>
                <div className="text-[10px] flex gap-3 text-gray-300">
                  <span>Cals: {Math.round(product.nutriments?.["energy-kcal_100g"] || 0)}</span>
                  <span className="text-red-300">Pro: {Math.round(product.nutriments?.proteins_100g || 0)}g</span>
                  <span className="text-blue-300">Carb: {Math.round(product.nutriments?.carbohydrates_100g || 0)}g</span>
                  <span className="text-gray-400">Fat: {Math.round(product.nutriments?.fat_100g || 0)}g</span>
                </div>
                <div className="text-[8px] text-gray-500 mt-1">(per 100g serving)</div>
              </div>
              <button
                onClick={() => handleConsume(product)}
                className="retro-button whitespace-nowrap"
              >
                Consume
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="retro-panel">
        <h3 className="text-lg text-yellow-300 mb-4">Recent Meals</h3>
        {gameState.foodLogs.length === 0 ? (
          <p className="text-xs text-gray-400">Your stomach is empty.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {gameState.foodLogs.slice(0, 5).map(log => (
              <div key={log.id} className="text-xs flex justify-between border-b border-white/20 pb-2">
                <span>{log.name}</span>
                <span className="text-gray-400">{Math.round(log.calories)} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
