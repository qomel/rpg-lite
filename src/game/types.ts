// Zmienna typu Rarity określa rzadkość przedmiotu w grze.
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type ItemSlot = "weapon" | "armor" | "charm";
export type ItemStats = Partial<
  Pick<Stats, "maxHp" | "strenght" | "armor" | "luck">
>;

export type Stats = {
  maxHp: number;
  hp: number;
  exp: number;
  level: number;
  strenght: number;
  potions: number;
  armor: number;
  luck: number;
  gold: number;
  inventoryCap: number;
};

export type MobKind = "mob" | "boss";

export type Mob = {
  id: string;
  name: string;

  level: number;
  maxHp: number;
  mobAttack: number;
  kind: MobKind;
  icon: string;
  lootTableId: string;
};

export type Item = {
  id: string;
  name: string;
  rarity: Rarity;
  slot: ItemSlot;
  sellPrice: number;
  requiredLevel: number;
  stats: ItemStats;
};

export type BattleResult = {
  finished: boolean;
  win?: boolean;
  damageTaken: number;
  mobDamage: number;
  expGained: number;
  goldGained: number;
  droppedItems?: Item;
  log: string[];
};

export type FightState = {
  mobId: string;
  mobHp: number;
  inProgress: boolean;
};

export type Equipment = {
  weapon?: Item;
  armor?: Item;
  charm?: Item;
};
