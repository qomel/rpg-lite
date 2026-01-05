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
  bat: {
    id: "bat",
    maxRarity: "uncommon",
    entries: [
      {
        name: "Echo Blade",
        slot: "weapon",
        rarity: "common",
        requiredLevel: 2,
        weight: 55,
      },
      {
        name: "Wing Cloak",
        slot: "armor",
        rarity: "common",
        requiredLevel: 2,
        weight: 55,
      },
      {
        name: "Sonic Charm",
        slot: "charm",
        rarity: "uncommon",
        requiredLevel: 4,
        weight: 22,
      },
    ],
  },
  spider: {
    id: "spider",
    maxRarity: "uncommon",
    entries: [
      {
        name: "Venom Dagger",
        slot: "weapon",
        rarity: "common",
        requiredLevel: 3,
        weight: 55,
      },
      {
        name: "Silk Wrap",
        slot: "armor",
        rarity: "uncommon",
        requiredLevel: 4,
        weight: 35,
      },
      {
        name: "Poison Fang",
        slot: "charm",
        rarity: "uncommon",
        requiredLevel: 4,
        weight: 20,
      },
    ],
  },
  wolf: {
    id: "wolf",
    maxRarity: "uncommon",
    entries: [
      {
        name: "Claw Axe",
        slot: "weapon",
        rarity: "common",
        requiredLevel: 4,
        weight: 55,
      },
      {
        name: "Hide Armor",
        slot: "armor",
        rarity: "uncommon",
        requiredLevel: 5,
        weight: 35,
      },
      {
        name: "Howl Totem",
        slot: "charm",
        rarity: "uncommon",
        requiredLevel: 5,
        weight: 20,
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
  skeleton: {
    id: "skeleton",
    maxRarity: "rare",
    entries: [
      {
        name: "Bone Saber",
        slot: "weapon",
        rarity: "common",
        requiredLevel: 6,
        weight: 50,
      },
      {
        name: "Ribcage Plate",
        slot: "armor",
        rarity: "uncommon",
        requiredLevel: 7,
        weight: 35,
      },
      {
        name: "Grave Sigil",
        slot: "charm",
        rarity: "rare",
        requiredLevel: 8,
        weight: 15,
      },
    ],
  },
  ghoul: {
    id: "ghoul",
    maxRarity: "rare",
    entries: [
      {
        name: "Rot Blade",
        slot: "weapon",
        rarity: "uncommon",
        requiredLevel: 7,
        weight: 35,
      },
      {
        name: "Decayed Mail",
        slot: "armor",
        rarity: "uncommon",
        requiredLevel: 8,
        weight: 35,
      },
      {
        name: "Hunger Charm",
        slot: "charm",
        rarity: "rare",
        requiredLevel: 9,
        weight: 15,
      },
    ],
  },
  mage: {
    id: "mage",
    maxRarity: "rare",
    entries: [
      {
        name: "Runic Staff",
        slot: "weapon",
        rarity: "uncommon",
        requiredLevel: 8,
        weight: 35,
      },
      {
        name: "Arcane Robe",
        slot: "armor",
        rarity: "rare",
        requiredLevel: 9,
        weight: 20,
      },
      {
        name: "Mana Relic",
        slot: "charm",
        rarity: "rare",
        requiredLevel: 9,
        weight: 15,
      },
    ],
  },
  ogre: {
    id: "ogre",
    maxRarity: "epic",
    entries: [
      {
        name: "Crushing Club",
        slot: "weapon",
        rarity: "rare",
        requiredLevel: 10,
        weight: 25,
      },
      {
        name: "Brute Plate",
        slot: "armor",
        rarity: "rare",
        requiredLevel: 10,
        weight: 25,
      },
      {
        name: "Rage Idol",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 12,
        weight: 8,
      },
    ],
  },
  wraith: {
    id: "wraith",
    maxRarity: "epic",
    entries: [
      {
        name: "Spectral Scythe",
        slot: "weapon",
        rarity: "rare",
        requiredLevel: 11,
        weight: 22,
      },
      {
        name: "Shroud Mantle",
        slot: "armor",
        rarity: "rare",
        requiredLevel: 11,
        weight: 22,
      },
      {
        name: "Haunt Sigil",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 12,
        weight: 8,
      },
    ],
  },
  knight: {
    id: "knight",
    maxRarity: "epic",
    entries: [
      {
        name: "Fallen Greatblade",
        slot: "weapon",
        rarity: "rare",
        requiredLevel: 12,
        weight: 22,
      },
      {
        name: "Cursed Plate",
        slot: "armor",
        rarity: "epic",
        requiredLevel: 13,
        weight: 10,
      },
      {
        name: "Oathbreaker Mark",
        slot: "charm",
        rarity: "rare",
        requiredLevel: 12,
        weight: 18,
      },
    ],
  },
  golem: {
    id: "golem",
    maxRarity: "epic",
    entries: [
      {
        name: "Granite Hammer",
        slot: "weapon",
        rarity: "rare",
        requiredLevel: 13,
        weight: 22,
      },
      {
        name: "Basalt Carapace",
        slot: "armor",
        rarity: "rare",
        requiredLevel: 13,
        weight: 22,
      },
      {
        name: "Core Shard",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 14,
        weight: 8,
      },
    ],
  },
  harpy: {
    id: "harpy",
    maxRarity: "epic",
    entries: [
      {
        name: "Gale Talons",
        slot: "weapon",
        rarity: "rare",
        requiredLevel: 14,
        weight: 22,
      },
      {
        name: "Featherweave Vest",
        slot: "armor",
        rarity: "epic",
        requiredLevel: 15,
        weight: 10,
      },
      {
        name: "Skyward Locket",
        slot: "charm",
        rarity: "rare",
        requiredLevel: 14,
        weight: 18,
      },
    ],
  },
  wyrm: {
    id: "wyrm",
    maxRarity: "epic",
    entries: [
      {
        name: "Wyrmfang Spear",
        slot: "weapon",
        rarity: "rare",
        requiredLevel: 15,
        weight: 20,
      },
      {
        name: "Drakescale Guard",
        slot: "armor",
        rarity: "epic",
        requiredLevel: 16,
        weight: 10,
      },
      {
        name: "Ember Glyph",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 15,
        weight: 8,
      },
    ],
  },
  cultist: {
    id: "cultist",
    maxRarity: "epic",
    entries: [
      {
        name: "Ritual Dagger",
        slot: "weapon",
        rarity: "rare",
        requiredLevel: 16,
        weight: 20,
      },
      {
        name: "Hexbound Robes",
        slot: "armor",
        rarity: "rare",
        requiredLevel: 16,
        weight: 20,
      },
      {
        name: "Forbidden Idol",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 17,
        weight: 8,
      },
    ],
  },
  assassin: {
    id: "assassin",
    maxRarity: "epic",
    entries: [
      {
        name: "Nightneedle",
        slot: "weapon",
        rarity: "epic",
        requiredLevel: 17,
        weight: 10,
      },
      {
        name: "Shadow Leather",
        slot: "armor",
        rarity: "rare",
        requiredLevel: 17,
        weight: 20,
      },
      {
        name: "Silence Token",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 18,
        weight: 8,
      },
    ],
  },
  wyvern: {
    id: "wyvern",
    maxRarity: "epic",
    entries: [
      {
        name: "Skyfang Blade",
        slot: "weapon",
        rarity: "epic",
        requiredLevel: 18,
        weight: 10,
      },
      {
        name: "Stormscale Mail",
        slot: "armor",
        rarity: "epic",
        requiredLevel: 18,
        weight: 10,
      },
      {
        name: "Tempest Charm",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 19,
        weight: 7,
      },
    ],
  },
  demon: {
    id: "demon",
    maxRarity: "epic",
    entries: [
      {
        name: "Infernal Cleaver",
        slot: "weapon",
        rarity: "epic",
        requiredLevel: 19,
        weight: 10,
      },
      {
        name: "Hellforged Plate",
        slot: "armor",
        rarity: "epic",
        requiredLevel: 19,
        weight: 10,
      },
      {
        name: "Brimstone Seal",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 20,
        weight: 6,
      },
    ],
  },
  ancient: {
    id: "ancient",
    maxRarity: "epic",
    entries: [
      {
        name: "Relic Greatsword",
        slot: "weapon",
        rarity: "epic",
        requiredLevel: 20,
        weight: 10,
      },
      {
        name: "Aegis of Ages",
        slot: "armor",
        rarity: "epic",
        requiredLevel: 20,
        weight: 10,
      },
      {
        name: "Eternal Crest",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 20,
        weight: 5,
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

  boss_ironbeast: {
    id: "boss_ironbeast",
    maxRarity: "legendary",
    entries: [
      {
        name: "Iron Maul",
        slot: "weapon",
        rarity: "epic",
        requiredLevel: 14,
        weight: 15,
      },
      {
        name: "Titan Core Armor",
        slot: "armor",
        rarity: "legendary",
        requiredLevel: 16,
        weight: 3,
      },
      {
        name: "Overload Engine",
        slot: "charm",
        rarity: "epic",
        requiredLevel: 15,
        weight: 10,
      },
    ],
  },
  boss_voidwyrm: {
    id: "boss_voidwyrm",
    maxRarity: "legendary",
    entries: [
      {
        name: "Void Fang",
        slot: "weapon",
        rarity: "epic",
        requiredLevel: 18,
        weight: 12,
      },
      {
        name: "Abyss Scale",
        slot: "armor",
        rarity: "legendary",
        requiredLevel: 20,
        weight: 2,
      },
      {
        name: "Entropy Seal",
        slot: "charm",
        rarity: "legendary",
        requiredLevel: 19,
        weight: 3,
      },
    ],
  },
};
