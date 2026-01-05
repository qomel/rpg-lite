import { expToNext } from "./balance";
import type { Stats } from "./types";

function applyLevelRewards(player: any, newLevel: number) {
  const hpGain = 8 + Math.floor(newLevel * 2);
  const strGain = 1; // +1 Str co 2 lvl
  const armGain = newLevel % 2 === 0 ? 1 : 0; // +1 ARM co 3 lvl
  const luckGain = newLevel % 3 === 0 ? 1 : 0; // +1 LUCK co 4 lvl
  player.maxHp += hpGain;
  player.strenght += strGain;
  player.armor += armGain;
  player.luck += luckGain;

  player.hp = player.maxHp;

  return { hpGain, strGain, armGain, luckGain };
}

export function applyExpAndLevelUp(
  player: Stats,
  expGained: number
): { player: Stats; leveledUp: number; log: string[] } {
  let p: Stats = { ...player, exp: player.exp + expGained };
  let leveledUp = 0;
  const log: string[] = [];

  while (p.exp >= expToNext(p.level)) {
    p.exp -= expToNext(p.level);
    p.level += 1;
    leveledUp += 1;

    // Wzrost statystyk przy awansie na wyższy poziom
    const r = applyLevelRewards(p, p.level);

    const parts: string[] = [];
    parts.push(`+HP ${r.hpGain}`);
    if (r.strGain > 0) parts.push(`+STR ${r.strGain}`);
    if (r.armGain > 0) parts.push(`+ARM ${r.armGain}`);
    if (r.luckGain > 0) parts.push(`+LUCK ${r.luckGain}`);

    log.push(`Level up! ${parts.join(" ")}`);
  }
  return { player: p, leveledUp, log };
}
