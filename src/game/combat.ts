import type { BattleResult, Mob, Stats } from "./types";
import { damageAfterArmor } from "./balance";
import { randInt } from "./rng";
import { rollLoot } from "./loot";
import { applyExpAndLevelUp } from "./level";

export function attackMob(
  player: Stats,
  mob: Mob
): { player: Stats; result: BattleResult } {
  const log: string[] = [];
  // Obrażenia od moba

  const damageTaken = damageAfterArmor(mob.mobAttack, player.armor);

  log.push("Walczysz z " + mob.name + "!");
  log.push("Otrzymujesz " + damageTaken);

  // Nagrody za pokonanie moba

  const expGained = mob.expReward;
  const goldGained = randInt(mob.goldMin, mob.goldMax);

  log.push(
    "Zdobywasz " +
      expGained +
      " punktów doświadczenia i " +
      goldGained +
      " złota."
  );

  // Update HP i GOLD

  let p: Stats = {
    ...player,
    hp: Math.max(0, player.hp - damageTaken),
    gold: player.gold + goldGained,
  };

  // EXP i level up

  const leveled = applyExpAndLevelUp(p, expGained);
  p = leveled.player;
  log.push(...leveled.log);

  // Loot RNG

  const droppedItems = rollLoot(p, mob);
  if (droppedItems) {
    log.push(
      "Zdobywasz przedmiot: " +
        droppedItems.name +
        " (Rzadkość: " +
        droppedItems.rarity +
        ")"
    );
  }

  const result: BattleResult = {
    win: true,
    damageTaken,
    expGained,
    goldGained,
    droppedItems,
    log,
  };

  return { player: p, result };
}
