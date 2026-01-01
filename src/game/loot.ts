import type { Item, Mob, Rarity, Stats } from "./types";
import { clamp } from "./balance";
import { pickByWeight, rand01 } from "./rng";

const COMMON_ITEMS: string[] = [
  "Wooden Sword",
  "Cloth Armor",
  "Health Potion",
  "Mana Potion",
];

const RARE_ITEMS: string[] = [
  "Iron Sword",
  "Chainmail Armor",
  "Greater Health Potion",
  "Greater Mana Potion",
];

const EPIC_ITEMS: string[] = [
  "Steel Sword",
  "Plate Armor",
  "Superior Health Potion",
  "Superior Mana Potion",
];

const LEGENDARY_ITEMS: string[] = [
  "Excalibur",
  "Dragon Scale Armor",
  "Elixir of Immortality",
  "Philosopher's Stone",
];

function sellPriceFor(rarity: Rarity): number {
  if (rarity === "common") return 10;
  if (rarity === "rare") return 50;
  if (rarity === "epic") return 200;
  if (rarity === "legendary") return 1000;
  return 0;
}

function nameFor(rarity: Rarity): string {
  const pool =
    rarity === "common"
      ? COMMON_ITEMS
      : rarity === "rare"
      ? RARE_ITEMS
      : rarity === "epic"
      ? EPIC_ITEMS
      : LEGENDARY_ITEMS;
  const idx = Math.floor(rand01() * pool.length);
  return pool[idx];
}

// Loot rarity
// base: common 80, rare 18, epix 3, legendary 0.5
// luck increases chance for better loot

export function rollLoot(player: Stats, mob: Mob): Item | undefined {
  // drop chance
  const dropChance = clamp(0.1, 0.85, 0.3 + player.luck * 0.01);
  if (rand01() > dropChance) return undefined;

  const luck = Math.max(0, player.luck);
  const m = clamp(0.7, 2.0, mob.lootMultiplier);

  const rare = 18 + luck * 0.2;
  const epic = 3 + luck * 0.05;
  const legendary = 0.5 + luck * 0.01;
  let common = 100 - rare - epic - legendary;

  const rareAdj = rare * m;
  const epicAdj = epic * m;
  const legendaryAdj = legendary * m;
  const total = common + rareAdj + epicAdj + legendaryAdj;

  const weights = [
    { rarity: "common" as const, weight: common / total },
    { rarity: "rare" as const, weight: rareAdj / total },
    { rarity: "epic" as const, weight: epicAdj / total },
    { rarity: "legendary" as const, weight: legendaryAdj / total },
  ];

  const chosen = pickByWeight(weights).rarity;
  const item: Item = {
    id: crypto.randomUUID(),
    name: nameFor(chosen),
    rarity: chosen,
    sellPrice: sellPriceFor(chosen),
  };
  return item;
}
