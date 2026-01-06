export function clamp(min: number, max: number, v: number): number {
  return Math.max(min, Math.min(max, v));
}

// Redukcja obrażeń
// dmgTaken = ceil(attack * 100 / (100 + armor))

export function damageAfterArmor(mobAttack: number, armor: number): number {
  const raw = (mobAttack * 100) / (100 + Math.max(0, armor));
  return Math.max(0, Math.ceil(raw));
}

export function playerPower(strength: number, armor: number): number {
  return strength * 2 + armor * 0.5;
}

export function expToNext(level: number): number {
  return 100 + Math.max(0, level - 1) * 50;
}

export function playerDamage(strength: number): number {
  return Math.max(1, 2 + strength);
}

export function expRewardForMob(mobLevel: number): number {
  // prosta krzywa
  // lvl1 ~ 12, lvl10 ~ 55, lvl20 ~ 105
  return Math.round(10 + mobLevel * 4.5);
}

export function goldRewardForMob(mobLevel: number): {
  min: number;
  max: number;
} {
  // lvl1 ~ 2-6, lvl10 ~ 12-22 itd.
  const min = Math.max(1, Math.round(1 + mobLevel * 1.2));
  const max = Math.max(min + 1, Math.round(4 + mobLevel * 1.8));
  return { min, max };
}

export function maxMobLevelAllowed(playerLevel: number): number {
  return playerLevel + (6 + Math.floor(playerLevel / 3));
}

export const POTION_PRICE_GOLD = 30;

export const POTION_HEAL_HP = 45;
