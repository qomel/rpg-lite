import { describe, it, expect } from "vitest";
import { createNewPlayer } from "../engine";
import { applyExpAndLevelUp } from "../level";

describe("leveling up mechanics", () => {
  it("levels up when enough EXP is gained", () => {
    const p = createNewPlayer();
    const { player } = applyExpAndLevelUp(p, 150); // Zakładamy, że 150 EXP wystarcza na awans

    expect(player.level).toBeGreaterThan(1);
    expect(player.hp).toBe(player.maxHp); // HP powinno być uzupełnione do maksimum
  });
});
