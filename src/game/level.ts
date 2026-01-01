import { expToNext } from "./balance";
import type { Stats } from "./types";

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
    p.maxHp += 10;
    p.hp = p.maxHp; // Uzupełnij zdrowie do maksimum przy awansie
    p.strenght += 1;
    p.armor += 1;
    p.luck += 1;

    log.push(`Awansowałeś na poziom ${p.level}`);
  }
  return { player: p, leveledUp, log };
}
