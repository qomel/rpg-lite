import { describe, it, expect } from "vitest";
import { createNewPlayer, MOBS } from "../engine";
import { attackMob } from "../combat";

describe("combat mechanics", () => {
  it("player HP never drops below 0", () => {
    const p = createNewPlayer();
    p.hp = 1;

    const { player } = attackMob(p, MOBS[4]);
    expect(player.hp).toBeGreaterThanOrEqual(0);
  });

  it("combat always grants EXP and gold", () => {
    const p = createNewPlayer();
    const { result } = attackMob(p, MOBS[0]);

    expect(result.expGained).toBeGreaterThan(0);
    expect(result.goldGained).toBeGreaterThan(0);
  });
});
