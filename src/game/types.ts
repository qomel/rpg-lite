// Zmienna typu Rarity określa rzadkość przedmiotu w grze.
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type Stats = {
  maxHp: number;
  hp: number;
  exp: number;
  level: number;
  strenght: number;
  armor: number;
  luck: number;
  gold: number;
};

export type Mob = {
  id: string;
  name: string;
  threatLevel: number; // do obliczenia winChance
  mobAttack: number;
  expReward: number;
  goldMin: number;
  goldMax: number;
  lootMultiplier: number; // mnożnik do szansy na zdobycie przedmiotu
};

export type Item = {
  id: string;
  name: string;
  rarity: Rarity;
  sellPrice: number;
};

export type BattleResult = {
  win: boolean;
  damageTaken: number;
  expGained: number;
  goldGained: number;
  droppedItems?: Item;
  log: string[];
};
