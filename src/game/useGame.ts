import { useEffect, useMemo, useRef, useState } from "react";
import { createNewPlayer, MOBS } from "./engine";
import type { FightState, Mob, Equipment, Item, ItemSlot } from "./types";
import { startFight, attackTurn } from "./combat";
import { expToNext } from "./balance";
type Phase = "ready" | "inFight" | "cooldown";

export function useGame() {
  const [player, setPlayer] = useState(createNewPlayer());
  const [selectedMobId, setSelectedMobId] = useState<string>(MOBS[0].id);
  const [fight, setFight] = useState<FightState>(() => startFight(MOBS[0]));
  const [phase, setPhase] = useState<Phase>("ready");
  const [log, setLog] = useState<string[]>([]);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [equipment, setEquipment] = useState<Equipment>({});
  const [inventoryOpen, setInventoryOpen] = useState(false);
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
  const canAttack = !turnLocked && phase !== "cooldown" && player.hp > 0; // Atakuj dostępny także po zakończeniu walki (respawn na klik)

  // start cooldown timer
  useEffect(() => {
    if (phase !== "cooldown") return;

    // start zawsze od 5
    setCooldownLeft(5);

    const t = window.setInterval(() => {
      setCooldownLeft((prev) => {
        // gdy dobijemy do 1 -> kończymy cooldown i robimy revive
        if (prev <= 1) {
          window.clearInterval(t);

          // revive + reset walki + odblokowanie
          setPlayer((p) => ({ ...p, hp: p.maxHp }));
          setFight(startFight(selectedMob));
          setPhase("ready");
          setLog([`Ocknąłeś się! Spróbuj nie umrzeć ponownie..`]);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(t);
  }, [phase, selectedMob]);

  function selectMob(mob: Mob) {
    if (selectionLocked) return;

    setSelectedMobId(mob.id);
    setFight(startFight(mob));
    setPhase("ready");
    setLog([`Wybrano: ${mob.name}. Kliknij "Atakuj, żeby rozpoczać walkę`]);
  }

  // button Atakuj
  function attack() {
    // gurady anyspam click
    if (turnLockRef.current) return;
    turnLockRef.current = true;
    setTurnLocked(true);

    try {
      if (phase === "cooldown") return;

      if (player.hp <= 0) return;

      // Jeśli walka jest zakończona (mob dead) i jesteśmy w READY,
      // to klik "Atakuj" ma rozpocząć nową walkę z tym samym mobem.
      let fightToUse = fight;
      if (!fight.inProgress || fight.mobHp <= 0) {
        fightToUse = startFight(selectedMob);
        setFight(fightToUse);
      }

      // after first atack lock in fight
      if (phase === "ready") setPhase("inFight");

      const res = attackTurn(player, fightToUse, selectedMob);
      setPlayer(res.player);
      setFight(res.fight);
      setLog(res.result.log);

      if (res.result.droppedItems) {
        setInventory((prev) => [res.result.droppedItems as Item, ...prev]);
      }

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

  function equipItem(itemId: string) {
    setInventory((prevInv) => {
      const item = prevInv.find((x) => x.id === itemId);
      if (!item) return prevInv;

      setEquipment((prevEq) => {
        const slot = item.slot as ItemSlot;
        const currentylyEquipped = prevEq[slot];

        // Zdejmowanie itemy z slota
        if (currentylyEquipped) {
          setInventory((inv2) => [currentylyEquipped, ...inv2]);
        }

        return { ...prevEq, [slot]: item };
      });
      return prevInv.filter((x) => x.id !== itemId);
    });
  }

  function unequip(slot: ItemSlot) {
    setEquipment((prevEq) => {
      const item = prevEq[slot];
      if (!item) return prevEq;

      setInventory((prevInv) => [item, ...prevInv]);
      const next = { ...prevEq };
      delete next[slot];
      return next;
    });
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
    inventory,
    equipment,
    inventoryOpen,
    setInventoryOpen,
    equipItem,
    unequip,
    expToNext: expToNext(player.level),
  };
}
