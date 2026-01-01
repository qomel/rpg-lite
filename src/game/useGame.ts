import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { createNewPlayer, MOBS } from "./engine";
import type { FightState, Mob, Equipment, Item, ItemSlot } from "./types";
import { startFight, attackTurn } from "./combat";
import { expToNext, maxMobLevelAllowed } from "./balance";
type Phase = "ready" | "inFight" | "cooldown";

type GearState = {
  inventory: Item[];
  equipment: Equipment;
};

type GearAction =
  | { type: "ADD_ITEM"; item: Item }
  | { type: "EQUIP"; itemId: string }
  | { type: "UNEQUIP"; slot: ItemSlot };

function gearReducer(state: GearState, action: GearAction): GearState {
  switch (action.type) {
    case "ADD_ITEM": {
      // zabezpieczenie przed duplikatem
      if (state.inventory.some((i) => i.id === action.item.id)) {
        return state;
      }
      return {
        ...state,
        inventory: [action.item, ...state.inventory],
      };
    }

    case "EQUIP": {
      const item = state.inventory.find((i) => i.id === action.itemId);
      if (!item) return state; // spam click / już założony

      const slot = item.slot;
      const currentlyEquipped = state.equipment[slot];

      let nextInventory = state.inventory.filter((i) => i.id !== item.id);

      if (currentlyEquipped) {
        nextInventory = [currentlyEquipped, ...nextInventory];
      }

      return {
        inventory: nextInventory,
        equipment: {
          ...state.equipment,
          [slot]: item,
        },
      };
    }

    case "UNEQUIP": {
      const item = state.equipment[action.slot];
      if (!item) return state;

      const nextEquipment = { ...state.equipment };
      delete nextEquipment[action.slot];

      // zabezpieczenie przed duplikatem
      const alreadyInInventory = state.inventory.some((i) => i.id === item.id);

      return {
        inventory: alreadyInInventory
          ? state.inventory
          : [item, ...state.inventory],
        equipment: nextEquipment,
      };
    }

    default:
      return state;
  }
}

export function useGame() {
  const [player, setPlayer] = useState(createNewPlayer());
  const [selectedMobId, setSelectedMobId] = useState<string>(MOBS[0].id);
  const [fight, setFight] = useState<FightState>(() => startFight(MOBS[0]));
  const [phase, setPhase] = useState<Phase>("ready");
  const [log, setLog] = useState<string[]>([]);
  const [gear, dispatchGear] = useReducer(gearReducer, {
    inventory: [],
    equipment: {},
  });
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
    setCooldownLeft(1);

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

    if (mob.level > maxMobLevelAllowed(player.level)) {
      setLog([
        `Za wysoki poziom! Masz L${
          player.level
        }. Możesz wybrać przeciwnika max L${maxMobLevelAllowed(player.level)}.`,
      ]);
      return;
    }

    const maxAllowed = maxMobLevelAllowed(player.level);
    if (mob.level > maxAllowed) {
      setLog([
        `Za wysoki poziom! Masz L${player.level}. Możesz walczyć max z L${maxAllowed}.`,
      ]);
    }
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
        dispatchGear({
          type: "ADD_ITEM",
          item: res.result.droppedItems as Item,
        });
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
    dispatchGear({ type: "EQUIP", itemId });
  }

  function unequip(slot: ItemSlot) {
    dispatchGear({ type: "UNEQUIP", slot });
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
    equipItem,
    unequip,
    expToNext: expToNext(player.level),
    inventory: gear.inventory,
    equipment: gear.equipment,
    maxAllowedMobLevel: maxMobLevelAllowed(player.level),
  };
}
