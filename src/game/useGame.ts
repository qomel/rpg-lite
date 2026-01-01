import { useEffect, useMemo, useRef, useState } from "react";
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

  // cooldown afer death
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);

  // blokda przed spam-click
  const turnLockRef = useRef(false);
  const [turnLocked, setTurnLocked] = useState(false);

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

  // when cooldown end -> revive + allow selection + reset fight
  useEffect(() => {
    if (phase === "cooldown" && cooldownLeft === 0) {
      // revive
      setPlayer((p) => ({ ...p, hp: p.maxHp }));
      // reset fight to selected mob
      setFight(startFight(selectedMob));
      setPhase("ready");
      setLog(["Ocknąłeś się! Spróbuj nie umrzeć ponownie.. "]);
    }
  }, [cooldownLeft, phase, selectedMob]);

  function selectMob(mob: Mob) {
    if (selectionLocked) return;

    setSelectedMobId(mob.id);
    setFight(startFight(mob));
    setPhase("ready");
    setLog([`Wybrano: ${mob.name}. Kliknij "Atakuj, żeby rozpoczać walkę`]);
  }

  function attack() {
    // gurady anyspam click
    if (turnLockRef.current) return;
    turnLockRef.current = true;
    setTurnLocked(true);

    try {
      // jeśli z jakiegoś powodu walka już nie trwa, nie wchodź w turę
      if (!fight.inProgress || fight.mobHp <= 0 || player.hp <= 0) {
        setPhase("ready");
        setLog(["Walka jest zakończona"]);
        return;
      }

      // after first atack lock in fight
      if (phase === "ready") setPhase("inFight");

      const res = attackTurn(player, fight, selectedMob);
      setPlayer(res.player);
      setFight(res.fight);
      setLog(res.result.log);

      // domykanie po zakończeniu
      if (res.result.finished) {
        if (res.result.win === true) {
          setPhase("ready");
        } else if (res.result.win === false) {
          setPhase("cooldown");
        } else {
          // If comabt is finished but there is no win/lose return to ready
          setPhase("ready");
        }
      }
    } finally {
      // zwolnij blokadę w następnym ticku, żeby nie dopuścić do double fire
      setTimeout(() => {
        turnLockRef.current = false;
        setTurnLocked(false);
      }, 0);
    }
  }

  function getStatusLabel(): string {
    if (phase === "cooldown") return `Pokonany - blokada ${cooldownLeft}s`;
    if (phase === "inFight") return `Walka w toku`;
    return "Gotowy";
  }

  return {
    player,
    mobs: MOBS,
    selectedMob,
    fight,
    log,
    selectMob,
    attack,
    phase,
    cooldownLeft,
    selectionLocked,
    canAttack,
    statusLabel: getStatusLabel(),
  };
}
