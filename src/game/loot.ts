import type { Item, ItemStats, Mob, Stats } from "./types";
import { clamp } from "./balance";
import { pickByWeight, rand01, randInt } from "./rng";
import { LOOT_TABLES, rarityLeq } from "./lootTables";

function sellPriceFor(rarity: Item["rarity"]): number {
  if (rarity === "common") return 10;
  if (rarity === "uncommon") return 25;
  if (rarity === "rare") return 60;
  if (rarity === "epic") return 220;
  if (rarity === "legendary") return 1000;
  return 0;
}

function rarityMultiplier(r: Item["rarity"]): number {
  switch (r) {
    case "common":
      return 1.0;
    case "uncommon":
      return 1.15;
    case "rare":
      return 1.35;
    case "epic":
      return 1.65;
    case "legendary":
      return 2.1;
    default:
      return 1.0;
  }
}

function rollItemStats(
  slot: Item["slot"],
  requiredLevel: number,
  rarity: Item["rarity"]
): ItemStats {
  const mult = rarityMultiplier(rarity);
  const wiggle = (min: number, max: number) => randInt(min, max);

  if (slot === "weapon") {
    const base = Math.max(2, Math.round(1.5 + requiredLevel * 0.7));
    return { strenght: Math.max(2, Math.round((base + wiggle(0, 1)) * mult)) };
  }

  if (slot === "armor") {
    const baseArmor = Math.max(1, Math.round(requiredLevel * 0.5));
    const baseHp = Math.max(10, Math.round(10 + requiredLevel * 4.0));
    return {
      armor: Math.max(1, Math.round((baseArmor + wiggle(0, 1)) * mult)),
      maxHp: Math.max(10, Math.round((baseHp + wiggle(0, 5)) * mult)),
    };
  }
  const baseLuck = Math.max(1, Math.round(1 + requiredLevel * 0.35));
  return { luck: Math.max(1, Math.round((baseLuck + wiggle(0, 1)) * mult)) };
}

export function rollLoot(player: Stats, mob: Mob): Item | undefined {
  const table = LOOT_TABLES[mob.lootTableId];
  if (!table) return undefined;

  // drop chance (luck wpływa, ale cap rarity trzyma balans)
  const dropChance = clamp(
    0.1,
    0.85,
    0.25 + player.luck * 0.01 + (mob.kind === "boss" ? 0.15 : 0)
  );
  if (rand01() > dropChance) return undefined;

  // wybieramy tylko wpisy <= maxRarity tabeli
  const entries = table.entries.filter((e) =>
    rarityLeq(e.rarity, table.maxRarity)
  );
  if (entries.length === 0) return undefined;

  // luck lekko przesuwa w stronę rzadszych w obrębie table
  const weights = entries.map((e) => {
    const rarityBoost =
      e.rarity === "common"
        ? 1
        : e.rarity === "uncommon"
        ? 1 + player.luck * 0.01
        : e.rarity === "rare"
        ? 1 + player.luck * 0.015
        : e.rarity === "epic"
        ? 1 + player.luck * 0.02
        : 1 + player.luck * 0.025;

    const bossBoost = mob.kind === "boss" ? 1.15 : 1;
    return { entry: e, weight: e.weight * rarityBoost * bossBoost };
  });

  const chosen = pickByWeight(weights).entry;

  const item: Item = {
    id: crypto.randomUUID(),
    name: chosen.name,
    rarity: chosen.rarity,
    slot: chosen.slot,
    requiredLevel: chosen.requiredLevel,
    sellPrice: sellPriceFor(chosen.rarity),
    stats: rollItemStats(chosen.slot, chosen.requiredLevel, chosen.rarity),
  };

  return item;
}
