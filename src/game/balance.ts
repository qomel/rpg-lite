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
