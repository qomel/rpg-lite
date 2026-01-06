import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { createNewPlayer, MOBS } from "./engine";
import type {
  FightState,
  Mob,
  Equipment,
  Item,
  ItemSlot,
  Stats,
} from "./types";
import { startFight, attackTurn } from "./combat";
import {
  POTION_HEAL_HP,
  POTION_PRICE_GOLD,
  expToNext,
  maxMobLevelAllowed,
} from "./balance";
type Phase = "ready" | "inFight" | "cooldown";

type GearState = {
  inventory: Item[];
  equipment: Equipment;
};

type GearAction =
  | { type: "ADD_ITEM"; item: Item }
  | { type: "EQUIP"; itemId: string }
  | { type: "UNEQUIP"; slot: ItemSlot }
  | { type: "REMOVE_ITEM"; itemId: string };

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

    case "REMOVE_ITEM": {
      if (!state.inventory.some((i) => i.id === action.itemId)) return state;
      return {
        ...state,
        inventory: state.inventory.filter((i) => i.id !== action.itemId),
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

  function applyItemStats(p: Stats, stats: Item["stats"], sign: 1 | -1): Stats {
    const s = stats ?? {};
    const next = {
      ...p,
      strenght: p.strenght + sign * (s.strenght ?? 0),
      armor: p.armor + sign * (s.armor ?? 0),
      luck: p.luck + sign * (s.luck ?? 0),
      maxHp: p.maxHp + sign * (s.maxHp ?? 0),
    };

    next.maxHp = Math.max(1, next.maxHp);
    next.strenght = Math.max(0, next.strenght);
    next.armor = Math.max(0, next.armor);
    next.luck = Math.max(0, next.level);
    next.hp = Math.min(Math.max(0, next.hp), next.maxHp);

    return next;
  }

  function equipItem(itemId: string) {
    const item = gear.inventory.find((i) => i.id === itemId);
    if (!item) return;

    if (player.level < item.requiredLevel) {
      setLog((prev) => [
        `Nie możesz założyć ${item.name}. Wymaga lvl ${item.requiredLevel}.`,
        ...prev,
      ]);
      return;
    }

    const slot = item.slot;
    const currentlyEquipped = gear.equipment[slot];

    setPlayer((p) => {
      let next = p;
      if (currentlyEquipped)
        next = applyItemStats(next, currentlyEquipped.stats, -1);
      next = applyItemStats(next, item.stats, +1);
      return next;
    });

    dispatchGear({ type: "EQUIP", itemId });
  }

  function unequip(slot: ItemSlot) {
    const item = gear.equipment[slot];
    if (!item) return;

    setPlayer((p) => applyItemStats(p, item.stats, -1));
    dispatchGear({ type: "UNEQUIP", slot });
  }

  function takeInventoryItem(itemId: string): Item | null {
    const it = gear.inventory.find((i) => i.id === itemId);
    if (!it) return null;

    dispatchGear({ type: "REMOVE_ITEM", itemId });
    return it;
  }

  function putInventoryItem(item: Item) {
    if (gear.inventory.length >= player.inventoryCap) {
      setLog((prev) => ["Brak miejsca w plecaku.", ...prev]);
      return;
    }
    dispatchGear({ type: "ADD_ITEM", item });
  }

  function sellItem(itemId: string) {
    const it = gear.inventory.find((i) => i.id === itemId);
    if (!it) return;

    dispatchGear({ type: "REMOVE_ITEM", itemId });
    setPlayer((p) => ({ ...p, gold: p.gold + (it.sellPrice ?? 0) }));
    setLog((prev) => [
      `Sprzedano: ${it.name} (+${it.sellPrice} gold).`,
      ...prev,
    ]);
  }

  function sellItems(items: Item[]) {
    if (!items.length) return;

    const total = items.reduce((s, it) => s + (it.sellPrice ?? 0), 0);

    setPlayer((p) => ({ ...p, gold: p.gold + total }));
    setLog((prev) => [
      `Sprzedano${items.length} przedmiotów (+${total} gold)`,
      ...prev,
    ]);
  }

  function buyPotion(qty: number = 1) {
    const q = Math.max(1, Math.floor(qty));
    const cost = POTION_PRICE_GOLD * q;

    setPlayer((p) => {
      if (p.gold < cost) {
        setLog((prev) => [`Masz niewystarczająco pieniędzy`, ...prev]);
        return p;
      }
      setLog((prev) => [`Kupiono miksturę x${q} (=${cost} gold).`, ...prev]);
      return { ...p, gold: p.gold - cost, potions: (p.potions ?? 0) + q };
    });
  }

  const INVENTORY_CAP_START = 20;
  const INVENTORY_CAP_MAX = 40;

  // ----------------- Cena za kolejny slot - rośnie mocno
  function nextSlotPrice(currentCap: number) {
    const base = 250;
    const step = Math.max(0, currentCap - INVENTORY_CAP_START);
    return Math.round(base * Math.pow(1.35, step));
  }

  function buyInventorySlot() {
    setPlayer((p) => {
      if (p.inventoryCap >= INVENTORY_CAP_MAX) {
        setLog((prev) => ["Osiągnieto maksymalną pojemność plecaka.", ...prev]);
        return p;
      }

      const price = nextSlotPrice(p.inventoryCap);
      if (p.gold < price) {
        setLog((prev) => [`Za mało golda. Potrzebujesz ${price}.`, ...prev]);
        return p;
      }

      setLog((prev) => [`Kupiono +1 slot plecaka (-${price} gold)`, ...prev]);
      return { ...p, gold: p.gold - price, inventoryCap: p.inventoryCap + 1 };
    });
  }

  function usePotion() {
    if (phase === "cooldown") return;

    setPlayer((p) => {
      if ((p.potions ?? 0) <= 0) {
        setLog((prev) => ["Nie masz mikstrur.", ...prev]);
        return p;
      }
      if (p.hp <= 0) return p;
      if (p.hp >= p.maxHp) {
        setLog((prev) => ["Masz pełne HP.", ...prev]);
        return p;
      }
      const after = Math.min(p.maxHp, p.hp + POTION_HEAL_HP);
      const healed = after - p.hp;

      setLog((prev) => [
        `Użytko mikstury: +${healed} HP (${after}/${p.maxHp}).`,
        ...prev,
      ]);
      return { ...p, potions: (p.potions ?? 0) - 1, hp: after };
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
    equipItem,
    unequip,
    expToNext: expToNext(player.level),
    inventory: gear.inventory,
    equipment: gear.equipment,
    maxAllowedMobLevel: maxMobLevelAllowed(player.level),
    sellItem,
    buyPotion,
    usePotion,
    potionPrice: POTION_PRICE_GOLD,
    potionHeal: POTION_HEAL_HP,
    sellItems,
    takeInventoryItem,
    putInventoryItem,
    nextSlotPrice: () => nextSlotPrice(player.inventoryCap),
    buyInventorySlot,
  };
}
