import { useEffect, useMemo, useState } from "react";
import { createNewPlayer, MOBS } from "./engine";
import type { FightState, Mob } from "./types";
import { startFight, attackTurn } from "./combat";

type Phase = "ready" | "inFight" | "cooldown";

export function useGame() {
  const [player, setPlayer] = useState(createNewPlayer());
  const [selectedMobId, setSelectedMobId] = useState<string>(MOBS[0].id);
  const [fight, setFight] = useState<FightState>(() => startFight(MOBS[0]));
  const [phase, setPhase] = useState<Phase>("ready");
  const [log, setLog] = useState<string[]>([]);

  const [cooldownLeft, setCooldownLeft] = useState<number>(0);

  const selectedMob: Mob = useMemo(
    () => MOBS.find((m) => m.id === selectedMobId) ?? MOBS[0],
    [selectedMobId]
  );

  const selectionLocked = phase === "inFight" || phase === "cooldown";
  const canAttack = phase !== "cooldown" && player.hp > 0 && fight.mobHp > 0;

  // start cooldown timer
  useEffect(() => {
    if (phase !== "cooldown") return;

    setCooldownLeft(5);
    const t = window.setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(t);
  }, [phase]);

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
