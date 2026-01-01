import { useState } from "react";
import { createNewPlayer, MOBS } from "./engine";
import { attackMob } from "./combat";
import type { Mob } from "./types";

export function useGame() {
  const [player, setPlayer] = useState(createNewPlayer());
  const [log, setLog] = useState<string[]>([]);

  function attack(mob: Mob) {
    const { player: updated, result } = attackMob(player, mob);
    setPlayer(updated);
    setLog(result.log);
  }

  return {
    player,
    mobs: MOBS,
    log,
    attack,
  };
}
