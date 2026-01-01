import type { ItemSlot, Rarity } from "./types";

export type LootEntry = {
  name: string;
  slot: ItemSlot;
  rarity: Rarity;
  requiredLevel: number;
  weight: number;
};

export type LootTable = {
  id: string;
  maxRarity: Rarity;
  entries: LootEntry[];
};

// Ogranicznie rarity

const RARITY_ORDER: Rarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
];
export function rarityLeq(a: Rarity, b: Rarity): boolean {
  return RARITY_ORDER.indexOf(a) <= RARITY_ORDER.indexOf(b);
}

export const LOOT_TABLES: Record<string, LootTable> = {
  slime: {
    id: "slime",
    maxRarity: "uncommon",
    entries: [
      {
        name: "Sticky Dagger",
        slot: "weapon",
        rarity: "common",
        requiredLevel: 1,
        weight: 60,
      },
      {
        name: "Slime Coat",
        slot: "armor",
        rarity: "common",
        requiredLevel: 1,
        weight: 60,
      },
      {
        name: "Jelly Charm",
        slot: "charm",
        rarity: "uncommon",
        requiredLevel: 3,
        weight: 20,
      },
    ],
  },
  rat: {
    id: "rat",
    maxRarity: "uncommon",
    entries: [
      {
        name: "Rat Fang",
        slot: "weapon",
        rarity: "common",
        requiredLevel: 1,
        weight: 60,
      },
      {
        name: "Patch Vest",
        slot: "armor",
        rarity: "common",
        requiredLevel: 1,
        weight: 60,
      },
      {
        name: "Scent Token",
        slot: "charm",
        rarity: "uncommon",
        requiredLevel: 3,
        weight: 18,
      },
    ],
  },
  bandit: {
    id: "bandit",
    maxRarity: "rare",
    entries: [
      {
        name: "Bandit Blade",
        slot: "weapon",
        rarity: "common",
        requiredLevel: 2,
        weight: 55,
      },
      {
        name: "Leather Guard",
        slot: "armor",
        rarity: "uncommon",
        requiredLevel: 3,
        weight: 30,
      },
      {
        name: "Coin Talisman",
        slot: "charm",
        rarity: "rare",
        requiredLevel: 6,
        weight: 12,
      },
    ],
  },

  // Bossy (wyższe rarity)
  boss_swampking: {
    id: "boss_swampking",
    maxRarity: "epic",
    entries: [
      {
        name: "Swamp Scepter",
        slot: "weapon",
        rarity: "rare",
        requiredLevel: 8,
        weight: 30,
      },
      {
        name: "Bog Plate",
        slot: "armor",
        rarity: "epic",
        requiredLevel: 10,
        weight: 10,
      },
      {
        name: "King's Fetish",
        slot: "charm",
        rarity: "rare",
        requiredLevel: 8,
        weight: 25,
      },
    ],
  },
  // boss_ironbeast, boss_voidwyrm analogicznie...
};
