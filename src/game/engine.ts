import type { Mob, Stats } from "./types";

export function createNewPlayer(): Stats {
  return {
    level: 1,
    exp: 0,
    maxHp: 100,
    hp: 100,
    strenght: 3,
    armor: 0,
    luck: 0,
    gold: 50,
  };
}

export const MOBS: Mob[] = [
  {
    id: "slime",
    name: "Slime",
    maxHp: 30,
    mobAttack: 12,
    expReward: 25,
    goldMin: 2,
    goldMax: 6,
    lootMultiplier: 0,
  },
  {
    id: "rat",
    name: "Giant Rat",
    maxHp: 40,
    mobAttack: 14,
    expReward: 30,
    goldMin: 3,
    goldMax: 8,
    lootMultiplier: 0.9,
  },
  {
    id: "bandit",
    name: "Bandit",
    maxHp: 60,
    mobAttack: 18,
    expReward: 45,
    goldMin: 8,
    goldMax: 16,
    lootMultiplier: 1.0,
  },
  {
    id: "ogre",
    name: "Ogre",
    maxHp: 80,
    mobAttack: 26,
    expReward: 70,
    goldMin: 14,
    goldMax: 28,
    lootMultiplier: 1.25,
  },
  {
    id: "wyrm",
    name: "Wyrm",
    maxHp: 120,
    mobAttack: 34,
    expReward: 95,
    goldMin: 22,
    goldMax: 40,
    lootMultiplier: 1.5,
  },
  {
    id: "dragon",
    name: "Dragon",
    maxHp: 300,
    mobAttack: 45,
    expReward: 150,
    goldMin: 40,
    goldMax: 80,
    lootMultiplier: 2.0,
  },
];
