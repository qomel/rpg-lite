import type { BattleResult, FightState, Mob, Stats } from "./types";
import { damageAfterArmor, playerDamage as calcPlayerDamage } from "./balance";
import { randInt } from "./rng";
import { rollLoot } from "./loot";
import { applyExpAndLevelUp } from "./level";

export function startFight(mob: Mob): FightState {
  return { mobId: mob.id, mobHp: mob.maxHp, inProgress: true };
}

export function attackTurn(
  player: Stats,
  fight: FightState,
  mob: Mob
): { player: Stats; fight: FightState; result: BattleResult } {
  const log: string[] = [];

  if (!fight.inProgress) {
    return {
      player,
      fight,
      result: {
        finished: true,
        win: undefined,
        damageTaken: 0,
        mobDamage: 0,
        expGained: 0,
        goldGained: 0,
        log: ["The fight is already over."],
      },
    };
  }

  // Player attacks mob

  const pDmg = calcPlayerDamage(player.strenght);
  let newMobHp = Math.max(0, fight.mobHp - pDmg);
  log.push(
    `Zaatakowałeś ${mob.name} i zadałeś ${pDmg} obrażeń. (${newMobHp}/${mob.maxHp} HP)`
  );

  // If mob is defeated => end fight, give rewards

  if (newMobHp === 0) {
    const expGained = mob.expReward;
    const goldGained = randInt(mob.goldMin, mob.goldMax);

    let p: Stats = { ...player, gold: player.gold + goldGained };
    const leveled = applyExpAndLevelUp(p, expGained);
    p = leveled.player;

    const droppedItems = rollLoot(p, mob);

    log.push(`Pokonałeś ${mob.name}! (${0}/${mob.maxHp} HP)`);
    log.push(`Zdobywasz ${expGained} EXP i ${goldGained} gold.`);
    log.push(...leveled.log);

    if (droppedItems)
      log.push(
        `Zdobywasz przedmiot: ${droppedItems.name} (${droppedItems.rarity}).`
      );

    const result: BattleResult = {
      finished: true,
      win: true,
      damageTaken: pDmg,
      mobDamage: 0,
      expGained,
      goldGained,
      droppedItems,
      log,
    };

    return {
      player: p,
      fight: { ...fight, mobHp: 0, inProgress: false }, // kluczowe: mobHp=0
      result,
    };
  }

  // Mob attacks player

  const mDmg = damageAfterArmor(mob.mobAttack, player.armor);
  const newPlayerHp = Math.max(0, player.hp - mDmg);
  log.push(
    `${mob.name} atakuje Cię i zadaje ${mDmg} obrażeń. (${newPlayerHp}/${player.maxHp} HP)`
  );

  const pAfter: Stats = { ...player, hp: newPlayerHp };
  const fightAfter: FightState = {
    ...fight,
    mobHp: newMobHp,
    inProgress: newPlayerHp > 0,
  };

  // Check if player is defeated

  if (newPlayerHp === 0) {
    log.push(`Zostałeś pokonany przez ${mob.name}...`);
    const result: BattleResult = {
      finished: true,
      win: false,
      damageTaken: pDmg,
      mobDamage: mDmg,
      expGained: 0,
      goldGained: 0,
      log,
    };
    return {
      player: pAfter,
      fight: { ...fightAfter, inProgress: false },
      result,
    };
  }

  // Fight continues

  const result: BattleResult = {
    finished: false,
    win: undefined,
    damageTaken: pDmg,
    mobDamage: mDmg,
    expGained: 0,
    goldGained: 0,
    droppedItems: undefined,
    log,
  };

  return { player: pAfter, fight: fightAfter, result };
}
