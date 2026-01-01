import type { Item, Mob, Rarity, Stats, ItemSlot } from "./types";
import { clamp } from "./balance";
import { pickByWeight, rand01 } from "./rng";

const POOLS: Record<ItemSlot, Record<Rarity, string[]>> = {
  weapon: {
    common: ["Wooden Sword", "Rusty Dagger", "Training Spear"],
    uncommon: ["Bronze Sword", "Sharpened Dagger", "Hunter Spear"],
    rare: ["Iron Sword", "Steel Dagger", "Ranger Blade"],
    epic: ["Steel Sword", "Knight Blade", "War Axe"],
    legendary: ["Excalibur", "Dragonfang", "Blade of Dawn"],
  },
  armor: {
    common: ["Cloth Armor", "Worn Vest", "Wooden Shield"],
    uncommon: ["Leather Armor", "Reinforced Vest", "Round Shield"],
    rare: ["Chainmail Armor", "Iron Shield", "Guard Plate"],
    epic: ["Plate Armor", "Aegis Shield", "Warlord Plate"],
    legendary: ["Dragon Scale Armor", "Titan Aegis", "Armor of Legends"],
  },
  charm: {
    common: ["Health Potion", "Mana Potion", "Simple Charm"],
    uncommon: ["Lesser Elixir", "Lucky Token", "Minor Amulet"],
    rare: ["Greater Health Potion", "Greater Mana Potion", "Silver Amulet"],
    epic: ["Superior Health Potion", "Superior Mana Potion", "Arcane Relic"],
    legendary: ["Elixir of Immortality", "Philosopher's Stone", "Void Relic"],
  },
};

function randFrom<T>(arr: T[]): T {
  return arr[Math.floor(rand01() * arr.length)];
}

function sellPriceFor(rarity: Rarity): number {
  if (rarity === "common") return 10;
  if (rarity === "uncommon") return 25;
  if (rarity === "rare") return 60;
  if (rarity === "epic") return 220;
  if (rarity === "legendary") return 1000;
  return 0;
}

// Drop chance zależny od luck
function rollDropChance(luck: number): boolean {
  const dropChance = clamp(0.1, 0.85, 0.3 + luck * 0.01);
  return rand01() <= dropChance;
}

// Rarity: bazowo + wpływ luck + mnożnik moba (lootMultiplier).
// Uwaga: wszystkie wartości są "wagami", nie muszą sumować się do 100.

function rollRarity(luck: number, mobMultiplier: number): Rarity {
  const m = clamp(0.7, 2.0, mobMultiplier);

  // bazowe wagi
  const common = 70;
  const uncommon = 20 + luck * 0.25;
  const rare = 8 + luck * 0.12;
  const epic = 1.8 + luck * 0.04;
  const legendary = 0.2 + luck * 0.01;

  // im mocniejsze mob tym wyżej
  const weights = [
    { rarity: "common" as const, weight: common / m },
    { rarity: "uncommon" as const, weight: uncommon * m },
    { rarity: "rare" as const, weight: rare * m },
    { rarity: "epic" as const, weight: epic * m },
    { rarity: "legendary" as const, weight: legendary * m },
  ];

  return pickByWeight(weights).rarity;
}

function rollSlot(): ItemSlot {
  const weights = [
    { slot: "weapon" as const, weight: 0.4 },
    { slot: "armor" as const, weight: 0.35 },
    { slot: "charm" as const, weight: 0.25 },
  ];

  const pick = pickByWeight(weights.map((w) => ({ ...w, weight: w.weight })));
  return pick.slot;
}

export function rollLoot(player: Stats, mob: Mob): Item | undefined {
  const luck = Math.max(0, player.luck);

  if (!rollDropChance(luck)) return undefined;

  const rarity = rollRarity(luck, mob.lootMultiplier);
  const slot = rollSlot();

  const pool = POOLS[slot][rarity];
  const name = randFrom(pool);

  const item: Item = {
    id: crypto.randomUUID(),
    name,
    rarity,
    slot,
    sellPrice: sellPriceFor(rarity),
  };

  return item;
}
