import { describe, it, expect } from "vitest";
import { createNewPlayer, MOBS } from "../engine";
import { startFight, attackTurn } from "../combat";

describe("turn-based combat", () => {
  it("mob HP decreases after player attack", () => {
    const p = createNewPlayer();
    const mob = MOBS[0];
    const fight = startFight(mob);

    const { fight: f2 } = attackTurn(p, fight, mob);
    expect(f2.mobHp).toBeLessThan(fight.mobHp);
  });

  it("player HP never drops below 0", () => {
    const p = { ...createNewPlayer(), hp: 1 };
    const mob = MOBS[4];
    const fight = startFight(mob);

    const { player } = attackTurn(p, fight, mob);
    expect(player.hp).toBeGreaterThanOrEqual(0);
  });
});
