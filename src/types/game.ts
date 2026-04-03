export interface Stats {
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  str: number;
  mag: number;
  def: number;
  exp: number;
  expToNext: number;
  stamina: number;
  maxStamina: number;
}

export interface Inventory {
  gold: number;
  materials: number;
  potions: number;
}

export interface FoodLog {
  id: string;
  name: string;
  calories: number;
  protein: number; // Grants STR
  carbs: number;   // Grants MAG/MP
  fat: number;     // Grants DEF
  timestamp: number;
}

export interface ActivityLog {
  id: string;
  type: 'cardio' | 'strength';
  durationMinutes: number;
  intensity: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface GameState {
  stats: Stats;
  inventory: Inventory;
  foodLogs: FoodLog[];
  activityLogs: ActivityLog[];
}

export const INITIAL_STATE: GameState = {
  stats: {
    level: 1,
    hp: 50,
    maxHp: 50,
    mp: 20,
    maxMp: 20,
    str: 10,
    mag: 10,
    def: 10,
    exp: 0,
    expToNext: 100,
    stamina: 100,
    maxStamina: 100,
  },
  inventory: {
    gold: 0,
    materials: 0,
    potions: 3,
  },
  foodLogs: [],
  activityLogs: [],
};
