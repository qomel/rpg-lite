import { useMemo, useState } from "react";
import { createNewPlayer, MOBS } from "./engine";
import type { FightState, Mob } from "./types";
import { startFight, attackTurn } from "./combat";

export function useGame() {
  const [player, setPlayer] = useState(createNewPlayer());
  const [selectedMobId, setSelectedMobId] = useState<string>(MOBS[0].id);
  const [fight, setFight] = useState<FightState>(() => startFight(MOBS[0]));
  const [log, setLog] = useState<string[]>([]);

  const selectedMob: Mob = useMemo(
    () => MOBS.find((m) => m.id === selectedMobId) ?? MOBS[0],
    [selectedMobId]
  );

  function selectMob(mob: Mob) {
    setSelectedMobId(mob.id);
    setFight(startFight(mob));
    setLog([`Rozpoczęto walkę z ${mob.name}.`]);
  }

  function attack() {
    const res = attackTurn(player, fight, selectedMob);
    setPlayer(res.player);
    setFight(res.fight);
    setLog(res.result.log);
  }

  function resetPlayer() {
    const p = createNewPlayer();
    setPlayer(p);
    setFight(startFight(selectedMob));
    setLog([`Postać została zresetowana.`]);
  }

  return {
    player,
    mobs: MOBS,
    selectedMob,
    fight,
    log,
    attack,
    selectMob,
    resetPlayer,
  };
}
